import { NextRequest, NextResponse } from "next/server";
import getConnection from "@/app/api/sql/database";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
	console.log("[saveJudgeData] Request started");
	try {
		// 1. Check session
		const session = await getServerSession(authOptions);
		console.log("[saveJudgeData] Session:", session ? "exists" : "null");

		if (!session?.user) {
			console.log("[saveJudgeData] Unauthorized: no session");
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);
		}

		// 2. Verify judge access
		const userAccess = (session.user as any).access;
		console.log("[saveJudgeData] User access level:", userAccess);
		if (userAccess < 2) {
			console.log("[saveJudgeData] Forbidden: access too low");
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		// 3. Parse body
		const body = await request.json();
		console.log("[saveJudgeData] Request body:", body);
		const { teamID, score, comment } = body;

		if (!teamID) {
			return NextResponse.json(
				{ error: "Missing teamID" },
				{ status: 400 },
			);
		}

		const judgeEmail = session.user.email;
		console.log("[saveJudgeData] judgeEmail:", judgeEmail);
		if (!judgeEmail) {
			return NextResponse.json(
				{ error: "Judge email not found" },
				{ status: 500 },
			);
		}

		// 4. Insert or update
		const pool = await getConnection();
		await pool.query(
			`INSERT INTO judging (teamID, judgeEmail, score, comment)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                 score = VALUES(score),
                 comment = VALUES(comment),
                 updated_at = CURRENT_TIMESTAMP`,
			[teamID, judgeEmail, score ?? null, comment ?? null],
		);

		console.log("[saveJudgeData] Save successful");
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("[saveJudgeData] UNCAUGHT ERROR:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: String(error) },
			{ status: 500 },
		);
	}
}
