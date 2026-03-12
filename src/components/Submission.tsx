"use client"

import React from "react"
import styles from "./Submission.module.css"
import { siteConfig } from "@/config/siteConfig"

interface SubmissionData {
	teamID: string
	title: string | null
	description: string
	github: string
	prompt: string | null
	technologies: string | null
	members?: string
	sub_code?: string
	sub_video?: string
	[key: string]: unknown
}

interface User {
	email: string
	access: number
	teamID: string | null
	name?: string | null
	image?: string | null
}

interface SubmissionProps {
	submission: SubmissionData
	user: User
	onEdit: () => void
}

const Submission = ({
	submission,
	user,
	onEdit,
}: SubmissionProps): React.ReactElement => {
	if (!submission) {
		return <></>
	}

	return (
		<div className={`${styles.wrap} displayBox`}>
			<div className={styles.outline}>
				<div className={styles.header}>
					<p className="cGreen medBig serifBold">
						{submission.title === null ? (
							<span className="cRed">
								{siteConfig.submission.untitled}
							</span>
						) : (
							submission.title
						)}
						<span className="smallMed">&nbsp;</span>
						<span className="small cGray serifBold">
							{submission.teamID}
						</span>
					</p>
					<span className={styles.filler}></span>

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
					<span className="serifBold cBlue">
						{siteConfig.submission.developedBy}&nbsp;
					</span>{" "}
					<span className="">
						{submission.members || "No team members listed"}
					</span>
				</p>

				<p className="cWhite">
					<span className="serifBold cBlue">
						{siteConfig.submission.builtUsing}&nbsp;&nbsp;
					</span>{" "}
					<span className="">
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
					<span className="serifBold cBlue">
						{siteConfig.submission.chosenPrompt}
					</span>{" "}
					<span className="">
						{submission.prompt === null ? (
							<span className="cRed">
								{siteConfig.submission.noPrompt}
							</span>
						) : (
							submission.prompt
						)}
					</span>
				</p>
				<br />

				<p className="cWhite">{submission.description}</p>
				<br />

				<span className="console sub">
					<p className="cBlue serifBold">
						{submission.sub_code === "Github" ? (
							<a
								href={submission.github}
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteConfig.submission.viewGithub}
							</a>
						) : submission.sub_code === "NOT SUBMITTED" ? (
							<span className="cRed">
								{siteConfig.submission.codeNotSubmitted}
							</span>
						) : (
							<a
								href={submission.sub_code}
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteConfig.submission.viewCode}
							</a>
						)}
						<span> </span>

						{submission.sub_video === "NOT SUBMITTED" ? (
							<span className="cRed">
								{siteConfig.submission.videoNotSubmitted}
							</span>
						) : (
							<a
								href={submission.sub_video}
								target="_blank"
								rel="noopener noreferrer"
							>
								{siteConfig.submission.viewVideo}
							</a>
						)}
					</p>
				</span>
			</div>
		</div>
	)
}

export default Submission
