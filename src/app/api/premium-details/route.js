import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const ses_id = searchParams.get("ses_id");
    const cat_id = searchParams.get("cat_id"); // optional if not used

    if (!ses_id) {
      return NextResponse.json(
        { success: false, message: "ses_id required" },
        { status: 400 }
      );
    }

    // 1️⃣ SEASON
    const [[season]] = await pool.query(
      `SELECT * FROM premium_season WHERE id = ?`,
      [ses_id]
    );

    if (!season) {
      return NextResponse.json(
        { success: false, message: "Season not found" },
        { status: 404 }
      );
    }

    // 2️⃣ EPISODES (FIXED TABLE NAME)
    const [episodes] = await pool.query(
      `
      SELECT *
      FROM premium_episodes
      WHERE season_id = ?
      ORDER BY episode_title  ASC
      `,
      [ses_id]
    );

    return NextResponse.json({
      success: true,
      season,
      episodes,
    });

  } catch (error) {
    console.error("Premium details error:", error);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
