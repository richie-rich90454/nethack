/**
 * Submission Present Component
 * Rewrite with TypeScript on 2026/3/10
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
import { siteConfig } from "@/config/siteConfig"

/**
 * Interface for submission data
 */
interface SubmissionData {
	teamID: string
	title: string | null
	members?: string
	description: string
	github: string
	prompt: string | null
	technologies: string | null
	sub_code?: string
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
const SubmissionPresent = ({
	submission,
	override,
}: SubmissionPresentProps): React.ReactElement => {
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
						<img
							src={`/25R1/${submission.teamID}.jpg`}
							alt={`${submission.title} project thumbnail`}
						/>
						<div className={styles.play}>{iconPlay}</div>
					</div>
				</a>
				<div className={styles.text}>
					<p className="cWhite medBig serifBold">
						{submission.title === null ? (
							<span className="cRed">
								{siteConfig.submission.untitled}
							</span>
						) : (
							submission.title
						)}
						<span className="smallMed">&nbsp;</span>
					</p>
					<hr />
					<p className="cWhite ">
						{siteConfig.submission.developedBy}{" "}
						<span className="serifBold cBlue">
							{submission.members || "Unknown"}
						</span>
					</p>
					<p className="cWhite">
						{siteConfig.submission.builtUsing}{" "}
						<span className="serifBold cGreen">
							{submission.technologies === null ? (
								<span className="cRed">
									{siteConfig.submission.noTechnologies}
								</span>
							) : (
								submission.technologies
							)}
						</span>
					</p>

					<p className="cWhite">
						<span className="cYellow serifBold">
							{submission.prompt ||
								siteConfig.submission.noPrompt}{" "}
						</span>
						| {submission.description}
					</p>
					<br />
					<p>
						{siteConfig.submission.shareUrl}{" "}
						<a
							className="console"
							href={`https://nethack.biszweb.club/showcase#${submission.teamID}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							https://nethack.biszweb.club/showcase#
							{submission.teamID}
						</a>
					</p>
					<p>
						{siteConfig.submission.downloadCode}{" "}
						{submission.sub_code === "Github" ? (
							<a
								href={submission.github}
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteConfig.submission.viewGithub}
							</a>
						) : (
							<a
								href={`/25R1/${submission.teamID}/${submission.title}.zip`}
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteConfig.submission.compressedFolder}
							</a>
						)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default SubmissionPresent
