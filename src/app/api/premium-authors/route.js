import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET ALL AUTHORS
export async function GET() {
  try {
    const [rows] = await pool.query(

      "SELECT * FROM premium_author WHERE status = 0 ORDER BY position ASC"
      
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Database Error" },
      { status: 500 }
    );
  }
}

// CREATE AUTHOR
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      p_author_name,
      author_thumbnail,
      card_thumbnail,
      cat_ids,
      is_god = 0,
      uploaded_by = 1,
      position = 0,
    } = body;

    if (!p_author_name || !author_thumbnail || !card_thumbnail || !cat_ids) {
      return NextResponse.json({
        success: false,
        message: "All fields are required.",
      });
    }

    const creation_time = Date.now();

    const [result] = await pool.query(
      `INSERT INTO premium_author 
      (p_author_name, author_thumbnail, card_thumbnail, cat_ids, is_god, creation_time, modified_time, uploaded_by, status, position)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)`,
      [
        p_author_name,
        author_thumbnail,
        card_thumbnail,
        cat_ids,
        is_god,
        creation_time,
        creation_time,
        uploaded_by,
        position,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Author created successfully",
      id: result.insertId,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
}


// --------------------------------
// PUT → Update Author
// --------------------------------
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    const body = await req.json();
    const {
      p_author_name,
      author_thumbnail,
      card_thumbnail,
      cat_ids,
      is_god,
      status,
      position,
    } = body;

    const modified_time = Date.now();

    await pool.query(
      `UPDATE premium_author SET 
       p_author_name=?, author_thumbnail=?, card_thumbnail=?, 
       cat_ids=?, is_god=?, status=?, position=?, modified_time=? 
       WHERE id=?`,
      [
        p_author_name,
        author_thumbnail,
        card_thumbnail,
        cat_ids,
        is_god,
        status,
        position,
        modified_time,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Author updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
}

// --------------------------------
// DELETE → Soft Delete Author
// --------------------------------
export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    await pool.query(
      "UPDATE premium_author SET status = 2 WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Author deleted (soft delete)",
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Database error",
      error: err.message,
    });
  }
}

