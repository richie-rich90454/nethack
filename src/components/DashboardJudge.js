import { useCompetition } from "@/context/CompetitionContext"
import { useEffect, useState } from "react"
import Submission from "./Submission"
import { useSession } from "next-auth/react"
import SubmissionForm from "./SubmissionForm"
import styles from "./DashboardJudge.module.css"

export default function DashboardJudge() {
    const { competitionState } = useCompetition()
    const { data: session } = useSession()

    const [entries, setEntries] = useState([])

    const [editing, setEditing] = useState("")

    const fetchEntries = async () => {
        try {
            const response = await fetch("/api/sql/pullProject")
            if (response.ok) {
                const data = await response.json()
                setEntries(data)
            } else {
                console.error("Failed to fetch entries")
            }
        } catch (error) {
            console.error("Error fetching entries: ", error)
        }
    }

    const refreshData = async () => {
        setEditing("")
        await fetchEntries()
    }

    useEffect(() => {
        fetchEntries()
    }, [])

    // if (competitionState !== "judging") {
    //     return (
    //         <>
    //             <p>Page under construction.</p>
    //         </>
    //     );
    // }

    return (
        <>
            <p>
                <span className="cWhite serifBold big">Dashboard for {session.user.name}</span>
            </p>
            <hr />
            <p className="cBlue">
                As a <span className="serifBold">Judge</span>, this is where you can survey and manage the competition
                submission.
            </p>
            <br />
            <p className="serifBold">The Hackathon submissions for 2025R1 can be found below. Some notes on judging:</p>
            <ul>
                <li>Code, Video, and Project Information (title, description) should be mandatory.</li>
                <li>Github and Technologies list was explicitly stated to be optional. </li>
                <li>Submissions are uniquely identified by teamID.</li>
            </ul>
            <br />
            <p className="serifBold">Some additional notes:</p>
            <ul>
                <li>
                    Since these submissions will eventually be displayed on this site, it is better for submissions to
                    have proper titles and technologies lists
                </li>
                <li>
                    A very basic tool is given on the upper-right corner for you to edit these as needed. This will
                    directly change the entries in our Hackathon database
                </li>
                <li>
                    Links are included for your convenience. However, some may be broken/locked behind login; you may
                    need to go back to the Teams assignment page to see the submission
                </li>
                <li>
                    Additional judging features should be available for future rounds (e.g. Add Comment). For now we
                    suggest you keep organized in external documents :(
                </li>
            </ul>
            <div className={styles.entries}>
                {entries.map(entry =>
                    entry.teamID === editing ? (
                        <SubmissionForm
                            key={entry.teamID}
                            teamID={entry.teamID}
                            readonly={false}
                            onUpdate={refreshData}
                        >
                            <p className="serifBold med">Edit Submission</p>
                            <p>You can add information such as technologies and title.</p>
                        </SubmissionForm>
                    ) : (
                        entry.round == "25R2" && (
                            <Submission
                                key={entry.teamID}
                                submission={entry}
                                user={session.user}
                                onEdit={() => setEditing(entry.teamID)}
                            ></Submission>
                        )
                    )
                )}
            </div>
        </>
    )
}
