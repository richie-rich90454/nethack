# BIBS·C Network Hackathon Portal - Architecture Documentation

## System Overview

The BIBS·C Network Hackathon Portal is a full‑stack web application built with **Next.js 16 (App Router)** and **TypeScript**, designed to manage annual hackathon competitions. The platform provides secure authentication, project submission workflows, judging dashboards, and competition state management for participants, judges, and administrators. All user‑facing text is externalized into a single configuration file, enabling rapid rebranding without code changes.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │   React     │  │  Next.js    │  │     CSS Modules       │   │
│  │ Components  │◄─┤    App      │◄─┤  (component‑scoped)   │   │
│  │   (TSX)     │  │    Router   │  │                       │   │
│  └─────────────┘  └─────────────┘  └───────────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js Server (Node.js)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────┐   │
│  │   API       │  │   Page      │  │    next.config.ts     │   │
│  │   Routes    │  │   Routes    │  │  (security/performance)│   │
│  │  (TypeScript)│  │ (TypeScript)│  └───────────────────────┘   │
│  └──────┬──────┘  └──────┬──────┘                                 │
└─────────┼────────────────┼───────────────────────────────────────┘
          │                │
          ▼                ▼
┌───────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│    Database       │  │      Azure AD       │  │   Static Assets  │
│    (MySQL 8+)     │  │      (OAuth 2.0)    │  │    (public/)     │
│   connection pool │  │                     │  │                  │
└───────────────────┘  └─────────────────────┘  └──────────────────┘
```

## Technology Stack

### Frontend Layer

- **Next.js 16.1.6**: React framework with App Router, Turbopack for fast development, and built‑in optimizations.
- **React 19.2.4**: UI library with hooks for state and lifecycle management.
- **TypeScript**: Strict mode, path aliases (`@/src/*`), and global type augmentations.
- **CSS Modules**: Component‑scoped styling with global design tokens defined in `globals.css`.
- **NextAuth.js**: Authentication library with Azure AD provider and custom JWT/session callbacks.

### Backend Layer

- **Next.js API Routes**: TypeScript‑based serverless functions handling database operations and authentication.
- **MySQL 8.0+**: Relational database with tables for users, project submissions (`hacks`), and competition phases (`phases`).
- **mysql2/promise**: Database driver with connection pooling, prepared statements, and TypeScript support (RowDataPacket).
- **Azure AD**: Enterprise identity provider via OAuth 2.0 and OpenID Connect.

### Infrastructure & Configuration

- **Centralized Configuration**: All user‑visible text, dates, and external URLs are defined in `config/siteConfig.ts` with a strongly typed interface.
- **Connection Pooling**: Managed pool with configurable limits (`connectionLimit: 20`) for efficient database resource usage.
- **Environment Variables**: Strictly typed via `types.d.ts` (NodeJS.ProcessEnv) for compile‑time safety.
- **Static File Serving**: Optimized delivery of fonts, images, and archived project files from the `public/` directory.

## Core Components

### 1. Authentication System

#### Architecture

```
User Browser → /login (Next.js) → Azure AD OAuth → NextAuth Callbacks → Database → Enriched Session
```

#### Key Components

- **AzureADProvider**: NextAuth provider configured with required scopes (`openid profile email User.Read`).
- **JWT Callback**: Enriches the token with `access`, `teamID`, and `accessToken` retrieved from the `users` table via `getUser(email)`.
- **Session Callback**: Transfers enriched token data to the client‑side session object.
- **Role‑Based Access Control**: Three‑tier permission system (0 = visitor/voter, 1 = competitor, 2+ = judge).

#### Data Flow

1. User visits `/login`; unauthenticated users see a sign‑in button.
2. On sign‑in, redirect to Azure AD; after consent, Azure AD redirects to `/api/auth/callback/azure-ad`.
3. NextAuth exchanges the authorization code for tokens; the `jwt` callback fetches user data from the database.
4. The `session` callback makes `access`, `teamID`, and other fields available to client components via `useSession()`.
5. Protected routes and API endpoints check `session.user.access` to enforce permissions.

### 2. Database Layer

#### Connection Management

```typescript
// app/api/sql/database.ts
const pool = mysql.createPool({
	host: "localhost",
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: "nethack",
	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0,
});

export default async function getConnection() {
	return await pool.getConnection();
}
```

#### Schema Design (Actual Tables)

**users** – Authentication and role data

| Column     | Type         | Description                       |
| ---------- | ------------ | --------------------------------- |
| id         | INT          | Primary key, auto‑increment       |
| email      | VARCHAR(255) | User email (unique)               |
| access     | INT          | 0=visitor, 1=competitor, 2+=judge |
| teamID     | VARCHAR(255) | Team identifier (for competitors) |
| members    | VARCHAR(255) | Optional team member names        |
| created_at | TIMESTAMP    | Account creation time             |

**hacks** – Project submissions (formerly “projects” table)

| Column          | Type         | Description                              |
| --------------- | ------------ | ---------------------------------------- |
| id              | INT          | Primary key                              |
| teamID          | VARCHAR(255) | Team identifier (matches `users.teamID`) |
| title           | VARCHAR(255) | Project title                            |
| description     | TEXT         | Project description                      |
| github          | VARCHAR(500) | GitHub repository URL                    |
| prompt          | VARCHAR(255) | Selected hackathon prompt                |
| technologies    | TEXT         | Comma‑separated technologies used        |
| members         | VARCHAR(255) | Team members (denormalized)              |
| sub_code        | VARCHAR(500) | Code submission URL or `"Github"`        |
| sub_video       | VARCHAR(500) | Video submission URL                     |
| round           | VARCHAR(10)  | Competition round (e.g., `"25R2"`)       |
| submission_date | TIMESTAMP    | Submission timestamp                     |
| status          | VARCHAR(50)  | `pending`, `reviewed`, etc.              |

**phases** – Competition timeline

| Column     | Type        | Description                       |
| ---------- | ----------- | --------------------------------- |
| id         | INT         | Primary key                       |
| phase      | VARCHAR(50) | `closed`, `active`, or `judging`  |
| start_date | TIMESTAMP   | Optional phase start              |
| end_date   | TIMESTAMP   | Optional phase end                |
| is_active  | BOOLEAN     | Whether this is the current phase |

#### Type‑Safe Query Helpers

All database functions are generic and return typed results:

```typescript
export async function query<T extends RowDataPacket[]>(
	sql: string,
	params?: any[],
): Promise<T> {
	const [rows] = await pool.query<T>(sql, params);
	return rows;
}
```

### 3. State Management

#### Competition Context

- **Global State**: `CompetitionContext` provides the current competition phase (`closed`, `active`, `judging`) to all components.
- **Automatic Fetching**: On mount, it calls `/api/sql/phase` and updates state.
- **Usage**: `const { competitionState } = useCompetition();`

#### Session State

- **NextAuth Integration**: `useSession()` hook provides client‑side session data, enriched with `access` and `teamID`.
- **Server‑Side Validation**: API routes and server components use `getServerSession()` to verify permissions.

### 4. API Architecture

#### Route Structure

```
app/api/
├── auth/[...nextauth]/          # NextAuth authentication endpoints
└── sql/                         # Database operation endpoints
    ├── database.ts                # Connection pool and utilities
    ├── editProject/route.ts       # POST – update a submission
    ├── phase/route.ts             # GET – current competition phase
    └── pullProject/route.ts       # GET – fetch submissions (supports ?search)
```

#### Design Patterns

- **RESTful Principles**: Endpoints map to resources (`phase`, `project`).
- **Middleware‑like Validation**: Each route checks session and permissions before processing.
- **Consistent Error Handling**: Returns JSON with `error` and `details`; HTTP status codes reflect the error type.
- **Input Validation**: Request bodies are parsed and validated; SQL injection prevented via parameterized queries.

### 5. Frontend Architecture

#### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── SessionProvider (next-auth/react)
├── CompetitionProvider (context)
├── Navbar (src/components/Navbar.tsx)
├── Page Content (children)
└── Footer (src/components/Footer.tsx)
```

#### Page Structure

- **Home (`/`)** – Public landing with countdowns and competition info.
- **Login (`/login`)** – Authentication page; shows user info when logged in.
- **Dashboard (`/dashboard`)** – Role‑specific view (competitor or judge) based on `access` level.
- **Showcase (`/showcase`)** – Public gallery of winning projects, driven by `siteConfig.showcase.winners`.

#### Styling System

- **CSS Modules**: Each component has a `*.module.css` file for scoped styles.
- **Global Styles**: `app/globals.css` defines custom fonts (CMU, Monaspace), color variables, and utility classes.
- **Responsive Design**: Mobile‑first with media queries; flexible layout classes.

## Configuration System

All customizable text and values are centralized in `config/siteConfig.ts`. The configuration is strongly typed and imported wherever a string is needed. This allows the entire portal to be rebranded by editing a single file.

Key sections:

- `siteTitle` – browser tab title
- `nav` – navigation labels
- `home` – headings, descriptions, countdown dates
- `login` – page text and account type labels
- `dashboard` – access denied, loading messages
- `dashboardCompetitor` / `dashboardJudge` – phase labels, tooltips, notes
- `showcase` – headings, winner team IDs, descriptions
- `submissionForm` – form labels, placeholders, prompt list
- `footer` – copyright
- `externalUrls` – sign‑up form link

## Data Flow Patterns

### Authentication Flow

1. User accesses a protected page; `useSession()` returns `null`.
2. Page redirects to `/login`.
3. User clicks “Sign in”; OAuth flow with Azure AD begins.
4. After successful authentication, NextAuth executes `jwt` and `session` callbacks.
5. Database user record is fetched (or created) and merged into the session.
6. Client receives enriched session; UI updates accordingly.

### Competition Phase Flow

1. `CompetitionProvider` mounts; calls `/api/sql/phase`.
2. API route queries the `phases` table and returns the current phase.
3. Context state updates; all consumers re‑render.
4. Phase determines which dashboard components are shown and whether forms are editable.

### Project Submission Flow (Competitor)

1. Competitor (`access === 1`) visits `/dashboard`.
2. `DashboardCompetitor` renders `SubmissionForm` (if phase is `active`).
3. User fills out the form; on submit, `POST /api/sql/editProject` is called.
4. API validates that the `teamID` matches the user’s team and updates the `hacks` table.
5. On success, `onUpdate` callback refreshes the form data.

### Project Retrieval Flow (Judge)

1. Judge (`access > 1`) visits `/dashboard`.
2. `DashboardJudge` calls `fetchEntries()` → `GET /api/sql/pullProject`.
3. API returns all records from the `hacks` table (no `search` param).
4. Each submission is rendered with `Submission` component; judges see “Edit” buttons.

## Security Considerations

- **Authentication**: OAuth 2.0 with Azure AD; HTTP‑only cookies for session storage.
- **Authorization**: Every API endpoint checks `session.user.access` and, for competitor edits, verifies `teamID` ownership.
- **SQL Injection**: All queries use parameterized statements via `mysql2`.
- **Input Validation**: Request bodies are parsed and expected fields are validated; malformed requests return 400.
- **Environment Variables**: Sensitive credentials are stored in `.env.local` (or production equivalents) and never committed.
- **HTTP Headers**: `next.config.ts` adds security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and a restrictive Content‑Security‑Policy.
- **Error Messages**: Generic messages returned to client; detailed errors logged server‑side.

## Performance Optimizations

- **Database**: Connection pooling reduces overhead; indexes on frequently queried columns (`email`, `teamID`).
- **Next.js**: `swcMinify: true`, `poweredByHeader: false`, image optimization with modern formats.
- **Frontend**: Code splitting per route, CSS Modules for minimal runtime, font optimization.
- **Production Build**: Console logs removed (except errors/warnings), source maps disabled to reduce bundle size.

## Deployment Architecture

### Development Environment

- **Database**: Local MySQL instance with schema defined in README.
- **Server**: `npm run dev` starts Next.js with Turbopack.
- **Environment**: `.env.local` supplies database credentials and Azure AD keys.

### Production Environment

- **Build**: `npm run build` creates an optimized production bundle.
- **Serve**: `npm start` runs the standalone Next.js server.
- **Reverse Proxy**: Nginx (or similar) handles SSL termination, load balancing, and static file caching.
- **Database**: Managed MySQL service (e.g., AWS RDS) with automated backups.

### Scaling Considerations

- **Horizontal Scaling**: Next.js server is stateless; multiple instances can run behind a load balancer.
- **Database Scaling**: Read replicas for heavy read workloads; connection pool limits adjusted accordingly.
- **CDN**: Static assets (`/_next/static`) can be served via CDN with long‑lived cache headers.

## Monitoring and Maintenance

- **Logging**: Application logs (`console.error`, `console.log`) are captured; database errors are logged.
- **Metrics**: Key metrics include API response times, error rates, and database connection pool usage.
- **Backups**: Regular database backups; tested restoration procedure.
- **Dependency Updates**: Regular `npm update` and review of security advisories.

## Development Guidelines

- **TypeScript**: Strict mode; always define interfaces for props and API responses.
- **Component Structure**: Each component in its own file; export as default.
- **API Routes**: Use `NextRequest` and `NextResponse`; wrap database calls in try/catch/finally.
- **Configuration**: Never hardcode user‑facing strings; always use `siteConfig`.
- **Testing**: Unit tests for utilities; integration tests for critical API flows (planned).

## Future Enhancements

- **Real‑time Updates**: WebSocket integration for live judging scores.
- **File Uploads**: Direct submission of videos/code via cloud storage.
- **Advanced Judging**: Scoring rubrics, comments per criterion.
- **Analytics Dashboard**: Track submissions, views, and engagement.
- **Internationalization**: Multiple languages via configuration files.

---

_This documentation reflects the codebase as of March 10, 2026, following the TypeScript migration and configuration‑driven redesign._
