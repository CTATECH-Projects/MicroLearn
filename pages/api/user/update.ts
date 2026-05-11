import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
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
    const { name, currentPassword, newPassword } = req.body;

    // Validate input
    if (!name && !newPassword) {
      return res
        .status(400)
        .json({ error: "Either name or password must be provided" });
    }

    // Get current user
    const userResult = await sql`
      SELECT id, email, name, password_hash
      FROM users
      WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userResult[0];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required" });
      }

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password_hash
      );

      if (!passwordMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await sql`
        UPDATE users
        SET password_hash = ${hashedNewPassword}, updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    // Update name if provided
    if (name) {
      await sql`
        UPDATE users
        SET name = ${name}, updated_at = NOW()
        WHERE id = ${userId}
      `;
    }

    // Return updated user info
    const updatedUser = await sql`
      SELECT id, email, name, role
      FROM users
      WHERE id = ${userId}
    `;

    console.log("[API] User updated:", userId);
    return res.status(200).json({
      id: updatedUser[0].id,
      email: updatedUser[0].email,
      name: updatedUser[0].name,
      role: updatedUser[0].role || "user",
    });
  } catch (error) {
    console.error("[API] Update user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
