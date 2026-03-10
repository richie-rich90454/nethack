/**
 * Countdown Mini Component
 * Rewrite with TypeScript on 2026/3/10
 *
 * A compact version of the countdown timer that displays only the formatted time
 * without labels. Updates automatically every second.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.targetDate - ISO 8601 date string for countdown target
 *
 * @example
 * <CountdownMini targetDate="2025-05-30T23:59:59+0800" />
 *
 * @returns {JSX.Element} Formatted time string (DD:HH:MM:SS)
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
 * Props for the CountdownMini component
 */
interface CountdownMiniProps {
    /** ISO 8601 date string for countdown target */
    targetDate: string
}

/**
 * Countdown Mini Component
 *
 * A compact countdown timer that displays only the formatted time.
 *
 * @param {CountdownMiniProps} props - Component props
 * @returns {JSX.Element} Formatted time span
 */
const CountdownMini = ({ targetDate }: CountdownMiniProps): React.ReactElement => {
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
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        return timeLeft
    }

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

    useEffect(() => {
        const timer = setInterval((): void => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return (): void => clearInterval(timer)
    }, [targetDate])

    /**
     * Format number to always have 2 digits with leading zero
     * @param {number} num - Number to format
     * @returns {string} Formatted 2-digit string
     */
    const formatNumber = (num: number): string => String(num).padStart(2, "0")

    return (
        <span>
            {`${formatNumber(timeLeft.days)}:${formatNumber(timeLeft.hours)}:${formatNumber(timeLeft.minutes)}:${formatNumber(timeLeft.seconds)}`}
        </span>
    )
}

export default CountdownMini
