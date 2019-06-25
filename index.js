import express from 'express'
import { ApolloServer } from 'apollo-server-express'

import graph from './graph'
import { connect, models } from './data'
import schema from './schema'


const start = async () => {
  const database = await connect()

  const server = new ApolloServer({
    ...graph(schema),
    context: {
      ...models(schema),
    },
  });

  const app = express();

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}


start()
