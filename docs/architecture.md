# Victor Executive Platform – Architecture & Workflow

## Repository layout

```
/Avitation
├── admin-panel/           # Next.js 15 admin portal built on the Isomorphic UI kit
├── backend/               # Node.js + Express REST API with MySQL persistence
├── docs/                  # Architectural and workflow documentation
├── isomorphic/            # Upstream UI theme packages (kept for reference)
└── Victor Executive Data Model.pdf
```

### admin-panel

- **App router** with route groups for authentication and the application shell (`(auth)` and `(dashboard)` segments).
- **AuthProvider** (`src/contexts/auth-context.tsx`) owns session state, access/refresh tokens and exposes `fetchWithAuth`.
- **Protected** wrapper guards pages that require authentication.
- **useApi/useApiData hooks** centralise JSON API calls, pagination and loading/error state.
- **Feature directories** hold cohesive UI:
  - `components/dashboard` – mission control overview.
  - `components/flights` – list, detail views and CRUD modals (passengers, crew, baggage, QR passes, document generation).
  - `components/reference` – airport/operator/aircraft/template catalogues.
  - `components/admin` – user & role management tables.
  - `components/authority` – authority console queue.
  - `components/qr` – standalone QR token validation screen.
- **Navigation** defined in `layouts/hydrogen/menu-items.tsx`, pointing to the Victor-specific routes in `config/routes.ts`.
- **Styling** uses Tailwind classes via the Isomorphic theme primitives (RizzUI buttons, badges, typography).

### backend

- **Express app** (`src/app.js`) with security middleware (Helmet, CORS), request logging (morgan) and static document hosting (`/documents`).
- **Configuration** via `env.example`; read in `src/config.js`.
- **MySQL access** through `mysql2/promise` with a connection pool (`src/db/pool.js`).
- **Schema management** (`src/db/schema.js`) creates all core tables on start:
  - `roles`, `users`, `refresh_tokens`
  - `airports`, `aircraft_types`, `operators`
  - `flights`, `passengers`, `crew_members`, `baggage_items`
  - `document_templates`, `documents`
  - `qr_passes`, `authority_notifications`, `audit_logs`, `sync_events`
- **Seed data** (`src/db/seed.js`) populates reference entities and sample operational records for immediate usage.
- **Service layer** encapsulates database queries (`services/flight-service`, `passenger-service`, etc.).
- **REST controllers & routers** expose the domain:
  - `/api/auth` – login, refresh, logout with JWT + refresh tokens.
  - `/api/flights` – flight CRUD + aggregate detail view.
  - `/api/flights/:id/passengers|crew|baggage` – nested CRUD endpoints.
  - `/api/flights/:id/general-declaration/generate` – generates PDFs via `pdfkit`.
  - `/api/flights/:flightId/passengers/:passengerId/qr-pass` – QR issuance, `/api/qr-pass/:token` public lookup.
  - `/api/flights/:id/authority-notifications` – compliance workflow.
  - `/api/reference/*` – airports, aircraft, operators, roles, templates.
  - `/api/users` – list user accounts and roles.

## End-to-end workflow

1. **Authentication**
   - Users authenticate against `/api/auth/login`. The admin panel stores the access/refresh tokens via `AuthProvider`.
   - Protected routes automatically refresh access tokens when the backend returns `401`.

2. **Flight management**
   - Mission control (`/dashboard`) surfaces counts and upcoming departures.
   - `/flights` lists movements with search, status filters and pagination.
   - Creating a flight opens a modal that pulls master data (operators, aircraft, airports) from `/api/reference/...`.

3. **Passenger & crew intake**
   - Flight detail pages (`/flights/{id}`) fetch a consolidated payload: flight metadata, passengers, crew, baggage, documents and authority logs.
   - Modals leverage the REST endpoints to add, update or delete passengers/crew, keeping counts in sync.

4. **Baggage & QR passes**
   - Baggage registration ties QR tags to passengers and provides status tracking (`/api/flights/:flightId/baggage`).
   - QR passes can be generated for passengers or crew; tokens can be verified without authentication at `/qr/{token}`.

5. **Document generation**
   - General Declarations are produced server-side, stored under `storage/documents`, and listed alongside other generated documents.
   - Templates are centrally managed (`document_templates`) and visible in the admin panel.

6. **Authority console**
   - `/authority-console` surfaces READY flights for regulatory follow-up. Each entry links back to the full manifest and document set.
   - Authority notifications are logged and can be re-queued.

7. **Reference & access control**
   - Dedicated pages expose airport, aircraft, operator and template catalogues sourced from the backend reference routes.
   - User and role listings provide visibility into platform access (VictorAdmin, OperatorAdmin, Handler, AuthorityUser).

## Running locally

1. **Backend**
   ```bash
   cd backend
   cp env.example .env   # update DB credentials & secrets
   npm install
   npm run dev
   ```
   Ensure a MySQL database (`victor` by default) exists and is reachable. Startup runs schema sync and seeding.

2. **Admin panel**
   ```bash
   cd admin-panel
   cp env.example .env         # set NEXT_PUBLIC_API_URL (e.g. http://localhost:4000/api)
   pnpm install                # or npm install
   pnpm dev                    # start Next.js dev server
   ```

3. **Login credentials**
   - `admin@victorexecutive.com / VictorAdmin!2025`
   - `ops@victorexecutive.com / Operator!2025`

## Extensibility notes

- Add new master-data modules by extending the reference service/controller and wiring a UI table similar to existing reference pages.
- When introducing additional documents, create templates in `document_templates`, extend the `document-service`, and expose a new controller endpoint.
- Background jobs (QR delivery, authority transmissions) can be scheduled with `node-cron` leveraging the existing database tables for state.

