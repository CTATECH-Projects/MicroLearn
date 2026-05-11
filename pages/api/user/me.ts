import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const userId = decoded.userId;
    console.log("[API] Getting user info for userId:", userId);

    // Get user info
    const userResult = await sql`
      SELECT id, email, name, role
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
    });
  } catch (error) {
    console.error("[API] Get user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
