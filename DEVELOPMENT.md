# Development Guide

## Getting Started

### Prerequisites

- **Node.js 18+** and **npm** (or yarn/pnpm)
- **MySQL 8.0+** database server
- **Azure AD Application** for authentication (development tenant available)
- **Git** for version control

### Initial Setup

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd nethack
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables** Create `.env.local` in the project root:

    ```env
    # Database Configuration
    SQL_USERNAME=root
    SQL_PASSWORD=your_password

    # NextAuth Configuration
    NEXTAUTH_SECRET=your_generated_secret_here
    NEXTAUTH_URL=http://localhost:3000

    # Azure AD Configuration (Development)
    AZURE_AD_CLIENT_ID=your_azure_ad_client_id
    AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret
    AZURE_AD_TENANT_ID=your_azure_ad_tenant_id
    ```

    Generate a secure NEXTAUTH_SECRET:

    ```bash
    openssl rand -base64 32
    ```

4. **Set up the database**

    ```sql
    -- Create database
    CREATE DATABASE nethack;
    USE nethack;

    -- Create users table
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        access INT DEFAULT 0,
        teamID VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Insert test users
    INSERT INTO users (email, access, teamID) VALUES
    ('visitor@example.com', 0, NULL),
    ('competitor@example.com', 1, 'team-001'),
    ('judge@example.com', 2, NULL);
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Access the application** Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Project Structure

```
nethack/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   │   ├── auth/          # Authentication routes
│   │   └── sql/           # Database operations
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── showcase/          # Project showcase
│   ├── layout.js          # Root layout
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── src/                   # Source code
│   ├── components/        # React components
│   └── context/          # React context providers
├── public/                # Static assets
└── docs/                  # Documentation
```

### Code Organization Guidelines

1. **Component Structure**
    - Each component in its own file with matching CSS module
    - Export default component at bottom of file
    - Include JSDoc comments for component documentation

2. **API Route Structure**
    - One route per file in `/app/api/` directory
    - Use HTTP methods appropriately (GET, POST, etc.)
    - Include error handling and input validation

3. **Styling Convention**
    - Use CSS Modules for component-scoped styles
    - Global styles in `app/globals.css`
    - Follow BEM-like naming convention in CSS modules

### Development Scripts

| Script          | Purpose                  | Usage           |
| --------------- | ------------------------ | --------------- |
| `npm run dev`   | Start development server | `npm run dev`   |
| `npm run build` | Build for production     | `npm run build` |
| `npm start`     | Start production server  | `npm start`     |
| `npm run lint`  | Run ESLint               | `npm run lint`  |

## Database Development

### Connection Management

The application uses a connection pool managed by `mysql2/promise`. Key configuration in `app/api/sql/database.js`:

```javascript
const pool = mysql.createPool({
    host: "localhost",
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: "nethack",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
})
```

### Query Patterns

1. **Using Connection Pool Directly**

    ```javascript
    import { query } from "@/api/sql/database"

    const results = await query("SELECT * FROM users WHERE access = ?", [1])
    ```

2. **Using Connection for Transactions**

    ```javascript
    import getConnection from "@/api/sql/database"

    const connection = await getConnection()
    try {
        await connection.beginTransaction()
        // Multiple queries
        await connection.commit()
    } catch (error) {
        await connection.rollback()
        throw error
    } finally {
        connection.release()
    }
    ```

### Schema Migrations

For production schema changes, create migration files:

```sql
-- migrations/001_add_projects_table.sql
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

## Authentication Development

### Azure AD Configuration

1. **Register Application in Azure AD**
    - Go to Azure Portal → Azure Active Directory → App registrations
    - Create new registration with redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
    - Note: Client ID, Tenant ID, and generate a client secret

2. **Required API Permissions**
    - Microsoft Graph → User.Read (delegated)
    - Microsoft Graph → email (delegated)
    - Microsoft Graph → profile (delegated)

### Testing Authentication

1. **Test Users**
    - Create test users in Azure AD or use existing accounts
    - Add test users to database with appropriate access levels

2. **Local Development**
    - Use Azure AD development tenant
    - Configure redirect URIs for localhost
    - Set `NEXTAUTH_URL` to `http://localhost:3000`

### Session Management

Access session data in components:

```javascript
import { useSession } from "next-auth/react"

const { data: session, status } = useSession()

if (status === "authenticated") {
    console.log("User access level:", session.user.access)
    console.log("Team ID:", session.user.teamID)
}
```

## Component Development

### Creating New Components

1. **Component Template**

    ```javascript
    /**
     * ComponentName Component
     *
     * Brief description of component purpose and functionality.
     *
     * @component
     * @param {Object} props - Component properties
     * @param {string} props.exampleProp - Example property description
     * @returns {JSX.Element} Rendered component
     */
    "use client"
    import React from "react"
    import styles from "./ComponentName.module.css"

    const ComponentName = ({ exampleProp }) => {
        return <div className={styles.container}>{/* Component content */}</div>
    }

    export default ComponentName
    ```

2. **CSS Module Template**
    ```css
    /* ComponentName.module.css */
    .container {
        /* Styles here */
    }
    ```

### State Management

1. **Local State**: Use `useState` for component-specific state
2. **Global State**: Use `CompetitionContext` for competition-wide state
3. **Session State**: Use `useSession` from NextAuth for authentication state

### Event Handling

```javascript
const handleSubmit = async event => {
    event.preventDefault()

    try {
        const response = await fetch("/api/sql/editProject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            // Handle success
        } else {
            // Handle error
        }
    } catch (error) {
        console.error("Submission error:", error)
    }
}
```

## API Development

### Creating New API Routes

1. **Route Structure**

    ```javascript
    /**
     * API Route: /api/endpoint/name
     *
     * Brief description of endpoint purpose and functionality.
     *
     * @route GET/POST /api/endpoint/name
     * @param {Request} request - HTTP request object
     * @returns {Response} HTTP response
     */
    import { getSession } from "next-auth/react"
    import { query } from "@/api/sql/database"

    export async function GET(request) {
        // Authentication check
        const session = await getSession({ req: request })
        if (!session) {
            return new Response("Unauthorized", { status: 401 })
        }

        try {
            // Database operations
            const results = await query("SELECT * FROM table")

            // Return response
            return Response.json(results)
        } catch (error) {
            console.error("API error:", error)
            return new Response("Internal Server Error", { status: 500 })
        }
    }

    export async function POST(request) {
        // Similar structure for POST requests
    }
    ```

2. **Input Validation**

    ```javascript
    const data = await request.json()

    // Validate required fields
    if (!data.requiredField) {
        return new Response("Missing required field", { status: 400 })
    }

    // Validate data types
    if (typeof data.field !== "string") {
        return new Response("Invalid field type", { status: 400 })
    }
    ```

### Error Handling

1. **HTTP Status Codes**
    - 200: Success
    - 400: Bad Request (client error)
    - 401: Unauthorized (authentication required)
    - 403: Forbidden (insufficient permissions)
    - 404: Not Found
    - 500: Internal Server Error

2. **Error Responses**
    ```javascript
    return Response.json({ error: "Descriptive error message" }, { status: 400 })
    ```

## Testing

### Unit Testing

1. **Component Tests**

    ```javascript
    // __tests__/components/Countdown.test.js
    import { render, screen } from "@testing-library/react"
    import Countdown from "@/components/Countdown"

    describe("Countdown Component", () => {
        test("renders countdown label", () => {
            render(<Countdown targetDate="2025-12-31" label="Test Event" />)
            expect(screen.getByText(/Time until/)).toBeInTheDocument()
        })
    })
    ```

2. **API Tests**

    ```javascript
    // __tests__/api/sql/phase.test.js
    import { GET } from "@/app/api/sql/phase/route"

    describe("Phase API", () => {
        test("returns competition phase", async () => {
            const response = await GET()
            expect(response.status).toBe(200)
        })
    })
    ```

### Integration Testing

1. **Authentication Flow**
    - Test login/logout functionality
    - Test protected route access
    - Test role-based permissions

2. **Database Integration**
    - Test CRUD operations
    - Test transaction handling
    - Test error scenarios

### End-to-End Testing

Use Playwright or Cypress for E2E testing:

```javascript
// e2e/dashboard.spec.js
test("competitor can access dashboard", async ({ page }) => {
    await page.goto("/login")
    // Authentication and dashboard navigation
})
```

## Debugging

### Common Issues

1. **Database Connection Errors**
    - Verify MySQL service is running
    - Check environment variables
    - Test database credentials

2. **Authentication Issues**
    - Check Azure AD configuration
    - Verify redirect URIs
    - Check NEXTAUTH_URL matches deployment

3. **Build Errors**
    - Clear node_modules: `rm -rf node_modules && npm install`
    - Check Node.js version compatibility
    - Verify dependency versions

### Debugging Tools

1. **Browser DevTools**
    - Console for client-side errors
    - Network tab for API requests
    - React DevTools for component inspection

2. **Server Logs**
    - Console output from `npm run dev`
    - Database query logs
    - NextAuth debug mode

3. **Database Debugging**

    ```sql
    -- Check active connections
    SHOW PROCESSLIST;

    -- Check table structure
    DESCRIBE users;

    -- Test queries
    SELECT * FROM users LIMIT 5;
    ```

## Code Quality

### Linting and Formatting

1. **ESLint Configuration**
    - Uses Next.js recommended rules
    - Run linter: `npm run lint`
    - Fix auto-fixable issues: `npm run lint -- --fix`

2. **Prettier Configuration**
    - Configured in `.prettierrc`
    - Format code: `npx prettier --write .`

### Code Review Guidelines

1. **Component Review**
    - Check for proper JSDoc documentation
    - Verify prop types and default values
    - Ensure error handling is present
    - Check for accessibility considerations

2. **API Review**
    - Validate input sanitization
    - Check authentication and authorization
    - Verify error responses
    - Ensure proper HTTP status codes

3. **Database Review**
    - Check for SQL injection prevention
    - Verify transaction handling
    - Ensure proper connection management
    - Check query optimization

### Performance Considerations

1. **Frontend Performance**
    - Minimize re-renders with React.memo
    - Use useCallback for event handlers
    - Implement lazy loading for routes
    - Optimize images and fonts

2. **Backend Performance**
    - Implement connection pooling
    - Add database indexes for frequent queries
    - Cache static data where appropriate
    - Monitor query performance

## Deployment Preparation

### Build Optimization

1. **Production Build**

    ```bash
    npm run build
    ```

    Check build output for:
    - Bundle size warnings
    - Page load times
    - Static generation status

2. **Environment Configuration**
    - Update `.env.local` to `.env.production`
    - Set production database credentials
    - Configure production Azure AD application
    - Update NEXTAUTH_URL to production domain

### Database Migration

1. **Backup Development Database**

    ```bash
    mysqldump -u root -p nethack > backup.sql
    ```

2. **Apply Schema Changes**

    ```sql
    -- Review and apply migration scripts
    SOURCE migrations/001_add_projects_table.sql;
    ```

3. **Test Data Migration**
    - Export test data if needed
    - Verify data integrity after migration
    - Test application functionality

### Security Review

1. **Environment Variables**
    - Remove hardcoded credentials
    - Use strong secrets for NEXTAUTH_SECRET
    - Rotate Azure AD client secrets

2. **API Security**
    - Review authentication on all endpoints
    - Check CORS configuration
    - Validate input sanitization

3. **Database Security**
    - Use limited privilege database users
    - Enable SSL for database connections
    - Implement regular backups

## Troubleshooting Guide

### Development Issues

| Issue                        | Possible Cause           | Solution                     |
| ---------------------------- | ------------------------ | ---------------------------- |
| Cannot connect to database   | MySQL not running        | Start MySQL service          |
| Authentication redirect loop | NEXTAUTH_URL mismatch    | Update .env.local            |
| Component not updating       | Missing dependency array | Check useEffect dependencies |
| API returns 401              | Missing session          | Check authentication flow    |

### Production Issues

| Issue                     | Possible Cause         | Solution                 |
| ------------------------- | ---------------------- | ------------------------ |
| High database connections | Connection leak        | Check connection release |
| Slow page loads           | Unoptimized queries    | Add database indexes     |
| Authentication failures   | Azure AD configuration | Check redirect URIs      |
| Build failures            | Dependency conflicts   | Update package.json      |

### Monitoring

1. **Application Logs**
    - Monitor console output
    - Track error frequency
    - Watch for performance issues

2. **Database Monitoring**
    - Monitor connection pool usage
    - Track slow queries
    - Watch for deadlocks

3. **User Feedback**
    - Collect error reports
    - Monitor user satisfaction
    - Track feature usage

## Contributing

### Workflow

1. **Create Feature Branch**

    ```bash
    git checkout -b feature/description
    ```

2. **Make Changes**
    - Follow coding standards
    - Add tests for new functionality
    - Update documentation

3. **Submit Pull Request**
    - Include description of changes
    - Reference related issues
    - Request code review

### Documentation Requirements

1. **Code Documentation**
    - JSDoc for all exported functions
    - Inline comments for complex logic
    - README updates for new features

2. **Architecture Documentation**
    - Update ARCHITECTURE.md for structural changes
    - Document new API endpoints
    - Update database schema documentation

### Testing Requirements

1. **New Features**
    - Unit tests for components
    - Integration tests for APIs
    - E2E tests for user flows

2. **Bug Fixes**
    - Test case reproducing the bug
    - Fix verification test
    - Regression tests for related functionality
