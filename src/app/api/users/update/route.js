import { verifyToken } from "@/lib/jwt";
import pool from "@/lib/db";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }

    const userData = verifyToken(token);
    const formData = await req.formData();

    const username = formData.get("username");
    const file = formData.get("profile_picture");

    let imagePath = null;

    if (file && file.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads");

      // ✅ CREATE uploads FOLDER IF NOT EXISTS
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name.replace(/\s+/g, "_");
      const filename = `${Date.now()}_${safeName}`;
      const uploadPath = path.join(uploadDir, filename);

      await writeFile(uploadPath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // ✅ UPDATE QUERY
    let query = "UPDATE users SET username = ?";
    const params = [username];

    if (imagePath) {
      query += ", profile_picture = ?";
      params.push(imagePath);
    }

    query += " WHERE id = ?";
    params.push(userData.id);

    await pool.query(query, params);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
    });
  }
}
