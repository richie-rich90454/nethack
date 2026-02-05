"use client"
import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCompetition } from "@/context/CompetitionContext"
import Submission from "@/components/Submission"
import DashboardCompetitor from "@/components/DashboardCompetitor"
import DashboardJudge from "@/components/DashboardJudge"

const Dashboard = () => {
    const { data: session, status: authStatus } = useSession()
    const competitionState = useCompetition().competitionState
    const [entries, setEntries] = useState([])

    // TODO: implement edit mode and view mode? prevent accidental changes
    const [edit, setEdit] = useState(false)

    const fetchEntries = async () => {
        if (session) {
            try {
                if (session.user.access > 1) {
                    const response = await fetch("/api/sql/pullProject")
                    if (response.ok) {
                        const data = await response.json()
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

    // this is called by an onUpdate that goes through Submission > JudgeToolbox
    const refreshData = () => {
        fetchEntries()
    }

    useEffect(() => {
        fetchEntries()
    }, [session])

    return (
        <>
            {session ? (
                <>
                    {/* handle access level 0 - visitor.voter */}
                    {session.user.access < 1 && (
                        <>
                            <p>
                                Your account (<span className="serifBold">Visitor/Voter</span>)does not grant you access
                                to this page.
                            </p>
                        </>
                    )}
                    {/* handle access level 1 - competitor */}
                    {session.user.access == 1 && <DashboardCompetitor />}
                    {/* handle access level 2 - judge */}
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
