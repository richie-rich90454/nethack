import CountdownMini from "@/components/CountdownMini"
import { useCompetition } from "@/context/CompetitionContext"
import { useSession } from "next-auth/react"
import SubmissionForm from "./SubmissionForm"

// for user.access === 1
export default function DashboardCompetitor() {
    const { data: session } = useSession()
    const { competitionState } = useCompetition()

    const isClosed = competitionState === "closed"
    const isActive = competitionState === "active"
    const isJudging = competitionState === "judging"

    return (
        <>
            <h1>Dashboard for {session.user.name}</h1>
            <hr />
            <p className="cBlue">
                As a <span className="serifBold">competitor</span>, this is where you can view the progress of the
                competition and your project.
            </p>
            <p className="cYellow padEnd">
                The 2025 Network Hackathon is currently in the&nbsp;
                <span className={`qBox ${competitionState == "closed" ? "serifBold serifUnderline" : ""}`}>
                    Closed
                    <span className="tooltip">
                        The Hackathon is <span className="serifBold">Closed</span>. It is currently not accepting work,
                        meaning you may not edit or submit files at this time.
                    </span>
                </span>
                &nbsp;&gt;&nbsp;
                <span className={`qBox ${competitionState == "active" ? "serifBold serifUnderline" : ""}`}>
                    Active
                    <span className="tooltip">
                        The Hackathon is <span className="serifBold">Active</span>. You have this time to complete all
                        aspects of your project submission. Be mindful of the stated deadline and carefully follow the
                        instructions given on this page.
                    </span>
                </span>
                &nbsp;&gt;&nbsp;
                <span className={`qBox ${competitionState == "judging" ? "serifBold serifUnderline" : ""}`}>
                    Review
                    <span className="tooltip">
                        The Hackathon is <span className="serifBold">Under Review</span>. You are no longer able to edit
                        your submission as it is being reviewed by judges and packaged for presentation.
                    </span>
                </span>{" "}
                phase.
            </p>
            {isClosed && (
                <>
                    <br />
                    <div className="projBox cYellow padBottom">
                        <p className="serifBold med">Hackathon is Closed</p>
                        <p>
                            Time remaining:{" "}
                            <span className="bSmooth console">
                                <CountdownMini targetDate="2025-02-17T08:59:59Z"></CountdownMini>
                            </span>
                        </p>
                    </div>
                </>
            )}
            {(isActive || isJudging) && (
                <SubmissionForm teamID={session.user.teamID} readonly={!isActive}>
                    {isActive && (
                        <>
                            <p className="serifBold med">Hackathon is Active</p>
                            <p>
                                Time remaining:{" "}
                                <span className="bSmooth console">
                                    <CountdownMini targetDate="2025-05-30T23:59:59+0800"></CountdownMini>
                                </span>
                            </p>
                        </>
                    )}
                    {isJudging && (
                        <>
                            <p className="serifBold med">Hackathon is Under Review</p>
                            <p>Edits can no longer be made.</p>
                        </>
                    )}
                </SubmissionForm>
            )}
        </>
    )
}
