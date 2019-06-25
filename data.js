import mongoose, { model, Schema } from 'mongoose'
import camelCase from 'lodash/camelCase'
import mapValues from 'lodash/mapValues'


mongoose.Promise = global.Promise


const mapping = {
  'ID': String,
  'String': String,
  'Int': Number,
  'Float': Number,
  'Boolean': Boolean,
}


export const connect = () =>
  mongoose.connect(
    'mongodb://localhost:27017/graphqltest',
    { useNewUrlParser: true },
  )

export const models = (schema) =>
  mapValues(
    schema,
    (attributes, modelName) =>
      model(camelCase(modelName), new Schema(
        mapValues(attributes, (type, attributeName) =>
          mapping[type.replace(/!/g, '')] || 'String'
        )
      ))
  )
