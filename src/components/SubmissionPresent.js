"use client"
import styles from "./SubmissionPresent.module.css"
import { useEffect, useState } from "react"
import Link from "next/link"

const SubmissionPresent = ({ submission, override }) => {
    const iconPlay = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-play-circle"
            viewBox="0 0 16 16"
        >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
        </svg>
    )
    return (
        <div className={`${styles.wrap} displayBox`}>
            {submission && (
                <div id={submission.teamID} className={styles.outline}>
                    <a
                        target="_blank"
                        href={override ? override : `/25R1/${submission.teamID}/${submission.title}.html`}
                    >
                        <div className={styles.image}>
                            <img src={`/25R1/${submission.teamID}.jpg`}></img>
                            <div className={styles.play}>{iconPlay}</div>
                        </div>
                    </a>
                    <div className={styles.text}>
                        <p className="cWhite medBig serifBold">
                            {submission.title == null ? (
                                <span className="cRed">Untitled Submission</span>
                            ) : (
                                submission.title
                            )}
                            <span className="smallMed">&nbsp;</span>
                        </p>
                        <hr />
                        <p className="cWhite ">
                            Developed by <span className="serifBold cBlue">{submission.members}</span>
                        </p>
                        <p className="cWhite">
                            Built using{" "}
                            <span className="serifBold cGreen">
                                {submission.technologies == null ? (
                                    <span className="cRed">No Technologies Listed</span>
                                ) : (
                                    submission.technologies
                                )}
                            </span>
                        </p>

                        <p className="cWhite">
                            <span className="cYellow serifBold">{submission.prompt} </span>| {submission.description}
                        </p>
                        <br />
                        <p>
                            Share URL:{" "}
                            <a className="console" href={`https://nethack.biszweb.club/showcase#${submission.teamID}`}>
                                https://nethack.biszweb.club/showcase#{submission.teamID}
                            </a>
                        </p>
                        <p>
                            Download code:{" "}
                            {submission.sub_code == "Github" ? (
                                <a href={submission.github} target="_blank">
                                    View on Github
                                </a>
                            ) : (
                                <a href={`/25R1/${submission.teamID}/${submission.title}.zip`}>Compressed Folder</a>
                            )}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SubmissionPresent
