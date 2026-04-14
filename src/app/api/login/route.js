import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req) {
  try {
    const { mobile, email } = await req.json();

    if (!mobile && !email) {
      return NextResponse.json(
        { success: false, message: "Mobile or Email required" },
        { status: 400 }
      );
    }

    // 🔹 Normally you fetch from DB
    const user = {
      id: 101,
      name: "Demo User",
      mobile: mobile || null,
      email: email || null,
    };

    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
      token,
    });

    // Optional: set token in cookie
    response.cookies.set("jwttoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
