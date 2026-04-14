import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

export async function GET(req) {
  try {
    // 🔐 Get token (Header OR Cookie)
    const authHeader = req.headers.get("authorization");
    const token =
      authHeader?.split(" ")[1] ||
      req.cookies.get("jwttoken")?.value;

    if (!token) {
      return NextResponse.json({
        isPremium: false,
        isPremiumActive: false,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json({
        isPremium: false,
        isPremiumActive: false,
      });
    }

    /* 🔥 Fetch latest premium record */
    const [[record]] = await pool.query(
      `
      SELECT plan_id, purchase_date, user_id, transaction_status, expire_date
      FROM premium_transaction_record
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [decoded.id]
    );

    if (!record) {
      return NextResponse.json({
        isPremium: false,
        isPremiumActive: false,
      });
    }

    /* ⏰ Normalize expiry date */
    const expireTime =
      typeof record.expire_date === "number"
        ? record.expire_date
        : new Date(record.expire_date).getTime();

    const now = Date.now();

    /* ❌ Expired */
    if (expireTime < now) {
      return NextResponse.json({
        isPremium: false,
        isPremiumActive: false,
        premiumExpired: true,
        premiumExpireDate: expireTime,
      });
    }

    /* ✅ ACTIVE SUBSCRIPTION */
    return NextResponse.json({
      isPremium: true,              // ✅ FRONTEND KEY
      isPremiumActive: true,        // ✅ BACKWARD SUPPORT
      premiumPlan: record.plan_id,
      premiumExpireDate: expireTime,
    });

  } catch (err) {
    console.error("Check subscription error:", err);
    return NextResponse.json({
      isPremium: false,
      isPremiumActive: false,
    });
  }
}
