import * as path from 'path'
import camelCase from 'lodash/camelCase'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'
import { fileLoader, mergeTypes } from 'merge-graphql-schemas'


const TYPES = ['Int', 'Float', 'String', 'Boolean', 'ID']


// SCHEMA
const generateSchema = (models) => {
  const typeDefs = mergeTypes(map(models, generateModelTypes))
  const resolvers = generateModelResolvers(models)

  return {
    typeDefs,
    resolvers,
  }
}


// TYPEDEFS
const generateType = (model, attributes) => {
  const withID = { _id: 'ID!', ...attributes }
  const mapped = map(withID, (type, key) => `${key}: ${type}`)

  return `
type ${model} {
  ${mapped.join('\n  ')}
}
  `
}

const generateInput = (model, attributes) => {
  const replaced = mapValues(attributes, (type, key) =>
    TYPES.includes(type.replace(/!/g, ''))
      ? type
      : `ID`
  )
  const mapped = map(replaced, (type, key) =>
    `${key}: ${type.replace(/!/g, '')}`
  )

  return `
input ${model}Input {
  ${mapped.join('\n  ')}
}
  `
}

const generateModelTypes = (attributes, name) => {
  const type = generateType(name, attributes)
  const input = generateInput(name, attributes)

  return `
type Query {
  ${camelCase(name)}s: [${name}]
  ${camelCase(name)}(_id: ID!): ${name}
}

type Mutation {
  create${name}(input: ${name}Input): ${name}
  update${name}(_id: ID!, input: ${name}Input): ${name}
  delete${name}(_id: ID!): ${name}
}

${type}
${input}
  `
}


// RESOLVERS
const generateModelResolvers = (schema) =>
  map(schema, generateResolvers)

const generateResolvers = (attributes, model) => ({
  Query: {
    [`${camelCase(model)}s`]: generateResolver(
      model,
      (Model, args) => Model.find(args)
    ),
    [camelCase(model)]: generateResolver(
      model,
      (Model, args) => Model.findOne(args)
    ),
  },

  Mutation: {
    [`create${model}`]: generateResolver(
      model,
      (Model, { input }) => Model.create(input),
    ),
    [`update${model}`]: generateResolver(
      model,
      (Model, { _id, input }) =>
        Model.findOneAndUpdate({ _id }, input, { new: true }),
    ),
    [`delete${model}`]: generateResolver(
      model,
      (Model, { _id }) => Model.deleteOne({ _id }),
    ),
  },

  [model]: generateAttributeResolvers(model, attributes)
})

const generateResolver = (model, run) =>
  (parent, args, context) =>
    run(context[model], args)

const generateAttributeResolvers = (model, attributes) =>
  mapValues(attributes, generateAttributeResolver(model))

const generateAttributeResolver = (model) => (type, name) =>
  TYPES.includes(type.replace(/!/g, ''))
    ? (parent) => parent[name]
    : (parent, args, context) => context[type].findOne({ _id: parent[name] })


export default generateSchema
