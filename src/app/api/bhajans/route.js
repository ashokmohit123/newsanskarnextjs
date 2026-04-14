import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const god_name = searchParams.get("god_name");
    const id = searchParams.get("id");
    const top = searchParams.get("top");

    /* =====================================================
       CASE 1: SINGLE BHAJAN (Player Page)
       /api/bhajans?id=2247
    ===================================================== */
    if (id) {
      const [rows] = await pool.query(
        `
        SELECT 
          id,
          title,
          media_file AS audio_url,
          thumbnail1,
          god_name
        FROM bhajan
        WHERE status = 0 AND id = ?
        LIMIT 1
        `,
        [id]
      );

      if (!rows.length) {
        return NextResponse.json({
          success: false,
          message: "Bhajan not found",
        });
      }

      return NextResponse.json({
        success: true,
        bhajan: rows[0],
      });
    }

    /* =====================================================
       CASE 2: VIEW ALL (Single God)
       /api/bhajans?god_name=Shiv
    ===================================================== */
    if (god_name) {
      const [rows] = await pool.query(
        `
        SELECT 
          id,
          god_name,
          title,
          description,
          image,
          thumbnail1,
          thumbnail2,
          media_file AS audio_url,
          god_image
        FROM bhajan
        WHERE status = 0 AND god_name = ?
        ORDER BY id DESC
        `,
        [god_name]
      );

      return NextResponse.json({
        success: true,
        god_name,
        bhajans: rows,
      });
    }

    /* =====================================================
       CASE 3: TOP 20 BHAJANS
       /api/bhajans?top=20
    ===================================================== */
    if (top) {
      const [rows] = await pool.query(
        `
        SELECT 
          id,
          god_name,
          title,
          thumbnail1,
          media_file AS audio_url
        FROM bhajan
        WHERE status = 0
        ORDER BY id DESC
        LIMIT ?
        `,
        [Number(top)]
      );

      return NextResponse.json({
        success: true,
        list: [
          {
            god_name: "Top Bhajans",
            bhajans: rows,
          },
        ],
      });
    }

    /* =====================================================
       CASE 4: HOME PAGE (Grouped by God)
       /api/bhajans
    ===================================================== */
    const [rows] = await pool.query(`
      SELECT 
        id,
        god_id,
        god_name,
        title,
        description,
        image,
        thumbnail1,
        thumbnail2,
        media_file AS audio_url,
        god_image
      FROM bhajan
      WHERE status = 0 AND god_id > 0
      ORDER BY god_name, id DESC
    `);

    const grouped = {};

    rows.forEach(row => {
      if (!grouped[row.god_name]) {
        grouped[row.god_name] = {
          god_name: row.god_name,
          bhajans: [],
        };
      }
      grouped[row.god_name].bhajans.push(row);
    });

    return NextResponse.json({
      success: true,
      list: Object.values(grouped),
    });

  } catch (error) {
    console.error("Bhajan API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
