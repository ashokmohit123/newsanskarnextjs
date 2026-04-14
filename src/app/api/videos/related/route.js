import { NextResponse } from "next/server";
import mysql from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const video_id = body.video_id;  // ✅ FIXED
    const page_no = body.page_no || 1;
    const limit = body.limit || 15;

    if (!video_id) {
      return NextResponse.json(
        { status: false, message: "video_id is required", data: [] },
        { status: 400 }
      );
    }

    const offset = (page_no - 1) * limit;

    // 1️⃣ Get current video info
    const [current] = await mysql.query(
      "SELECT id, video_title, category, youtube_url, thumbnail_url, author_name, views,	video_url  FROM video_master WHERE id = ?",
      [video_id]
    );

    if (!current.length) {
      return NextResponse.json({
        status: false,
        message: "Invalid video_id",
        data: []
      });
    }

    const category = current[0].category;

    // 2️⃣ Fetch related videos
    const [related] = await mysql.query(
      `SELECT id, video_title, youtube_url, thumbnail_url, views, author_name, video_url, category 
       FROM video_master 
       WHERE category = ? AND id != ?
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [category, video_id, limit, offset]
    );

    return NextResponse.json({
      status: true,
      message: "Success",
      data: {
        currentVideo: current[0],
        relatedVideos: related
      }
    });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { status: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
