# BIBS·C Network Hackathon Portal

## Overview

The BIBS·C Network Hackathon Portal is a **fully customizable Next.js application template** designed to manage hackathon competitions of any scale. The platform provides secure authentication, project submission workflows, judging dashboards, and competition state management for participants, judges, and administrators. **All user‑facing text and configurable values are externalized into a single configuration file**, enabling rapid rebranding and adaptation for any event without code changes.

## Technology Stack

- **Frontend**: Next.js 16.1.6 with React 19.2.4
- **Authentication**: NextAuth with Azure AD provider
- **Database**: MySQL 8.0+ with mysql2 driver (connection pooling, type‑safe queries)
- **Language**: TypeScript (strict mode enabled, path aliases, global type augmentations)
- **Styling**: CSS Modules (component‑scoped styles with global design tokens)
- **Configuration**: Centralized `config/siteConfig.ts` for all text, dates, and external URLs
- **Deployment**: Next.js standalone build with production optimizations
- **Security**: Enhanced headers (CSP, X‑Frame‑Options, etc.) and hardened Next.js configuration

## Project Structure

```
nethack/
├── app/                          # Next.js App Router pages and API routes
│   ├── api/                      # API endpoints
│   │   ├── auth/                  # NextAuth authentication
│   │   │   └── [...nextauth]/route.ts
│   │   └── sql/                    # Database operations
│   │       ├── database.ts           # Connection pool and utilities
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
│   └── siteConfig.ts                # All customizable text and values
├── public/                         # Static assets
│   ├── fonts/                       # Custom fonts
│   └── 25R1/                        # Previous competition submissions
├── docs/                            # Documentation
├── types.d.ts                       # Global TypeScript type definitions
├── next.config.ts                    # Next.js configuration (TypeScript)
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies and scripts
```

## 🎨 Customization Guide – Making It Your Own Hackathon Site

All user‑visible text, dates, and selectable options are defined in **`config/siteConfig.ts`**. To adapt the portal for a new hackathon, edit only this file – no code changes are required.

### What You Can Customize

| Section | Examples |
| --- | --- |
| **Site Identity** | `siteTitle`, navigation labels (`nav.home`, `nav.login`, etc.) |
| **Home Page** | `home.welcomeHeading`, `home.introText`, `home.statusText`, `home.countdownDates` |
| **Login Page** | `login.heading`, `login.description`, `login.emailNote`, `login.accountTypeLabels` |
| **Dashboard (General)** | `dashboard.accessDenied`, `dashboard.loading`, `dashboard.loginRequired` |
| **Competitor Dashboard** | Phase labels, tooltips, countdown dates, messages |
| **Judge Dashboard** | Introductory text, judging notes, additional notes, edit form prompts |
| **Showcase Page** | `showcase.heading`, `showcase.description`, `showcase.longDescription`, `showcase.winners` (team IDs) |
| **Submission Form** | Field labels, placeholders, available prompts (`prompts` array) |
| **Footer** | `footer.copyright` |
| **External Links** | `externalUrls.signUpForm` |
| **Countdown Dates** | All date strings (ISO 8601 with offset, e.g. `"2025-06-11T23:59:59+0800"`) |

All strings can include HTML (e.g., `<span class="serifBold">`). The configuration is strongly typed – your IDE will provide autocompletion and prevent typos.

### Example: Changing the Competition Year

1. Open `config/siteConfig.ts`.
2. Update the heading:  
   `welcomeHeading: "Welcome to the 3rd Annual Awesome Hackathon"`
3. Adjust the countdown dates and status text.
4. Save the file – the site immediately reflects the new content.

### Example: Adding a New Submission Prompt

In the `submissionForm.prompts` array, add your new prompt:

```typescript
prompts: ["Game Jam", "AI for Good", "Open Innovation"]
```

The submission form will automatically render radio buttons for each option.

---

## Quick Start

### Prerequisites

- Node.js 18 or later and npm
- MySQL database (version 8.0 or later recommended)
- Azure AD application registered for authentication (or adapt providers in NextAuth)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/richie-rich90454/nethack.git
    cd nethack
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**  
   Create a `.env.local` file in the project root:

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

4. **Set up the database:**

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
    ```

5. **Start the development server:**

    ```bash
    npm run dev
    ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with Turbopack  |
| `npm run build`        | Create a production build                |
| `npm start`            | Run the production server                |
| `npm run lint`         | Run ESLint                               |
| `npm run format`       | Format all files with Prettier           |
| `npm run format:check` | Check formatting without writing changes |

## Architecture

### Authentication System

The application uses NextAuth with an Azure AD provider. User roles (access levels) are stored in the `users` table and are merged into the JWT and session via custom callbacks (`app/api/auth/[...nextauth]/route.ts`).

- **Access Level 0**: Visitor/Voter (read‑only access to public pages)
- **Access Level 1**: Competitor (can submit and edit projects)
- **Access Level 2+**: Judge/Admin (can view all submissions, edit metadata, use judge tools)

### Database Layer

A connection pool is configured in `app/api/sql/database.ts` with the following settings:

- Connection limit: 20
- Wait for connections: true
- Queue limit: 0 (unlimited)

Type‑safe query helpers (`query<T>`, `getUser`, etc.) leverage TypeScript generics to ensure correct result shapes.

### Competition State Management

`CompetitionContext` (`src/context/CompetitionContext.tsx`) fetches the current phase from `/api/sql/phase` and provides it throughout the application. Phases are:

- `closed` – Submissions not accepted
- `active` – Submission period open
- `judging` – Under review

### Configuration System

All customizable text, dates, and external URLs are defined in `config/siteConfig.ts`. The `siteConfig` object is imported wherever a string is required, ensuring consistency and making rebranding trivial. The configuration interface is fully typed.

## API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth authentication (Azure AD) |
| `/api/sql/phase` | GET | Retrieve current competition phase |
| `/api/sql/pullProject` | GET | Fetch project submissions (optional `?search=teamID`) |
| `/api/sql/editProject` | POST | Update a project submission |

All endpoints return JSON. Error responses include a `message` and, where applicable, `details`.

## TypeScript Features

- **Strict mode** enabled (`strict: true`) to catch potential issues.
- **Path aliases** (`@/*` maps to project root, `@/src/*` to source) for clean imports.
- **Type augmentation** for NextAuth (`types.d.ts`) adds custom fields (`access`, `teamID`) to session and JWT.
- **Generic database helpers** ensure type‑safe queries (`query<T>`).
- **Component props** are fully typed with interfaces.

## User Roles and Permissions

### Visitor/Voter (Access Level 0)

- View competition information and public showcase
- Cannot access dashboard
- Can sign up for future competitions via external form

### Competitor (Access Level 1)

- All visitor permissions
- Access competition dashboard
- Submit and edit project materials
- View submission status
- Team‑specific project management

### Judge (Access Level 2+)

- All competitor permissions
- View all project submissions
- Edit submission metadata (title, technologies)
- Access judge toolbox utilities
- Score and review submissions

> **Note:** Users with access level 2 or higher share the same judge capabilities. The system is designed to be extensible for future admin features.

## Styling Approach

- **CSS Modules** provide component‑scoped styling (e.g., `Countdown.module.css`).
- **Global styles** (`app/globals.css`) define custom fonts (CMU, Monaspace), color variables, responsive utilities, and UI patterns (tooltips, checkboxes, radios, console‑style elements).
- All class names used in components must match those defined in the global CSS or respective module.

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

| Column     | Type         | Description                                      |
| ---------- | ------------ | ------------------------------------------------ |
| id         | INT          | Primary key, auto-increment                      |
| email      | VARCHAR(255) | User email (unique identifier)                   |
| access     | INT          | Access level (0=visitor, 1=competitor, 2+=judge) |
| teamID     | VARCHAR(255) | Team identifier for competitors                  |
| members    | VARCHAR(255) | Team member names (optional)                     |
| created_at | TIMESTAMP    | Account creation timestamp                       |

### Hacks Table (Project Submissions)

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

| Column     | Type        | Description                          |
| ---------- | ----------- | ------------------------------------ |
| id         | INT         | Primary key, auto-increment          |
| phase      | VARCHAR(50) | Phase name (closed, active, judging) |
| start_date | TIMESTAMP   | Phase start time                     |
| end_date   | TIMESTAMP   | Phase end time                       |
| is_active  | BOOLEAN     | Whether phase is current             |

## Performance & Security Enhancements

The project includes a hardened Next.js configuration (`next.config.ts`) that optimizes both performance and security:

- **React Strict Mode** enabled to identify potential issues during development.
- **SWC minification** (`swcMinify: true`) for faster builds and smaller bundles.
- **`poweredByHeader: false`** removes the `X-Powered-By: Next.js` header, reducing information disclosure.
- **Image optimization** with modern formats (`avif`, `webp`) and support for external domains (configurable via `images.domains`).
- **Security headers** applied to all routes:
    - `X-Frame-Options: DENY` – prevents clickjacking.
    - `X-Content-Type-Options: nosniff` – stops MIME type sniffing.
    - `Referrer-Policy: strict-origin-when-cross-origin` – controls referrer information.
    - `Permissions-Policy` – disables unnecessary browser features (camera, microphone, geolocation).
    - `Content-Security-Policy` – restricts resource loading (currently allows `'unsafe-inline'` for existing code; may be tightened in future).
- **Console removal** in production (except `error` and `warn`) reduces client bundle size.
- **Production source maps** disabled to further minimize bundle size.

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Considerations

- Set all required environment variables in your production environment (use a secrets manager for sensitive values).
- Configure a reverse proxy (Nginx recommended) for SSL termination and static asset caching.
- Ensure your database connection pool settings are appropriate for expected load.

### Example Nginx Reverse Proxy Configuration

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

    # Serve static files directly for optimal performance
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
    - Verify MySQL is running: `systemctl status mysql`
    - Check credentials and database name in `.env.local`
    - Ensure the schema is created and tables exist
    - Review connection pool limits in `database.ts`

2. **Authentication Failures**
    - Validate Azure AD application settings in Azure portal
    - Confirm redirect URIs include `/api/auth/callback/azure-ad`
    - Ensure `NEXTAUTH_URL` matches the deployed URL exactly
    - Verify `NEXTAUTH_SECRET` is set and consistent

3. **TypeScript Errors**
    - Run `npm run build` for complete error output
    - Confirm `types.d.ts` is included in `tsconfig.json` (`include` array)
    - Restart the TypeScript server in VS Code (Ctrl+Shift+P → "TypeScript: Restart TS server")
    - Check that all imports use the correct paths (`@/src/` prefix for components/context)

4. **Build Failures**
    - Delete `node_modules` and `package-lock.json`, then run `npm install`
    - Verify Node.js version is 18 or newer
    - Review `tsconfig.json` for any misconfigurations
    - Check for outdated dependencies with `npm outdated`

### Debugging

- Open browser developer tools (F12) to view console errors and network requests.
- Monitor server logs during development; `npm run dev` displays errors in the terminal.
- Use React DevTools to inspect component state and props.
- Enable MySQL general log: `SET GLOBAL general_log = 'ON';` then inspect the log file.
- Run TypeScript type checks without building: `tsc --noEmit`.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes, ensuring TypeScript types are correctly applied.
4. Run `npm run lint` and `npm run format` to maintain code quality.
5. Commit and push your changes.
6. Submit a pull request with a detailed description.

All contributions must pass the build (`npm run build`) and follow the existing code style.

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in the repository.

## Acknowledgments

- [Next.js](https://nextjs.org/) – The React framework for production.
- [NextAuth.js](https://next-auth.js.org/) – Authentication for Next.js.
- [mysql2](https://github.com/sidorares/node-mysql2) – MySQL driver with promise support.
- [Bootstrap Icons](https://icons.getbootstrap.com/) – Open‑source icons used throughout the UI.

---

**You now possess a fully customizable, performant, and secure hackathon portal template. Customize `config/siteConfig.ts` and make it your own.**

**If you find this project helpful, please consider giving it a star.**
