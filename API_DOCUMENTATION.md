# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the BIBS·C Network Hackathon Portal. The API follows RESTful principles, is implemented using Next.js App Router, and is fully typed with TypeScript. All endpoints (except authentication) enforce role‑based access control.

## Base URL

All API endpoints are relative to the application base URL:

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

All API endpoints (except authentication endpoints) require valid authentication. The application uses NextAuth with Azure AD, which manages sessions via HTTP‑only cookies.

### Authentication Headers

No manual header configuration is required for browser‑based requests. Server‑side requests (e.g., from `getServerSession`) also rely on the same cookie mechanism.

### Authentication Flow

1. User authenticates via `/api/auth/[...nextauth]`
2. NextAuth sets session cookies
3. Subsequent API requests automatically include the session
4. Each endpoint validates the session and user permissions

## Response Format

### Success Response

```json
{
    "data": {
        /* response data */
    } // or a direct array/object
}
```

Many endpoints return the data directly (without a wrapper) for simplicity.

### Error Response

```json
{
    "error": "Error message describing the issue",
    "details": "Optional additional details",
    "status": 400
}
```

### Common HTTP Status Codes

| Code | Description           |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |

## Authentication Endpoints

### GET|POST `/api/auth/[...nextauth]`

NextAuth authentication endpoints for Azure AD integration.

**Description**: Handles the OAuth 2.0 authentication flow with Azure Active Directory. The dynamic route `[...nextauth]` captures all authentication‑related requests.

**Request Methods**: GET, POST

**Authentication**: None required (public)

**Response**: NextAuth manages redirects, session creation, and JSON responses as needed.

**Implementation Details**:  
See `app/api/auth/[...nextauth]/route.ts` for the full configuration. Key features:

- Azure AD provider with required scopes (`openid profile email User.Read`)
- JWT callback that enriches the token with `access`, `teamID`, and `accessToken`
- Session callback that transfers enriched data to the client‑side session
- User access level (0, 1, 2+) is fetched from the database via `getUser(email)`

## Database Operation Endpoints

All database endpoints are located under `/api/sql/` and require authentication. They use a connection pool (`app/api/sql/database.ts`) and parameterized queries to prevent SQL injection.

### GET `/api/sql/phase`

Retrieves the current competition phase from the `phases` table.

**Request Method**: GET

**Authentication**: Required (any authenticated user)

**Response**:

```json
{
    "phase": "closed" | "active" | "judging"
}
```

**Example Request**:

```javascript
fetch("/api/sql/phase")
    .then(res => res.json())
    .then(data => console.log(data.phase))
```

**Implementation Details**:

- Queries the `phases` table and returns the `phase` of the most recent (or active) record.
- Used by `CompetitionContext` to manage application‑wide phase state.
- No caching implemented; each request hits the database.

### GET `/api/sql/pullProject`

Retrieves project submissions from the `hacks` table. Supports an optional `search` parameter to filter by `teamID`.

**Request Method**: GET

**Authentication**: Required (access level ≥ 2 for full list; access level 1 can only fetch their own team via `search`)

**Query Parameters**:

| Parameter | Type   | Description                         | Required |
| --------- | ------ | ----------------------------------- | -------- |
| `search`  | string | `teamID` to filter a single project | No       |

**Response** (without `search`):

```json
[
    {
        "id": 1,
        "teamID": "c0ad4f19",
        "title": "Natural Selection Simulation",
        "description": "A simulation of evolutionary processes...",
        "github": "https://github.com/...",
        "prompt": "Game Jam",
        "technologies": "JavaScript, p5.js",
        "members": "Alice, Bob",
        "sub_code": "Github",
        "sub_video": "https://youtu.be/...",
        "round": "25R2",
        "submission_date": "2025-05-15T10:30:00.000Z",
        "status": "pending"
    }
]
```

**Response** (with `search`): an array containing the single matching record, or an empty array if not found.

**Example Requests**:

```javascript
// Fetch all projects (judges only)
fetch("/api/sql/pullProject")

// Fetch a specific team's project
fetch("/api/sql/pullProject?search=c0ad4f19")
```

**Implementation Details**:

- Judges (`access > 1`) can retrieve all records; competitors (`access = 1`) can only retrieve their own team’s record (by including `search`).
- Returns an empty array if no records match.

### POST `/api/sql/editProject`

Creates or updates a project submission in the `hacks` table.

**Request Method**: POST

**Authentication**: Required (access level 1+)

**Request Body**:

```json
{
    "teamID": "c0ad4f19",
    "title": "Updated Project Title",
    "description": "Updated description...",
    "github": "https://github.com/...",
    "prompt": "Game Jam",
    "technologies": "JavaScript, React"
}
```

**Required Fields**: `teamID`, `title`, `description`, `github`, `prompt`, `technologies`  
(Note: `github` and `technologies` are required by the form, but the database allows NULL; the component sends them as strings.)

**Response** (success):

```json
{
    "message": "Update successful"
}
```

**Response** (failure – no matching team):

```json
{
    "message": "No team found with the given ID"
}
```

**Error Responses**:

- 400: Malformed JSON or missing fields
- 401: Not authenticated
- 403: User’s `teamID` does not match the submitted `teamID` (unless user is a judge)
- 500: Database error with `details`

**Example Request**:

```javascript
const projectData = {
    teamID: "c0ad4f19",
    title: "AI Assistant",
    description: "An intelligent assistant...",
    github: "https://github.com/team-001/ai-assistant",
    prompt: "Game Jam",
    technologies: "Python, Flask"
}

fetch("/api/sql/editProject", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData)
})
    .then(res => res.json())
    .then(data => {
        if (res.ok) console.log(data.message)
        else console.error(data.error)
    })
```

**Implementation Details**:

- Uses an `UPDATE` query; assumes the record already exists (inserts are handled separately).
- Returns `affectedRows` to determine success.
- Judges (`access > 1`) can edit any project; competitors can only edit their own team’s project (the `teamID` in the body must match `session.user.teamID`).

## Database Utility Functions

All database utilities reside in `app/api/sql/database.ts` and are written in TypeScript with generic return types.

### `getConnection(): Promise<PoolConnection>`

Acquires a database connection from the connection pool. Always release the connection in a `finally` block.

```typescript
import getConnection from "@/app/api/sql/database"

const connection = await getConnection()
try {
    const [rows] = await connection.query("SELECT * FROM users")
    return rows
} finally {
    connection.release()
}
```

### `getUser(email: string): Promise<{ access: number; teamID: string | null } | null>`

Retrieves a user’s access level and team ID from the `users` table. Used by NextAuth during sign‑in.

```typescript
import { getUser } from "@/app/api/sql/database"

const user = await getUser("user@example.com")
if (user) {
    console.log(`Access: ${user.access}, Team: ${user.teamID}`)
}
```

### `query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T>`

Executes a raw SQL query with parameterized values. Returns the result rows typed as `T`.

```typescript
import { query } from "@/app/api/sql/database"

const users = await query<{ id: number; email: string }[]>("SELECT id, email FROM users WHERE access = ?", [1])
```

## Error Handling

All endpoints follow a consistent error handling pattern:

- **Authentication errors**: Return 401 if no session, 403 if insufficient permissions.
- **Validation errors**: Return 400 with a descriptive message.
- **Database errors**: Return 500 with a generic message (details logged server‑side).

Example error response (403):

```json
{
    "error": "Forbidden",
    "details": "You do not have permission to edit this project."
}
```

## Rate Limiting

Currently, the API does not implement rate limiting. For production, consider adding middleware‑based rate limiting (e.g., using `express-rate-limit` with Next.js middleware or a reverse proxy).

## CORS

The API is configured for same‑origin requests only. No CORS headers are set; all requests must originate from the same domain. If cross‑origin access is required, implement a custom middleware in `app/middleware.ts`.

## Database Schema Reference

The application uses three main tables: `users`, `hacks`, and `phases`. (See the main README for full schemas.)

### Users Table

| Column       | Type         | Description                       |
| ------------ | ------------ | --------------------------------- |
| `id`         | INT          | Primary key                       |
| `email`      | VARCHAR(255) | Unique user email                 |
| `access`     | INT          | 0=visitor, 1=competitor, 2+=judge |
| `teamID`     | VARCHAR(255) | Team identifier for competitors   |
| `members`    | VARCHAR(255) | Optional team member names        |
| `created_at` | TIMESTAMP    | Account creation time             |

### Hacks Table

| Column            | Type         | Description                              |
| ----------------- | ------------ | ---------------------------------------- |
| `id`              | INT          | Primary key                              |
| `teamID`          | VARCHAR(255) | Team identifier (matches `users.teamID`) |
| `title`           | VARCHAR(255) | Project title                            |
| `description`     | TEXT         | Project description                      |
| `github`          | VARCHAR(500) | GitHub URL                               |
| `prompt`          | VARCHAR(255) | Selected prompt                          |
| `technologies`    | TEXT         | Comma‑separated technologies             |
| `members`         | VARCHAR(255) | Team members (denormalized)              |
| `sub_code`        | VARCHAR(500) | Code submission URL or `"Github"`        |
| `sub_video`       | VARCHAR(500) | Video submission URL                     |
| `round`           | VARCHAR(10)  | Competition round                        |
| `submission_date` | TIMESTAMP    | Timestamp of submission                  |
| `status`          | VARCHAR(50)  | Submission status                        |

### Phases Table

| Column       | Type        | Description                       |
| ------------ | ----------- | --------------------------------- |
| `id`         | INT         | Primary key                       |
| `phase`      | VARCHAR(50) | `closed`, `active`, or `judging`  |
| `start_date` | TIMESTAMP   | Optional phase start              |
| `end_date`   | TIMESTAMP   | Optional phase end                |
| `is_active`  | BOOLEAN     | Whether this is the current phase |

## Testing API Endpoints

### Using cURL

```bash
# Test phase endpoint (after obtaining a session cookie)
curl -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  http://localhost:3000/api/sql/phase
```

### Using Browser DevTools

1. Log in to the application.
2. Open DevTools (F12) → Network tab.
3. Perform actions that trigger API calls (e.g., loading the dashboard).
4. Inspect request and response details.

### Using Postman / Insomnia

- Configure OAuth 2.0 with Azure AD to obtain a session.
- Set the base URL to `http://localhost:3000/api`.
- Include the session cookie in requests (Postman can manage cookies automatically if you visit the site first).

## TypeScript Integration

All API routes are written in TypeScript and export typed request/response handlers:

- `NextRequest` and `NextResponse` from `next/server`
- Database results are typed using interfaces (e.g., `ProjectSubmission`, `UserRow`)
- The `query` function is generic, preserving type safety

Example of a typed API route:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { query } from "@/app/api/sql/database"

interface PhaseRow extends RowDataPacket {
    phase: string
}

export async function GET(req: NextRequest) {
    const [rows] = await query<PhaseRow[]>("SELECT phase FROM phases LIMIT 1")
    return NextResponse.json({ phase: rows[0]?.phase ?? "unknown" })
}
```

## Performance Considerations

- **Indexes**: Ensure indexes on `email` (users), `teamID` (hacks), and `phase` (phases).
- **Connection pool**: The pool size is set to 20; adjust based on expected concurrency.
- **Query optimization**: Use `EXPLAIN` to analyze slow queries.
- **Caching**: Static data like the competition phase could be cached with a short TTL; not currently implemented.

## Security Considerations

- **SQL injection**: All queries use parameterized statements (via `mysql2`).
- **Authentication**: Every non‑auth endpoint verifies the session and checks permissions.
- **Data validation**: Request bodies are validated before being used in queries.
- **Error messages**: Production errors omit stack traces and sensitive details.
- **CSP**: A Content Security Policy is set in `next.config.ts` (see main README).

## Versioning and Deprecation

The API currently does not use versioning. Future breaking changes will be introduced under a `/v1/` prefix, and deprecated endpoints will be supported for one release cycle with clear warnings.

## Support

For issues, consult:

- Server logs (`npm run dev` or production logs)
- Browser console for client‑side errors
- Database logs (enable general log if needed)
- The project’s GitHub repository for known issues

---

_This documentation was last updated on March 10, 2026, to reflect the TypeScript migration and configuration‑driven design._
