import { NextResponse } from "next/server";
import pool from "@/lib/db";

function milliseconds() {
  return Date.now();
}

export async function POST(req) {
  try {
    let body;

    // ---- FIX: support both JSON & form-data ----
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      const form = await req.formData();
      body = { type: form.get("type") };
    }

    const type = body?.type;
    console.log("TYPE RECEIVED:", type);


    const current_time = milliseconds();

    // 1️⃣ Fetch menus
    const [menus] = await pool.query(`
      SELECT id, menu_title, position
      FROM web_menu
      WHERE status = 0 AND menu_type_id = 3
      ORDER BY position DESC
    `);

    let finalResult = [];

    // 2️⃣ Fetch video list per menu
    for (const menu of menus) {
      const [videos] = await pool.query(
        `
        SELECT *,
          (likes + youtube_likes) AS total_likes,
          (views + youtube_views) AS total_views
        FROM video_master
        WHERE status = 0
          AND published_date <= ?
          AND FIND_IN_SET(?, web_menu_ids)
        ORDER BY published_date DESC
        LIMIT 40
      `,
        [current_time, menu.id]
      );

      finalResult.push({
        menu_id: menu.id,
        menu_title: menu.menu_title,
        videos,
      });
    }

    return NextResponse.json({
      status: true,
      message: "Success",
      list: finalResult,
    });
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({
      status: false,
      message: "API Error",
      error: error.message,
    });
  }
}
