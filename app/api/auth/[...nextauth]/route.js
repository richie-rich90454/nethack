/**
 * NextAuth Authentication API Route
 *
 * Configures and exports NextAuth authentication handlers for Azure AD integration.
 * Provides JWT and session callbacks to enrich user data with competition-specific
 * access levels and team information from the database.
 *
 * @route GET/POST /api/auth/[...nextauth]
 * @module auth
 */

import NextAuth from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import { getUser } from "@/api/sql/database"

/**
 * NextAuth Configuration Options
 *
 * Defines authentication providers, callbacks, and security settings for the application.
 *
 * @type {import("next-auth").NextAuthOptions}
 */
const authOptions = {
    // Secret for encrypting JWT tokens and sessions
    secret: process.env.NEXTAUTH_SECRET,

    // Authentication providers configuration
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID,
            authorization: {
                params: {
                    // Required scopes for user authentication
                    scope: "openid profile email User.Read",
                    // Callback URL for Azure AD OAuth flow
                    redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/azure-ad"
                }
            }
        })
    ],

    // Callbacks for customizing authentication flow
    callbacks: {
        /**
         * JWT Callback - Called whenever a JWT is created or updated
         *
         * Enriches the JWT token with user information from Azure AD and
         * competition-specific data from the database.
         *
         * @param {Object} params - Callback parameters
         * @param {Object} params.token - JWT token being created/updated
         * @param {Object} params.account - OAuth account information
         * @param {Object} params.profile - User profile from Azure AD
         * @returns {Promise<Object>} Updated JWT token
         */
        async jwt({ token, account, profile }) {
            // Only process on initial sign-in (when account exists)
            if (account) {
                // Store Azure AD access token
                token.accessToken = account.access_token

                // Store basic user information from Azure AD profile
                token.name = profile?.name
                token.email = profile?.email

                // Initialize competition-specific fields with defaults
                token.access = 0 // Default access level: visitor/voter
                token.teamID = null // No team by default

                // Fetch competition-specific user data from database
                const competition = await getUser(profile.email.toLowerCase())
                if (competition) {
                    token.access = competition.access // User access level (0, 1, 2+)
                    token.teamID = competition.teamID // Team identifier for competitors
                }
            }
            return token
        },

        /**
         * Session Callback - Called whenever a session is checked
         *
         * Transforms JWT token data into session object accessible to client components.
         *
         * @param {Object} params - Callback parameters
         * @param {Object} params.session - Current session object
         * @param {Object} params.token - JWT token containing user data
         * @returns {Promise<Object>} Updated session object
         */
        async session({ session, token }) {
            // Enrich session with data from JWT token
            session.accessToken = token.accessToken
            session.user.name = token.name
            session.user.email = token.email
            session.user.access = token.access // Competition access level
            session.user.teamID = token.teamID // Team identifier

            return session
        }
    }
}

/**
 * NextAuth Handler
 *
 * Creates NextAuth handler with configured options and exports as GET and POST handlers
 * for the dynamic API route.
 */
const handler = NextAuth(authOptions)

// Export handlers for both GET and POST requests to the auth endpoint
export { handler as GET, handler as POST }
