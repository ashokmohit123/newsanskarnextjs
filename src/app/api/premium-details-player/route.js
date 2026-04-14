import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID required" },
      { status: 400 }
    );
  }

  const [[episode]] = await pool.query(
    `SELECT id, custom_episode_url AS video_url, episode_title
     FROM premium_episodes
     WHERE id = ?`,
    [id]
  );

  if (!episode) {
    return NextResponse.json(
      { success: false, message: "Episode not found" },
      { status: 404 }
    );
  }

  const [[next]] = await pool.query(
    `SELECT id FROM premium_episodes
     WHERE id > ?
     ORDER BY id ASC
     LIMIT 1`,
    [id]
  );

  return NextResponse.json({
    success: true,
    video_url: episode.video_url,
    episode_title: episode.episode_title, // ✅ added
    next_episode_id: next?.id || null,
  });
}
