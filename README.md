# BIBS·C Network Hackathon Portal

## Overview

The BIBS·C Network Hackathon Portal is a Next.js web application designed to manage the annual BIBS·C Network Hackathon competition. The platform provides authentication, project submission, judging workflows, and competition state management for participants, judges, and administrators.

## Technology Stack

- **Frontend**: Next.js 16.1.6 with React 19.2.4
- **Authentication**: NextAuth with Azure AD provider
- **Database**: MySQL with mysql2 driver
- **Styling**: CSS Modules
- **Deployment**: Next.js standalone build

## Project Structure

```
nethack/
├── app/                    # Next.js app router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth authentication
│   │   └── sql/           # Database operations
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── showcase/          # Project showcase
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Home page
│   └── globals.css        # Global styles
├── src/                   # Source components and context
│   ├── components/        # React components
│   └── context/          # React context providers
├── public/                # Static assets
│   ├── fonts/            # Custom fonts
│   └── 25R1/             # Previous competition submissions
├── docs/                  # Documentation
└── package.json          # Dependencies and scripts
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MySQL database
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

3. Set up environment variables: Create a `.env.local` file in the root directory with the following variables:

    ```
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create projects table (example structure)
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

## Architecture

### Authentication System

The application uses NextAuth with Azure AD provider for authentication. User roles are stored in the database and mapped during the authentication callback:

- **Access Level 0**: Visitor/Voter (read-only access)
- **Access Level 1**: Competitor (can submit projects)
- **Access Level 2+**: Judge/Admin (can view and judge submissions)

### Database Layer

The database connection is managed through a connection pool in `app/api/sql/database.js`. The pool configuration includes:

- Connection limit: 20
- Wait for connections: true
- Automatic error handling and reconnection

### Competition State Management

The competition state is managed through React Context (`src/context/CompetitionContext.js`) and fetched from the database via the `/api/sql/phase` endpoint. This allows real-time updates to competition phases across the application.

### Component Architecture

Components are organized by functionality:

- **Layout Components**: Navbar, Footer
- **Dashboard Components**: DashboardCompetitor, DashboardJudge
- **Submission Components**: Submission, SubmissionForm, SubmissionPresent
- **Utility Components**: Countdown, CountdownMini, JudgeToolbox

## API Endpoints

### Authentication

- `GET/POST /api/auth/[...nextauth]` - NextAuth authentication routes

### Database Operations

- `GET /api/sql/phase` - Get current competition phase
- `GET /api/sql/pullProject` - Retrieve project submissions (judges only)
- `POST /api/sql/editProject` - Edit project submissions

### Database Connection

- `app/api/sql/database.js` - Database connection pool and utility functions

## User Roles and Permissions

### Visitor/Voter (Access Level 0)

- View competition information
- Access public showcase
- Cannot access dashboard

### Competitor (Access Level 1)

- All visitor permissions
- Access competition dashboard
- Submit and edit project materials
- View submission status

### Judge/Admin (Access Level 2+)

- All competitor permissions
- View all project submissions
- Judge and score submissions
- Access judge toolbox utilities

## Styling Approach

The application uses CSS Modules for component-scoped styling. Global styles are defined in `app/globals.css` and include:

- Custom font definitions (CMU and Monaspace fonts)
- Color variables for consistent theming
- Responsive design utilities
- Console-style UI elements for countdowns

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

- `email` (VARCHAR): User email (primary identifier)
- `access` (INT): Access level (0=visitor, 1=competitor, 2+=judge)
- `teamID` (VARCHAR): Team identifier for competitors
- `created_at` (TIMESTAMP): Account creation timestamp

### Projects Table (Example)

Stores project submissions:

- `teamID` (VARCHAR): Reference to team
- `project_name` (VARCHAR): Project title
- `description` (TEXT): Project description
- `submission_url` (VARCHAR): URL to project materials
- `submission_date` (TIMESTAMP): Submission timestamp
- `status` (VARCHAR): Submission status (pending, reviewed, etc.)

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Considerations

- Ensure all environment variables are set in production
- Configure proper CORS settings if needed
- Set up SSL/TLS for production
- Configure database connection pooling for production load

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
    - Verify MySQL service is running
    - Check database credentials in environment variables
    - Ensure database schema is properly initialized

2. **Authentication Issues**
    - Verify Azure AD application configuration
    - Check redirect URIs in Azure AD portal
    - Ensure NEXTAUTH_URL matches deployment URL

3. **Build Errors**
    - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
    - Check Node.js version compatibility
    - Verify all dependencies are properly installed

### Debugging

- Check browser console for client-side errors
- Monitor server logs for API errors
- Use React DevTools for component state inspection
- Check database query logs for SQL issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with appropriate tests
4. Submit a pull request with detailed description

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in the repository.
