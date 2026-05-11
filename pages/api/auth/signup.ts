import { NextApiRequest, NextApiResponse } from "next";
import { neon } from "@neondatabase/serverless";
import bcryptjs from "bcryptjs";
import { generateToken, getTokenExpiration } from "@/lib/jwt";

const sql = neon(process.env.DATABASE_URL || "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return res.status(500).json({ error: "Database configuration error" });
  }

  const { email, password, name } = req.body;
  console.log(email, password, name);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await sql`
      INSERT INTO users (email, password_hash, name, created_at, updated_at)
      VALUES (${email}, ${hashedPassword},${name}, NOW(), NOW())
      RETURNING id
    `;

    // Create user streak record
    await sql`
      INSERT INTO user_streaks (user_id, current_streak, longest_streak, total_lessons_completed, created_at, updated_at)
      VALUES (${user[0].id}, 0, 0, 0, NOW(), NOW())
    `;

    // Generate JWT token
    const token = generateToken(user[0].id);
    const expiresAt = getTokenExpiration();

    console.log('[API] User signed up:', user[0].id, 'Token generated');

    return res.status(200).json({
      token,
      expiresAt: expiresAt.toISOString(),
      userId: user[0].id,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
