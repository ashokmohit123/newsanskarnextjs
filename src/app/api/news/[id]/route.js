import { NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * 🔥 Clean unwanted empty HTML tags
 */
function cleanHTML(html) {
  if (!html) return "";

  return html
    // remove empty h1-h6 tags containing only &nbsp; or spaces
    .replace(/<h[1-6][^>]*>(\s|&nbsp;)*<\/h[1-6]>/gi, "")
    // remove empty p tags
    .replace(/<p[^>]*>(\s|&nbsp;)*<\/p>/gi, "")
    // remove extra <br>
    .replace(/(<br\s*\/?>\s*){2,}/gi, "<br>")
    .trim();
}

export async function GET(req, context) {
  try {
    // ✅ params async (Next 15)
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "News ID required" },
        { status: 400 }
      );
    }

    // 🔥 increase view count
    await pool.query(
      "UPDATE news SET views_count = views_count + 1 WHERE id = ?",
      [id]
    );

    // 🔥 fetch clicked news
    const [rows] = await pool.query(
      `
      SELECT 
        id,
        title,
        description,
        image,
        views_count,
        DATE_FORMAT(
          COALESCE(
            STR_TO_DATE(creation_time, '%Y-%m-%d %H:%i:%s'),
            STR_TO_DATE(creation_time, '%Y-%m-%d')
          ),
          '%M %d, %Y'
        ) AS published_date
      FROM news
      WHERE id = ? AND status = 0
      LIMIT 1
      `,
      [id]
    );

    if (!rows.length) {
      return NextResponse.json(
        { success: false, message: "News not found" },
        { status: 404 }
      );
    }

    // 🔥 CLEAN DESCRIPTION BEFORE SEND
    const news = {
      ...rows[0],
      description: cleanHTML(rows[0].description),
    };

    return NextResponse.json({
      success: true,
      news,
    });

  } catch (error) {
    console.error("NEWS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
