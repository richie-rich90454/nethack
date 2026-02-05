# BIBS·C Network Hackathon Portal - Architecture Documentation

## System Overview

The BIBS·C Network Hackathon Portal is a full-stack web application built with Next.js 16 (App Router) that manages the annual hackathon competition. The system provides authentication, project submission, judging workflows, and competition state management for participants, judges, and administrators.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    Client (Browser)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │   React     │  │  Next.js    │  │   CSS Modules    │    │
│  │ Components  │◄─┤    App      │◄─┤     Styling      │    │
│  │             │  │    Router   │  │                  │    │
│  └─────────────┘  └─────────────┘  └──────────────────┘    │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTPS
                            ▼
┌────────────────────────────────────────────────────────────┐
│                 Next.js Server (Node.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐    │
│  │   API       │  │   Page      │  │   Middleware     │    │
│  │   Routes    │  │   Routes    │  │   & Auth         │    │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────┘    │
└─────────┼────────────────┼────────────────────┼────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐
│   Database   │  │   Azure AD   │  │   Static Assets     │
│   (MySQL)    │  │   (OAuth)    │  │   (Public/)         │
└──────────────┘  └──────────────┘  └─────────────────────┘
```

## Technology Stack

### Frontend Layer

- **Next.js 16.1.6**: React framework with App Router for server-side rendering and routing
- **React 19.2.4**: UI component library with hooks for state management
- **CSS Modules**: Component-scoped styling with custom properties
- **NextAuth.js**: Authentication library for session management

### Backend Layer

- **Next.js API Routes**: Serverless functions for backend logic
- **MySQL 8.0+**: Relational database for persistent storage
- **mysql2/promise**: Database driver with async/await support
- **Azure AD**: Enterprise authentication provider via OAuth 2.0

### Infrastructure

- **Connection Pooling**: Managed database connections with configurable limits
- **Environment Variables**: Configuration management for different environments
- **Static File Serving**: Optimized delivery of fonts, PDFs, and media files

## Core Components

### 1. Authentication System

#### Architecture

```
User Browser → Next.js Page → Azure AD OAuth → NextAuth Callbacks → Database → Enriched Session
```

#### Key Components

- **AzureADProvider**: NextAuth provider for Azure Active Directory integration
- **JWT Callbacks**: Custom token enrichment with competition-specific data
- **Session Management**: Server-side session storage with client-side hydration
- **Role-Based Access Control**: Three-tier permission system (visitor, competitor, judge)

#### Data Flow

1. User initiates login via `/login` page
2. Redirect to Azure AD authorization endpoint
3. OAuth code exchange for access token
4. NextAuth JWT callback enriches token with database user data
5. Session callback makes data available to client components
6. Access level determines UI rendering and API permissions

### 2. Database Layer

#### Connection Management

```javascript
// Connection pool configuration
const pool = mysql.createPool({
    host: "localhost",
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: "nethack",
    waitForConnections: true,
    connectionLimit: 20, // Maximum concurrent connections
    queueLimit: 0 // Unlimited connection queue
})
```

#### Schema Design

- **users table**: Authentication and role management
    - `email` (VARCHAR, UNIQUE): Primary user identifier
    - `access` (INT): Permission level (0=visitor, 1=competitor, 2+=judge)
    - `teamID` (VARCHAR): Team association for competitors
    - `created_at` (TIMESTAMP): Account creation time

- **projects table**: Competition submissions (example structure)
    - `teamID` (VARCHAR): Reference to submitting team
    - `project_name` (VARCHAR): Submission title
    - `description` (TEXT): Project description
    - `submission_url` (VARCHAR): Link to project materials
    - `submission_date` (TIMESTAMP): Submission timestamp
    - `status` (VARCHAR): Review status (pending, reviewed, etc.)

#### Query Patterns

- **Parameterized Queries**: SQL injection prevention through prepared statements
- **Connection Pooling**: Efficient resource utilization for concurrent requests
- **Error Handling**: Graceful degradation with null returns and error logging

### 3. State Management

#### Competition Context

- **Global State**: Competition phase accessible application-wide
- **Real-time Updates**: Automatic fetching on application mount
- **Provider Pattern**: React Context API for dependency injection

#### Session State

- **NextAuth Integration**: Automatic session synchronization
- **Client-side Access**: `useSession()` hook for authentication state
- **Server-side Validation**: Protected API routes with session checks

### 4. API Architecture

#### Route Structure

```
/app/api/
├── auth/[...nextauth]/     # Authentication endpoints (NextAuth)
└── sql/                    # Database operation endpoints
    ├── phase/              # Competition phase management
    ├── pullProject/        # Project retrieval (judges only)
    └── editProject/        # Project submission and editing
```

#### Design Patterns

- **RESTful Principles**: Resource-oriented endpoint design
- **Middleware Integration**: NextAuth session validation
- **Error Handling**: Consistent error responses with status codes
- **Input Validation**: Parameter validation before database operations

### 5. Frontend Architecture

#### Component Hierarchy

```
RootLayout
├── SessionProvider (NextAuth)
├── CompetitionProvider (Custom Context)
├── Navbar (Navigation)
├── Main Content (Page-specific)
└── Footer (Copyright)
```

#### Page Structure

- **Home Page (`/`)**: Public landing with countdown and competition info
- **Dashboard (`/dashboard`)**: Role-specific interface based on access level
- **Login (`/login`)**: Authentication entry point
- **Showcase (`/showcase`)**: Public project gallery

#### Styling System

- **CSS Modules**: Component-scoped styles with `.module.css` convention
- **Global Styles**: `app/globals.css` for shared design tokens
- **Font Management**: Custom font faces with fallback system
- **Responsive Design**: Mobile-first approach with media queries

## Data Flow Patterns

### Authentication Flow

1. **Initial Request**: User accesses protected route
2. **Session Check**: `useSession()` validates authentication state
3. **Redirect**: Unauthenticated users redirected to `/login`
4. **OAuth Flow**: Azure AD authentication with scope requests
5. **Callback Processing**: JWT enrichment with competition data
6. **Session Creation**: Persistent session with role information

### Competition State Flow

1. **Provider Initialization**: `CompetitionProvider` mounts
2. **API Request**: Fetch current phase from `/api/sql/phase`
3. **State Update**: Context value updated with competition phase
4. **Component Subscription**: Components use `useCompetition()` hook
5. **Re-render**: UI updates based on competition state

### Project Submission Flow

1. **Competitor Access**: User with access level 1 accesses dashboard
2. **Form Presentation**: Submission form with validation
3. **API Submission**: POST to `/api/sql/editProject` with project data
4. **Database Persistence**: Project data stored in MySQL
5. **Confirmation**: Success/error feedback to user

## Security Considerations

### Authentication Security

- **OAuth 2.0**: Industry-standard authorization framework
- **JWT Encryption**: NextAuth secret for token signing
- **Session Management**: HTTP-only cookies for session storage
- **Scope Limitation**: Minimal required permissions from Azure AD

### Database Security

- **Parameterized Queries**: Prevention of SQL injection attacks
- **Connection Pooling**: Resource isolation between requests
- **Environment Variables**: Sensitive credentials outside source code
- **Input Validation**: Server-side validation of all user inputs

### Application Security

- **Role-Based Access Control**: Three-tier permission system
- **API Authorization**: Session validation on protected endpoints
- **CORS Configuration**: Restricted cross-origin requests
- **Error Handling**: Generic error messages to prevent information leakage

## Performance Considerations

### Database Optimization

- **Connection Pooling**: Reuse of database connections
- **Query Optimization**: Indexed columns for frequent lookups
- **Batch Operations**: Efficient data retrieval patterns

### Frontend Optimization

- **Code Splitting**: Automatic by Next.js route-based splitting
- **Image Optimization**: Next.js built-in image optimization
- **Font Optimization**: Local font files with proper formatting
- **CSS Optimization**: Minimal runtime overhead with CSS Modules

### Server Optimization

- **Server-Side Rendering**: Initial page load performance
- **Static Generation**: Pre-rendered pages where applicable
- **API Caching**: Appropriate cache headers for static data
- **Bundle Optimization**: Tree-shaking and minification

## Deployment Architecture

### Development Environment

- **Local Database**: MySQL instance on localhost
- **Development Server**: `npm run dev` with hot reload
- **Environment Variables**: `.env.local` for configuration

### Production Environment

- **Build Process**: `npm run build` for optimized production bundle
- **Static Export**: Next.js static generation where applicable
- **Environment Configuration**: Production environment variables
- **Database Hosting**: Managed MySQL instance with backups

### Scaling Considerations

- **Horizontal Scaling**: Stateless application servers
- **Database Scaling**: Read replicas for heavy read loads
- **CDN Integration**: Static asset delivery via CDN
- **Load Balancing**: Distributed traffic across instances

## Monitoring and Maintenance

### Logging Strategy

- **Application Logs**: Console logging with error categorization
- **Database Logs**: Connection errors and query performance
- **Authentication Logs**: Login attempts and session management

### Monitoring Points

- **Database Connections**: Pool utilization and error rates
- **API Performance**: Response times and error rates
- **Authentication Flow**: Success/failure rates and latency
- **User Engagement**: Page views and feature usage

### Maintenance Procedures

- **Database Backups**: Regular backup schedule and testing
- **Dependency Updates**: Security patches and version upgrades
- **Performance Testing**: Load testing before major events
- **Security Audits**: Regular review of authentication and authorization

## Development Guidelines

### Code Organization

- **Feature-Based Structure**: Components grouped by functionality
- **API Co-location**: API routes adjacent to related pages
- **Shared Utilities**: Common functions in dedicated modules
- **Type Safety**: JSDoc annotations for better developer experience

### Testing Strategy

- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database interaction testing
- **E2E Tests**: User workflow testing with authentication
- **Performance Tests**: Load testing for competition periods

### Documentation Standards

- **JSDoc Comments**: All exported functions and components
- **Architecture Documentation**: This document and README
- **API Documentation**: Endpoint specifications and examples
- **Deployment Guides**: Environment-specific setup instructions

## Future Considerations

### Potential Enhancements

1. **Real-time Updates**: WebSocket integration for live competition updates
2. **File Uploads**: Direct file submission with storage integration
3. **Advanced Judging**: Scoring system with multiple criteria
4. **Analytics Dashboard**: Competition metrics and insights
5. **Mobile Application**: Native mobile experience for participants

### Scalability Improvements

1. **Microservices Architecture**: Decoupled services for specific functions
2. **Caching Layer**: Redis for frequently accessed data
3. **Message Queue**: Async processing for resource-intensive operations
4. **Containerization**: Docker for consistent deployment environments

### Security Enhancements

1. **Two-Factor Authentication**: Additional authentication factor
2. **Audit Logging**: Comprehensive activity tracking
3. **Rate Limiting**: API protection against abuse
4. **Security Headers**: Additional HTTP security headers
