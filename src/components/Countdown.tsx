/**
 * Countdown Component
 * Rewrite with TypeScript on 2026/3/10
 *
 * Displays a real-time countdown timer to a specified target date with formatted
 * time display (days:hours:minutes:seconds) and automatic updates every second.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.targetDate - ISO 8601 date string for countdown target
 * @param {string} props.label - Display label for the countdown event
 *
 * @example
 * <Countdown
 *   targetDate="2025-05-30T23:59:59+0800"
 *   label="Submission Closes"
 * />
 *
 * @returns {JSX.Element} Rendered countdown timer with label and formatted time
 */

"use client"

import React, { useEffect, useState } from "react"
import styles from "./Countdown.module.css"
import { siteConfig } from "@/config/siteConfig"

/**
 * Interface for the time left object
 */
interface TimeLeft {
    /** Number of days remaining */
    days: number
    /** Number of hours remaining (0-23) */
    hours: number
    /** Number of minutes remaining (0-59) */
    minutes: number
    /** Number of seconds remaining (0-59) */
    seconds: number
}

/**
 * Props for the Countdown component
 */
interface CountdownProps {
    /** ISO 8601 date string for countdown target */
    targetDate: string
    /** Display label for the countdown event */
    label: string
}

/**
 * Countdown Component
 *
 * Displays a countdown timer that updates every second until the target date.
 *
 * @param {CountdownProps} props - Component props
 * @returns {JSX.Element} Countdown timer
 */
const Countdown = ({ targetDate, label }: CountdownProps): React.ReactElement => {
    /**
     * Calculates the time remaining until the target date
     * @returns {TimeLeft} Time left object with days, hours, minutes, seconds
     */
    const calculateTimeLeft = (): TimeLeft => {
        const target = new Date(targetDate)
        const now = new Date()
        const difference = target.getTime() - now.getTime() + target.getTimezoneOffset() * 60 * 1000
        let timeLeft: TimeLeft

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            }
        } else {
            // Countdown has ended - show zeros
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    // State to hold current time left values
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

    // Set up interval to update countdown every second
    useEffect(() => {
        const timer = setInterval((): void => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        // Cleanup interval on component unmount
        return (): void => clearInterval(timer)
    }, [targetDate])

    /**
     * Format number to always have 2 digits with leading zero
     * @param {number} num - Number to format
     * @returns {string} Formatted 2-digit string
     */
    const formatNumber = (num: number): string => String(num).padStart(2, "0")

    return (
        <div className={styles.wrap}>
            {/* Countdown label with event description */}
            <div className={styles.label}>
                {siteConfig.countdown.timeUntilPrefix} <b>{label}</b>
            </div>

            {/* Formatted countdown display DD:HH:MM:SS */}
            <div className={styles.countdown}>
                {`${formatNumber(timeLeft.days)}:${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`}
            </div>

            {/* Full date string for reference */}
            <div className={styles.label}>{new Date(targetDate).toString()}</div>
        </div>
    )
}

export default Countdown
