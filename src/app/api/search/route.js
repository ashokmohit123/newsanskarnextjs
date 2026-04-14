import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";

    // ✅ EMPTY SEARCH → 10
    // ✅ SEARCH TEXT → 100
    const limit = q ? 100 : 10;

    const like = `%${q}%`;

    const [
      [premiumEpisodes],
      [premiumSeasons],
      [videoMaster],
      [bhajan],
    ] = await Promise.all([

      pool.query(
        `SELECT 
          id,
          episode_title AS title,
          thumbnail_url,
          'premium' AS type
         FROM premium_episodes
         WHERE episode_title LIKE ?
       
         LIMIT ?`,
        [like, limit]
      ),

      pool.query(
        `SELECT 
          id,
          season_title AS title,
          season_thumbnail,
          'season' AS type
         FROM premium_season
         WHERE season_title LIKE ?
        
         LIMIT ?`,
        [like, limit]
      ),

      pool.query(
        `SELECT 
          id,
          video_title AS title,
          thumbnail_url1,
          'video' AS type
         FROM video_master
         WHERE video_title LIKE ?
         ORDER BY id DESC
         LIMIT ?`,
        [like, limit]
      ),

      pool.query(
        `SELECT 
          id,
          title,
          thumbnail1,
          'bhajan' AS type
         FROM bhajan
         WHERE title LIKE ?
         ORDER BY id DESC
         LIMIT ?`,
        [like, limit]
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        premiumEpisodes,
        premiumSeasons,
        videoMaster,
        bhajan,
      },
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
