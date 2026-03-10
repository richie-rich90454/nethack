/**
 * Judge Toolbox Component
 * Rewrite with TypeScript on 2026/3/10 (1773140683)
 *
 * Provides a set of tools for judges to edit submission metadata.
 * Allows editing of title and technologies fields directly in the database.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.submission - Submission object containing project data
 * @param {Function} props.onUpdate - Callback function to refresh data after update
 *
 * @example
 * <JudgeToolbox
 *   submission={submission}
 *   onUpdate={refreshData}
 * />
 *
 * @returns {JSX.Element} Judge tools panel with edit buttons
 */

"use client"

import styles from "./JudgeToolbox.module.css"
import React from "react"

/**
 * Interface for submission data
 */
interface Submission {
    /** Team identifier */
    teamID: string
    /** Project title */
    title: string
    /** Project description */
    description: string
    /** GitHub repository URL */
    github: string
    /** Hackathon prompt selection */
    prompt: string
    /** Technologies used (comma-separated) */
    technologies: string
    /** Additional properties */
    [key: string]: unknown
}

/**
 * Props for JudgeToolbox component
 */
interface JudgeToolboxProps {
    /** Submission object containing project data */
    submission: Submission
    /** Callback function to refresh data after update */
    onUpdate: () => void
}

/**
 * Judge Toolbox Component
 *
 * Provides tools for judges to edit submission metadata directly.
 *
 * @param {JudgeToolboxProps} props - Component props
 * @returns {JSX.Element} Judge tools panel
 */
const JudgeToolbox = ({ submission, onUpdate }: JudgeToolboxProps): React.ReactElement => {
    /**
     * Update submission entries in the database
     *
     * @param {string} newTitle - Updated title
     * @param {string} newTech - Updated technologies list
     */
    const changeEntries = async (newTitle: string, newTech: string): Promise<void> => {
        const data = {
            teamID: submission.teamID,
            title: newTitle,
            description: submission.description,
            github: submission.github,
            prompt: submission.prompt,
            technologies: newTech
        }

        try {
            const response = await fetch("api/sql/editProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = (await response.json()) as { message?: string }

            if (response.ok) {
                onUpdate()
            } else {
                console.error("Error: " + (result.message || "Unknown error"))
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    /**
     * Handle edit title button click
     */
    const handleEditTitle = (): void => {
        const newTitle = prompt("Enter a new title:")
        if (newTitle) {
            changeEntries(newTitle, submission.technologies)
        }
    }

    /**
     * Handle edit technologies button click
     */
    const handleEditTechs = (): void => {
        const newTech = prompt("Enter a new technologies list:")
        if (newTech) {
            changeEntries(submission.title, newTech)
        }
    }

    /**
     * Handle add comment button click (placeholder for future functionality)
     */
    const handleAddComment = (): void => {
        // Placeholder for future comment functionality
        alert("Comment functionality coming soon!")
    }

    return (
        <div className={`${styles.wrap} smallMed judgeTools serifBold`}>
            <span className="small cRed">
                Judge Tools
                <br />
            </span>
            <span
                className="button"
                onClick={handleEditTitle}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent): void => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleEditTitle()
                    }
                }}
            >
                Edit Title
            </span>
            <span
                className="button"
                onClick={handleEditTechs}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent): void => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleEditTechs()
                    }
                }}
            >
                Edit Techs
            </span>
            <span
                className="button"
                onClick={handleAddComment}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent): void => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleAddComment()
                    }
                }}
            >
                Add Comment
            </span>
        </div>
    )
}

export default JudgeToolbox
