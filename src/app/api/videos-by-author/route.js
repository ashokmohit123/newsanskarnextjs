import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const author_id = searchParams.get("id");

    if (!author_id) {
      return NextResponse.json(
        { status: false, message: "author id required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT 
        \`id\`,
        \`season_title\`,
        \`description\`,
        \`season_thumbnail\`
      FROM \`premium_season\`
      WHERE \`status\` = 0
        AND \`author_id\` = ?
      ORDER BY \`id\` DESC
      `,
      [author_id]
    );

    return NextResponse.json({
      status: true,
      data: rows,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { status: false, message: error.message },
      { status: 500 }
    );
  }
}
