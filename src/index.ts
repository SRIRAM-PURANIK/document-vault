import { createYoga, createSchema } from "graphql-yoga";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
      type Query {
        hello: String
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello from Document Vault",
      },
    },
  }),
});

Bun.serve({ fetch: yoga, port: 4000 });

console.log("Running at http://localhost:4000/graphql");