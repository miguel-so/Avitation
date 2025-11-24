# Victor Admin Portal

React + TypeScript + Chakra UI administrative dashboard for the Victor Executive platform. The portal consumes the unified backend API to orchestrate flights, passengers, documents, QR workflows and the authority terminal.

## Key capabilities

- **Authentication** – JWT-based login with refresh support, persisted securely in local storage.
- **Role-aware navigation** – VictorAdmin, OperatorAdmin, Handler and AuthorityUser roles surface tailored menus and views.
- **Flight operations** – Filterable flight dashboard and a detailed view exposing passengers, crew, baggage status and document history.
- **Document control** – Trigger General Declaration generation and review recent documents across flights.
- **Authority terminal** – Dedicated workspace for authorities to retrieve the latest General Declaration metadata for their jurisdiction.
- **Settings scaffolding** – Guided configuration sections for airports, templates and user governance (API endpoints to be implemented).

## Getting started

```bash
cd admin-portal
cp env.example .env
npm install
npm run dev
```

Configure the following environment variables in `.env`:

- `VITE_API_URL` – Base URL for the Victor backend (e.g. `http://localhost:4000/api`).
- `VITE_AUTH_STORAGE_KEY` – Storage key for persisted session payload (defaults to `victor_admin_session`).

## Architecture highlights

- **UI stack** – Chakra UI v2, custom brand theme, responsive layout shell (`AppLayout`).
- **Routing** – `react-router-dom` with nested layout and `ProtectedRoute` guard enforcing authentication and optional role constraints.
- **Data fetching** – TanStack Query (`@tanstack/react-query`) orchestrates API calls, caching and post-mutation invalidation.
- **Forms & validation** – `react-hook-form` paired with Zod via `@hookform/resolvers`.
- **API layer** – Axios client with bearer injection, automatic 401 logout and domain-specific wrappers in `src/api/`.

## NPM scripts

- `npm run dev` – Start Vite development server.
- `npm run build` – Type-check and build production assets.
- `npm run preview` – Preview production build.
- `npm run lint` – Run ESLint with zero-warning budget.
- `npm run typecheck` – Run TypeScript in no-emit mode.

## Suggested development workflow

1. Start the backend (`npm run dev` in `backend/`) pointing to a MySQL instance.
2. Launch the admin portal with `npm run dev`.
3. Sign in using seeded credentials from the backend (see backend README).
4. Manage flights, trigger document generation and validate authority access.
5. Extend settings modules as backend management endpoints become available.

## Testing roadmap

- **Component coverage** – Add React Testing Library suites for core routes (login, flights dashboard, flight detail, authority terminal) with realistic TanStack Query providers.
- **Network isolation** – Stub API responses with MSW to model backend envelope shapes and role-based scenarios without requiring a live server.
- **Accessibility hooks** – Integrate `@testing-library/jest-dom` assertions (e.g. `toHaveAccessibleName`) to enforce Chakra UI semantics.
- **Smoke flows** – Record high-level journey tests (login → flights → document generation) once seed data is loaded to guard against regression in routing and auth guards.


