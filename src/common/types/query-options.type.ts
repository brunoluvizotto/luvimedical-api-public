import { Field, InputType, Int } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'

@InputType('QueryOptions')
export class QueryOptionsType<Entity> {
  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number

  @Field(() => GraphQLJSON, { nullable: true })
  orderBy?: { [P in keyof Entity]?: any }

  @Field(() => GraphQLJSON, { nullable: true })
  where?: { [P in keyof Entity]?: any }
}
