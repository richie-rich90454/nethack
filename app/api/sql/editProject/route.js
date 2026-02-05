"use server"
import getConnection from "@/api/sql/database"

export async function POST(request) {
    const connection = await getConnection()
    const body = await request.json()

    const { teamID, title, description, github, prompt, technologies } = body

    // Use parameterized queries to prevent SQL injection
    const query = `
        UPDATE hacks 
        SET title = ?, description = ?, github = ?, prompt = ?, technologies = ? 
        WHERE teamID = ?;
    `

    try {
        const [sqlResults] = await connection.query(query, [title, description, github, prompt, technologies, teamID])

        // Check if any rows were affected
        if (sqlResults.affectedRows > 0) {
            return new Response(JSON.stringify({ message: "Update successful" }), { status: 200 })
        } else {
            return new Response(JSON.stringify({ message: "No team found with the given ID" }), { status: 404 })
        }
    } catch (error) {
        console.error("Update error:", error)
        return new Response(JSON.stringify({ error: "Database error", details: error.message }), { status: 500 })
    } finally {
        // Ensure the connection is closed
        if (connection) {
            await connection.release()
        }
    }
}
