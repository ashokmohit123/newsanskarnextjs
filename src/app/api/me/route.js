import { verifyToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("jwttoken")?.value;

  if (!token) return NextResponse.json({ user: null });

  const user = verifyToken(token);
  return NextResponse.json({ user });
}
