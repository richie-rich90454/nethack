"use client"

import React from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { useCompetition } from "@/src/context/CompetitionContext"
import Link from "next/link"

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
                <span className="cWhite serifBold big">User Login</span>
            </p>
            <hr />
            <p className="cBlue">
                This is the portal for <span className="serifBold">competitor, voter, and judge</span> account login.
            </p>
            <p className="cYellow">
                Please note you should login using your <span className="console">@basischina.com</span> Microsoft email
                account.
            </p>
            <div className="console lightBox loginBox cBlack">
                {status === "loading" ? (
                    <p className="center">Loading...</p>
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
                                Sign out
                            </span>
                        </p>
                        <br />
                        <p className="serifBold">Your Account Information</p>
                        <p>Name: {session.user.name}</p>
                        <p>Email: {session.user.email}</p>
                        <p>
                            Account type:{" "}
                            {session.user.access === 0
                                ? "Visitor/Voter"
                                : session.user.access === 1
                                  ? "Competitor"
                                  : session.user.access === 2
                                    ? "Judge"
                                    : session.user.access === 9
                                      ? "Admin"
                                      : "Unknown"}
                        </p>
                        {session.user.access === 1 && session.user.teamID && <p>Team ID: {session.user.teamID}</p>}
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
                                        href="https://forms.cloud.microsoft/r/3t7EywybWw"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className="button serifBold bBlue">Sign up for the Hackathon</span>
                                    </a>
                                </p>
                                <br />
                                <p className="serifItalic">
                                    Signed up and approved? Please sign out and then login to view your dashboard!
                                </p>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <p className="center">
                            You are not currently logged in.{" "}
                            <span
                                className="button serifBold"
                                onClick={handleSignIn}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && handleSignIn()}
                            >
                                Sign in
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login
