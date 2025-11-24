# Victor Backend

Node.js + Express + Prisma (MySQL) API powering the Victor Executive ecosystem. This service exposes unified endpoints for the React admin portal, WordPress portal, and offline-first mobile apps.

## Requirements

- Node.js >= 18.18
- MySQL 8 (or compatible managed service)
- npm >= 9

## Setup

```bash
cp env.example .env
npm install
npx prisma generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Configure `DATABASE_URL`, JWT secrets, and provider credentials in `.env`. During development you can run `docker compose` (to be added) or point to a local MySQL instance.

## Scripts

- `npm run dev` – Start the development server with hot reload.
- `npm run build` – Type-check and emit JavaScript to `dist/`.
- `npm start` – Run the built server.
- `npm run prisma:migrate` – Apply migrations interactively.
- `npm run prisma:seed` – Populate the database with demo roles, users, airports, flights and documents.

## Project Structure

Refer to `docs/architecture.md` for a complete tree and workflow overview.

## Testing

Test strategy TBD. Recommended stack: Vitest + supertest for HTTP integration, plus contract tests for API schemas.

## Sample credentials

After running `npm run prisma:seed`, you can sign in with the following demo users:

- `victor.admin@victorexecutive.com` / `ChangeMe123!` (VictorAdmin)
- `operator@victorexecutive.com` / `Operator123!` (OperatorAdmin)

