import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const menu_id = searchParams.get("menu_id");

    if (!menu_id) {
      return NextResponse.json(
        { success: false, message: "menu_id is required" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `
      SELECT *
      FROM video_master
      WHERE status = 0
      AND FIND_IN_SET(?, web_menu_ids)
      ORDER BY id DESC
      `,
      [menu_id]
    );

    return NextResponse.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
