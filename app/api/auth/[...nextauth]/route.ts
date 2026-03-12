/**
 * NextAuth Authentication API Route
 * Rewritten with TypeScript in 2026/3/10 update in 2026/3/11
 *
 * Configures and exports NextAuth authentication handlers.
 * - In production: Azure AD provider (requires valid environment variables).
 * - In development: Credentials provider for easy testing with any `@test.com` user.
 *
 * JWT and session callbacks enrich the token/session with competition‑specific
 * fields (access level, teamID) from the database.
 *
 * @route GET/POST /api/auth/[...nextauth]
 * @module auth
 */

import NextAuth, { NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUser } from "@/app/api/sql/database"

/**
 * NextAuth Configuration Options
 *
 * Defines authentication providers, callbacks, and security settings.
 */
const authOptions: NextAuthOptions = {
	// Secret for encrypting JWT tokens and sessions – must be set in .env.local
	secret: process.env.NEXTAUTH_SECRET,

	/**
	 * Authentication Providers
	 * Conditionally include providers based on the environment.
	 */
	providers: [
		// ---------- Production: Azure AD ----------
		...(process.env.NODE_ENV === "production"
			? [
					AzureADProvider({
						// Azure AD application credentials – must be set in environment
						clientId: process.env.AZURE_AD_CLIENT_ID!,
						clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
						tenantId: process.env.AZURE_AD_TENANT_ID!,
						authorization: {
							params: {
								// Required scopes for reading user profile
								scope: "openid profile email User.Read",
								// Callback URL must match the one registered in Azure AD
								redirect_uri: process.env.NEXTAUTH_URL
									? process.env.NEXTAUTH_URL +
										"/api/auth/callback/azure-ad"
									: undefined,
							},
						},
					}),
				]
			: []),

		// ---------- Development: Credentials (test users) ----------
		...(process.env.NODE_ENV === "development"
			? [
					CredentialsProvider({
						// Name displayed on the sign‑in page
						name: "Dev Login",
						// Fields shown in the login form (password is ignored)
						credentials: {
							email: { label: "Email", type: "email" },
							password: { label: "Password", type: "password" },
						},
						/**
						 * Authorize callback – called when the user submits the form.
						 * Looks up the email in the database and returns a user object
						 * if found. The password is ignored (development only).
						 */
						async authorize(credentials) {
							if (!credentials?.email) return null

							// Fetch user from the `users` table by email
							const user = await getUser(
								credentials.email.toLowerCase(),
							)
							if (!user) return null // email not found – reject login

							// Return minimal user object – will be passed to the jwt callback
							return {
								id: String((user as any).id),
								email: (user as any).email,
								access: (user as any).access,
								teamID: (user as any).teamID,
							}
						},
					}),
				]
			: []),
	],

	/**
	 * Callbacks – customize the JWT and session objects.
	 */
	callbacks: {
		/**
		 * JWT Callback – runs whenever a JWT is created or updated.
		 * Enriches the token with user data from the database.
		 *
		 * @param token  – Current JWT token
		 * @param account – OAuth account details (only for Azure AD)
		 * @param profile – User profile from provider (only for Azure AD)
		 * @param user   – User object returned by authorize() (only for Credentials)
		 * @returns Modified token
		 */
		async jwt({ token, account, profile, user }) {
			// ----- Credentials flow (development) -----
			if (user) {
				// user comes from the authorize() callback
				token.email = user.email ?? ""
				token.name = user.email // display name – can be changed later
				token.access = (user as any).access
				token.teamID = (user as any).teamID
			}

			// ----- Azure AD flow (production) -----
			if (account && profile) {
				// Store Azure AD access token (if needed later)
				token.accessToken = account.access_token
				token.name = profile?.name
				token.email = profile?.email ?? ""

				// Default competition values (visitor)
				token.access = 0
				token.teamID = null

				// Fetch competition‑specific data from the database using the email
				if (profile?.email) {
					const competition = await getUser(
						profile.email.toLowerCase(),
					)
					if (competition) {
						token.access = (
							competition as {
								access: number
								teamID: string | null
							}
						).access
						token.teamID = (
							competition as {
								access: number
								teamID: string | null
							}
						).teamID
					}
				}
			}

			return token
		},

		/**
		 * Session Callback – runs whenever the session is checked.
		 * Transfers data from the JWT token to the session object,
		 * making it available on the client side.
		 *
		 * @param session – Current session object
		 * @param token   – JWT token containing user data
		 * @returns Updated session
		 */
		async session({ session, token }) {
			// Copy fields from token to session
			session.accessToken = token.accessToken as string | undefined
			session.user.name = token.name as string | undefined | null
			session.user.email = token.email as string
			session.user.access = token.access as number // competition access level
			session.user.teamID = token.teamID as string | null // team identifier

			return session
		},
	},
}

/**
 * NextAuth Handler
 *
 * Creates the NextAuth handler with the above configuration.
 * Exports GET and POST handlers for the dynamic route.
 */
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
