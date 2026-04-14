import redis from "@/lib/redis";
import { signToken } from "@/lib/jwt";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const { mobile, email, otp, device_token } = await req.json();

    if ((!mobile && !email) || !otp) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Mobile/Email and OTP required",
        }),
        { status: 400 }
      );
    }

    /* =========================
       🔹 VERIFY OTP
    ========================= */
    const key = mobile ? `otp:${mobile}` : `otp:${email}`;
    const storedOtp = await redis.get(key);

    if (!storedOtp) {
      return new Response(
        JSON.stringify({ success: false, message: "OTP expired" }),
        { status: 400 }
      );
    }

    if (storedOtp !== otp) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid OTP" }),
        { status: 400 }
      );
    }

    /* =========================
       🔹 FIND USER
    ========================= */
    let user;

    if (mobile) {
      const [[existingUser]] = await pool.query(
        "SELECT id, mobile, email FROM users WHERE mobile = ? LIMIT 1",
        [mobile]
      );
      user = existingUser;
    } else {
      const [[existingUser]] = await pool.query(
        "SELECT id, mobile, email FROM users WHERE email = ? LIMIT 1",
        [email]
      );
      user = existingUser;
    }

    /* =========================
       🔹 INSERT USER
    ========================= */
    const safeDeviceToken = device_token || "web";

    if (!user) {
      let result;

      if (mobile) {
        [result] = await pool.query(
          `INSERT INTO users (mobile, device_token, creation_time)
           VALUES (?, ?, NOW())`,
          [mobile, safeDeviceToken]
        );

        user = {
          id: result.insertId,
          mobile,
          email: null,
        };
      } else {
        [result] = await pool.query(
          `INSERT INTO users (email, device_token, creation_time)
           VALUES (?, ?, NOW())`,
          [email, safeDeviceToken]
        );

        user = {
          id: result.insertId,
          mobile: null,
          email,
        };
      }
    } else {
      // 🔁 Update device_token on every login
      await pool.query(
        `UPDATE users SET device_token = ? WHERE id = ?`,
        [safeDeviceToken, user.id]
      );
    }

    /* =========================
       🔹 CREATE JWT
    ========================= */
    const token = signToken({
      id: user.id,
      mobile: user.mobile,
      email: user.email,
    });

    /* =========================
       🔹 DELETE OTP
    ========================= */
    await redis.del(key);

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP verified successfully",
        token,
        user,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
