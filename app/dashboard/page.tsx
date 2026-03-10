"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCompetition } from "@/src/context/CompetitionContext"
import Submission from "@/src/components/Submission"
import DashboardCompetitor from "@/src/components/DashboardCompetitor"
import DashboardJudge from "@/src/components/DashboardJudge"

/**
 * Interface representing a project entry from the database
 * Rewrite with TypeScript in 2026/3/10 (1773139731)
 */
interface ProjectEntry {
    id: number
    teamID: string
    title: string
    description: string
    github: string
    prompt: string
    technologies: string
    submission_date?: string
    status?: string
    [key: string]: unknown
}

/**
 * Dashboard Page Component
 *
 * Main dashboard view that displays different content based on user access level:
 * - Access 0: Visitors/Voters (no access)
 * - Access 1: Competitors (submission dashboard)
 * - Access 2+: Judges (judging dashboard)
 *
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = (): React.ReactElement => {
    const { data: session, status: authStatus } = useSession()
    const { competitionState } = useCompetition() // Now correctly accessing competitionState
    const [entries, setEntries] = useState<ProjectEntry[]>([])

    // TODO: implement edit mode and view mode? prevent accidental changes
    const [edit, setEdit] = useState<boolean>(false)

    /**
     * Fetch project entries from the database
     * Only judges (access > 1) can fetch all entries
     */
    const fetchEntries = async (): Promise<void> => {
        if (session) {
            try {
                if (session.user.access > 1) {
                    const response = await fetch("/api/sql/pullProject")
                    if (response.ok) {
                        const data = (await response.json()) as ProjectEntry[]
                        setEntries(data)
                    } else {
                        console.error("Failed to fetch entries")
                    }
                }
            } catch (error) {
                console.error("Error fetching entries: ", error)
            }
        }
    }

    /**
     * Refresh data callback passed to child components
     * Called by onUpdate through Submission > JudgeToolbox
     */
    const refreshData = (): void => {
        fetchEntries()
    }

    // Fetch entries when session changes
    useEffect(() => {
        fetchEntries()
    }, [session])

    return (
        <>
            {session ? (
                <>
                    {/* handle access level 0 - visitor/voter */}
                    {session.user.access < 1 && (
                        <>
                            <p>
                                Your account (<span className="serifBold">Visitor/Voter</span>) does not grant you
                                access to this page.
                            </p>
                        </>
                    )}
                    {/* handle access level 1 - competitor */}
                    {session.user.access === 1 && <DashboardCompetitor />}
                    {/* handle access level 2+ - judge */}
                    {session.user.access > 1 && <DashboardJudge />}
                </>
            ) : authStatus === "loading" ? (
                <>
                    <p>Loading...</p>
                </>
            ) : (
                <>
                    <p>
                        You need to{" "}
                        <b>
                            <Link className="button bGray" href="/login">
                                Login
                            </Link>
                        </b>{" "}
                        to access this page.
                    </p>
                </>
            )}
        </>
    )
}

export default Dashboard
