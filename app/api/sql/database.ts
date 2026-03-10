/**
 * Database Connection Module
 * Rewrite with TypeScript in 2026/3/10 (1773139470)
 *
 * Provides MySQL database connection pooling and utility functions for the application.
 * Uses mysql2/promise for async/await support and connection pooling for performance.
 *
 * @module database
 */

"use server"

import mysql from "mysql2/promise"
import { RowDataPacket } from "mysql2"

/**
 * MySQL Connection Pool Configuration
 *
 * Creates a connection pool with the following configuration:
 * - Host: localhost
 * - Database: nethack
 * - Connection limit: 20 concurrent connections
 * - Wait for connections: true (queue connections when limit reached)
 * - Queue limit: 0 (unlimited queue size)
 *
 * Environment variables required:
 * - SQL_USERNAME: MySQL database username
 * - SQL_PASSWORD: MySQL database password
 *
 * @type {mysql.Pool}
 */
const pool = mysql.createPool({
    host: "localhost",
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: "nethack",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
})

/**
 * Handle pool errors
 *
 * MySQL connection pool errors are handled by rejecting promises that use the pool.
 * We can still catch uncaught errors at the process level if needed.
 */
// Note: The 'error' event is not available in mysql2/promise Pool type
// Connection errors will be thrown when using getConnection() or query()

/**
 * User data interface for database query results
 */
interface UserRow extends RowDataPacket {
    access: number
    teamID: string | null
    [key: string]: unknown
}

/**
 * Get a database connection from the pool
 *
 * Acquires a connection from the connection pool. The connection must be
 * released back to the pool after use by calling connection.release().
 *
 * @async
 * @returns {Promise<mysql.PoolConnection>} MySQL connection object
 *
 * @example
 * // Usage pattern:
 * const connection = await getConnection();
 * try {
 *   const [rows] = await connection.query('SELECT * FROM users');
 *   return rows;
 * } finally {
 *   connection.release();
 * }
 */
export default async function getConnection(): Promise<mysql.PoolConnection> {
    try {
        return await pool.getConnection()
    } catch (error) {
        console.error("Error getting database connection:", error)
        throw error
    }
}

/**
 * Retrieve user information by email
 *
 * Fetches user access level and team ID from the database for authentication
 * and authorization purposes. Used by NextAuth during user authentication.
 *
 * @async
 * @param {string} email - User email address (case-insensitive search)
 * @returns {Promise<Object|null>} User object with access and teamID, or null if not found
 *
 * @example
 * const user = await getUser('user@example.com');
 * if (user) {
 *   console.log(`Access level: ${user.access}, Team ID: ${user.teamID}`);
 * }
 */
export async function getUser(email: string): Promise<{ access: number; teamID: string | null } | null> {
    try {
        const [rows] = await pool.query<UserRow[]>(
            "SELECT access, teamID FROM users WHERE email = ?",
            [email.toLowerCase()] // Normalize email to lowercase for consistent lookup
        )
        return rows[0] || null
    } catch (error) {
        console.error("Database error in getUser:", error)
        return null
    }
}

/**
 * Execute a raw query using the connection pool
 *
 * Utility function for executing SQL queries directly using the pool.
 * For complex transactions, use getConnection() instead.
 *
 * @async
 * @param {string} sql - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 *
 * @example
 * const results = await query('SELECT * FROM projects WHERE teamID = ?', ['team123']);
 */
export async function query<T extends RowDataPacket[]>(sql: string, params: any[] = []): Promise<T> {
    try {
        const [rows] = await pool.query<T>(sql, params)
        return rows
    } catch (error) {
        console.error("Database query error:", error)
        throw error
    }
}
