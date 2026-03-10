// types.d.ts

import "next-auth"
import "next-auth/jwt"

// ========================================================
// Environment Variables
// ========================================================
declare namespace NodeJS {
    interface ProcessEnv {
        // Database
        SQL_USERNAME: string
        SQL_PASSWORD: string

        // NextAuth
        NEXTAUTH_SECRET: string
        NEXTAUTH_URL: string

        // Azure AD
        AZURE_AD_CLIENT_ID: string
        AZURE_AD_CLIENT_SECRET: string
        AZURE_AD_TENANT_ID: string

        // Add other env vars as needed
    }
}

// ========================================================
// NextAuth Type Augmentation
// ========================================================
declare module "next-auth" {
    /**
     * Extend the built-in User type with your custom fields.
     * These are the fields stored in the database and returned by the authorize callback.
     */
    interface User {
        access: number // 0=visitor, 1=competitor, 2+=judge
        teamID: string | null
    }

    /**
     * Extend the Session type to include your custom user fields.
     */
    interface Session {
        user: {
            id?: string // NextAuth often includes an id, but you can also use email
            email: string
            access: number
            teamID: string | null
            name?: string | null
            image?: string | null
        }
    }
}

declare module "next-auth/jwt" {
    /**
     * Extend the JWT type (what is stored in the session token).
     */
    interface JWT {
        access: number
        teamID: string | null
        email: string
    }
}

// ========================================================
// Optional: Database Row Types (example)
// ========================================================
// You can define types for your database rows here or in separate files.
// Example for a user row:
/*
declare namespace DB {
  interface User {
    id: number;
    email: string;
    access: number;
    teamID: string | null;
    created_at: Date;
  }

  interface Project {
    id: number;
    teamID: string;
    project_name: string;
    description: string | null;
    submission_url: string;
    submission_date: Date;
    status: "pending" | "reviewed" | "accepted" | "rejected";
  }
}
*/

// ========================================================
// Global Utility Types
// ========================================================
// If you need a common type for API responses:
/*
declare type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};
*/
