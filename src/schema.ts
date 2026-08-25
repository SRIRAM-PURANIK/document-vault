export const typeDefs = /* GraphQL */ `
  type Collection {
    id: ID!
    name: String!
    slug: String!
    createdAt: String!
    documents: [Document!]!
  }

  type Document {
    id: ID!
    title: String!
    content: String!
    tags: [String!]!
    isArchived: Boolean!
    createdAt: String!
    collectionId: ID!
    collection: Collection!
  }

  input CreateCollectionInput {
    name: String!
    slug: String!
  }

  input CreateDocumentInput {
    title: String!
    content: String!
    tags: [String!]
    collectionId: ID!
  }

  input UpdateDocumentInput {
    title: String
    content: String
    tags: [String!]
    isArchived: Boolean
  }

  type Query {
    collections: [Collection!]!
    collection(id: ID!): Collection
    documents(collectionId: ID, isArchived: Boolean): [Document!]!
    document(id: ID!): Document
  }

  type Mutation {
    createCollection(input: CreateCollectionInput!): Collection!
    createDocument(input: CreateDocumentInput!): Document!
    updateDocument(id: ID!, input: UpdateDocumentInput!): Document!
    deleteDocument(id: ID!): Boolean!
    archiveDocument(id: ID!): Document!
  }
`;