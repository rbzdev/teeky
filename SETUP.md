# Setup Instructions

## Prisma Setup

After cloning or pulling schema changes, run:

```bash
pnpm prisma generate
```

This regenerates the Prisma Client with TypeScript types for your models.

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL="mongodb+srv://..."
```

## Development

```bash
pnpm dev
```

## Notes

- The codebase uses **JSON payloads** for server actions (not FormData)
- Run `pnpm prisma generate` if you see TypeScript errors about `prisma.invitation`
