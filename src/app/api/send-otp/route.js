// src/app/api/send-otp/route.js
export const runtime = "nodejs"; // <--- Correct Node runtime

import redis from "@/lib/redis";
import nodemailer from "nodemailer";
import { sendSMS } from "@/lib/sendSms";

export async function POST(req) {
  try {
    const { mobile, email } = await req.json();

    if (!mobile && !email) {
      return new Response(JSON.stringify({ success: false, message: "Mobile or Email required" }), { status: 400 });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    if (mobile) {
      if (mobile.length !== 10) {
        return new Response(JSON.stringify({ success: false, message: "Invalid mobile number" }), { status: 400 });
      }

      await redis.set(`otp:${mobile}`, otp, "EX", 300);
      await sendSMS(mobile, otp);

      return new Response(JSON.stringify({ success: true, message: "OTP sent to mobile" }), { status: 200 });
    }

    if (email) {
      await redis.set(`otp:${email}`, otp, "EX", 300);

      const transporter = nodemailer.createTransport({
        host: "smtp.office365.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.OFFICE365_EMAIL,
          pass: process.env.OFFICE365_PASS,
        },
        tls: { ciphers: "SSLv3" },
      });

      await transporter.sendMail({
        from: `"Sanskar TV" <${process.env.OFFICE365_EMAIL}>`,
        to: email,
        subject: "OTP Verification",
        text: `Dear User, ${otp} is your OTP for Sanskar TV verification`,
        html: `<p>Dear User, <b>${otp}</b> is your OTP for Sanskar TV verification</p>`,
      });

      return new Response(JSON.stringify({ success: true, message: "OTP sent to email" }), { status: 200 });
    }
  } catch (err) {
    console.error("OTP ERROR:", err);
    return new Response(JSON.stringify({ success: false, message: "Failed to send OTP" }), { status: 500 });
  }
}
