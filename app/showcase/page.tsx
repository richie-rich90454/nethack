"use client"

import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCompetition } from "@/src/context/CompetitionContext"
import CountdownMini from "@/src/components/CountdownMini"
import SubmissionPresent from "@/src/components/SubmissionPresent"

/**
 * Interface representing a project submission from the database
 * Rewrite with TypeScript on 2026/3/10 (1773140038)
 */
interface ProjectSubmission {
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
 * Showcase Page Component
 *
 * Displays the winning and finalist projects from the 2025R1 Hackathon.
 * Fetches project data for specific team IDs and renders them with appropriate styling.
 *
 * @returns {JSX.Element} Showcase page
 */
const Showcase = (): React.ReactElement => {
    const { data: session } = useSession()
    const [entries, setEntries] = useState<ProjectSubmission[] | string>("Loading...")

    /**
     * Fetch project entries for all winner team IDs
     */
    const fetchEntries = async (): Promise<void> => {
        try {
            // TODO: prob modify database schema (i.e. make new fields) so this can be done in 1 api call
            const winners: string[] = [
                "c0ad4f19",
                "d34f1c1d",
                "dbb3b35b",
                "012ba255",
                "17b07c3a",
                "46ff65b7",
                "f4da2d19",
                "7fea1e8e"
            ]

            const all: ProjectSubmission[] = []

            for (let i = 0; i < winners.length; i++) {
                const response = await fetch("/api/sql/pullProject?search=" + winners[i])

                if (response.ok) {
                    const data = (await response.json()) as ProjectSubmission[]
                    if (data && data.length > 0) {
                        all.push(data[0])
                    }
                } else {
                    console.error("Failed to fetch entries for team: " + winners[i])
                }
            }

            setEntries(all)
        } catch (error) {
            console.error("Error fetching entries: ", error)
            setEntries("Error loading entries")
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [session])

    /**
     * Award icon SVG component
     */
    const iconAward: React.ReactElement = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-award-fill"
            viewBox="0 0 16 16"
        >
            <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z" />
            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
        </svg>
    )

    // Check if entries is an array (not a string)
    const hasEntries = Array.isArray(entries) && entries.length >= 8

    return (
        <>
            <p>
                <span className="cWhite serifBold big">Project Showcase (2025R1)</span>
            </p>
            <hr />
            <p className="cBlue">
                The projects on this page are all <span className="serifBold">original student work</span>, submitted as
                part of the 2nd Annual BIBS·C Network Hackathon. Participants were given 1 week to develop a project
                from scratch that responds to one of the Hackathon prompts - from conceptualization to implementation to
                presentation, students took charge of their projects.{" "}
            </p>
            <br />
            <p>
                Out of 24 qualifying projects from 65 students across 5 schools, these projects were selected by a panel
                of judges as exemplary and representative work. A Hackathon is all about applying technology in unique
                ways to solve practical problems, so projects were assessed on their use of technology, originality,
                presentation, topicality, and usability. Whenever possible, we have placed the interactive version of
                their project's on this site; code download is also available. We encourage you to reach out to these
                students via Teams if you want to learn more about their projects!{" "}
            </p>
            <br />

            <div>
                {hasEntries && (
                    <>
                        <p>
                            <span className="cWhite serifBold med">Our Top 3:</span>
                        </p>
                        <p className="cWhite">
                            Our judges were very impressed with the quality of the project submissions this Round, and
                            it was difficult to rank the Finalists. The following projects are all compelling in their
                            own way: <span className="serifBold">Natural Selection Simulation</span> takes first place
                            because of how impressively it embodies the "Theory and Reality" prompt, powerfully
                            demonstrating the power of computational simulation in modeling and communicating scientific
                            theories. Next, <span className="serifBold">Local-Server-Chat</span> explores the very
                            fundamentals of the technology that is found all around us and so often taken for granted,
                            creating a chat server usable by anyone.{" "}
                            <span className="serifBold">N-Body Simulation</span> is an exciting project that uses
                            visualization to bring gravitation and our solar system to life.
                        </p>

                        <div className="border gold">
                            <SubmissionPresent
                                key="0"
                                submission={entries[0]}
                                override={`/25R1/${entries[0].teamID}/vid.mp4`}
                            />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border silver">
                            <SubmissionPresent
                                key="1"
                                submission={entries[1]}
                                override={`/25R1/${entries[1].teamID}/vid.mp4`}
                            />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border bronze">
                            <SubmissionPresent
                                key="2"
                                submission={entries[2]}
                                override={`/25R1/${entries[2].teamID}/vid.mp4`}
                            />
                            <div className="award">{iconAward}</div>
                        </div>
                        <br />
                        <p>
                            <span className="cWhite serifBold med">The remaining Finalists (Honorable Mentions):</span>
                        </p>
                        <p className="cWhite">
                            We believe all of Finalist projects were impressive enough to be worth your time exploring,
                            so all of them are presented here. In no particular order, here is another set of diverse
                            and captivating projects:
                        </p>
                        <div className="border green">
                            <SubmissionPresent key="3" submission={entries[3]} override={0} />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent key="4" submission={entries[4]} override={0} />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent
                                key="5"
                                submission={entries[5]}
                                override={`/25R1/${entries[5].teamID}/vid.mp4`}
                            />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent
                                key="6"
                                submission={entries[6]}
                                override="https://david-why.tech/bmplogicsim/"
                            />
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent key="7" submission={entries[7]} override={0} />
                            <div className="award">{iconAward}</div>
                        </div>
                        <br />
                        <p className="cWhite">
                            We are immensely proud of all of our participants, and we can honestly say that we learned
                            something new from each project. We will be trying to put up more projects for public
                            viewing in the future, but for now we hope you enjoyed this exhibition of the power of
                            technology.{" "}
                        </p>
                    </>
                )}

                {/* Loading state */}
                {entries === "Loading..." && <p className="cWhite">Loading showcase projects...</p>}

                {/* Error state */}
                {entries === "Error loading entries" && (
                    <p className="cWhite">Failed to load showcase projects. Please try again later.</p>
                )}
            </div>
        </>
    )
}

export default Showcase
