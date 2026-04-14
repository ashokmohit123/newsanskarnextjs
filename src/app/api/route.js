import pool from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    return new Response(
      JSON.stringify({
        success: true,
        message: "sanskar1111 Database Connected Successfully!",
        rows
      }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Database Connection Failed",
        error: err.message
      }),
      { status: 500 }
    );
  }
}


