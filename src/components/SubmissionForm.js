import { useEffect, useState } from "react"

const iconSave = (
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
const iconCheck = (
    <span className="iconCheck">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" />
        </svg>
    </span>
)

export default function SubmissionForm({ children, teamID, readonly, onUpdate }) {
    const [members, setMembers] = useState("")

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [github, setGithub] = useState("")
    const [prompt, setPrompt] = useState("")
    const [technologies, setTechnologies] = useState("")

    const fetchEntry = async () => {
        const response = await fetch("/api/sql/pullProject?search=" + teamID)
        if (response.ok) {
            const data = await response.json()
            setTitle(data[0]?.title)
            setMembers(data[0]?.members)
            setDescription(data[0]?.description)
            setGithub(data[0]?.github)
            setPrompt(data[0]?.prompt)
            setTechnologies(data[0]?.technologies)
        } else {
            console.error("Failed to fetch entry")
        }
    }

    const editEntry = async event => {
        event.preventDefault() // Do not submit the form

        if (readonly) return

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

            const result = await response.json()
            if (response.ok) {
                onUpdate()
                fetchEntry()
            } else {
                console.error("Error: " + result.message)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    useEffect(() => {
        fetchEntry()
    }, []) // empty array means this runs only once on mount, not on re-render

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
                                    defaultValue={title}
                                    onChange={e => setTitle(e.target.value)}
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
                                            defaultValue={description}
                                            onChange={e => setDescription(e.target.value)}
                                            rows="15"
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
                                                    onChange={e => setPrompt(e.target.value)}
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
                                            defaultValue={technologies}
                                            onChange={e => setTechnologies(e.target.value)}
                                            rows="3"
                                            readOnly={readonly}
                                        />
                                    </span>
                                    <span className="inputWrap">
                                        Link to Github (optional)
                                        <textarea
                                            className="txtBox txtArea med serifItalic"
                                            placeholder="https://..."
                                            defaultValue={github}
                                            onChange={e => setGithub(e.target.value)}
                                            rows="3"
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
