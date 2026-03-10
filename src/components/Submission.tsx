/**
 * Submission Component
 * Rewrite with TypeScript on 2026/3/10 (1773140761)
 *
 * Displays a single project submission with all its metadata.
 * Provides edit functionality for judges.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.submission - Submission data object
 * @param {Object} props.user - Current user object (for permissions)
 * @param {Function} props.onEdit - Callback function when edit is clicked
 *
 * @example
 * <Submission
 *   submission={submission}
 *   user={session.user}
 *   onEdit={() => setEditing(entry.teamID)}
 * />
 *
 * @returns {JSX.Element} Submission display component
 */

"use client"

import React from "react"
import styles from "./Submission.module.css"
import Link from "next/link"
import JudgeToolbox from "@/src/components/JudgeToolbox"

/**
 * Interface for submission data
 */
interface SubmissionData {
    /** Team identifier */
    teamID: string
    /** Project title */
    title: string | null
    /** Project description */
    description: string
    /** GitHub repository URL */
    github: string
    /** Hackathon prompt selection */
    prompt: string | null
    /** Technologies used (comma-separated) */
    technologies: string | null
    /** Team members (optional) */
    members?: string
    /** Code submission type or URL */
    sub_code?: string
    /** Video submission URL */
    sub_video?: string
    /** Additional properties */
    [key: string]: unknown
}

/**
 * User interface for session user
 */
interface User {
    /** User email */
    email: string
    /** User access level */
    access: number
    /** Team identifier */
    teamID: string | null
    /** User name */
    name?: string | null
    /** User image */
    image?: string | null
}

/**
 * Props for Submission component
 */
interface SubmissionProps {
    /** Submission data object */
    submission: SubmissionData
    /** Current user object (for permissions) */
    user: User
    /** Callback function when edit is clicked */
    onEdit: () => void
}

/**
 * Submission Component
 *
 * Displays a project submission with all metadata.
 * Judges see edit buttons for modifying submission information.
 *
 * @param {SubmissionProps} props - Component props
 * @returns {JSX.Element} Submission display
 */
const Submission = ({ submission, user, onEdit }: SubmissionProps): React.ReactElement => {
    // Safety check - if no submission, return empty fragment
    if (!submission) {
        return <></>
    }

    return (
        <div className={`${styles.wrap} displayBox`}>
            <div className={styles.outline}>
                <div className={styles.header}>
                    <p className="cGreen medBig serifBold">
                        {submission.title === null ? (
                            <span className="cRed">Untitled Submission</span>
                        ) : (
                            submission.title
                        )}
                        <span className="smallMed">&nbsp;</span>
                        <span className="small cGray serifBold">{submission.teamID}</span>
                    </p>
                    <span className={styles.filler}></span>

                    {/* Show edit button for judges (access level >= 2) */}
                    {user.access >= 2 && (
                        <p className={`${styles.edit} sub serifBold cGreen`}>
                            <a
                                onClick={onEdit}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e: React.KeyboardEvent): void => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        onEdit()
                                    }
                                }}
                            >
                                [Edit]
                            </a>
                        </p>
                    )}
                </div>
                <hr className={styles.padBottom} />

                <p className="cWhite">
                    <span className="serifBold cBlue">Developed by&nbsp;</span>{" "}
                    <span className="">{submission.members || "No team members listed"}</span>
                </p>

                <p className="cWhite">
                    <span className="serifBold cBlue">Built using&nbsp;&nbsp;</span>{" "}
                    <span className="">
                        {submission.technologies === null ? (
                            <span className="cRed">No Technologies Listed</span>
                        ) : (
                            submission.technologies
                        )}
                    </span>
                </p>

                <p className="cWhite">
                    <span className="serifBold cBlue">Chosen prompt</span>{" "}
                    <span className="">
                        {submission.prompt === null ? (
                            <span className="cRed">No Prompt Selected</span>
                        ) : (
                            submission.prompt
                        )}
                    </span>
                </p>
                <br />

                <p className="cWhite">{submission.description}</p>
                <br />

                <span className="console sub">
                    {/* Code and Video links */}
                    <p className="cBlue serifBold">
                        {submission.sub_code === "Github" ? (
                            <a href={submission.github} target="_blank" rel="noopener noreferrer">
                                [View GitHub]
                            </a>
                        ) : submission.sub_code === "NOT SUBMITTED" ? (
                            <span className="cRed">[Code NOT SUBMITTED]</span>
                        ) : (
                            <a href={submission.sub_code} target="_blank" rel="noopener noreferrer">
                                [View Code]
                            </a>
                        )}
                        <span> </span>

                        {submission.sub_video === "NOT SUBMITTED" ? (
                            <span className="cRed">[Video NOT SUBMITTED]</span>
                        ) : (
                            <a href={submission.sub_video} target="_blank" rel="noopener noreferrer">
                                [View Video]
                            </a>
                        )}
                    </p>
                </span>

                {/* JudgeToolbox component - commented out but kept for reference */}
                {/* {user.access >= 2 && (
                    <JudgeToolbox submission={submission} onUpdate={onEdit} />
                )} */}
            </div>
        </div>
    )
}

export default Submission
