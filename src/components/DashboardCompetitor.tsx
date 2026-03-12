import React from "react";
import CountdownMini from "@/src/components/CountdownMini";
import { useCompetition } from "@/src/context/CompetitionContext";
import { useSession } from "next-auth/react";
import SubmissionForm from "./SubmissionForm";
import { siteConfig } from "@/config/siteConfig";
import styles from "./DashboardCompetitor.module.css";

export default function DashboardCompetitor(): React.ReactElement {
	const { data: session } = useSession();
	const { competitionState } = useCompetition();

	const isClosed = competitionState === "closed";
	const isActive = competitionState === "active";
	const isJudging = competitionState === "judging";

	if (!session?.user) {
		return <p>Loading user information...</p>;
	}

	const handleUpdate = async (): Promise<void> => {
		console.log("Submission updated");
	};

	return (
		<div className={styles.wrapper}>
			<h1>
				{siteConfig.dashboardCompetitor.heading.replace(
					"{name}",
					session.user.name || "",
				)}
			</h1>
			<hr />
			<p className="cBlue">{siteConfig.dashboardCompetitor.intro}</p>
			<p className="cYellow padEnd">
				The 2025 Network Hackathon is currently in the&nbsp;
				<span
					className={`qBox ${competitionState === "closed" ? "serifBold serifUnderline" : ""}`}
				>
					{siteConfig.dashboardCompetitor.phaseIndicator.closed.label}
					<span className="tooltip">
						{
							siteConfig.dashboardCompetitor.phaseIndicator.closed
								.tooltip
						}
					</span>
				</span>
				&nbsp;&gt;&nbsp;
				<span
					className={`qBox ${competitionState === "active" ? "serifBold serifUnderline" : ""}`}
				>
					{siteConfig.dashboardCompetitor.phaseIndicator.active.label}
					<span className="tooltip">
						{
							siteConfig.dashboardCompetitor.phaseIndicator.active
								.tooltip
						}
					</span>
				</span>
				&nbsp;&gt;&nbsp;
				<span
					className={`qBox ${competitionState === "judging" ? "serifBold serifUnderline" : ""}`}
				>
					{
						siteConfig.dashboardCompetitor.phaseIndicator.judging
							.label
					}
					<span className="tooltip">
						{
							siteConfig.dashboardCompetitor.phaseIndicator
								.judging.tooltip
						}
					</span>
				</span>{" "}
				phase.
			</p>

			{isClosed && (
				<>
					<br />
					<div className="projBox cYellow padBottom">
						<p className="serifBold med">
							{siteConfig.dashboardCompetitor.closedMessage.title}
						</p>
						<p>
							{
								siteConfig.dashboardCompetitor.closedMessage
									.timeRemainingLabel
							}{" "}
							<span className="bSmooth console">
								<CountdownMini
									targetDate={
										siteConfig.dashboardCompetitor
											.closedMessage.countdownDate
									}
								/>
							</span>
						</p>
					</div>
				</>
			)}

			{(isActive || isJudging) && (
				<SubmissionForm
					teamID={session.user.teamID ?? undefined}
					readonly={!isActive}
					onUpdate={handleUpdate}
				>
					{isActive && (
						<>
							<p className="serifBold med">
								{
									siteConfig.dashboardCompetitor.activeMessage
										.title
								}
							</p>
							<p>
								{
									siteConfig.dashboardCompetitor.activeMessage
										.timeRemainingLabel
								}{" "}
								<span className="bSmooth console">
									<CountdownMini
										targetDate={
											siteConfig.dashboardCompetitor
												.activeMessage.countdownDate
										}
									/>
								</span>
							</p>
						</>
					)}
					{isJudging && (
						<>
							<p className="serifBold med">
								{
									siteConfig.dashboardCompetitor
										.judgingMessage.title
								}
							</p>
							<p>
								{
									siteConfig.dashboardCompetitor
										.judgingMessage.message
								}
							</p>
						</>
					)}
				</SubmissionForm>
			)}
		</div>
	);
}
