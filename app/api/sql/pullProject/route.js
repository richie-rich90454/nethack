"use server"
import getConnection from "@/api/sql/database"

// allows two types of requests to 'hacks' table
export async function GET(request) {
    let connection
    try {
        connection = await getConnection()
        let pullResults = []

        const url = new URL(request.url)
        const search = url.searchParams.get("search") // Get the 'search' parameter

        if (search) {
            // runs if request is in the form "api/sql/pull?search=XXX"
            // returns specific entry corresponding to search query
            ;[pullResults] = await connection.query("SELECT * FROM hacks WHERE teamID = ?", [search])
        } else {
            // returns general case of full database
            ;[pullResults] = await connection.query("SELECT * FROM hacks")
        }

        return new Response(JSON.stringify(pullResults), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        ;``
        console.log("Error in pulling", error)
        return new Response(JSON.stringify({ error: "Database error", details: error.message }), {
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
