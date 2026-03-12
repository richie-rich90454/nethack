import React from "react";
import styles from "./Submission.module.css";
import { siteConfig } from "@/config/siteConfig";

interface SubmissionData {
	teamID: string;
	title: string | null;
	description: string;
	github: string;
	prompt: string | null;
	technologies: string | null;
	members?: string;
	sub_code?: string;
	sub_video?: string;
	[key: string]: unknown;
}

interface User {
	email: string;
	access: number;
	teamID: string | null;
	name?: string | null;
	image?: string | null;
}

interface SubmissionProps {
	submission: SubmissionData;
	user: User;
	onEdit: () => void;
}

const Submission = ({
	submission,
	user,
	onEdit,
}: SubmissionProps): React.ReactElement => {
	if (!submission) return <></>;

	return (
		<div className={styles.wrap}>
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
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ")
										onEdit();
								}}
							>
								[Edit]
							</a>
						</p>
					)}
				</div>

				<div className={styles.teamInfo}>
					<span className="serifBold cBlue">
						{siteConfig.submission.developedBy}&nbsp;
					</span>
					<span>
						{submission.members || "No team members listed"}
					</span>
				</div>

				<div className={styles.contentGrid}>
					{/* Left column – description */}
					<div className={styles.descriptionColumn}>
						<p className={styles.metadataLabel}>
							Project Description
						</p>
						<p className={styles.metadataValue}>
							{submission.description}
						</p>
					</div>

					{/* Right column – metadata */}
					<div className={styles.metadataColumn}>
						<div className={styles.metadataItem}>
							<span className={styles.metadataLabel}>
								{siteConfig.submission.chosenPrompt}
							</span>
							<span
								className={`${styles.metadataValue} ${styles.promptBadge}`}
							>
								{submission.prompt === null ? (
									<span className="cRed">
										{siteConfig.submission.noPrompt}
									</span>
								) : (
									submission.prompt
								)}
							</span>
						</div>

						<div className={styles.metadataItem}>
							<span className={styles.metadataLabel}>
								{siteConfig.submission.builtUsing}
							</span>
							<span className={styles.metadataValue}>
								{submission.technologies === null ? (
									<span className="cRed">
										{siteConfig.submission.noTechnologies}
									</span>
								) : (
									submission.technologies
								)}
							</span>
						</div>

						<div className={styles.metadataItem}>
							<span className={styles.metadataLabel}>GitHub</span>
							<span className={styles.metadataValue}>
								{submission.github ? (
									<a
										href={submission.github}
										target="_blank"
										rel="noopener noreferrer"
									>
										{submission.github}
									</a>
								) : (
									<span className="cRed">Not provided</span>
								)}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.links}>
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
				</div>
			</div>
		</div>
	);
};

export default Submission;
