## Victor Executive Platform – Technical Architecture

### Overview
The Victor ecosystem comprises three primary clients (WordPress landing site, React web admin portal, Android mobile app) backed by a unified Node.js API and a shared MySQL database. This repository contains the backend API and the React admin portal. The website consumes the same API via secure authentication but is managed separately in WordPress.

### High-Level Architecture
- **Clients**: WordPress site (marketing + embedded SPA), React admin portal, Android offline-first app, authority portal entry point.
- **Backend**: Node.js (TypeScript) + Express with modular domain layers (controllers → services → repositories) backed by Prisma ORM for MySQL.
- **Security**: JWT authentication with refresh tokens, role-based access control (VictorAdmin, OperatorAdmin, Handler, AuthorityUser). Transport secured via HTTPS/TSL and payload validation with Zod schemas.
- **Data Layer**: MySQL schema representing shared entities: Flights, Airports, Passengers, CrewMembers, BaggageItems, QRPasses, Documents, AuthorityNotifications, Users, Roles, AuditLogs.
- **Integrations**: Document generation service (PDFKit/Templating), email/SMS providers, optional storage service (S3-compatible) for generated documents.
- **Observability**: Structured logging (pino), request tracing via middleware, audit trail stored in database.

### Backend Project Structure (`backend/`)
```
backend/
  prisma/
    schema.prisma
  src/
    config/
      env.ts
      logger.ts
    core/
      http.ts
      error.ts
      pagination.ts
    middleware/
      auth.ts
      errorHandler.ts
      permissions.ts
      requestLogger.ts
    lib/
      prisma.ts
      crypto.ts
      tokens.ts
    modules/
      airports/
        airports.controller.ts
        airports.routes.ts
        airports.service.ts
        airports.schemas.ts
      auth/
        auth.controller.ts
        auth.routes.ts
        auth.service.ts
        auth.schemas.ts
      flights/
        flights.controller.ts
        flights.routes.ts
        flights.service.ts
        flights.schemas.ts
      passengers/
        passengers.controller.ts
        passengers.routes.ts
        passengers.service.ts
        passengers.schemas.ts
      crew/
        crew.controller.ts
        crew.routes.ts
        crew.service.ts
        crew.schemas.ts
      baggage/
        baggage.controller.ts
        baggage.routes.ts
        baggage.service.ts
        baggage.schemas.ts
      qrpass/
        qrpass.controller.ts
        qrpass.routes.ts
        qrpass.service.ts
        qrpass.schemas.ts
      documents/
        documents.controller.ts
        documents.routes.ts
        documents.service.ts
        documents.schemas.ts
      authority/
        authority.controller.ts
        authority.routes.ts
        authority.service.ts
        authority.schemas.ts
      templates/
        templates.controller.ts
        templates.routes.ts
        templates.service.ts
        templates.schemas.ts
      users/
        users.controller.ts
        users.routes.ts
        users.service.ts
        users.schemas.ts
    routes/
      index.ts
    server.ts
    app.ts
  package.json
  tsconfig.json
  .env.example
  README.md
```

- **Prisma schema** defines table structures and relations, enabling type-safe data access.
- **Controllers** accept HTTP requests, validate payloads, and delegate to services.
- **Services** encapsulate business logic, orchestrate repositories, and trigger side effects (document generation, notifications).
- **Repositories (via Prisma)** execute all database interactions.
- **Middleware** enforces authentication, authorisation, validation, logging, and error translation.

#### Key Backend Workflows
1. **Flight Lifecycle**: Create → update → sync passengers/crew/baggage → generate documents → notify authorities.
2. **QR Pass Pipeline**: Generate secure token (encrypted payload) → send email/SMS via provider → scan validation endpoint returning role-filtered view.
3. **Document Generation**: Build JSON payload from domain entities → render PDF via template metadata → store storage key + checksum.
4. **Authority Terminal**: Dedicated routes under `/api/authority/*` with strict role checks and full auditing.
5. **Master Data Administration**: Manage airports, document templates and user provisioning through VictorAdmin-only endpoints.
6. **Offline Sync Support**: Backend exposes idempotent endpoints and conflict resolution logic (timestamps + version field) to support mobile app sync.

### Data Model Snapshot
- `Airport`: canonical list managed via admin portal.
- `Flight`: ties operator, aircraft, airport references, schedule data, sync version.
- `Passenger` / `CrewMember`: personal data, status fields, document references, linked to `Flight`.
- `BaggageItem`: linked to passenger or flight, stores weight, status history.
- `QRPass`: secure token, type (passenger/crew/handler), generatedAt, expiresAt, sentAt, status.
- `Document`: type (GeneralDeclaration, PassengerManifest, CrewList), storage link, generatedBy, audit trail.
- `AuthorityNotification`: flight, document, channel, status, metadata.
- `User` / `Role`: authentication, permission mapping.
- `AuditLog`: actor, action, resource, old/new data snapshot, timestamp, IP/device.

### API Surface (Selected Examples)
| Route | Description | Roles |
|-------|-------------|-------|
| `POST /api/auth/login` | Issue access + refresh tokens | All |
| `GET /api/flights` | Filterable flight listing | VictorAdmin, OperatorAdmin |
| `POST /api/flights` | Create flight (idempotent per UID) | VictorAdmin, OperatorAdmin |
| `GET /api/flights/:id/passengers` | Retrieve passenger roster | OperatorAdmin |
| `POST /api/flights/:id/passengers` | Add passenger from scans/manual | OperatorAdmin |
| `POST /api/flights/:flightId/passengers/:passengerId/qr-pass` | Generate QR | VictorAdmin, OperatorAdmin |
| `GET /api/qr-pass/:token` | Validate QR scan (masked data) | Handler, AuthorityUser |
| `POST /api/flights/:id/general-declaration/generate` | Generate PDF | OperatorAdmin |
| `POST /api/flights/:id/notify-authority` | Send documents to authorities | VictorAdmin |
| `GET /api/authority/flights` | Authority-specific list | AuthorityUser |
| `GET /api/airports` | List airports (search + filters) | VictorAdmin, OperatorAdmin, Handler, AuthorityUser |
| `POST /api/airports` | Create airport master data | VictorAdmin |
| `PUT /api/airports/:id` | Update airport master data | VictorAdmin |
| `GET /api/templates` | List document templates | VictorAdmin |
| `POST /api/templates` | Register document template metadata | VictorAdmin |
| `PUT /api/templates/:id` | Update document template metadata | VictorAdmin |
| `GET /api/users` | List platform users and roles | VictorAdmin |
| `POST /api/users` | Create platform user | VictorAdmin |
| `PUT /api/users/:id` | Update platform user role/status | VictorAdmin |

All endpoints enforce permission checks and input validation. Response payloads use consistent envelope: `{ data, meta, errors }`.

### Frontend Project Structure (`admin-portal/`)
```
admin-portal/
  src/
    api/
      auth.ts
      authority.ts
      baggage.ts
      client.ts
      crew.ts
      documents.ts
      flights.ts
      passengers.ts
    components/
      layout/
        AppLayout.tsx
        Sidebar.tsx
        Topbar.tsx
      tables/
        FlightsTable.tsx
    contexts/
      AuthContext.tsx
    hooks/
      useAuth.ts
      useApiError.ts
    pages/
      Auth/Login.tsx
      Flights/FlightsDashboard.tsx
      Flights/FlightDetails.tsx
      Documents/DocumentsDashboard.tsx
      Authority/AuthorityDashboard.tsx
      Settings/SettingsLanding.tsx
      Misc/Unauthorized.tsx
      Misc/NotFound.tsx
    routes/
      index.tsx
      ProtectedRoute.tsx
    theme/
      components.ts
      index.ts
    types/
      api.ts
      domain.ts
    App.tsx
    main.tsx
  package.json
  tsconfig.json
  vite.config.ts
  env.example
```

- **Routing**: `react-router-dom` with nested guardable routes via `ProtectedRoute`, enabling role-specific navigation.
- **State Management**: React context maintains the authenticated session; TanStack Query drives API fetching, caching and invalidation.
- **UI**: Chakra UI v2 custom theme, responsive shell and reusable tables/cards.
- **API Layer**: Axios client with bearer injection, automatic 401 handling and domain-specific wrappers.
- **Forms**: React Hook Form + Zod for typed validation (login today, configuration scaffolding ready).

### Workflow Overview
1. **Authentication**: Login validates credentials, persists session payload locally and primes Axios interceptors; 401 responses trigger logout.
2. **Role-Aware Navigation**: `ProtectedRoute` enforces authentication/role guards while the sidebar renders menu links according to `SessionUser.role`.
3. **Flight Management**: Dashboard filters feed query params; flight detail aggregates passengers, crew, baggage and documents and triggers General Declaration generation.
4. **Authority Terminal**: Dedicated view lists jurisdiction flights and exposes the latest General Declaration metadata with audit logging.
5. **Document Oversight**: Document dashboard summarises recent flights and their document states, linking back to the operational flight view.

### Compliance & Security Notes
- All personally identifiable information (PII) responses are role-filtered.
- Sensitive data encrypted at rest via database encryption/rest schema (handled at MySQL level) and in transit via HTTPS.
- Audit logs stored for every authority access; surfaces in admin UI for review.
- Backend adheres to GDPR by implementing data minimization, retention policies, and explicit consent tracking (future enhancement).

### Development Workflow
1. Copy `.env.example` to `.env` in both projects.
2. Run `npm install` inside `backend/` and `admin-portal/`.
3. For backend:
   - Start MySQL instance and configure connection string in `.env`.
   - Run `npx prisma migrate dev` to apply schema.
   - Start dev server with `npm run dev`.
4. For admin portal:
   - Configure `VITE_API_URL` in `.env`.
   - Start dev server with `npm run dev`.

### Future Enhancements
- Implement WebSocket channel for live status updates between portal and mobile app.
- Introduce background workers (BullMQ) for scheduled jobs (QR Pass delivery, authority notifications).
- Add analytics dashboards for operational insights (load factors, turnaround times).


