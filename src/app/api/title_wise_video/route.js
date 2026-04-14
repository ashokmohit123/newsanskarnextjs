import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tvmenu_id = searchParams.get("tvmenu_id");

    // ❌ validation
    if (!tvmenu_id) {
      return NextResponse.json(
        { success: false, message: "tvmenu_id is required" },
        { status: 400 }
      );
    }

    // 1️⃣ Get menu title
    const [menuRows] = await pool.query(
      `
      SELECT id, menu_title
      FROM web_menu
      WHERE id = ?
      `,
      [tvmenu_id]
    );

    if (!menuRows.length) {
      return NextResponse.json({
        success: true,
        menu_id: tvmenu_id,
        menu_title: "",
        data: [],
      });
    }

    // 2️⃣ Get ALL seasons/videos for this menu
    const [videos] = await pool.query(
      `
      SELECT
        id,
        season_title,
        category_id,
        description,
        season_thumbnail,
        promo_video,
        yt_promo_video
      FROM premium_season
      WHERE
        status = 0
        AND (published_date IS NULL OR published_date <= NOW())
        AND FIND_IN_SET(?, web_menu_ids)
      ORDER BY position ASC
      `,
      [tvmenu_id]
    );

    return NextResponse.json({
      success: true,
      menu_id: tvmenu_id,
      menu_title: menuRows[0].menu_title,
      data: videos,
    });

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
