# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the BIBS·C Network Hackathon Portal. The API follows RESTful principles and uses Next.js API Routes for implementation.

## Base URL

All API endpoints are relative to the application base URL:

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## Authentication

All API endpoints (except authentication endpoints) require valid authentication. The application uses NextAuth with Azure AD for authentication.

### Authentication Headers

API requests automatically include authentication via HTTP-only cookies set by NextAuth. No manual header configuration is required for browser-based requests.

### Authentication Flow

1. User authenticates via `/api/auth/[...nextauth]` endpoints
2. NextAuth sets session cookies
3. Subsequent API requests automatically include authentication
4. Server validates session before processing requests

## Response Format

### Success Response

```json
{
    "data": {
        /* response data */
    }
}
```

### Error Response

```json
{
    "error": "Error message describing the issue",
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

### GET/POST `/api/auth/[...nextauth]`

NextAuth authentication endpoints for Azure AD integration.

**Description**: Handles OAuth 2.0 authentication flow with Azure Active Directory.

**Request Methods**: GET, POST

**Authentication**: None required (public endpoint)

**Response**: NextAuth handles redirects and session management

**Configuration**: See `app/api/auth/[...nextauth]/route.js` for detailed configuration including:

- Azure AD provider setup
- JWT callbacks for token enrichment
- Session callbacks for user data

## Database Operation Endpoints

### GET `/api/sql/phase`

Retrieves the current competition phase from the database.

**Description**: Fetches the current competition state/phase for display throughout the application.

**Request Method**: GET

**Authentication**: Required (any authenticated user)

**Response**:

```json
{
  "phase": "active" | "registration" | "submission" | "judging" | "completed"
}
```

**Example Request**:

```javascript
fetch("/api/sql/phase")
    .then(response => response.json())
    .then(data => console.log(data.phase))
```

**Implementation Details**:

- Used by `CompetitionContext` provider
- Cached client-side for application state management
- Returns string representing current competition phase

### GET `/api/sql/pullProject`

Retrieves project submissions from the database (judges only).

**Description**: Fetches all project submissions for judging purposes. Restricted to users with access level 2+ (judges/admins).

**Request Method**: GET

**Authentication**: Required (access level 2+)

**Response**:

```json
[
    {
        "id": 1,
        "teamID": "team-001",
        "project_name": "Project Title",
        "description": "Project description",
        "submission_url": "https://example.com/project",
        "submission_date": "2025-05-15T10:30:00.000Z",
        "status": "pending"
    }
]
```

**Example Request**:

```javascript
fetch("/api/sql/pullProject")
    .then(response => response.json())
    .then(projects => {
        projects.forEach(project => {
            console.log(`Team: ${project.teamID}, Project: ${project.project_name}`)
        })
    })
```

**Implementation Details**:

- Requires `session.user.access >= 2`
- Returns array of project objects
- Includes submission metadata and status
- Used in judge dashboard components

### POST `/api/sql/editProject`

Creates or updates project submissions in the database.

**Description**: Handles project submission creation and updates. Available to competitors (access level 1) for their own team submissions.

**Request Method**: POST

**Authentication**: Required (access level 1+)

**Request Body**:

```json
{
    "teamID": "team-001",
    "project_name": "Project Title",
    "description": "Project description",
    "submission_url": "https://example.com/project"
}
```

**Required Fields**:

- `teamID`: Team identifier (must match user's teamID)
- `project_name`: Project title/name
- `description`: Project description
- `submission_url`: URL to project materials

**Response**:

```json
{
    "success": true,
    "message": "Project submitted successfully",
    "projectId": 123
}
```

**Error Responses**:

- 400: Missing required fields or invalid data
- 401: Not authenticated
- 403: User doesn't have permission to edit this team's project
- 500: Database error

**Example Request**:

```javascript
const projectData = {
    teamID: "team-001",
    project_name: "AI Assistant",
    description: "An intelligent assistant for hackathon participants",
    submission_url: "https://github.com/team-001/ai-assistant"
}

fetch("/api/sql/editProject", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(projectData)
})
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log(`Project submitted with ID: ${result.projectId}`)
        } else {
            console.error(`Error: ${result.message}`)
        }
    })
```

**Implementation Details**:

- Validates user has permission to edit specified team's project
- Checks for required fields and data validation
- Handles both new submissions and updates
- Returns success/error message with project ID

## Database Utility Functions

### `getConnection()`

**Location**: `app/api/sql/database.js`

**Description**: Acquires a database connection from the connection pool.

**Returns**: `Promise<mysql.PoolConnection>`

**Usage**:

```javascript
import getConnection from "@/api/sql/database"

const connection = await getConnection()
try {
    const [rows] = await connection.query("SELECT * FROM users")
    return rows
} finally {
    connection.release()
}
```

**Important**: Always release the connection using `connection.release()` in a finally block.

### `getUser(email)`

**Location**: `app/api/sql/database.js`

**Description**: Retrieves user information by email address.

**Parameters**:

- `email` (string): User email address (case-insensitive)

**Returns**: `Promise<Object|null>`

```javascript
{
  access: 1,      // User access level
  teamID: "team-001"  // Team identifier
}
```

**Usage**:

```javascript
import { getUser } from "@/api/sql/database"

const user = await getUser("user@example.com")
if (user) {
    console.log(`Access: ${user.access}, Team: ${user.teamID}`)
}
```

**Implementation Details**:

- Used by NextAuth during authentication
- Normalizes email to lowercase for consistent lookup
- Returns null if user not found
- Logs database errors to console

### `query(sql, params)`

**Location**: `app/api/sql/database.js`

**Description**: Executes a SQL query using the connection pool.

**Parameters**:

- `sql` (string): SQL query string
- `params` (Array): Query parameters for prepared statements

**Returns**: `Promise<Array>` Query results

**Usage**:

```javascript
import { query } from "@/api/sql/database"

// Simple query
const users = await query("SELECT * FROM users WHERE access = ?", [1])

// Insert with parameters
await query("INSERT INTO projects (teamID, project_name) VALUES (?, ?)", ["team-001", "Project Name"])
```

**Implementation Details**:

- Uses parameterized queries to prevent SQL injection
- Returns query results directly
- Throws errors for database issues
- Suitable for simple queries without transactions

## Error Handling

### Authentication Errors

**401 Unauthorized**: User is not authenticated

```json
{
    "error": "Authentication required",
    "status": 401
}
```

**403 Forbidden**: User lacks required permissions

```json
{
    "error": "Insufficient permissions",
    "status": 403
}
```

### Client Errors

**400 Bad Request**: Invalid request data

```json
{
    "error": "Missing required field: project_name",
    "status": 400
}
```

**404 Not Found**: Resource not found

```json
{
    "error": "Project not found",
    "status": 404
}
```

### Server Errors

**500 Internal Server Error**: Server-side issue

```json
{
    "error": "Database connection failed",
    "status": 500
}
```

## Rate Limiting

Currently, the API does not implement rate limiting. For production deployment, consider implementing:

1. **IP-based rate limiting** for public endpoints
2. **User-based rate limiting** for authenticated endpoints
3. **Endpoint-specific limits** based on resource intensity

## CORS Configuration

The API is configured for same-origin requests only. For cross-origin requests in development:

1. Configure CORS headers in Next.js middleware
2. Specify allowed origins in production
3. Consider preflight request handling for complex requests

## Database Schema Reference

### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    access INT DEFAULT 0,
    teamID VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Field Descriptions**:

- `email`: Primary user identifier (case-insensitive)
- `access`: Permission level (0=visitor, 1=competitor, 2+=judge)
- `teamID`: Team association for competitors
- `created_at`: Account creation timestamp

### Projects Table (Example)

```sql
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teamID VARCHAR(255) NOT NULL,
    project_name VARCHAR(255),
    description TEXT,
    submission_url VARCHAR(500),
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending'
);
```

**Field Descriptions**:

- `teamID`: Reference to submitting team
- `project_name`: Submission title
- `description`: Project description
- `submission_url`: Link to project materials
- `submission_date`: Submission timestamp
- `status`: Review status (pending, reviewed, approved, rejected)

## Testing API Endpoints

### Using curl

**Test authentication**:

```bash
# This will redirect to Azure AD login
curl -v http://localhost:3000/api/auth/signin
```

**Test phase endpoint** (requires authentication cookies):

```bash
# After authenticating in browser, copy cookies
curl -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  http://localhost:3000/api/sql/phase
```

### Using Browser Developer Tools

1. Open browser Developer Tools (F12)
2. Navigate to Network tab
3. Perform actions in the application
4. Inspect API requests and responses

### Using Postman/Insomnia

1. Configure authentication via OAuth 2.0 with Azure AD
2. Set base URL to `http://localhost:3000/api`
3. Test endpoints with appropriate authentication

## Performance Considerations

### Database Optimization

1. **Indexes**: Ensure proper indexes on frequently queried columns:

    ```sql
    CREATE INDEX idx_users_email ON users(email);
    CREATE INDEX idx_projects_teamID ON projects(teamID);
    CREATE INDEX idx_projects_status ON projects(status);
    ```

2. **Query Optimization**: Use EXPLAIN to analyze query performance
3. **Connection Pooling**: Configure appropriate pool size based on expected load

### API Optimization

1. **Response Caching**: Implement caching for static data
2. **Pagination**: Add pagination for large result sets
3. **Compression**: Enable gzip compression for API responses
4. **Monitoring**: Track API response times and error rates

## Security Considerations

### Input Validation

All API endpoints should validate:

1. **Required fields**: Check for missing required parameters
2. **Data types**: Validate parameter types and formats
3. **Length limits**: Enforce maximum lengths for string fields
4. **SQL injection**: Use parameterized queries exclusively

### Authentication Security

1. **Session Management**: Rely on NextAuth for secure session handling
2. **Token Validation**: Validate JWT tokens on each request
3. **Role Verification**: Check user access level for protected endpoints
4. **Team Ownership**: Verify users can only access their own team's data

### Database Security

1. **Least Privilege**: Database user should have minimal required permissions
2. **Connection Security**: Use SSL for database connections in production
3. **Error Handling**: Generic error messages to prevent information leakage
4. **Audit Logging**: Log sensitive operations for security monitoring

## Versioning

Current API version: **v1**

The API does not currently implement versioning in the URL. For future versions, consider:

- URL versioning: `/api/v1/endpoint`
- Header versioning: `Accept: application/vnd.nethack.v1+json`
- Parameter versioning: `?version=1`

## Deprecation Policy

When introducing breaking changes:

1. Maintain backward compatibility for one major release cycle
2. Document deprecated endpoints with migration guides
3. Provide ample notice before removing deprecated functionality
4. Log usage of deprecated endpoints for migration tracking

## Monitoring and Metrics

### Key Metrics to Monitor

1. **Response Times**: Average and p95 response times per endpoint
2. **Error Rates**: 4xx and 5xx error percentages
3. **Authentication Success Rate**: Login success/failure ratio
4. **Database Performance**: Query execution times and connection pool usage
5. **Endpoint Usage**: Request volume per endpoint

### Logging

API endpoints should log:

1. **Request details**: Method, path, parameters (sanitized)
2. **User context**: User ID, access level, team ID
3. **Performance metrics**: Processing time, database query time
4. **Errors**: Detailed error information for debugging
5. **Security events**: Authentication failures, permission violations

## Support and Troubleshooting

### Common Issues

**Authentication Issues**:

- Verify Azure AD application configuration
- Check redirect URIs match deployment URL
- Ensure NEXTAUTH_SECRET is properly set

**Database Issues**:

- Verify MySQL service is running
- Check database connection credentials
- Review database error logs

**API Response Issues**:

- Check browser console for CORS errors
- Verify request payload matches expected format
- Check server logs for detailed error information

### Getting Help

1. **Check Documentation**: Review this document and code comments
2. **Examine Logs**: Check server and database logs for errors
3. **Reproduce Issue**: Create minimal test case to reproduce the problem
4. **Contact Support**: Reach out to development team with detailed issue description
