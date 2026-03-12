/**
 * Judge Toolbox Component (Enhanced)
 * Rewrite with TypeScript on 2026/3/12
 *
 * Provides a comprehensive judging panel for each submission.
 * Judges can:
 *   - View and edit project title and technologies (existing)
 *   - Assign a numeric score (1–10)
 *   - Write and save a comment
 *   - See previously saved score/comment
 *
 * @component
 * @param {Object} props - Component properties
 * @param {Object} props.submission - Submission object containing project data
 * @param {Function} props.onUpdate - Callback to refresh parent data after any update
 *
 * @example
 * <JudgeToolbox
 *   submission={submission}
 *   onUpdate={refreshData}
 * />
 *
 * @returns {JSX.Element} Full judging panel
 */

"use client"

import styles from "./JudgeToolbox.module.css"
import React, { useState, useEffect } from "react"
import { siteConfig } from "@/config/siteConfig"

/**
 * Interface for submission data (as provided by parent)
 */
interface Submission {
	teamID: string
	title: string
	description: string
	github: string
	prompt: string
	technologies: string
	[key: string]: unknown
}

/**
 * Interface for judge data fetched from the backend
 */
interface JudgeData {
	score?: number
	comment?: string
	reviewed?: boolean
}

/**
 * Props for JudgeToolbox component
 */
interface JudgeToolboxProps {
	submission: Submission
	onUpdate: () => void
}

/**
 * Judge Toolbox Component
 */
const JudgeToolbox = ({
	submission,
	onUpdate,
}: JudgeToolboxProps): React.ReactElement => {
	// State for judge-specific fields
	const [score, setScore] = useState<number>(5)
	const [comment, setComment] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
	const [saved, setSaved] = useState<boolean>(false)

	// Fetch existing judge data on mount
	useEffect(() => {
		const fetchJudgeData = async () => {
			try {
				const response = await fetch(
					`/api/sql/getJudgeData?teamID=${submission.teamID}`,
				)
				if (response.ok) {
					const data = (await response.json()) as JudgeData
					setScore(data.score ?? 5)
					setComment(data.comment ?? "")
				}
			} catch (error) {
				console.error("Error fetching judge data:", error)
			}
		}
		fetchJudgeData()
	}, [submission.teamID])

	/**
	 * Save judge score and comment to the database
	 */
	const handleSaveJudgeData = async () => {
		setLoading(true)
		try {
			const response = await fetch("/api/sql/saveJudgeData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					teamID: submission.teamID,
					score,
					comment,
				}),
			})
			if (response.ok) {
				setSaved(true)
				setTimeout(() => setSaved(false), 2000)
				onUpdate() // refresh parent if needed
			} else {
				console.error("Failed to save judge data")
			}
		} catch (error) {
			console.error("Error saving judge data:", error)
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Update submission title/technologies (existing functionality)
	 */
	const changeEntries = async (newTitle: string, newTech: string) => {
		const data = {
			teamID: submission.teamID,
			title: newTitle,
			description: submission.description,
			github: submission.github,
			prompt: submission.prompt,
			technologies: newTech,
		}
		try {
			const response = await fetch("/api/sql/editProject", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			})
			if (response.ok) {
				onUpdate()
			} else {
				const result = (await response.json()) as { message?: string }
				console.error("Error: " + (result.message || "Unknown error"))
			}
		} catch (error) {
			console.error("Error:", error)
		}
	}

	const handleEditTitle = () => {
		const newTitle = prompt("Enter a new title:", submission.title)
		if (newTitle && newTitle !== submission.title) {
			changeEntries(newTitle, submission.technologies)
		}
	}

	const handleEditTechs = () => {
		const newTech = prompt(
			"Enter a new technologies list:",
			submission.technologies,
		)
		if (newTech && newTech !== submission.technologies) {
			changeEntries(submission.title, newTech)
		}
	}

	return (
		<div className={`${styles.wrap} smallMed judgeTools serifBold`}>
			{/* Existing edit buttons */}
			<div className={styles.editSection}>
				<span className="small cRed">
					{siteConfig.judgeToolbox.title}
				</span>
				<div className={styles.buttonGroup}>
					<button
						className="button"
						onClick={handleEditTitle}
						aria-label={siteConfig.judgeToolbox.editTitle}
					>
						{siteConfig.judgeToolbox.editTitle}
					</button>
					<button
						className="button"
						onClick={handleEditTechs}
						aria-label={siteConfig.judgeToolbox.editTechs}
					>
						{siteConfig.judgeToolbox.editTechs}
					</button>
				</div>
			</div>

			{/* Scoring and comments section */}
			<div className={styles.judgeSection}>
				<label htmlFor={`score-${submission.teamID}`} className="cBlue">
					Score (1–10):
				</label>
				<input
					id={`score-${submission.teamID}`}
					type="range"
					min="1"
					max="10"
					value={score}
					onChange={(e) => setScore(parseInt(e.target.value, 10))}
					className={styles.scoreSlider}
				/>
				<span className={styles.scoreValue}>{score}</span>

				<label
					htmlFor={`comment-${submission.teamID}`}
					className="cBlue"
				>
					Comment:
				</label>
				<textarea
					id={`comment-${submission.teamID}`}
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					rows={3}
					className={styles.commentBox}
					placeholder="Enter your comments here..."
				/>

				<button
					className={`button ${styles.saveButton}`}
					onClick={handleSaveJudgeData}
					disabled={loading}
				>
					{loading
						? "Saving..."
						: saved
							? "✓ Saved"
							: "Save Judgement"}
				</button>
			</div>
		</div>
	)
}

export default JudgeToolbox
