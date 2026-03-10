/**
 * Submission Form Component
 * Rewrite with TypeScript on 2026/3/10
 *
 * Provides a form for competitors to submit and edit their project details.
 * Judges may also use this form in read-only mode or for editing.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child elements to render above the form
 * @param {string} props.teamID - Team ID for the submission
 * @param {boolean} props.readonly - Whether the form is read-only
 * @param {Function} props.onUpdate - Callback function after successful update
 * @returns {JSX.Element} Submission form
 */

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { siteConfig } from "@/config/siteConfig"

/**
 * Icon components for form actions
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
    children?: React.ReactNode
    teamID?: string
    readonly: boolean
    onUpdate: () => void
}

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

    const editEntry = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

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

    useEffect(() => {
        fetchEntry()
    }, [])

    if (!teamID) {
        return <></>
    }

    return (
        <>
            <div className="flexBox">
                <div className="leftBox">
                    <div className="projBox cYellow padBottom">{children}</div>
                    <div className="projBox console cBlue">
                        <p className="serifBold med">{siteConfig.submissionForm.checklistTitle}</p>
                        <p>
                            {siteConfig.submissionForm.yourTeamLabel} <span className="serifBold">{members}</span>
                        </p>
                        <br />
                        <p className="wrapCheckbox">
                            <label className="labelCheckbox">
                                <input type="checkbox" />
                                {iconCheck}
                            </label>
                            {siteConfig.submissionForm.checklistComingSoon}
                        </p>
                    </div>
                </div>
                <div className="rightBox">
                    <form onSubmit={editEntry}>
                        <div className="projBox console">
                            {!readonly && (
                                <button type="submit" aria-label={siteConfig.submissionForm.saveButtonAria}>
                                    {iconSave}
                                </button>
                            )}
                            <span className="inputWrap">
                                <input
                                    className="titleInput txtBox medBig serifBold"
                                    type="text"
                                    placeholder={siteConfig.submissionForm.projectTitlePlaceholder}
                                    value={title}
                                    onChange={(e: ChangeEvent<HTMLInputElement>): void => setTitle(e.target.value)}
                                    readOnly={readonly}
                                />
                            </span>
                            <div className="flexBox clientWrap">
                                <div className="leftBoxInv">
                                    <span className="inputWrap">
                                        {siteConfig.submissionForm.descriptionLabel}
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder={siteConfig.submissionForm.descriptionPlaceholder}
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
                                    {siteConfig.submissionForm.promptSelectLabel}
                                    <div className="txtArea promptArea">
                                        {siteConfig.submissionForm.prompts.map((promptValue, index) => (
                                            <p key={index} className="wrapRadio">
                                                <label className="labelRadio">
                                                    <input
                                                        type="radio"
                                                        value={promptValue}
                                                        checked={prompt === promptValue}
                                                        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                                            setPrompt(e.target.value)
                                                        }
                                                        disabled={readonly}
                                                    />
                                                    <span className="iconRadio"></span>
                                                </label>
                                                {promptValue}
                                            </p>
                                        ))}
                                    </div>
                                    <span className="inputWrap">
                                        {siteConfig.submissionForm.technologiesLabel}
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder={siteConfig.submissionForm.technologiesPlaceholder}
                                            value={technologies}
                                            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                                                setTechnologies(e.target.value)
                                            }
                                            rows={3}
                                            readOnly={readonly}
                                        />
                                    </span>
                                    <span className="inputWrap">
                                        {siteConfig.submissionForm.githubLabel}
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder={siteConfig.submissionForm.githubPlaceholder}
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
