// app/api/continue-watching/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { headers } from "next/headers";

/* =========================
   🔹 GET CONTINUE WATCHING
========================= */
export async function GET() {
  try {
    const headerList = await headers();
    const token = headerList.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - token missing" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
  ///.log("user :",decoded)
    const userId = decoded.id;
const [rows] = await pool.query(
  `SELECT id, media_id, type, season_id, pause_at, total_duration
   FROM new_continue_watching
   WHERE user_id = ?
     AND CAST(NULLIF(total_duration, '') AS UNSIGNED) >
         CAST(NULLIF(pause_at, '') AS UNSIGNED)
   ORDER BY modified_time DESC
   LIMIT 40`,
  [userId]
);

    const result = [];
    const visitedSeason = new Set();
//console.log("rows ", rows);
    for (const row of rows) {
      const { type, media_id, season_id, pause_at, total_duration } = row;

      // 🎬 MOVIE / VIDEO
     // 🎬 MOVIE / VIDEO
if (type === 1) {
  const [[video]] = await pool.query(
    `SELECT id, video_title, thumbnail_url, custom_video_url
     FROM video_master
     WHERE id = ? AND status = 0`,
    [media_id]
  );

  if (video) {
    result.push({
      id: video.id,
      title: video.video_title, // ✅ FIXED
      thumbnail_url: video.thumbnail_url,
      video_url: video.custom_video_url,
      progress: Math.floor((pause_at / total_duration) * 100),
      type: "video",
    });
  }
}


      // 📺 SERIES / EPISODE
      if (type === 2 && !visitedSeason.has(season_id)) {
        visitedSeason.add(season_id);

        const [[episode]] = await pool.query(
          `SELECT id AS episode_id, episode_title, thumbnail_url, custom_episode_url
           FROM premium_episodes
           WHERE id = ? AND status = 0`,
          [media_id]
        );

        if (episode) {
          result.push({
            id: episode.episode_id,
            title: episode.episode_title,
            thumbnail_url: episode.thumbnail_url,
            video_url: episode.custom_episode_url,
            progress: Math.floor((pause_at / total_duration) * 100),
            type: "series",
          });
        }
      }
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Continue Watching GET Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

/* =========================
   🔹 POST CONTINUE WATCHING
========================= */
export async function POST(req) {
  try {
    const headerList = await headers();
    const token = headerList.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - token missing" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }
//console.log("decode :",decoded)
    const userId = decoded.id || 705130;
    const {
      media_id,
      type,
      season_id = null,
      pause_at,
      total_duration,
    } = await req.json();

    if (!media_id || !type || pause_at == null || !total_duration) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 🔍 Check same user + media + type
    const [existing] = await pool.query(
      `SELECT id
       FROM new_continue_watching
       WHERE user_id = ? AND media_id = ? AND type = ?
       LIMIT 1`,
      [userId, media_id, type]
    );

    if (existing.length > 0) {
      // 🔁 UPDATE
      await pool.query(
        `UPDATE new_continue_watching
         SET pause_at = ?, total_duration = ?, season_id = ?, modified_time = NOW()
         WHERE id = ?`,
        [
          pause_at,
          total_duration,
          season_id,
          existing[0].id,
        ]
      );

      return NextResponse.json({
        success: true,
        message: "Continue watching updated",
      });
    }

    // ➕ INSERT
    await pool.query(
      `INSERT INTO new_continue_watching
       (user_id, media_id, type, season_id, pause_at, total_duration, modified_time)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        media_id,
        type,
        season_id,
        pause_at,
        total_duration,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Continue watching inserted",
    });
  } catch (err) {
    console.error("Continue Watching POST Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
