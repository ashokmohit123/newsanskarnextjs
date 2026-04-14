import { NextResponse } from "next/server";
import pool from "@/lib/db";
import crypto from "crypto";
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    /* =============================
       📥 REQUEST BODY
    ============================= */
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan,
    } = await req.json();

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !plan
    ) {
      return NextResponse.json(
        { success: false, message: "Missing payment data" },
        { status: 400 }
      );
    }

    /* =============================
       🔐 AUTH
    ============================= */
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    /* =============================
       🔎 VERIFY RAZORPAY SIGNATURE
    ============================= */
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    /* =============================
       📆 PLAN VALIDITY
    ============================= */
    let validity = 0;

    switch (plan) {
      case "Premium":
        validity = 420;
        break;
      case "Super":
        validity = 240;
        break;
      case "Normal":
        validity = 50;
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid plan" },
          { status: 400 }
        );
    }

    const purchase_date = Date.now();
    const expire_date =
      purchase_date + validity * 24 * 60 * 60 * 1000;

    /* =============================
       💾 INSERT SUCCESS TRANSACTION
    ============================= */
    await pool.query(
      `INSERT INTO premium_transaction_record
       (
         user_id,
         plan_id,
         purchase_date,
         expire_date,
         validity,
         transaction_status,
         pre_transaction_id,
         post_transaction_id
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,                // user_id
        plan,                   // plan_id
        purchase_date,          // purchase_date (ms)
        expire_date,            // expire_date (ms)
        validity,               // validity (days)
        1,                      // ✅ transaction_status = SUCCESS
        razorpay_order_id,      // pre_transaction_id
        razorpay_payment_id,    // post_transaction_id
      ]
    );

    /* =============================
       ✅ RESPONSE
    ============================= */
    return NextResponse.json({
      success: true,
      message: "Subscription activated successfully",
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
