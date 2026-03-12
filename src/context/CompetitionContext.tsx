/**
 * Competition Context Provider
 * Rewrite with TypeScript in 2026/3/10 (1773139749)
 *
 * Provides global competition state management across the application.
 * Fetches and maintains the current competition phase from the backend API.
 *
 * @module CompetitionContext
 */

"use client"

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react"

/**
 * Competition context value interface
 */
interface CompetitionContextValue {
	/** Current competition phase from backend */
	competitionState: string | null
}

/**
 * Props for CompetitionProvider component
 */
interface CompetitionProviderProps {
	/** Child components to wrap */
	children: ReactNode
}

/**
 * Competition Context
 * @type {React.Context<CompetitionContextValue | undefined>}
 */
const CompetitionContext = createContext<CompetitionContextValue | undefined>(
	undefined,
)

/**
 * Competition Provider Component
 *
 * Wraps the application to provide competition state to all child components.
 * Automatically fetches competition phase from the backend on mount.
 *
 * @component
 * @param {CompetitionProviderProps} props - Component properties
 * @param {React.ReactNode} props.children - Child components to wrap
 *
 * @example
 * // In layout.js or app root:
 * <CompetitionProvider>
 *   <App />
 * </CompetitionProvider>
 *
 * @returns {JSX.Element} Context provider wrapping children
 */
export const CompetitionProvider = ({
	children,
}: CompetitionProviderProps): React.ReactElement => {
	// State to hold current competition phase
	const [competitionState, setCompetitionState] = useState<string | null>(
		null,
	)

	/**
	 * Fetches the current competition phase from the backend API
	 * @async
	 * @returns {Promise<void>}
	 */
	const fetchCompetitionState = async (): Promise<void> => {
		try {
			const response = await fetch("/api/sql/phase")
			if (response.ok) {
				const data = (await response.json()) as { phase_name: string }
				setCompetitionState(data.phase_name)
			} else {
				console.error("Failed to fetch competition phase")
			}
		} catch (error) {
			console.error("Error fetching competition phase: ", error)
		}
	}

	// Fetch competition state on component mount
	useEffect(() => {
		fetchCompetitionState()
	}, []) // Empty dependency array ensures this runs only once on mount

	const value: CompetitionContextValue = {
		competitionState,
	}

	return (
		<CompetitionContext.Provider value={value}>
			{children}
		</CompetitionContext.Provider>
	)
}

/**
 * Custom hook to access competition context
 *
 * Provides easy access to competition state throughout the application.
 * Must be used within a CompetitionProvider.
 *
 * @hook
 * @returns {CompetitionContextValue} Competition context value
 * @returns {string | null} competitionState - Current competition phase from backend
 *
 * @example
 * // In any component:
 * const { competitionState } = useCompetition();
 *
 * @throws {Error} If used outside of CompetitionProvider
 */
export const useCompetition = (): CompetitionContextValue => {
	const context = useContext(CompetitionContext)

	if (context === undefined) {
		throw new Error(
			"useCompetition must be used within a CompetitionProvider",
		)
	}

	return context
}
