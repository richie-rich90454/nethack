"use client"
import styles from "./JudgeToolbox.module.css"
import React from "react"
import { useEffect, useState } from "react"

const JudgeToolbox = ({ submission, onUpdate }) => {
    const [title, setTitle] = useState(submission.title)
    const [technologies, setTechnologies] = useState(submission.technologies)

    const changeEntries = async (newTitle, newTech) => {
        const data = {
            teamID: submission.teamID,
            title: newTitle,
            description: submission.description,
            github: submission.github,
            prompt: submission.prompt,
            technologies: newTech
        }

        try {
            const response = await fetch("api/sql/editProject", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (response.ok) {
                onUpdate()
            } else {
                console.error("Error: " + result.message)
            }
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return (
        <div className={`${styles.wrap} smallMed judgeTools serifBold`}>
            <span className="small cRed">
                Judge Tools
                <br />
            </span>
            <span
                className="button"
                onClick={() => {
                    const newTitle = prompt("Enter a new title:")
                    if (newTitle) {
                        changeEntries(newTitle, submission.technologies)
                    }
                }}
            >
                Edit Title
            </span>
            <span
                className="button"
                onClick={() => {
                    const newTech = prompt("Enter a new technologies list:")
                    if (newTech) {
                        changeEntries(submission.title, newTech)
                    }
                }}
            >
                Edit Techs
            </span>
            <span className="button">Add Comment</span>
        </div>
    )
}

export default JudgeToolbox
