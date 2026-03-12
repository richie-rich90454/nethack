import { useCompetition } from "@/src/context/CompetitionContext"
import { useEffect, useState } from "react"
import Submission from "./Submission"
import JudgeToolbox from "./JudgeToolbox"
import { useSession } from "next-auth/react"
import SubmissionForm from "./SubmissionForm"
import styles from "./DashboardJudge.module.css"
import { siteConfig } from "@/config/siteConfig"

interface ProjectSubmission {
	id: number
	teamID: string
	title: string
	description: string
	github: string
	prompt: string
	technologies: string
	members?: string
	sub_code?: string
	sub_video?: string
	round?: string
	submission_date?: string
	status?: string
	[key: string]: unknown
}

export default function DashboardJudge(): React.ReactElement {
	const { competitionState } = useCompetition()
	const { data: session } = useSession()

	const [entries, setEntries] = useState<ProjectSubmission[]>([])
	const [editing, setEditing] = useState<string>("")

	const fetchEntries = async (): Promise<void> => {
		try {
			const response = await fetch("/api/sql/pullProject")
			if (response.ok) {
				const data = await response.json()
				// Transform API response to match ProjectSubmission interface
				const transformed: ProjectSubmission[] = data.map(
					(item: any) => ({
						id: item.id,
						teamID: item.teamID,
						// Use the new column names if present, otherwise fall back to old names
						title: item.title || item.project_name || "Untitled",
						description: item.description || "",
						github: item.github || item.submission_url || "",
						prompt: item.prompt || "",
						technologies: item.technologies || "",
						members: item.members || "",
						sub_code: item.sub_code || "Github",
						sub_video: item.sub_video || "NOT SUBMITTED",
						round: item.round || "",
						submission_date: item.submission_date,
						status: item.status,
					}),
				)
				setEntries(transformed)
			} else {
				console.error("Failed to fetch entries")
			}
		} catch (error) {
			console.error("Error fetching entries: ", error)
		}
	}

	const refreshData = async (): Promise<void> => {
		setEditing("")
		await fetchEntries()
	}

	useEffect(() => {
		fetchEntries()
	}, [])

	if (!session?.user) {
		return <p>Loading user information...</p>
	}

	return (
		<>
			<p>
				<span className="cWhite serifBold big">
					{siteConfig.dashboardJudge.heading.replace(
						"{name}",
						session.user.name || "",
					)}
				</span>
			</p>
			<hr />
			<p className="cBlue">{siteConfig.dashboardJudge.intro}</p>
			<br />
			<p className="serifBold">
				{siteConfig.dashboardJudge.judgingNotes[0]}
			</p>
			<ul>
				{siteConfig.dashboardJudge.judgingNotes.map((note, i) => (
					<li key={i}>{note}</li>
				))}
			</ul>
			<br />
			<p className="serifBold">Some additional notes:</p>
			<ul>
				{siteConfig.dashboardJudge.additionalNotes.map((note, i) => (
					<li key={i}>{note}</li>
				))}
			</ul>

			<div className={styles.entries}>
				{entries.map((entry) =>
					entry.teamID === editing ? (
						// Edit mode: show SubmissionForm
						<SubmissionForm
							key={entry.teamID}
							teamID={entry.teamID}
							readonly={false}
							onUpdate={refreshData}
						>
							<p className="serifBold med">
								{siteConfig.dashboardJudge.editForm.title}
							</p>
							<p>
								{siteConfig.dashboardJudge.editForm.description}
							</p>
						</SubmissionForm>
					) : (
						// Normal view: show Submission + JudgeToolbox
						<div
							key={entry.teamID}
							className={styles.entryWithTools}
						>
							<Submission
								submission={entry}
								user={session.user}
								onEdit={() => setEditing(entry.teamID)}
							/>
							<JudgeToolbox
								submission={entry}
								onUpdate={refreshData}
							/>
						</div>
					),
				)}
			</div>
		</>
	)
}
