"use client"
import styles from "./Submission.module.css"
import { useEffect, useState } from "react"
import Link from "next/link"
import JudgeToolbox from "@/components/JudgeToolbox"

const Submission = ({ submission, user, onEdit }) => {
    return (
        <div className={`${styles.wrap} displayBox`}>
            {submission && (
                <div className={styles.outline}>
                    <div className={styles.header}>
                        <p className="cGreen medBig serifBold">
                            {submission.title == null ? (
                                <span className="cRed">Untitled Submission</span>
                            ) : (
                                submission.title
                            )}
                            <span className="smallMed">&nbsp;</span>
                            <span className="small cGray serifBold">{submission.teamID}</span>
                        </p>
                        <span className={styles.filler}></span>
                        <p className={`${styles.edit} sub serifBold cGreen`}>
                            <a onClick={onEdit}>[Edit]</a>
                        </p>
                    </div>
                    <hr className={styles.padBottom} />
                    <p className="cWhite">
                        <span className="serifBold cBlue">Developed by&nbsp;</span>{" "}
                        <span className="">{submission.members}</span>
                    </p>
                    <p className="cWhite">
                        <span className="serifBold cBlue">Built using&nbsp;&nbsp;</span>{" "}
                        <span className="">
                            {submission.technologies == null ? (
                                <span className="cRed">No Technologies Listed</span>
                            ) : (
                                submission.technologies
                            )}
                        </span>
                    </p>
                    <p className="cWhite">
                        <span className="serifBold cBlue">Chosen prompt</span>{" "}
                        <span className="">
                            {submission.prompt == null ? (
                                <span className="cRed">No Prompt Selected</span>
                            ) : (
                                submission.prompt
                            )}
                        </span>
                    </p>
                    <br />
                    <p className="cWhite">{submission.description}</p>
                    <br />
                    <span className="console sub">
                        {/* <p className="cWhite sub"><span className="serifBold cBlue">Code&nbsp;</span> {submission.sub_code == "Github" ? <a href={submission.github} target="_blank">{submission.github}</a> : submission.sub_code == "NOT SUBMITTED" ? <span className="cRed">{submission.sub_code}</span> : <a href={submission.sub_code} target="_blank">{submission.sub_code}</a> }</p>
                            <p className="cWhite sub"><span className="serifBold cBlue">Video</span> {submission.sub_video == "NOT SUBMITTED" ? <span className="cRed">{submission.sub_video}</span> : <a href={submission.sub_video} target="_blank">{submission.sub_video}</a>}</p> */}
                        <p className="cBlue serifBold">
                            {submission.sub_code == "Github" ? (
                                <a href={submission.github} target="_blank">
                                    [View GitHub]
                                </a>
                            ) : submission.sub_code == "NOT SUBMITTED" ? (
                                <span className="cRed">[Code NOT SUBMITTED]</span>
                            ) : (
                                <a href={submission.sub_code} target="_blank">
                                    [View Code]
                                </a>
                            )}
                            <span> </span>
                            {submission.sub_video == "NOT SUBMITTED" ? (
                                <span className="cRed">[Video NOT SUBMITTED]</span>
                            ) : (
                                <a href={submission.sub_video} target="_blank">
                                    [View Video]
                                </a>
                            )}
                        </p>
                    </span>
                </div>
            )}
        </div>
    )
}

export default Submission
