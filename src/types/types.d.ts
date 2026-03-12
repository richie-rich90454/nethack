/**
 * Global Type Definitions for Nethack Hackathon Portal
 *
 * This file contains all type augmentations and global type definitions
 * used throughout the application. It extends NextAuth types to include
 * competition-specific user fields and defines environment variables.
 *
 * @module types
 */

import "next-auth"
import "next-auth/jwt"

// ========================================================
// Environment Variables
// ========================================================
/**
 * Type-safe environment variables for the application.
 * All variables must be defined in .env.local or production environment.
 */
declare namespace NodeJS {
	interface ProcessEnv {
		// Database Configuration
		/** MySQL database username */
		SQL_USERNAME: string
		/** MySQL database password */
		SQL_PASSWORD: string

		// NextAuth Configuration
		/** Secret for encrypting JWT tokens and sessions */
		NEXTAUTH_SECRET: string
		/** Base URL for NextAuth callbacks (e.g., http://localhost:3000) */
		NEXTAUTH_URL: string

		// Azure AD Configuration
		/** Azure AD application client ID */
		AZURE_AD_CLIENT_ID: string
		/** Azure AD application client secret */
		AZURE_AD_CLIENT_SECRET: string
		/** Azure AD tenant ID */
		AZURE_AD_TENANT_ID: string

		// Optional: Database connection details if needed
		/** Database host (optional, defaults to localhost) */
		DB_HOST?: string
		/** Database name (optional, if not using default) */
		DB_NAME?: string
	}
}

// ========================================================
// NextAuth Type Augmentation
// ========================================================
/**
 * Extend NextAuth's built-in types to include competition-specific fields.
 * These augmentations are automatically picked up by TypeScript.
 */

declare module "next-auth" {
	/**
	 * Extend the built-in User type with competition-specific fields.
	 * These are the fields stored in the database and returned by the authorize callback.
	 */
	interface User {
		/** Access level: 0=visitor/voter, 1=competitor, 2+=judge/admin */
		access: number
		/** Team identifier for competitors (null for non-competitors) */
		teamID: string | null
		/** Optional: User's display name */
		name?: string | null
		/** Optional: User's email (primary identifier) */
		email?: string | null
		/** Optional: User's avatar image URL */
		image?: string | null
	}

	/**
	 * Extend the Session type to include custom user fields and access token.
	 * This is what client components receive via useSession().
	 */
	interface Session {
		/** Azure AD access token for authenticated API calls */
		accessToken?: string
		/** User information with competition-specific fields */
		user: {
			/** User's unique identifier (from database or NextAuth) */
			id?: string
			/** User's email address (primary identifier) */
			email: string
			/** Access level: 0=visitor, 1=competitor, 2+=judge */
			access: number
			/** Team identifier for competitors */
			teamID: string | null
			/** User's display name from Azure AD */
			name?: string | null
			/** User's avatar image URL from Azure AD */
			image?: string | null
		}
		/** Session expiry timestamp */
		expires: string
	}

	/**
	 * Extend the Profile type from Azure AD to include all possible fields.
	 */
	interface Profile {
		/** Azure AD object ID */
		oid?: string
		/** User's preferred username */
		preferred_username?: string
		/** User's given name (first name) */
		given_name?: string
		/** User's family name (last name) */
		family_name?: string
		/** User's email address */
		email?: string
		/** User's display name */
		name?: string
		/** User's avatar image URL */
		picture?: string
		/** Additional Azure AD fields */
		[claim: string]: unknown
	}
}

declare module "next-auth/jwt" {
	/**
	 * Extend the JWT type (what is stored in the session token).
	 * This is used in the jwt callback and passed to the session callback.
	 */
	interface JWT {
		/** User's access level for competition */
		access: number
		/** User's team identifier */
		teamID: string | null
		/** User's email address */
		email: string
		/** Azure AD access token for API calls */
		accessToken?: string
		/** User's display name */
		name?: string | null
		/** JWT issued at timestamp */
		iat?: number
		/** JWT expiration timestamp */
		exp?: number
		/** JWT subject (user identifier) */
		sub?: string
		/** Additional JWT fields from NextAuth */
		[key: string]: unknown
	}
}

// ========================================================
// Database Row Types
// ========================================================
/**
 * Database entity types for type-safe database operations.
 * These match the expected structure of your MySQL tables.
 */

/**
 * Namespace for database-related types to avoid global pollution.
 */
declare namespace DB {
	/**
	 * User table row structure.
	 * Maps to the 'users' table in MySQL.
	 */
	interface User {
		/** Auto-incrementing primary key */
		id: number
		/** User's email address (unique) */
		email: string
		/** Access level: 0=visitor, 1=competitor, 2+=judge */
		access: number
		/** Team identifier for competitors (null if not in a team) */
		teamID: string | null
		/** Timestamp when the user record was created */
		created_at: Date
		/** Optional: Last login timestamp */
		last_login?: Date | null
		/** Optional: User's display name */
		name?: string | null
	}

	/**
	 * Projects table row structure.
	 * Maps to the 'projects' table in MySQL.
	 */
	interface Project {
		/** Auto-incrementing primary key */
		id: number
		/** Team identifier that owns this project */
		teamID: string
		/** Name/title of the project */
		project_name: string
		/** Detailed project description */
		description: string | null
		/** URL to project repository, demo, or submission */
		submission_url: string
		/** Timestamp when the project was submitted */
		submission_date: Date
		/** Current submission status */
		status: "pending" | "reviewed" | "accepted" | "rejected"
		/** Optional: Feedback from judges */
		feedback?: string | null
		/** Optional: Final score if judged */
		score?: number | null
		/** Optional: Last updated timestamp */
		updated_at?: Date | null
	}

	/**
	 * Competition phases/rounds table structure.
	 * Maps to the 'phases' or 'settings' table in MySQL.
	 */
	interface Phase {
		/** Phase identifier */
		id: number
		/** Phase name (e.g., "submission", "judging", "results") */
		phase: string
		/** Phase start timestamp */
		start_date?: Date | null
		/** Phase end timestamp */
		end_date?: Date | null
		/** Whether the phase is currently active */
		is_active?: boolean
		/** Additional phase configuration */
		config?: Record<string, unknown> | null
	}

	/**
	 * Teams table structure (if applicable).
	 */
	interface Team {
		/** Unique team identifier */
		teamID: string
		/** Team display name */
		team_name: string
		/** Team description or tagline */
		description?: string | null
		/** Team creation timestamp */
		created_at: Date
		/** Team leader's email */
		leader_email: string
		/** Team member emails (JSON array or comma-separated) */
		members?: string | null
		/** Whether team is active in competition */
		is_active?: boolean
	}
}

// ========================================================
// API Response Types
// ========================================================
/**
 * Standard API response format for consistent error handling.
 * Used across all API routes for type-safe responses.
 */

/**
 * Generic API response wrapper.
 * @template T - Type of the data payload
 */
declare type ApiResponse<T = any> = {
	/** Whether the request was successful */
	success: boolean
	/** Response data payload (present on success) */
	data?: T
	/** Error message (present on failure) */
	error?: string
	/** Optional user-friendly message */
	message?: string
	/** Optional status code */
	status?: number
	/** Optional timestamp */
	timestamp?: string
}

/**
 * Paginated API response wrapper.
 * @template T - Type of the items in the current page
 */
declare type PaginatedResponse<T = any> = {
	/** Whether the request was successful */
	success: boolean
	/** Array of items for current page */
	data?: T[]
	/** Current page number (1-based) */
	page: number
	/** Number of items per page */
	limit: number
	/** Total number of items across all pages */
	total: number
	/** Total number of pages */
	totalPages: number
	/** Optional error message */
	error?: string
}

// ========================================================
// Component Props Types
// ========================================================
/**
 * Common component prop types for reusability.
 */

/**
 * Props for components that accept children.
 */
declare interface ChildrenProps {
	/** React child nodes */
	children: React.ReactNode
}

/**
 * Props for components that accept CSS class names.
 */
declare interface ClassNameProps {
	/** Additional CSS class names */
	className?: string
}

/**
 * Props for components that can be styled with CSS modules.
 */
declare interface StyledProps extends ClassNameProps {
	/** Inline styles */
	style?: React.CSSProperties
}

// ========================================================
// Utility Types
// ========================================================
/**
 * Utility type to make all properties of T optional but with a catch.
 * Unlike Partial<T>, this works well with nested objects.
 */
declare type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Utility type to make all properties of T readonly.
 */
declare type DeepReadonly<T> = {
	readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
}

/**
 * Utility type to extract the element type from an array.
 */
declare type ArrayElement<T extends readonly unknown[]> =
	T extends readonly (infer U)[] ? U : never

// ========================================================
// Global Constants and Enums
// ========================================================
/**
 * Competition access levels as an enum for better type safety.
 */
declare const enum AccessLevel {
	/** Visitor/Voter - can view public content only */
	VISITOR = 0,
	/** Competitor - can submit and manage their project */
	COMPETITOR = 1,
	/** Judge - can view and score all submissions */
	JUDGE = 2,
	/** Admin - full system access */
	ADMIN = 3,
}

/**
 * Competition phases as an enum.
 */
declare const enum CompetitionPhase {
	/** Competition not yet started */
	PENDING = "pending",
	/** Submission phase - competitors can submit projects */
	SUBMISSION = "submission",
	/** Judging phase - judges review submissions */
	JUDGING = "judging",
	/** Results phase - winners announced */
	RESULTS = "results",
	/** Competition completed */
	COMPLETED = "completed",
}
