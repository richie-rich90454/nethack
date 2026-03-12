import { useCompetition } from "@/src/context/CompetitionContext"
import { useEffect, useState } from "react"
import Submission from "./Submission"
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
				// Transform each item to match Submission component's expectations
				const transformed = data.map((item: any) => ({
					id: item.id,
					teamID: item.teamID,
					title: item.project_name || "Untitled",
					description: item.description || "",
					github: item.submission_url || "",
					prompt: "", // Add a default or map from somewhere
					technologies: "", // Add a default or map from somewhere
					members: "", // Add if available
					sub_code: "Github", // or "NOT SUBMITTED" as needed
					sub_video: "NOT SUBMITTED",
					submission_date: item.submission_date,
					status: item.status,
				}))
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
				{entries.map((entry: ProjectSubmission) =>
					entry.teamID === editing ? (
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
						entry.round === "25R2" && (
							<Submission
								key={entry.teamID}
								submission={entry}
								user={session.user}
								onEdit={(): void => setEditing(entry.teamID)}
							/>
						)
					),
				)}
			</div>
		</>
	)
}
