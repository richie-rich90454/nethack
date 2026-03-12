/**
 * Root Layout Component
 * Rewrite with TypeScript on 2026/3/10 (1773140135)
 *
 * Defines the root HTML structure and provides global context providers
 * for the entire application. This layout wraps all pages and includes
 * essential providers for authentication and competition state management.
 *
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child pages/components to render
 * @returns {JSX.Element} Root HTML structure with providers
 */

"use client";

import React, { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { SessionProvider } from "next-auth/react";
import { CompetitionProvider } from "@/src/context/CompetitionContext";
import { siteConfig } from "@/config/siteConfig";

/**
 * Props for the RootLayout component
 */
interface RootLayoutProps {
	/** Child pages/components to render */
	children: ReactNode;
}

/**
 * Root Layout Component
 *
 * Provides the base HTML structure and context providers for the entire application.
 *
 * @param {RootLayoutProps} props - Component props
 * @returns {JSX.Element} Root layout with providers
 */
export default function RootLayout({
	children,
}: RootLayoutProps): React.ReactElement {
	return (
		<html lang="en">
			<head>
				{/* Prevent search engine indexing for development/competition sites */}
				<meta name="robots" content="noindex, nofollow" />

				{/* Responsive viewport configuration */}
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>

				{/* Application title */}
				<title>{siteConfig.siteTitle}</title>
			</head>
			<body>
				{/* NextAuth Session Provider for authentication state management */}
				<SessionProvider>
					<div className="biggestWrap">
						{/* Global navigation bar */}
						<Navbar />

						{/* Main content wrapper with competition state provider */}
						<div className="bigWrap">
							<CompetitionProvider>
								{children}
							</CompetitionProvider>
						</div>

						{/* Global footer */}
						<Footer />
					</div>
				</SessionProvider>
			</body>
		</html>
	);
}
