"use server"

import { NextRequest } from "next/server"
import getConnection from "@/app/api/sql/database"
import { RowDataPacket, OkPacket } from "mysql2"

/**
 * Request body interface for project update
 * Rewrite with TypeScript on 2026/3/10 1773139234
 */
interface UpdateProjectRequest {
	teamID: string
	title: string
	description: string
	github: string
	prompt: string
	technologies: string
}

export async function POST(request: NextRequest) {
	const connection = await getConnection()

	try {
		const body = (await request.json()) as UpdateProjectRequest

		const { teamID, title, description, github, prompt, technologies } =
			body

		// Use parameterized queries to prevent SQL injection
		const query = `
            UPDATE hacks 
            SET title = ?, description = ?, github = ?, prompt = ?, technologies = ? 
            WHERE teamID = ?;
        `

		const [sqlResults] = await connection.query<OkPacket>(query, [
			title,
			description,
			github,
			prompt,
			technologies,
			teamID,
		])

		// Check if any rows were affected
		if (sqlResults.affectedRows > 0) {
			return new Response(
				JSON.stringify({ message: "Update successful" }),
				{ status: 200 },
			)
		} else {
			return new Response(
				JSON.stringify({ message: "No team found with the given ID" }),
				{ status: 404 },
			)
		}
	} catch (error) {
		console.error("Update error:", error)
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error"
		return new Response(
			JSON.stringify({ error: "Database error", details: errorMessage }),
			{ status: 500 },
		)
	} finally {
		// Ensure the connection is closed
		if (connection) {
			await connection.release()
		}
	}
}
