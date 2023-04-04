import { PrismaClient } from '@prisma/client'
import { EMAIL_TEMPLATE_NAMES } from '../common/constants'

const prisma = new PrismaClient()

async function main() {
  await seedPermissions()
  await seedRoles()
  await seedUsers()
  await seedMailTemplates()
}

async function seedPermissions() {
  console.log('Seeding permissions')
  await prisma.permission.upsert({
    where: { name: 'patient-record.create' },
    update: {},
    create: { id: '45aa62db-d403-4f15-9996-458a97a98a68', name: 'patient-record.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient-record.delete' },
    update: {},
    create: { id: '03e422bd-03c3-4f6a-8867-50f737b51e6f', name: 'patient-record.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient-record.get' },
    update: {},
    create: { id: '824f91f8-28f7-4c23-861b-b236aa06e791', name: 'patient-record.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient-record.list' },
    update: {},
    create: { id: '73744c88-7d5d-4a3c-86b9-c80b7bb55a75', name: 'patient-record.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient-record.update' },
    update: {},
    create: { id: 'e00241a6-dc18-4f5c-848e-8c40fdef7c6d', name: 'patient-record.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'appointment.create' },
    update: {},
    create: { id: '05bbe40c-adbd-4df0-aa1d-1d4d37a74db1', name: 'appointment.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'appointment.delete' },
    update: {},
    create: { id: '06e3a4cb-e4e1-42f9-801e-c5966ac1de90', name: 'appointment.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'appointment.get' },
    update: {},
    create: { id: 'ec55061e-728e-4bef-aa9f-d5088f479622', name: 'appointment.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'appointment.list' },
    update: {},
    create: { id: '018e221e-14b2-4ed4-9da6-6c9504703265', name: 'appointment.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'appointment.update' },
    update: {},
    create: { id: '135ee2a7-cfcc-44ba-8e5a-6c0a0a108103', name: 'appointment.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient.create' },
    update: {},
    create: { id: '1c0dc7a3-4377-44d8-8b82-184527d66c12', name: 'patient.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient.delete' },
    update: {},
    create: { id: 'db385753-929e-4042-975c-12f409b4da5c', name: 'patient.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient.get' },
    update: {},
    create: { id: '1da6f24f-6b2b-43e7-a21f-c2060e3df4f4', name: 'patient.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient.list' },
    update: {},
    create: { id: '00fb8c01-5d26-465c-9e27-102343f9555b', name: 'patient.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'patient.update' },
    update: {},
    create: { id: '4193e158-c8fb-4176-b668-4935d6323ee9', name: 'patient.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician.create' },
    update: {},
    create: { id: 'ac16704f-ad42-4a95-adcf-15043f489621', name: 'physician.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician.delete' },
    update: {},
    create: { id: 'fcc7599b-5fb1-40df-97e3-ae331e003590', name: 'physician.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician.get' },
    update: {},
    create: { id: '1c8856a7-6878-457d-b262-1e8200eea645', name: 'physician.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician.list' },
    update: {},
    create: { id: '0c7a658f-7c0e-4495-846b-b5f21fcacdc2', name: 'physician.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician.update' },
    update: {},
    create: { id: 'a757b1b4-35f8-4595-96a9-4b0d874db882', name: 'physician.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'user.create' },
    update: {},
    create: { id: 'b7a44664-9d00-4566-9f4c-73207dd28cd6', name: 'user.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'user.delete' },
    update: {},
    create: { id: 'f44bac87-17e8-4ce3-8159-7dd92e275c46', name: 'user.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'user.get' },
    update: {},
    create: { id: '37ba63f1-69fa-4fb4-a552-37913cc9e2f3', name: 'user.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'user.list' },
    update: {},
    create: { id: '6e055305-1ac7-49d5-9081-89d7933aa654', name: 'user.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'user.update' },
    update: {},
    create: { id: '64db1839-e9e1-4e62-82fa-6bd729812b69', name: 'user.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'role.create' },
    update: {},
    create: { id: '5a595a3b-22b7-46f0-932e-50bb72322c96', name: 'role.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'role.delete' },
    update: {},
    create: { id: 'c36ffab5-684a-4fab-b9ca-b28973e31b01', name: 'role.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'role.get' },
    update: {},
    create: { id: 'b7435989-4285-425d-b6a0-1970a51c26d0', name: 'role.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'role.list' },
    update: {},
    create: { id: 'f97f1387-4985-481e-9aff-e8b2d6193573', name: 'role.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'role.update' },
    update: {},
    create: { id: '3a03a7c6-077c-4814-a62a-e7277314d723', name: 'role.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-working-hours.create' },
    update: {},
    create: { id: '3dc29259-f906-422b-bf51-a74f639e5dac', name: 'physician-working-hours.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-working-hours.delete' },
    update: {},
    create: { id: '4393c762-28e3-4abc-938e-4385043876af', name: 'physician-working-hours.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-working-hours.get' },
    update: {},
    create: { id: '20aab738-2811-4034-ab90-3264fa7d838b', name: 'physician-working-hours.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-working-hours.list' },
    update: {},
    create: { id: '6c9dcf71-a4e4-43ea-9551-659feb39ec5a', name: 'physician-working-hours.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-working-hours.update' },
    update: {},
    create: { id: '46362aab-682d-4d1b-b034-1de5bad9cb5f', name: 'physician-working-hours.update' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-leave.create' },
    update: {},
    create: { id: '71cf2452-c68f-4a86-b7f1-aec51a6b995e', name: 'physician-leave.create' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-leave.delete' },
    update: {},
    create: { id: '3d0d2e0d-0df1-4312-8d8b-7f21ef78f8d6', name: 'physician-leave.delete' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-leave.get' },
    update: {},
    create: { id: '9a9b33f6-e148-4485-8545-9c4d9dc3819f', name: 'physician-leave.get' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-leave.list' },
    update: {},
    create: { id: 'a303238a-cf16-48a5-8bea-0232264e0c64', name: 'physician-leave.list' },
  })
  await prisma.permission.upsert({
    where: { name: 'physician-leave.update' },
    update: {},
    create: { id: 'be15d75c-2eb7-427b-bd11-d87d97f08f03', name: 'physician-leave.update' },
  })
  console.log('Done seeding permissions')
}

async function seedRoles() {
  console.log('Seeding roles...')
  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      id: 'e9e208c6-4f5c-457f-90fd-363ad5666637',
      name: 'admin',
      permissions: {
        connect: [
          { name: 'patient-record.create' },
          { name: 'patient-record.delete' },
          { name: 'patient-record.get' },
          { name: 'patient-record.list' },
          { name: 'patient-record.update' },
          { name: 'appointment.create' },
          { name: 'appointment.delete' },
          { name: 'appointment.get' },
          { name: 'appointment.list' },
          { name: 'appointment.update' },
          { name: 'patient.create' },
          { name: 'patient.delete' },
          { name: 'patient.get' },
          { name: 'patient.list' },
          { name: 'patient.update' },
          { name: 'physician.create' },
          { name: 'physician.delete' },
          { name: 'physician.get' },
          { name: 'physician.list' },
          { name: 'physician.update' },
          { name: 'user.create' },
          { name: 'user.delete' },
          { name: 'user.get' },
          { name: 'user.list' },
          { name: 'user.update' },
          { name: 'role.create' },
          { name: 'role.delete' },
          { name: 'role.get' },
          { name: 'role.list' },
          { name: 'role.update' },
          { name: 'physician-working-hours.create' },
          { name: 'physician-working-hours.delete' },
          { name: 'physician-working-hours.get' },
          { name: 'physician-working-hours.list' },
          { name: 'physician-working-hours.update' },
          { name: 'physician-leave.create' },
          { name: 'physician-leave.delete' },
          { name: 'physician-leave.get' },
          { name: 'physician-leave.list' },
          { name: 'physician-leave.update' },
        ],
      },
    },
  })
  await prisma.role.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      id: 'eb0e781e-e7a7-4831-bc23-2a8a12bf09d6',
      name: 'manager',
      permissions: {
        connect: [
          { name: 'appointment.create' },
          { name: 'appointment.delete' },
          { name: 'appointment.get' },
          { name: 'appointment.list' },
          { name: 'appointment.update' },
          { name: 'patient.create' },
          { name: 'patient.delete' },
          { name: 'patient.get' },
          { name: 'patient.list' },
          { name: 'patient.update' },
          { name: 'physician.create' },
          { name: 'physician.delete' },
          { name: 'physician.get' },
          { name: 'physician.list' },
          { name: 'physician.update' },
          { name: 'user.create' },
          { name: 'user.delete' },
          { name: 'user.get' },
          { name: 'user.list' },
          { name: 'user.update' },
          { name: 'physician-working-hours.create' },
          { name: 'physician-working-hours.delete' },
          { name: 'physician-working-hours.get' },
          { name: 'physician-working-hours.list' },
          { name: 'physician-working-hours.update' },
          { name: 'physician-leave.create' },
          { name: 'physician-leave.delete' },
          { name: 'physician-leave.get' },
          { name: 'physician-leave.list' },
          { name: 'physician-leave.update' },
        ],
      },
    },
  })
  await prisma.role.upsert({
    where: { name: 'physician' },
    update: {},
    create: {
      id: '0c01ebae-aa71-4f0f-a9f4-6a8879f42699',
      name: 'physician',
      permissions: {
        connect: [
          { name: 'patient-record.create' },
          { name: 'patient-record.get' },
          { name: 'patient-record.list' },
          { name: 'patient-record.update' },
          { name: 'appointment.create' },
          { name: 'appointment.delete' },
          { name: 'appointment.get' },
          { name: 'appointment.list' },
          { name: 'appointment.update' },
          { name: 'patient.create' },
          { name: 'patient.delete' },
          { name: 'patient.get' },
          { name: 'patient.list' },
          { name: 'patient.update' },
          { name: 'physician.get' },
          { name: 'physician.list' },
          { name: 'physician-leave.get' },
          { name: 'physician-leave.list' },
        ],
      },
    },
  })
  await prisma.role.upsert({
    where: { name: 'scheduler' },
    update: {},
    create: {
      id: 'd27a2026-0719-495a-8c71-776c82d478b3',
      name: 'scheduler',
      permissions: {
        connect: [
          { name: 'appointment.create' },
          { name: 'appointment.delete' },
          { name: 'appointment.get' },
          { name: 'appointment.list' },
          { name: 'appointment.update' },
          { name: 'patient.create' },
          { name: 'patient.get' },
          { name: 'patient.list' },
          { name: 'patient.update' },
          { name: 'physician.get' },
          { name: 'physician.list' },
        ],
      },
    },
  })
  console.log('Done seeding roles')
}

async function seedUsers() {
  console.log('Seeding users...')
  await prisma.user.upsert({
    where: { email: 'admin@luvimedical.com.br' },
    update: {},
    create: {
      id: '148c9d5e-2a45-4c5b-85c1-f3c4378d4d53',
      email: 'admin@luvimedical.com.br',
      name: 'Master Admin',
      password: '$2b$12$OMGeYaFnR9a0hb003F76LOH1FGL.VgYmN0GCuncR7cvGR3SktBTG2',
      activated: true,
      roles: {
        connect: {
          name: 'admin',
        },
      },
    },
  })
  console.log('Done seeding users')
}

async function seedMailTemplates() {
  console.log('Seeding mail templates...')
  await prisma.mailTemplate.upsert({
    where: { id: '399034d7-d00e-4683-8450-132e28803941' },
    update: {},
    create: {
      id: '399034d7-d00e-4683-8450-132e28803941',
      name: EMAIL_TEMPLATE_NAMES.WELCOME_AND_ACTIVATE,
      subject: '🩺 Convite para o Luvimedical!',
      // eslint-disable-next-line max-len
      body: '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet"><div><h2 style="text-align:center; font-family: \'DM Sans\', sans-serif; font-size:24px;">Bem vindo ao Luvimedical, {{name}}!</h2><div style="text-align:center; font-family: \'DM Sans\', sans-serif; font-size:17px; margin-bottom:12px;">Para ativar sua conta, acesse o link em até {{hoursToExpire}} horas:</div><div style="text-align:center; font-family: \'DM Sans\', sans-serif; font-size:17px; margin-bottom:12px;"><a href="http://localhost:7500/signin/activation?token={{activationToken}}">http://localhost:7500/signin/activation</a></div><div style="text-align:center; font-family: \'DM Sans\', sans-serif; font-size:12px; margin-bottom:4px;">*Se você não solicitou a criação do seu usuário, por favor desconsidere este e-mail.</div></div>',
      contactMethod: 'email',
    },
  })
  console.log('Done seeding mail templates')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
