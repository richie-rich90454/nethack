import { NextRequest, NextResponse } from "next/server";
import getConnection from "@/app/api/sql/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
	console.log("[getJudgeData] Request started");
	try {
		// 1. Check session
		const session = await getServerSession(authOptions);
		console.log("[getJudgeData] Session:", session ? "exists" : "null");

		if (!session?.user) {
			console.log("[getJudgeData] Unauthorized: no session");
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// 2. Verify judge access level
		const userAccess = (session.user as any).access;
		console.log("[getJudgeData] User access level:", userAccess);
		if (userAccess < 2) {
			console.log("[getJudgeData] Forbidden: access too low");
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// 3. Get teamID from query
		const { searchParams } = new URL(request.url);
		const teamID = searchParams.get("teamID");
		console.log("[getJudgeData] teamID:", teamID);
		if (!teamID) {
			return NextResponse.json(
				{ error: "Missing teamID" },
				{ status: 400 },
			);
		}

		// 4. Get judge email from session
		const judgeEmail = session.user.email;
		console.log("[getJudgeData] judgeEmail:", judgeEmail);
		if (!judgeEmail) {
			return NextResponse.json(
				{ error: "Judge email not found" },
				{ status: 500 },
			);
		}

		// 5. Query database
		const pool = await getConnection();
		const [rows] = await pool.query(
			`SELECT score, comment FROM judging WHERE teamID = ? AND judgeEmail = ?`,
			[teamID, judgeEmail],
		);
		console.log("[getJudgeData] Query rows:", rows);

		const judgeData = (rows as any[])[0] || {};
		return NextResponse.json({
			score: judgeData.score ?? null,
			comment: judgeData.comment ?? null,
		});
	} catch (error) {
		console.error("[getJudgeData] UNCAUGHT ERROR:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: String(error) },
			{ status: 500 },
		);
	}
}
