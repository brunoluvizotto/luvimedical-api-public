/*
Unfortunately, `npx prisma db pull` has two shortcomings:
1. It doesn't automatically convert to PascalCase / camelCase and add @map and @@map. Thankfully,
it does leave existing @map/@@map alone.
2. It automatically converts enums back to snake_case, even if they were already PascalCase / camelCase.
This script ameliorates that. It works as a state machine, going over the file line by line.
- It will convert enum names to PascalCase
- It will convert model names to PascalCase and add an @@map
- It will convert field types to camelCase and add a @map
It's not very smart -- if you feed this script an invalid Prisma file, it may produce an invalid Prisma file.
Also, if an @map or @@map already exists, it might re-add it.
*/
import { camelCase, pascalCase } from 'change-case'
const fs = require('fs')

enum StateName {
  Model = 'Model',
  Enum = 'Enum',
  Other = 'Other',
}

interface BaseState {
  lines: string[]
}

interface ModelState extends BaseState {
  name: StateName.Model
  originalModelName: string
  pascalCaseModelName: string
}

interface EnumState extends BaseState {
  name: StateName.Enum
}

interface OtherState extends BaseState {
  name: StateName.Other
}

type PrismaSchemaState = ModelState | EnumState | OtherState

function handleOtherState(state: OtherState, line: string): PrismaSchemaState {
  let newState: PrismaSchemaState
  const getName = (line: string) => line.split(' ').filter(i => i)[1]

  function singularizeName(name: string) {
    if (name.endsWith('es')) {
      return name.slice(0, -2)
    } else if (name.endsWith('s')) {
      return name.slice(0, -1)
    } else {
      return name
    }
  }

  if (line.startsWith('model')) {
    const originalModelName = getName(line)
    newState = {
      name: StateName.Model,
      lines: state.lines,
      originalModelName: originalModelName,
      pascalCaseModelName: pascalCase(originalModelName),
    } as ModelState
    if (newState.originalModelName === newState.pascalCaseModelName) {
      // If it's already pascalcase, we already did this!
      newState.lines.push(line)
    } else {
      newState.lines.push(`model ${singularizeName(newState.pascalCaseModelName)} {`)
    }
  } else if (line.startsWith('enum')) {
    newState = {
      name: StateName.Enum,
      lines: state.lines,
    } as EnumState
    const originalEnumName = getName(line)
    const pascalCaseName = pascalCase(originalEnumName)
    if (pascalCaseName === originalEnumName) {
      // If it's already pascalcase, we already did this !
      newState.lines.push(line)
    } else {
      newState.lines.push(`enum ${pascalCaseName} {`)
    }
  } else {
    newState = { ...state }
    newState.lines.push(line)
  }

  return newState
}

function handleModelState(state: ModelState, line: string): PrismaSchemaState {
  let newState: PrismaSchemaState
  const lineSplit = line.split(' ')
  const [fieldName, fieldType] = lineSplit.filter(i => i)
  if (line.startsWith('}')) {
    newState = {
      name: StateName.Other,
      lines: state.lines,
    } as OtherState

    if (state.originalModelName !== state.pascalCaseModelName) {
      newState.lines.push('')
      newState.lines.push(`  @@map("${state.originalModelName}")`)
    }
    newState.lines.push(line)
  } else if (fieldName && !fieldName.startsWith('@')) {
    // If it starts with @, it's a model attribute and not a field
    newState = { ...state }
    const isRelation = line.includes('@relation')

    const camelCaseFieldName = camelCase(fieldName)
    if (fieldName !== camelCaseFieldName) {
      const fieldNameIndex = lineSplit.findIndex(e => e === fieldName)
      lineSplit[fieldNameIndex] = camelCaseFieldName
      if (!isRelation) {
        lineSplit.push(`@map("${fieldName}")`)
      }
    }

    // We want to parse out "String" from "String[]" and such
    const parsedFieldType = /^([a-z0-9_]+)/i.exec(fieldType)
    if (!parsedFieldType) {
      throw new Error(`Cannot parse fieldType ${fieldType} on line ${line}`)
    }

    const actualFieldType = parsedFieldType[1]
    if (!actualFieldType) {
      throw new Error(`Did not parse fieldType from regex result ${parsedFieldType}`)
    }
    const pascalCaseFieldType = pascalCase(actualFieldType) + fieldType.slice(actualFieldType.length)

    if (fieldType !== pascalCaseFieldType) {
      const fieldTypeIndex = lineSplit.findIndex(e => e === fieldType)
      lineSplit[fieldTypeIndex] = pascalCaseFieldType
    }

    newState.lines.push(lineSplit.join(' '))
  } else {
    newState = { ...state }
    newState.lines.push(line)
  }
  return newState
}

function handleEnumState(state: EnumState, line: string): PrismaSchemaState {
  let newState: PrismaSchemaState
  if (line.startsWith('}')) {
    newState = {
      ...state,
      name: StateName.Other,
    }
  } else {
    newState = { ...state }
  }
  newState.lines.push(line)
  return newState
}

function createIdiomaticPrismaSchema(prismaSchema: string) {
  let state: PrismaSchemaState = {
    name: StateName.Other,
    lines: [],
  }
  for (const line of prismaSchema.split('\n')) {
    if (state.name === StateName.Model) {
      state = handleModelState(state, line)
    } else if (state.name === StateName.Enum) {
      state = handleEnumState(state, line)
    } else if (state.name === StateName.Other) {
      state = handleOtherState(state, line)
    } else {
      throw new Error('Unknown state')
    }
  }
  return state.lines.join('\n')
}

async function main() {
  const prismaFileName = __dirname + '/prisma/schema.prisma'
  console.log({ prismaFileName })
  const prismaFile = await fs.promises.readFile(prismaFileName, 'utf8')

  const newFile = createIdiomaticPrismaSchema(prismaFile)
  await fs.promises.writeFile(prismaFileName, newFile)
}

main()
