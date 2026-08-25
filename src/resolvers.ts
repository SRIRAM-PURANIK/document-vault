import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const resolvers = {
  Query: {
    collections: () => prisma.collection.findMany({ orderBy: { createdAt: "desc" } }),

    collection: (_parent: unknown, args: { id: string }) =>
      prisma.collection.findUnique({ where: { id: args.id } }),

    documents: (_parent: unknown, args: { collectionId?: string; isArchived?: boolean }) =>
      prisma.document.findMany({
        where: {
          ...(args.collectionId ? { collectionId: args.collectionId } : {}),
          ...(args.isArchived !== undefined ? { isArchived: args.isArchived } : {}),
        },
        orderBy: { createdAt: "desc" },
      }),

    document: (_parent: unknown, args: { id: string }) =>
      prisma.document.findUnique({ where: { id: args.id } }),
  },

  Mutation: {
    createCollection: (_parent: unknown, args: { input: { name: string; slug: string } }) =>
      prisma.collection.create({ data: args.input }),

    createDocument: (
      _parent: unknown,
      args: { input: { title: string; content: string; tags?: string[]; collectionId: string } }
    ) =>
      prisma.document.create({
        data: {
          title: args.input.title,
          content: args.input.content,
          tags: args.input.tags ?? [],
          collectionId: args.input.collectionId,
        },
      }),

    updateDocument: (
      _parent: unknown,
      args: { id: string; input: Partial<{ title: string; content: string; tags: string[]; isArchived: boolean }> }
    ) =>
      prisma.document.update({
        where: { id: args.id },
        data: args.input,
      }),

    deleteDocument: async (_parent: unknown, args: { id: string }) => {
      await prisma.document.delete({ where: { id: args.id } });
      return true;
    },

    archiveDocument: (_parent: unknown, args: { id: string }) =>
      prisma.document.update({
        where: { id: args.id },
        data: { isArchived: true },
      }),
  },

  // Field-level resolvers for relations
  Collection: {
    documents: (parent: { id: string }) =>
      prisma.document.findMany({ where: { collectionId: parent.id } }),
  },

  Document: {
    collection: (parent: { collectionId: string }) =>
      prisma.collection.findUnique({ where: { id: parent.collectionId } }),
  },
};