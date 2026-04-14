import { verifyToken } from "@/lib/jwt";
import pool from "@/lib/db";

export async function GET(req) {
  const auth = req.headers.get("authorization");

  if (!auth)
    return Response.json({ success: false, message: "Token missing" });

  const token = auth.split(" ")[1];

  try {
    const user = verifyToken(token);

    const [rows] = await pool.query("SELECT * FROM users WHERE id=?", [user.id]);

    return Response.json({ success: true, user: rows[0] });
  } catch (err) {
    return Response.json({ success: false, message: "Invalid token" });
  }
}
