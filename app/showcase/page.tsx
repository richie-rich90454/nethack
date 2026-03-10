/**
 * Showcase Page Component
 * Rewrite with TypeScript on 2026/3/10
 *
 * Displays the winning and finalist projects from the 2025R1 Hackathon.
 * Fetches project data for specific team IDs and renders them with appropriate styling.
 *
 * @component
 * @returns {JSX.Element} Showcase page
 */

"use client"

import React from "react"
import { useEffect, useState } from "react"
import SubmissionPresent from "@/src/components/SubmissionPresent"
import { siteConfig } from "@/config/siteConfig"

/**
 * Interface representing a project submission from the database
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

/**
 * Showcase Page Component
 *
 * Displays the winning and finalist projects from the 2025R1 Hackathon.
 *
 * @returns {JSX.Element} Showcase page
 */
const Showcase = (): React.ReactElement => {
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
    }, [])

    // Check if entries is an array (not a string) and has at least 8 items
    const hasEntries = Array.isArray(entries) && entries.length >= 8

    return (
        <>
            <p>
                <span className="cWhite serifBold big">{siteConfig.showcase.heading}</span>
            </p>
            <hr />
            <p className="cBlue" dangerouslySetInnerHTML={{ __html: siteConfig.showcase.description }} />
            <br />
            <p>{siteConfig.showcase.longDescription}</p>
            <br />

            <div>
                {hasEntries && (
                    <>
                        <p>
                            <span className="cWhite serifBold med">{siteConfig.showcase.top3.title}</span>
                        </p>
                        <p
                            className="cWhite"
                            dangerouslySetInnerHTML={{ __html: siteConfig.showcase.top3.description }}
                        />

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
                            <span className="cWhite serifBold med">{siteConfig.showcase.honorableMentions.title}</span>
                        </p>
                        <p className="cWhite">{siteConfig.showcase.honorableMentions.description}</p>
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
                        <p className="cWhite">{siteConfig.showcase.closing}</p>
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
