import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // 🔥 Fetch premium history
    const [rows] = await pool.query(
      `SELECT id, purchase_date, plan_id, user_id,transaction_status, expire_date
       FROM premium_transaction_record
       WHERE user_id = ?
       ORDER BY id DESC`,
      [user.id]
    );  

    return NextResponse.json({
      success: true,
      transactions: rows,
    });
  } catch (error) {
    console.error("PREMIUM HISTORY ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
