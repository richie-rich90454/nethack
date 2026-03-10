/**
 * Dashboard Page Component
 * Rewrite with TypeScript on 2026/3/10
 *
 * Main dashboard view that displays different content based on user access level:
 * - Access 0: Visitors/Voters (no access)
 * - Access 1: Competitors (submission dashboard)
 * - Access 2+: Judges (judging dashboard)
 *
 * @component
 * @returns {JSX.Element} Dashboard page
 */

"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCompetition } from "@/src/context/CompetitionContext"
import Submission from "@/src/components/Submission"
import DashboardCompetitor from "@/src/components/DashboardCompetitor"
import DashboardJudge from "@/src/components/DashboardJudge"
import { siteConfig } from "@/config/siteConfig"

/**
 * Interface representing a project entry from the database
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
 * Main dashboard view that displays different content based on user access level.
 *
 * @returns {JSX.Element} Dashboard page
 */
const Dashboard = (): React.ReactElement => {
    const { data: session, status: authStatus } = useSession()
    const competition = useCompetition()
    const [entries, setEntries] = useState<ProjectEntry[]>([])
    const [edit, setEdit] = useState<boolean>(false)

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

    const refreshData = (): void => {
        fetchEntries()
    }

    useEffect(() => {
        fetchEntries()
    }, [session])

    return (
        <>
            {session ? (
                <>
                    {/* handle access level 0 - visitor/voter */}
                    {session.user.access < 1 && (
                        <p dangerouslySetInnerHTML={{ __html: siteConfig.dashboard.accessDenied }} />
                    )}
                    {/* handle access level 1 - competitor */}
                    {session.user.access === 1 && <DashboardCompetitor />}
                    {/* handle access level 2+ - judge */}
                    {session.user.access > 1 && <DashboardJudge />}
                </>
            ) : authStatus === "loading" ? (
                <p>{siteConfig.dashboard.loading}</p>
            ) : (
                <p>
                    {siteConfig.dashboard.loginRequired.replace(
                        "{link}",
                        `<Link href="/login" className="button bGray">${siteConfig.dashboard.loginLinkText}</Link>`
                    )}
                </p>
            )}
        </>
    )
}

export default Dashboard
