/**
 * Countdown Component
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

const Countdown = ({ targetDate, label }) => {
    /**
     * Calculates the time remaining until the target date
     * @returns {Object} Time left object with days, hours, minutes, seconds
     */
    const calculateTimeLeft = () => {
        const target = new Date(targetDate)
        // Adjust for timezone offset to ensure accurate calculation
        const difference = target - new Date() + target.getTimezoneOffset() * 60
        let timeLeft = {}

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
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    // Set up interval to update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        // Cleanup interval on component unmount
        return () => clearInterval(timer)
    }, [targetDate])

    /**
     * Format number to always have 2 digits with leading zero
     * @param {number} num - Number to format
     * @returns {string} Formatted 2-digit string
     */
    const f = num => String(num).padStart(2, "0")

    return (
        <div className={styles.wrap}>
            {/* Countdown label with event description */}
            <div className={styles.label}>
                Time until <b>{label}</b>
            </div>

            {/* Formatted countdown display DD:HH:MM:SS */}
            <div className={styles.countdown}>
                {`${f(timeLeft.days)}:${f(timeLeft.hours)}:${f(timeLeft.minutes)}:${f(timeLeft.seconds)}`}
            </div>

            {/* Full date string for reference */}
            <div className={styles.label}>{new Date(targetDate).toString()}</div>
        </div>
    )
}

export default Countdown
