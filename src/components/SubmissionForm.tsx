import React, { useEffect, useState, ChangeEvent, FormEvent } from "react"

/**
 * Icon components for form actions
 * Rewrite with TypeScript on 2026/3/10 (1773140856)
 */
const iconSave: React.ReactElement = (
    <span className="iconSave">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="currentColor"
            transform="translate(0,-.6)"
            viewBox="0 0 16 16"
        >
            <path d="M11 2H9v3h2z" />
            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z" />
        </svg>
    </span>
)

const iconCheck: React.ReactElement = (
    <span className="iconCheck">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
        </svg>
    </span>
)

/**
 * Interface for submission data from API
 */
interface SubmissionData {
    id?: number
    teamID: string
    title: string | null
    members?: string
    description: string | null
    github: string | null
    prompt: string | null
    technologies: string | null
    [key: string]: unknown
}

/**
 * Props for SubmissionForm component
 */
interface SubmissionFormProps {
    /** Child elements to render above the form */
    children?: React.ReactNode
    /** Team ID for the submission */
    teamID?: string
    /** Whether the form is read-only */
    readonly: boolean
    /** Callback function after successful update */
    onUpdate: () => void
}

/**
 * Submission Form Component
 *
 * Provides a form for competitors to submit and edit their project details.
 * Judges may also use this form in read-only mode or for editing.
 *
 * @param {SubmissionFormProps} props - Component props
 * @returns {JSX.Element} Submission form
 */
export default function SubmissionForm({
    children,
    teamID,
    readonly,
    onUpdate
}: SubmissionFormProps): React.ReactElement {
    const [members, setMembers] = useState<string>("")
    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [github, setGithub] = useState<string>("")
    const [prompt, setPrompt] = useState<string>("")
    const [technologies, setTechnologies] = useState<string>("")

    /**
     * Fetch existing submission data for this team
     */
    const fetchEntry = async (): Promise<void> => {
        if (!teamID) return

        const response = await fetch("/api/sql/pullProject?search=" + teamID)
        if (response.ok) {
            const data = (await response.json()) as SubmissionData[]
            setTitle(data[0]?.title || "")
            setMembers(data[0]?.members || "")
            setDescription(data[0]?.description || "")
            setGithub(data[0]?.github || "")
            setPrompt(data[0]?.prompt || "")
            setTechnologies(data[0]?.technologies || "")
        } else {
            console.error("Failed to fetch entry")
        }
    }

    /**
     * Handle form submission to update project data
     */
    const editEntry = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault() // Do not submit the form

        if (readonly || !teamID) return

        const data = {
            teamID,
            title,
            description,
            github,
            prompt,
            technologies
        }

        try {
            const response = await fetch("/api/sql/editProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = (await response.json()) as { message?: string }

            if (response.ok) {
                onUpdate()
                fetchEntry()
            } else {
                console.error("Error: " + (result.message || "Unknown error"))
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    // Fetch entry on component mount
    useEffect(() => {
        fetchEntry()
    }, []) // empty array means this runs only once on mount, not on re-render

    // If no teamID, don't render
    if (!teamID) {
        return <></>
    }

    return (
        <>
            <div className="flexBox">
                <div className="leftBox">
                    <div className="projBox cYellow padBottom">{children}</div>
                    <div className="projBox console cBlue">
                        <p className="serifBold med">Project Checklist</p>
                        <p>
                            Your team: <span className="serifBold">{members}</span>
                        </p>
                        <br />
                        <p className="wrapCheckbox">
                            <label className="labelCheckbox">
                                <input type="checkbox" />
                                {iconCheck}
                            </label>
                            {/* TODO: this. Custom checkbox implemented below. Checklist should contain all required
                             *       Hackathon deliverables (video, code, title/description) etc */}
                            {/* TODO: file upload. See Pitch Perfect */}
                            Checklist Coming Soon
                        </p>
                        {/* <p className="wrapCheckbox"><label className="labelCheckbox">
                            <input type="checkbox" />
                            {iconCheck} 
                        </label>
                        Hello Test</p> */}
                    </div>
                </div>
                <div className="rightBox">
                    {/* TODO: refactor this. This entire form should be a Component. Pass an argument to the Component
                     *       to state whether the form should be editable. */}
                    <form onSubmit={editEntry}>
                        <div className="projBox console">
                            {!readonly && <button type="submit">{iconSave}</button>}
                            <span className="inputWrap">
                                <input
                                    className="titleInput txtBox medBig serifBold"
                                    type="text"
                                    placeholder="Project Title"
                                    value={title}
                                    onChange={(e: ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value)}
                                    readOnly={readonly}
                                />
                            </span>
                            <div className="flexBox clientWrap">
                                <div className="leftBoxInv">
                                    <span className="inputWrap">
                                        Project Description
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder="Describe your project in 3-8 sentences."
                                            value={description}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                                                setDescription(e.target.value)
                                            }
                                            rows={15}
                                            readOnly={readonly}
                                        />
                                    </span>
                                </div>

                                <div className="rightBoxInv">
                                    Prompt Select
                                    <div className="txtArea promptArea">
                                        <p className="wrapRadio">
                                            <label className="labelRadio">
                                                <input
                                                    type="radio"
                                                    value="Game Jam"
                                                    checked={prompt === "Game Jam"}
                                                    onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                                        setPrompt(e.target.value)
                                                    }
                                                    disabled={readonly}
                                                />
                                                <span className="iconRadio"></span>
                                            </label>
                                            Game Jam
                                        </p>
                                    </div>
                                    <span className="inputWrap">
                                        List of technologies (optional)
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder="e.g. Javascript, Python, numpy, Scratch"
                                            value={technologies}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                                                setTechnologies(e.target.value)
                                            }
                                            rows={3}
                                            readOnly={readonly}
                                        />
                                    </span>
                                    <span className="inputWrap">
                                        Link to Github (optional)
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder="https://..."
                                            value={github}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                                                setGithub(e.target.value)
                                            }
                                            rows={3}
                                            readOnly={readonly}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
