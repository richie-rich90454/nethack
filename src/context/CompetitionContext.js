/**
 * Competition Context Provider
 *
 * Provides global competition state management across the application.
 * Fetches and maintains the current competition phase from the backend API.
 *
 * @module CompetitionContext
 */

"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

/**
 * Competition Context
 * @type {React.Context}
 */
const CompetitionContext = createContext()

/**
 * Competition Provider Component
 *
 * Wraps the application to provide competition state to all child components.
 * Automatically fetches competition phase from the backend on mount.
 *
 * @component
 * @param {Object} props - Component properties
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
export const CompetitionProvider = ({ children }) => {
    // State to hold current competition phase
    const [competitionState, setCompetitionState] = useState(null)

    /**
     * Fetches the current competition phase from the backend API
     * @async
     * @returns {Promise<void>}
     */
    const fetchCompetitionState = async () => {
        try {
            const response = await fetch("/api/sql/phase")
            if (response.ok) {
                const data = await response.json()
                setCompetitionState(data.phase)
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

    return <CompetitionContext.Provider value={{ competitionState }}>{children}</CompetitionContext.Provider>
}

/**
 * Custom hook to access competition context
 *
 * Provides easy access to competition state throughout the application.
 * Must be used within a CompetitionProvider.
 *
 * @hook
 * @returns {Object} Competition context value
 * @returns {any} competitionState - Current competition phase from backend
 *
 * @example
 * // In any component:
 * const { competitionState } = useCompetition();
 *
 * @throws {Error} If used outside of CompetitionProvider
 */
export const useCompetition = () => {
    const context = useContext(CompetitionContext)
    if (context === undefined) {
        throw new Error("useCompetition must be used within a CompetitionProvider")
    }
    return context
}
