# BIBS·C Network Hackathon Portal

## Overview

The BIBS·C Network Hackathon Portal is a Next.js web application designed to manage the annual BIBS·C Network Hackathon competition. The platform provides authentication, project submission, judging workflows, and competition state management for participants, judges, and administrators.

## Technology Stack

- **Frontend**: Next.js 16.1.6 with React 19.2.4
- **Authentication**: NextAuth with Azure AD provider
- **Database**: MySQL with mysql2 driver
- **Language**: TypeScript (strict mode enabled)
- **Styling**: CSS Modules
- **Deployment**: Next.js standalone build

## Project Structure

```
nethack/
├── app/                    # Next.js app router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth authentication
│   │   │   └── [...nextauth]/route.ts
│   │   └── sql/           # Database operations
│   │       ├── database.ts # Connection pool and utilities
│   │       ├── editProject/route.ts
│   │       ├── phase/route.ts
│   │       └── pullProject/route.ts
│   ├── dashboard/         # User dashboard
│   │   └── page.tsx
│   ├── login/             # Login page
│   │   └── page.tsx
│   ├── showcase/          # Project showcase
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── src/                   # Source components and context
│   ├── components/        # React components
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
│   └── context/           # React context providers
│       └── CompetitionContext.tsx
├── public/                # Static assets
│   ├── fonts/            # Custom fonts
│   └── 25R1/             # Previous competition submissions
├── docs/                  # Documentation
├── types.d.ts             # Global TypeScript type definitions
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL database (8.0+ recommended)
- Azure AD application for authentication

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/richie-rich90454/nethack.git
    cd nethack
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables: Create a `.env.local` file in the root directory:

    ```env
    # Database Configuration
    SQL_USERNAME=your_mysql_username
    SQL_PASSWORD=your_mysql_password

    # NextAuth Configuration
    NEXTAUTH_SECRET=your_nextauth_secret
    NEXTAUTH_URL=http://localhost:3000

    # Azure AD Configuration
    AZURE_AD_CLIENT_ID=your_azure_ad_client_id
    AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret
    AZURE_AD_TENANT_ID=your_azure_ad_tenant_id
    ```

4. Set up the database:

    ```sql
    CREATE DATABASE nethack;
    USE nethack;

    -- Create users table
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        access INT DEFAULT 0,
        teamID VARCHAR(255),
        members VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create hacks table (project submissions)
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

    -- Create phases table
    CREATE TABLE phases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        phase VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NULL,
        end_date TIMESTAMP NULL,
        is_active BOOLEAN DEFAULT FALSE
    );

    -- Insert default phase
    INSERT INTO phases (phase, is_active) VALUES ('closed', TRUE);
    ```

5. Run the development server:

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without writing changes

## Architecture

### Authentication System

The application uses NextAuth with Azure AD provider for authentication. User roles are stored in the database and mapped during the authentication callback (see `app/api/auth/[...nextauth]/route.ts`):

- **Access Level 0**: Visitor/Voter – read-only access to public pages and showcase
- **Access Level 1**: Competitor – can access dashboard, submit and edit projects
- **Access Level 2+**: Judge/Admin – can view all submissions, edit metadata, use judge tools

### Database Layer

The database connection is managed through a connection pool in `app/api/sql/database.ts`. The pool configuration includes:

- Connection limit: 20
- Wait for connections: true
- Queue limit: 0 (unlimited queue)
- Type-safe query helpers with generics

### Competition State Management

The competition state is managed through React Context (`src/context/CompetitionContext.tsx`) and fetched from the database via the `/api/sql/phase` endpoint. Available phases:

- **closed**: Competition not accepting submissions
- **active**: Submission period open
- **judging**: Submissions under review

### Component Architecture

Components are organized by functionality with TypeScript interfaces for props:

- **Layout Components**: Navbar, Footer
- **Dashboard Components**: DashboardCompetitor, DashboardJudge
- **Submission Components**: Submission, SubmissionForm, SubmissionPresent
- **Utility Components**: Countdown, CountdownMini, JudgeToolbox

## API Endpoints

### Authentication

- `GET|POST /api/auth/[...nextauth]` - NextAuth authentication routes

### Database Operations

- `GET /api/sql/phase` - Get current competition phase
- `GET /api/sql/pullProject` - Retrieve project submissions (supports `?search=teamID` parameter)
- `POST /api/sql/editProject` - Edit project submissions

### Database Connection

- `app/api/sql/database.ts` - Database connection pool and utility functions with TypeScript generics

## TypeScript Features

The project uses strict TypeScript with the following benefits:

- **Type-safe API responses**: All database queries return typed results
- **Component props validation**: Each component has a defined Props interface
- **Session type augmentation**: Custom NextAuth types for access levels and teamID
- **Environment variable validation**: Type-safe `process.env` access
- **Generic query helpers**: Reusable database functions with type parameters

## User Roles and Permissions

### Visitor/Voter (Access Level 0)

- View competition information
- Access public showcase
- Cannot access dashboard
- Can sign up for future competitions via external form

### Competitor (Access Level 1)

- All visitor permissions
- Access competition dashboard
- Submit and edit project materials
- View submission status
- Team-specific project management

### Judge (Access Level 2+)

- All competitor permissions
- View all project submissions
- Edit submission metadata (title, technologies)
- Access judge toolbox utilities
- Score and review submissions

> **Note:** Currently, all users with access level 2 or higher have the same judge permissions. The system is designed to be extensible for future admin features if needed.

## Styling Approach

The application uses CSS Modules for component-scoped styling. Global styles are defined in `app/globals.css` and include:

- Custom font definitions (CMU and Monaspace fonts)
- Color variables for consistent theming
- Responsive design utilities
- Console-style UI elements for countdowns
- Tooltip and popup styles
- Checkbox and radio button custom styling

## Environment Variables

| Variable                 | Description                            | Required |
| ------------------------ | -------------------------------------- | -------- |
| `SQL_USERNAME`           | MySQL database username                | Yes      |
| `SQL_PASSWORD`           | MySQL database password                | Yes      |
| `NEXTAUTH_SECRET`        | Secret for NextAuth session encryption | Yes      |
| `NEXTAUTH_URL`           | Base URL for NextAuth callbacks        | Yes      |
| `AZURE_AD_CLIENT_ID`     | Azure AD application client ID         | Yes      |
| `AZURE_AD_CLIENT_SECRET` | Azure AD application client secret     | Yes      |
| `AZURE_AD_TENANT_ID`     | Azure AD tenant ID                     | Yes      |

## Database Schema

### Users Table

Stores user authentication and role information:

| Column     | Type         | Description                                      |
| ---------- | ------------ | ------------------------------------------------ |
| id         | INT          | Primary key, auto-increment                      |
| email      | VARCHAR(255) | User email (unique identifier)                   |
| access     | INT          | Access level (0=visitor, 1=competitor, 2+=judge) |
| teamID     | VARCHAR(255) | Team identifier for competitors                  |
| members    | VARCHAR(255) | Team member names (optional)                     |
| created_at | TIMESTAMP    | Account creation timestamp                       |

### Hacks Table

Stores project submissions:

| Column          | Type         | Description                              |
| --------------- | ------------ | ---------------------------------------- |
| id              | INT          | Primary key, auto-increment              |
| teamID          | VARCHAR(255) | Reference to team                        |
| title           | VARCHAR(255) | Project title                            |
| description     | TEXT         | Project description                      |
| github          | VARCHAR(500) | GitHub repository URL                    |
| prompt          | VARCHAR(255) | Selected hackathon prompt                |
| technologies    | TEXT         | Technologies used (comma-separated)      |
| members         | VARCHAR(255) | Team members                             |
| sub_code        | VARCHAR(500) | Code submission URL or type              |
| sub_video       | VARCHAR(500) | Video submission URL                     |
| round           | VARCHAR(10)  | Competition round (e.g., "25R1", "25R2") |
| submission_date | TIMESTAMP    | Submission timestamp                     |
| status          | VARCHAR(50)  | Submission status (pending, reviewed)    |

### Phases Table

Manages competition timeline:

| Column     | Type        | Description                          |
| ---------- | ----------- | ------------------------------------ |
| id         | INT         | Primary key, auto-increment          |
| phase      | VARCHAR(50) | Phase name (closed, active, judging) |
| start_date | TIMESTAMP   | Phase start time                     |
| end_date   | TIMESTAMP   | Phase end time                       |
| is_active  | BOOLEAN     | Whether phase is current             |

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Considerations

- Ensure all environment variables are set in production
- Configure proper CORS settings if needed
- Set up SSL/TLS with reverse proxy (Nginx recommended)
- Configure database connection pooling for production load
- Use PM2 or similar process manager for Node.js

### Reverse Proxy Configuration (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve static files directly
    location /_next/static {
        alias /path/to/your/app/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
    - Verify MySQL service is running: `systemctl status mysql`
    - Check database credentials in environment variables
    - Ensure database schema is properly initialized
    - Check connection pool limits in `database.ts`

2. **Authentication Issues**
    - Verify Azure AD application configuration in Azure portal
    - Check redirect URIs (must include `/api/auth/callback/azure-ad`)
    - Ensure NEXTAUTH_URL matches deployment URL exactly
    - Verify JWT secret is properly set in environment

3. **TypeScript Errors**
    - Run `npm run build` to see full type error output
    - Ensure all imports use correct paths (`@/src/` prefix for components/context)
    - Check that `types.d.ts` is included in `tsconfig.json`
    - Restart TypeScript server in VS Code (Ctrl+Shift+P → "TypeScript: Restart TS server")

4. **Build Errors**
    - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
    - Check Node.js version compatibility (18+ required)
    - Verify all dependencies are properly installed
    - Check for TypeScript configuration issues in `tsconfig.json`

### Debugging

- Check browser console for client-side errors (F12)
- Monitor server logs for API errors: `npm run dev` shows all errors
- Use React DevTools for component state inspection
- Check database query logs: `SET GLOBAL general_log = 'ON';`
- Use TypeScript's `--noEmit` flag for type checking without building: `tsc --noEmit`

## TypeScript Configuration

The project uses a strict TypeScript configuration (`tsconfig.json`) with:

- `strict: true` - Enable all strict type checking options
- `moduleResolution: "bundler"` - Optimized for Next.js
- Path aliases: `@/*` for root imports, `@/src/*` for source files
- Type augmentation for NextAuth session and JWT in `types.d.ts`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes with appropriate TypeScript types
4. Run `npm run lint` and `npm run format` to ensure code quality
5. Submit a pull request with detailed description
6. Ensure all TypeScript checks pass (`npm run build`)

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in the repository.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication by [NextAuth.js](https://next-auth.js.org/)
- Database driver by [mysql2](https://github.com/sidorares/node-mysql2)
- Icons from [Bootstrap Icons](https://icons.getbootstrap.com/)
