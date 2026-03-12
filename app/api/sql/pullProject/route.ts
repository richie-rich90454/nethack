"use server"

import { NextRequest } from "next/server"
import getConnection from "@/app/api/sql/database"
import { RowDataPacket } from "mysql2"

/**
 * Interface representing a hack/project record from the database
 * Rewrite with TypeScript on 2026/3/10 (1773139336)
 */
interface HackRow extends RowDataPacket {
	id?: number
	teamID: string
	title: string
	description: string
	github: string
	prompt: string
	technologies: string
	submission_date?: Date
	status?: string
	[key: string]: unknown
}

// allows two types of requests to 'hacks' table
export async function GET(request: NextRequest) {
	let connection
	try {
		connection = await getConnection()
		let pullResults: HackRow[] = []

		const url = new URL(request.url)
		const search = url.searchParams.get("search") // Get the 'search' parameter

		if (search) {
			// runs if request is in the form "api/sql/pull?search=XXX"
			// returns specific entry corresponding to search query
			const [rows] = await connection.query<HackRow[]>(
				"SELECT * FROM hacks WHERE teamID = ?",
				[search],
			)
			pullResults = rows
		} else {
			// returns general case of full database
			const [rows] = await connection.query<HackRow[]>(
				"SELECT * FROM hacks",
			)
			pullResults = rows
		}

		return new Response(JSON.stringify(pullResults), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.log("Error in pulling", error)
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error"

		return new Response(
			JSON.stringify({ error: "Database error", details: errorMessage }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
	} finally {
		if (connection) {
			connection.release()
		}
	}
}
