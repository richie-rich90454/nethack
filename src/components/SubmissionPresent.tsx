/**
 * Submission Present Component
 * Rewrite with TypeScript on 2026/3/10 (1773140907)
 *
 * Displays a project submission in a presentation format for the showcase page.
 * Includes project image, title, description, and links to the live project and code.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.submission - Submission data object
 * @param {string|number} props.override - Override URL for video/project link (0 for none)
 *
 * @example
 * <SubmissionPresent
 *   submission={submission}
 *   override={`/25R1/${submission.teamID}/vid.mp4`}
 * />
 *
 * @returns {JSX.Element} Submission presentation card
 */

"use client"

import React from "react"
import styles from "./SubmissionPresent.module.css"
import Link from "next/link"

/**
 * Interface for submission data
 */
interface SubmissionData {
    /** Team identifier */
    teamID: string
    /** Project title */
    title: string | null
    /** Team members */
    members?: string
    /** Project description */
    description: string
    /** GitHub repository URL */
    github: string
    /** Hackathon prompt selection */
    prompt: string | null
    /** Technologies used (comma-separated) */
    technologies: string | null
    /** Code submission type or URL */
    sub_code?: string
    /** Additional properties */
    [key: string]: unknown
}

/**
 * Props for SubmissionPresent component
 */
interface SubmissionPresentProps {
    /** Submission data object */
    submission: SubmissionData
    /** Override URL for video/project link (0 for none) */
    override: string | number
}

/**
 * Play icon component
 */
const iconPlay: React.ReactElement = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-play-circle"
        viewBox="0 0 16 16"
    >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
    </svg>
)

/**
 * Submission Present Component
 *
 * Displays a project submission in card format with image, title, description,
 * and links to the live project and source code.
 *
 * @param {SubmissionPresentProps} props - Component props
 * @returns {JSX.Element} Submission presentation card
 */
const SubmissionPresent = ({ submission, override }: SubmissionPresentProps): React.ReactElement => {
    // Safety check - if no submission, return empty fragment
    if (!submission) {
        return <></>
    }

    /**
     * Determine the link URL based on override value
     */
    const getLinkUrl = (): string => {
        if (override) {
            if (typeof override === "string") {
                return override
            }
            // If override is 0 (number), use default path
        }
        return `/25R1/${submission.teamID}/${submission.title}.html`
    }

    const linkUrl = getLinkUrl()

    return (
        <div className={`${styles.wrap} displayBox`}>
            <div id={submission.teamID} className={styles.outline}>
                <a target="_blank" rel="noopener noreferrer" href={linkUrl}>
                    <div className={styles.image}>
                        <img src={`/25R1/${submission.teamID}.jpg`} alt={`${submission.title} project thumbnail`} />
                        <div className={styles.play}>{iconPlay}</div>
                    </div>
                </a>
                <div className={styles.text}>
                    <p className="cWhite medBig serifBold">
                        {submission.title === null ? (
                            <span className="cRed">Untitled Submission</span>
                        ) : (
                            submission.title
                        )}
                        <span className="smallMed">&nbsp;</span>
                    </p>
                    <hr />
                    <p className="cWhite ">
                        Developed by <span className="serifBold cBlue">{submission.members || "Unknown"}</span>
                    </p>
                    <p className="cWhite">
                        Built using{" "}
                        <span className="serifBold cGreen">
                            {submission.technologies === null ? (
                                <span className="cRed">No Technologies Listed</span>
                            ) : (
                                submission.technologies
                            )}
                        </span>
                    </p>

                    <p className="cWhite">
                        <span className="cYellow serifBold">{submission.prompt || "No prompt"} </span>|{" "}
                        {submission.description}
                    </p>
                    <br />
                    <p>
                        Share URL:{" "}
                        <a
                            className="console"
                            href={`https://nethack.biszweb.club/showcase#${submission.teamID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            https://nethack.biszweb.club/showcase#{submission.teamID}
                        </a>
                    </p>
                    <p>
                        Download code:{" "}
                        {submission.sub_code === "Github" ? (
                            <a href={submission.github} target="_blank" rel="noopener noreferrer">
                                View on Github
                            </a>
                        ) : (
                            <a
                                href={`/25R1/${submission.teamID}/${submission.title}.zip`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Compressed Folder
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SubmissionPresent
