export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("jwttoken")?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ loggedIn: true });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
