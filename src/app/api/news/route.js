import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        title,
        description,
        image,
        views_count,

        -- ✅ HANDLE STRING / NULL / INVALID DATE
        DATE_FORMAT(
          COALESCE(
            STR_TO_DATE(creation_time, '%Y-%m-%d %H:%i:%s'),
            STR_TO_DATE(creation_time, '%Y-%m-%d'),
            NOW()
          ),
          '%M %d, %Y'
        ) AS published_date,

        uploaded_by
      FROM news
      WHERE status = 0
      ORDER BY id DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    const [[count]] = await pool.query(
      `SELECT COUNT(*) AS total FROM news WHERE status = 0`
    );

    return NextResponse.json({
      success: true,
      news: rows,
      pagination: {
        total: count.total,
        page,
        limit,
        totalPages: Math.ceil(count.total / limit),
      },
    });
  } catch (error) {
    console.error("NEWS API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
