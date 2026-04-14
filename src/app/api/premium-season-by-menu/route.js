  import { NextResponse } from "next/server";
  import pool from "@/lib/db";

  export async function GET() {
    try {
      // 1️⃣ Get all menus with menu_type_id = 6
      const [menus] = await pool.query(
        `
        SELECT id, menu_title
        FROM web_menu
        WHERE menu_type_id = 6
        ORDER BY position ASC
        `
      );

      if (!menus.length) {
        return NextResponse.json({
          success: true,
          data: [],
        });
      }

      // 2️⃣ For each menu, fetch seasons
      const result = [];

      for (const menu of menus) {
        const [seasons] = await pool.query(
          `
          SELECT
            id,
            season_title,
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
          [menu.id]
        );


        
        result.push({
          menu_id: menu.id,
          menu_title: menu.menu_title,
          seasons: seasons,
        }); 
      }

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("API ERROR:", error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }
