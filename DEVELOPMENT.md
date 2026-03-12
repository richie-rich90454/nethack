# Development Guide

## Getting Started

### Prerequisites

- **Node.js 18+** and **npm** (or yarn/pnpm)
- **MySQL 8.0+** database server
- **Azure AD Application** for authentication (development tenant available)
- **Git** for version control
- **TypeScript** – the project is written in strict TypeScript; familiarity is recommended.

### Initial Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/richie-rich90454/nethack.git
    cd nethack
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**  
   Create `.env.local` in the project root:

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

    Generate a secure `NEXTAUTH_SECRET`:

    ```bash
    openssl rand -base64 32
    ```

4. **Set up the database**

    ```sql
    CREATE DATABASE nethack;
    USE nethack;

    -- Users table
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        access INT DEFAULT 0,
        teamID VARCHAR(255),
        members VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Hacks table (project submissions)
    CREATE TABLE hacks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        teamID VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        github VARCHAR(500),
        prompt VARCHAR(255),
        technologies TEXT,
        members VARCHAR(255),
        sub_code VARCHAR(500),
        sub_video VARCHAR(500),
        round VARCHAR(10),
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending'
    );

    -- Phases table (competition timeline)
    CREATE TABLE phases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phase VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NULL,
        end_date TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT FALSE
    );

    -- Insert default phase
    INSERT INTO phases (phase, is_active) VALUES ('closed', TRUE);

    -- Insert test users
    INSERT INTO users (email, access, teamID, members) VALUES
    ('visitor@example.com', 0, NULL, NULL),
    ('competitor@example.com', 1, 'team-001', 'John Doe'),
    ('judge@example.com', 2, NULL, NULL);
    ```

5. **Start the development server**

    ```bash
    npm run dev
    ```

6. **Access the application**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Workflow

### Project Structure

```
nethack/
├── app/                         # Next.js App Router
│   ├── api/                     # API endpoints
│   │   ├── auth/                 # NextAuth authentication
│   │   │   └── [...nextauth]/route.ts
│   │   └── sql/                   # Database operations
│   │       ├── database.ts          # Connection pool & utilities
│   │       ├── editProject/route.ts
│   │       ├── phase/route.ts
│   │       └── pullProject/route.ts
│   ├── dashboard/                 # User dashboard
│   │   └── page.tsx
│   ├── login/                     # Login page
│   │   └── page.tsx
│   ├── showcase/                  # Project showcase
│   │   └── page.tsx
│   ├── layout.tsx                 # Root layout with providers
│   ├── page.tsx                   # Home page
│   └── globals.css                 # Global styles
├── src/                           # Source components and context
│   ├── components/                 # React components
│   │   ├── Countdown.tsx
│   │   ├── CountdownMini.tsx
│   │   ├── DashboardCompetitor.tsx
│   │   ├── DashboardJudge.tsx
│   │   ├── Footer.tsx
│   │   ├── JudgeToolbox.tsx
│   │   ├── Navbar.tsx
│   │   ├── Submission.tsx
│   │   ├── SubmissionForm.tsx
│   │   └── SubmissionPresent.tsx
│   └── context/                    # React context providers
│       └── CompetitionContext.tsx
├── config/                        # Central configuration
│   └── siteConfig.ts                # All customizable text & values
├── public/                         # Static assets
│   ├── fonts/                       # Custom fonts
│   └── 25R1/                        # Previous competition submissions
├── docs/                            # Documentation
├── types.d.ts                       # Global TypeScript type definitions
├── next.config.ts                    # Next.js configuration (TypeScript)
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

### Code Organization Guidelines

1. **Component Structure**
    - Each component resides in its own `.tsx` file under `src/components/`.
    - Include a matching CSS Module (`*.module.css`) for scoped styles.
    - Export the component as `default` at the bottom.
    - Provide JSDoc comments describing the component and its props.

2. **API Route Structure**
    - One route per file in `app/api/` following the Next.js App Router convention.
    - Use named exports for HTTP methods (`GET`, `POST`, etc.).
    - Always authenticate and authorize requests using `getServerSession` from NextAuth.
    - Include comprehensive error handling and input validation.

3. **Configuration**
    - All user‑facing text, dates, and external URLs are defined in `config/siteConfig.ts`.
    - Import `siteConfig` wherever a string is needed; never hardcode text.
    - The configuration is strongly typed; extend the `SiteConfig` interface when adding new fields.

4. **Styling Convention**
    - Use CSS Modules for component‑scoped styles.
    - Global styles (fonts, color variables, utility classes) reside in `app/globals.css`.
    - Follow a BEM‑like naming convention inside modules for clarity.

### Development Scripts

| Script                 | Purpose                                  | Usage                  |
| ---------------------- | ---------------------------------------- | ---------------------- |
| `npm run dev`          | Start development server with Turbopack  | `npm run dev`          |
| `npm run build`        | Create a production build                | `npm run build`        |
| `npm start`            | Run the production server                | `npm start`            |
| `npm run lint`         | Run ESLint                               | `npm run lint`         |
| `npm run format`       | Format all files with Prettier           | `npm run format`       |
| `npm run format:check` | Check formatting without writing changes | `npm run format:check` |

## TypeScript Development

The project uses strict TypeScript with the following features:

- **Path aliases**: `@/*` maps to project root, `@/src/*` to source files.
- **Global types**: Defined in `types.d.ts` (NextAuth augmentation, environment variables, database row types).
- **Component props**: Always define an interface for props.
- **API routes**: Use `NextRequest` and `NextResponse` from `next/server`.

### Example Component with TypeScript

```tsx
import React from "react";
import styles from "./Example.module.css";

interface ExampleProps {
	title: string;
	count?: number; // optional prop
}

const Example = ({ title, count = 0 }: ExampleProps): React.ReactElement => {
	return (
		<div className={styles.container}>
			<h2>{title}</h2>
			<p>Count: {count}</p>
		</div>
	);
};

export default Example;
```

### Example API Route with TypeScript

```tsx
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { query } from "@/app/api/sql/database";
import { RowDataPacket } from "mysql2";

interface MyRow extends RowDataPacket {
	id: number;
	name: string;
}

export async function GET(req: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const [rows] = await query<MyRow[]>("SELECT id, name FROM mytable");
		return NextResponse.json(rows);
	} catch (error) {
		console.error("API error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
```

## Database Development

### Connection Management

The application uses a connection pool managed by `mysql2/promise`. Configuration in `app/api/sql/database.ts`:

```typescript
const pool = mysql.createPool({
	host: "localhost",
	user: process.env.SQL_USERNAME,
	password: process.env.SQL_PASSWORD,
	database: "nethack",
	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0,
});
```

### Query Patterns

1. **Using the pool directly (simple queries)**

    ```typescript
    import { query } from "@/app/api/sql/database";

    const users = await query("SELECT * FROM users WHERE access = ?", [1]);
    ```

2. **Using a connection for transactions**

    ```typescript
    import getConnection from "@/app/api/sql/database";

    const connection = await getConnection();
    try {
    	await connection.beginTransaction();
    	// multiple queries
    	await connection.commit();
    } catch (error) {
    	await connection.rollback();
    	throw error;
    } finally {
    	connection.release();
    }
    ```

### Schema Migrations

For production changes, create migration scripts in a `migrations/` folder:

```sql
-- migrations/002_add_feedback_column.sql
ALTER TABLE hacks ADD COLUMN feedback TEXT;
```

Apply migrations manually or with a tool like `node-migrate`.

## Authentication Development

### Azure AD Configuration

1. **Register an application** in Azure Portal → Azure Active Directory → App registrations.
2. **Set redirect URI**: `http://localhost:3000/api/auth/callback/azure-ad` (for development).
3. **Note** the Application (client) ID, Directory (tenant) ID, and generate a client secret.
4. **Add delegated permissions**: Microsoft Graph → `User.Read`, `email`, `profile`.

### Environment Variables for Authentication

Ensure your `.env.local` contains the correct values. The `NEXTAUTH_URL` must match the deployed URL (including port for local development).

### Testing Authentication

- Use test accounts in your Azure AD tenant.
- After login, the session will contain `access` and `teamID` fields (fetched from the database).
- Protected routes and API endpoints check `session.user.access` to enforce permissions.

### Session Usage in Components

```tsx
import { useSession } from "next-auth/react";

const { data: session, status } = useSession();

if (status === "authenticated") {
	console.log("Access level:", session.user.access);
	console.log("Team ID:", session.user.teamID);
}
```

## Component Development

### Creating a New Component

1. Create a new `.tsx` file in `src/components/` with the following template:

    ```tsx
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
    "use client";
    import React from "react";
    import styles from "./ComponentName.module.css";

    interface ComponentNameProps {
    	exampleProp: string;
    }

    const ComponentName = ({
    	exampleProp,
    }: ComponentNameProps): React.ReactElement => {
    	return <div className={styles.container}>{exampleProp}</div>;
    };

    export default ComponentName;
    ```

2. Create the corresponding CSS Module `ComponentName.module.css`:

    ```css
    .container {
    	/* styles */
    }
    ```

### State Management

- **Local state**: Use `useState` for component‑specific state.
- **Global competition state**: Use `useCompetition()` from `@/src/context/CompetitionContext`.
- **Session state**: Use `useSession()` from `next-auth/react`.
- **Form state**: Use controlled components with `useState` or consider `useReducer` for complex forms.

### Event Handling

```tsx
const handleSubmit = async (
	event: React.FormEvent<HTMLFormElement>,
): Promise<void> => {
	event.preventDefault();
	try {
		const res = await fetch("/api/sql/editProject", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});
		if (res.ok) {
			// handle success
		} else {
			// handle error
		}
	} catch (error) {
		console.error("Submission error:", error);
	}
};
```

## API Development

### Creating a New API Route

1. Create a folder under `app/api/` (e.g., `app/api/example/`).
2. Add a `route.ts` file with the following structure:

    ```tsx
    import { NextRequest, NextResponse } from "next/server";
    import { getServerSession } from "next-auth";
    import { authOptions } from "@/app/api/auth/[...nextauth]/route";
    import { query } from "@/app/api/sql/database";

    export async function GET(req: NextRequest) {
    	const session = await getServerSession(authOptions);
    	if (!session) {
    		return NextResponse.json(
    			{ error: "Unauthorized" },
    			{ status: 401 },
    		);
    	}

    	try {
    		const results = await query("SELECT * FROM example");
    		return NextResponse.json(results);
    	} catch (error) {
    		console.error("API error:", error);
    		return NextResponse.json(
    			{ error: "Internal Server Error" },
    			{ status: 500 },
    		);
    	}
    }

    export async function POST(req: NextRequest) {
    	// similar pattern
    }
    ```

### Input Validation

Always validate incoming data:

```tsx
const body = await req.json();
if (!body.requiredField || typeof body.requiredField !== "string") {
	return NextResponse.json(
		{ error: "Missing or invalid requiredField" },
		{ status: 400 },
	);
}
```

### Error Handling

Return appropriate HTTP status codes and JSON error messages:

- `400` – Bad request (client error)
- `401` – Unauthorized (not authenticated)
- `403` – Forbidden (insufficient permissions)
- `404` – Resource not found
- `500` – Internal server error

## Testing

### Unit Testing

Set up Jest and React Testing Library (currently not configured; you may add them). Example test:

```tsx
import { render, screen } from "@testing-library/react";
import Countdown from "@/src/components/Countdown";

test("renders countdown label", () => {
	render(<Countdown targetDate="2025-12-31" label="Test Event" />);
	expect(screen.getByText(/Time until/)).toBeInTheDocument();
});
```

### Integration Testing

Test API endpoints using a test database or mocks. Example using `node-fetch` or `supertest`.

### End-to-End Testing

Consider using Playwright or Cypress. Example Playwright test:

```ts
test("competitor can access dashboard", async ({ page }) => {
	await page.goto("/login");
	// fill login form and submit
	await expect(page).toHaveURL("/dashboard");
});
```

## Debugging

### Common Issues

| Issue                        | Possible Cause           | Solution                               |
| ---------------------------- | ------------------------ | -------------------------------------- |
| Cannot connect to database   | MySQL not running        | Start MySQL service                    |
| Authentication redirect loop | NEXTAUTH_URL mismatch    | Update `.env.local`                    |
| Component not updating       | Missing dependency array | Check `useEffect` dependencies         |
| API returns 401              | Missing session          | Check authentication flow              |
| TypeScript errors            | Outdated types           | Run `npm install` or restart TS server |

### Tools

- **Browser DevTools**: Console, Network tab, React DevTools.
- **Server logs**: `npm run dev` outputs all console messages.
- **Database logs**: Enable MySQL general log: `SET GLOBAL general_log = 'ON';`.
- **NextAuth debug**: Add `debug: true` to `authOptions` in development.

### Production Troubleshooting

| Issue                     | Possible Cause         | Solution                 |
| ------------------------- | ---------------------- | ------------------------ |
| High database connections | Connection leak        | Check connection release |
| Slow page loads           | Unoptimized queries    | Add database indexes     |
| Authentication failures   | Azure AD configuration | Check redirect URIs      |
| Build failures            | Dependency conflicts   | Update `package.json`    |

### Monitoring

- **Application logs**: Monitor console output for errors.
- **Database**: Track connection pool usage, slow queries.
- **User feedback**: Collect error reports via forms or analytics.

## Code Quality

### Linting and Formatting

- ESLint configuration extends Next.js core web vitals.
- Prettier is configured in `.prettierrc`.
- Run `npm run lint` to check for issues; `npm run format` to auto‑format.

### Code Review Guidelines

- **Components**: Proper TypeScript interfaces, JSDoc comments, error handling, accessibility (ARIA attributes where needed).
- **API routes**: Authentication checks, input validation, consistent error responses, connection release.
- **Database**: Parameterized queries, proper use of connection pool, transaction handling where necessary.

### Performance Considerations

- **React**: Use `React.memo` for expensive components; `useCallback` and `useMemo` for stable references.
- **Next.js**: Leverage automatic code splitting; use `next/image` for images.
- **Database**: Add indexes on frequently queried columns (`email`, `teamID`, `phase`).
- **API**: Return only necessary data; consider pagination for large result sets.

## Deployment Preparation

### Build Optimization

```bash
npm run build
```

Check the build output for any warnings. Ensure environment variables are set for production.

### Database Migration

1. Backup production database.
2. Apply migration scripts.
3. Verify data integrity.

### Security Review

- Rotate Azure AD client secrets.
- Use a strong `NEXTAUTH_SECRET`.
- Ensure database user has least‑privilege permissions.
- Review CORS and CSP settings in `next.config.ts`.

## Contributing

### Workflow

1. **Create a feature branch**:
    ```bash
    git checkout -b feature/your-feature
    ```
2. **Make changes** following coding standards.
3. **Run linter and formatter**:
    ```bash
    npm run lint
    npm run format
    ```
4. **Test** your changes locally.
5. **Commit** with a clear message.
6. **Push** and open a pull request.

### Documentation Requirements

- Update relevant documentation (README, ARCHITECTURE.md, API docs) if your change affects public interfaces or architecture.
- Include JSDoc comments for new functions and components.
- For configuration changes, update `siteConfig.ts` interface and default values.

### Testing Requirements

- Write unit tests for new utilities or complex logic.
- Update integration tests for API changes.
- Ensure existing tests pass.

---

This guide is maintained as part of the project documentation. For questions or clarifications, please open an issue on GitHub.
