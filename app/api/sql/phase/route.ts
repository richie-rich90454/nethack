"use server"

import { NextRequest } from "next/server"
import getConnection from "@/app/api/sql/database"
import { RowDataPacket } from "mysql2"

/**
 * Interface representing a phase record from the database
 * Rewrite with TypeScript in 2026/3/10 (1773139271)
 */
interface PhaseRow extends RowDataPacket {
    id?: number
    phase: string
    [key: string]: unknown
}

export async function GET(request: NextRequest) {
    let connection

    try {
        connection = await getConnection()

        const [pullResults] = await connection.query<PhaseRow[]>("SELECT * FROM phases")

        // Get the last element in the array (most recent phase)
        const sortedResults = pullResults[pullResults.length - 1]

        return new Response(JSON.stringify(sortedResults), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        console.log("Error in pulling", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        return new Response(JSON.stringify({ error: "Database error", details: errorMessage }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } finally {
        if (connection) {
            connection.release()
        }
    }
}
