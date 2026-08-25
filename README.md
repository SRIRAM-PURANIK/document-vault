# Document Vault

A GraphQL API for managing documents organized into collections, built with Bun, TypeScript, GraphQL Yoga, Prisma 7, and PostgreSQL.

## Stack

- Runtime: Bun
- API: GraphQL Yoga (schema-first)
- ORM: Prisma 7 (with @prisma/adapter-pg driver adapter)
- Database: PostgreSQL (via Docker Compose)
- Language: TypeScript (strict mode)

## Data Model

- Collection: a named grouping of documents (name, slug)
- Document: belongs to a Collection; has title, content, tags, isArchived, createdAt

## Setup

1. Install dependencies:
```bash
   bun install
```

2. Start PostgreSQL:
```bash
   docker compose up -d
```

3. Configure environment - ensure .env has:




4. Run migrations:
```bash
   bunx prisma migrate dev
```

5. Start the server:
```bash
   bun run src/index.ts
```



## API

### Queries
- collections - list all collections
- collection(id) - fetch one collection with its documents
- documents(collectionId?, isArchived?) - list documents, optionally filtered
- document(id) - fetch a single document

### Mutations
- createCollection(input)
- createDocument(input)
- updateDocument(id, input)
- deleteDocument(id)
- archiveDocument(id) - soft-delete via isArchived flag

## Tradeoffs and Design Decisions

- No authentication/authorization layer. The assignment scope focused on core CRUD and data modeling; auth was deprioritized given time constraints. In a production version, this would be the first addition - likely JWT-based auth with a User model and ownership checks on Document/Collection mutations.
- Soft delete via isArchived for documents, hard delete via deleteDocument. Both are exposed so the client can choose recoverable vs. permanent removal; a stricter design might only allow soft-delete and handle purging separately.
- Cascade delete on Collection to Document (onDelete: Cascade in the Prisma schema) - deleting a collection removes its documents rather than orphaning them. This favors data consistency over accidental-deletion protection; a safer alternative would be to block deletion of non-empty collections.
- @prisma/adapter-pg driver adapter used instead of a bare connection string, per Prisma 7's new required pattern - connection details live in prisma.config.ts and are passed explicitly to the client at instantiation.
- Postgres runs on a remapped host port (5433) in docker-compose.yml to avoid conflicting with a pre-existing native Postgres service on the dev machine; this is a local dev workaround and doesn't affect the app code, since DATABASE_URL is the single source of truth for the connection.
- No pagination on list queries (collections, documents) - acceptable at current scale for the assignment; would add cursor-based pagination before this went to production with larger datasets.

## License

Private submission for Burdenoff hiring assignment.
