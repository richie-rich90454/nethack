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
import { siteConfig } from "@/config/siteConfig"

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
	const countdownDates: string[] = siteConfig.home.countdownDates

	const { status, data: session } = useSession()

	return (
		<div>
			<h1>{siteConfig.home.welcomeHeading}</h1>
			<hr />
			<p
				className="cBlue"
				dangerouslySetInnerHTML={{ __html: siteConfig.home.introText }}
			/>
			<p className="cYellow">{siteConfig.home.statusText}</p>

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
						href={siteConfig.externalUrls.signUpForm}
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
				{/* <Countdown key={0} targetDate={countdownDates[0]} label={siteConfig.home.countdownLabels.registrationCloses}/> */}
				{/* <Countdown key={1} targetDate={countdownDates[1]} label={siteConfig.home.countdownLabels.promptsRelease}/> */}
				<Countdown
					key={2}
					targetDate={countdownDates[2]}
					label={siteConfig.home.countdownLabels.submissionCloses}
				/>
			</center>
		</div>
	)
}

export default Home
