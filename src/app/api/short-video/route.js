import { NextResponse } from "next/server";
import pool from "@/lib/db";

/* =========================
   GET API
========================= */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    /* =========================
       🔥 SHORTS LIST (FAST)
    ========================= */
    if (action === "list") {
      const lastId =
        Number(searchParams.get("last_id")) || Number.MAX_SAFE_INTEGER;

      const limit = 10; // 🚀 VERY FAST FIRST PAINT

      const [rows] = await pool.query(
        `
        SELECT 
          id,
          title,
          thumbnail,
          video_url
        FROM shorts_video
        WHERE status = 0
          AND id < ?
        ORDER BY id DESC
        LIMIT ?
        `,
        [lastId, limit]
      );

      return NextResponse.json({
        success: true,
        shorts: rows,
        last_id: rows.length ? rows[rows.length - 1].id : null,
      });
    }

    /* =========================
       ❤️ LIKES + USER LIKE
    ========================= */
    if (action === "meta") {
      const shorts_id = searchParams.get("shorts_id");
      const user_id = Number(searchParams.get("user_id")) || 0;

      if (!shorts_id) {
        return NextResponse.json({
          likes: 0,
          islike: 0,
        });
      }

      const [[likes]] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM users_like_content
        WHERE type='shorts' AND type_id=?
        `,
        [shorts_id]
      );

      let islike = 0;
      if (user_id) {
        const [[liked]] = await pool.query(
          `
          SELECT id
          FROM users_like_content
          WHERE user_id=? AND type='shorts' AND type_id=?
          LIMIT 1
          `,
          [user_id, shorts_id]
        );
        islike = liked ? 1 : 0;
      }

      return NextResponse.json({
        likes: likes.total,
        islike,
      });
    }

    /* =========================
       💬 COMMENTS LIST
    ========================= */
    if (action === "comments") {
      const shorts_id = searchParams.get("shorts_id");

      if (!shorts_id) {
        return NextResponse.json({ success: true, comments: [] });
      }

      const [rows] = await pool.query(
        `
        SELECT id, user_id, comment
        FROM shorts_comments
        WHERE shorts_id=?
        ORDER BY id DESC
        LIMIT 100
        `,
        [shorts_id]
      );

      return NextResponse.json({
        success: true,
        comments: rows,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("GET API ERROR:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

/* =========================
   POST API
========================= */
export async function POST(req) {
  try {
    const body = await req.json();
    const { action, user_id, shorts_id, comment } = body;

    /* =========================
       ❤️ LIKE / UNLIKE
    ========================= */
    if (action === "like") {
      if (!user_id || !shorts_id) {
        return NextResponse.json({ success: false });
      }

      const [[exists]] = await pool.query(
        `
        SELECT id
        FROM users_like_content
        WHERE user_id=? AND type='shorts' AND type_id=?
        `,
        [user_id, shorts_id]
      );

      if (exists) {
        await pool.query(
          `
          DELETE FROM users_like_content
          WHERE user_id=? AND type='shorts' AND type_id=?
          `,
          [user_id, shorts_id]
        );

        return NextResponse.json({ liked: false });
      }

      await pool.query(
        `
        INSERT INTO users_like_content (user_id,type_id,type)
        VALUES (?,?, 'shorts')
        `,
        [user_id, shorts_id]
      );

      return NextResponse.json({ liked: true });
    }

    /* =========================
       💬 ADD COMMENT
    ========================= */
    if (action === "comment") {
      if (!comment || !shorts_id || !user_id) {
        return NextResponse.json({ success: false });
      }

      await pool.query(
        `
        INSERT INTO shorts_comments (shorts_id,user_id,comment)
        VALUES (?,?,?)
        `,
        [shorts_id, user_id, comment]
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    console.error("POST API ERROR:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
