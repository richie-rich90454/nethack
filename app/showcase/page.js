"use client"
import React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useCompetition } from "@/context/CompetitionContext"
import CountdownMini from "@/components/CountdownMini"
import SubmissionPresent from "@/components/SubmissionPresent"

const Dashboard = () => {
    const { data: session } = useSession()
    const [entries, setEntries] = useState("Loading...")

    const fetchEntries = async () => {
        try {
            // TODO: prob modify database schema (i.e. make new fields) so this can be done in 1 api call
            let winners = [
                "c0ad4f19",
                "d34f1c1d",
                "dbb3b35b",
                "012ba255",
                "17b07c3a",
                "46ff65b7",
                "f4da2d19",
                "7fea1e8e"
            ]
            let all = []
            let data
            for (let i = 0; i < winners.length; i++) {
                let response = await fetch("/api/sql/pullProject?search=" + winners[i])
                if (response.ok) {
                    data = await response.json()
                    all.push(data[0])
                } else {
                    console.error("Failed to fetch entries")
                }
            }
            setEntries(all)
        } catch (error) {
            console.error("Error fetching entries: ", error)
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [session])

    const iconAward = (
        // <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-award" viewBox="0 0 16 16">
        //     <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
        //     <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
        // </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-award-fill"
            viewBox="0 0 16 16"
        >
            <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864z" />
            <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
        </svg>
    )
    return (
        <>
            <p>
                <span className="cWhite serifBold big">Project Showcase (2025R1)</span>
            </p>
            <hr />
            <p className="cBlue">
                The projects on this page are all <span className="serifBold">original student work</span>, submitted as
                part of the 2nd Annual BIBS·C Network Hackathon. Participants were given 1 week to develop a project
                from scratch that responds to one of the Hackathon prompts - from conceptualization to implementation to
                presentation, students took charge of their projects.{" "}
            </p>
            <br />
            <p>
                Out of 24 qualifying projects from 65 students across 5 schools, these projects were selected by a panel
                of judges as exemplary and representative work. A Hackathon is all about applying technology in unique
                ways to solve practical problems, so projects were assessed on their use of technology, originality,
                presentation, topicality, and usability. Whenever possible, we have placed the interactive version of
                their project's on this site; code download is also available. We encourage you to reach out to these
                students via Teams if you want to learn more about their projects!{" "}
            </p>
            <br />

            <div>
                {entries != "Loading..." && (
                    <>
                        <p>
                            <span className="cWhite serifBold med">Our Top 3:</span>
                        </p>
                        <p className="cWhite">
                            Our judges were very impressed with the quality of the project submissions this Round, and
                            it was difficult to rank the Finalists. The following projects are all compelling in their
                            own way: <span className="serifBold">Natural Selection Simulation</span> takes first place
                            because of how impressively it embodies the "Theory and Reality" prompt, powerfully
                            demonstrating the power of computational simulation in modeling and communicating scientific
                            theories. Next, <span className="serifBold">Local-Server-Chat</span> explores the very
                            fundamentals of the technology that is found all around us and so often taken for granted,
                            creating a chat server usable by anyone.{" "}
                            <span className="serifBold">N-Body Simulation</span> is an exciting project that uses
                            visualization to bring gravitation and our solar system to life.
                        </p>

                        <div className="border gold">
                            <SubmissionPresent
                                key="0"
                                submission={entries[0]}
                                override={`/25R1/${entries[0].teamID}/vid.mp4`}
                            ></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border silver">
                            <SubmissionPresent
                                key="1"
                                submission={entries[1]}
                                override={`/25R1/${entries[1].teamID}/vid.mp4`}
                            ></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border bronze">
                            <SubmissionPresent
                                key="2"
                                submission={entries[2]}
                                override={`/25R1/${entries[2].teamID}/vid.mp4`}
                            ></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <br />
                        <p>
                            <span className="cWhite serifBold med">The remaining Finalists (Honorable Mentions):</span>
                        </p>
                        <p className="cWhite">
                            We believe all of Finalist projects were impressive enough to be worth your time exploring,
                            so all of them are presented here. In no particular order, here is another set of diverse
                            and captivating projects:
                        </p>
                        <div className="border green">
                            <SubmissionPresent key="3" submission={entries[3]} override={0}></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent key="4" submission={entries[4]} override={0}></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent
                                key="5"
                                submission={entries[5]}
                                override={`/25R1/${entries[5].teamID}/vid.mp4`}
                            ></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent
                                key="6"
                                submission={entries[6]}
                                override="https://david-why.tech/bmplogicsim/"
                            ></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <div className="border green">
                            <SubmissionPresent key="7" submission={entries[7]} override={0}></SubmissionPresent>
                            <div className="award">{iconAward}</div>
                        </div>
                        <br />
                        <p className="cWhite">
                            We are immensely proud of all of our participants, and we can honestly say that we learned
                            something new from each project. We will be trying to put up more projects for public
                            viewing in the future, but for now we hope you enjoyed this exhibition of the power of
                            technology.{" "}
                        </p>
                    </>
                )}
            </div>
        </>
    )
}

export default Dashboard
