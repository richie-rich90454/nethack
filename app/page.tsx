/**
 * Home Page Component
 * Rewrite with TypeScript in 2026/3/10 (1773140170)
 *
 * The main landing page for the BIBS·C Network Hackathon Portal.
 * Displays competition information, authentication status-based navigation,
 * and countdown timers for key competition milestones.
 *
 * @component
 * @returns {JSX.Element} Home page with competition info and navigation
 */

"use client"

import React from "react"
import Countdown from "@/src/components/Countdown"
import { useSession } from "next-auth/react"
import Link from "next/link"

/**
 * Home Page Component
 * 
 * Landing page that displays:
 * - Competition information
 * - Authentication-based navigation links
 * - Countdown timers for competition deadlines
 * 
 * @returns {JSX.Element} Home page
 */
const Home = (): React.ReactElement => {
    const countdownDates: string[] = [
        "2025-05-16T23:59:59+0800", 
        "2025-05-17T23:59:59+0800", 
        "2025-05-30T23:59:59+0800"
    ]

    const { status, data: session } = useSession()

    return (
        <div>
            <h1>Welcome to the 2nd Annual BIBS·C Network Hackathon</h1>
            <hr />
            <p className="cBlue">
                We are all about <span className="serifBold">understanding</span> and{" "}
                <span className="serifBold">applying</span> technology. In a Hackathon, you are given limited time to
                draw on your skills and produce an original product. Your product may be focused on anything from
                programming to hardware to art - so long as it answers the competition's prompts.
            </p>
            <p className="cYellow">
                The 2025 Competition has begun! If you have registered, please login to your Hackathon account to view
                your project Dashboard and submit materials. Please note that this site experience as a beta test.{" "}
            </p>
            
            {/* Conditional navigation based on authentication status */}
            {status === "authenticated" && session?.user.access >= 1 ? (
                <p>
                    <Link href="/dashboard" className="cBlue link">
                        &gt;&gt;&gt; Access your dashboard here!
                    </Link>
                </p>
            ) : status === "authenticated" ? (
                <p>
                    <a 
                        href="https://forms.cloud.microsoft/r/3t7EywybWw" 
                        className="cBlue link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        &gt;&gt;&gt; Sign up for the Hackathon here!
                    </a>
                </p>
            ) : status === "unauthenticated" ? (
                <p>
                    <Link href="/login" className="cBlue link">
                        &gt;&gt;&gt; Login to your account here!
                    </Link>
                </p>
            ) : (
                <p>&nbsp;</p>
            )}
            
            <center className="console">
                {/* Countdown timers - commented out ones are for future use */}
                {/* <Countdown key={0} targetDate={countdownDates[0]} label="Registration Closes"/> */}
                {/* <Countdown key={1} targetDate={countdownDates[1]} label="Prompts Release"/> */}
                <Countdown key={2} targetDate={countdownDates[2]} label="Submission Closes" />
            </center>
        </div>
    )
}

export default Home