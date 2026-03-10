"use client"

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useCompetition } from "@/src/context/CompetitionContext"
import Link from "next/link"
import { siteConfig } from "@/config/siteConfig"

/**
 * Login Page Component
 * Rewrite with TypeScript in 2026/3/10 (1773139917)
 *
 * Handles user authentication and displays user information based on session status.
 * Shows different content for:
 * - Loading state
 * - Authenticated users (with access level-specific info)
 * - Unauthenticated users
 *
 * @returns {JSX.Element} Login page
 */
const Login = (): React.ReactElement => {
    const { data: session, status } = useSession()
    const { competitionState } = useCompetition()

    /**
     * Handle sign out with span click
     */
    const handleSignOut = (): void => {
        signOut()
    }

    /**
     * Handle sign in with span click
     */
    const handleSignIn = (): void => {
        signIn("azure-ad")
    }

    return (
        <div>
            <p>
                <span className="cWhite serifBold big">{siteConfig.login.heading}</span>
            </p>
            <hr />
            <p className="cBlue">{siteConfig.login.description}</p>
            <p className="cYellow">{siteConfig.login.emailNote}</p>
            <div className="console lightBox loginBox cBlack">
                {status === "loading" ? (
                    <p className="center">{siteConfig.login.loadingText}</p>
                ) : session ? (
                    <>
                        <p className="center">
                            You are logged in.{" "}
                            <span
                                className="button serifBold bWhite"
                                onClick={handleSignOut}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && handleSignOut()}
                            >
                                {siteConfig.login.signOutButton}
                            </span>
                        </p>
                        <br />
                        <p className="serifBold">{siteConfig.login.yourAccountInfo}</p>
                        <p>
                            {siteConfig.login.nameLabel} {session.user.name}
                        </p>
                        <p>
                            {siteConfig.login.emailLabel} {session.user.email}
                        </p>
                        <p>
                            {siteConfig.login.accountTypeLabel}{" "}
                            {siteConfig.login.accountTypeLabels[session.user.access] || "Unknown"}
                        </p>
                        {session.user.access === 1 && session.user.teamID && (
                            <p>
                                {siteConfig.login.teamIdLabel} {session.user.teamID}
                            </p>
                        )}
                        <br />
                        {session.user.access >= 1 && (
                            <p className="center">
                                <Link href="/dashboard">
                                    <span className="button serifBold bBlue">Open My Hackathon Dashboard</span>
                                </Link>
                            </p>
                        )}
                        {session.user.access === 0 && (
                            <>
                                <p className="center">
                                    <a
                                        href={siteConfig.externalUrls.signUpForm}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="button serifBold bBlue">Sign up for the Hackathon</span>
                                    </a>
                                </p>
                                <br />
                                <p className="serifItalic">{siteConfig.login.signUpPrompt}</p>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <p className="center">
                            {siteConfig.login.notLoggedInText}{" "}
                            <span
                                className="button serifBold"
                                onClick={handleSignIn}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && handleSignIn()}
                            >
                                {siteConfig.login.signInButton}
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login
