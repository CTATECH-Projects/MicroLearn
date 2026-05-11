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

  try {
    if (!token) {
      console.log("[API] No token provided, returning unauthenticated status");
      return res
        .status(401)
        .json({ error: "Unauthorized - no token provided" });
    }

    const decoded = verifyToken(token);
    console.log("[API] Token verification result:", {
      hasDecoded: !!decoded,
      hasUserId: decoded?.userId,
    });

    if (!decoded || !decoded.userId) {
      console.log("[API] Invalid token");
      return res.status(401).json({ error: "Unauthorized - invalid token" });
    }

    const userId = decoded.userId;
    console.log("[API] Getting stats for userId:", userId);

    // Get user info
    const userResult = await sql`
      SELECT email,name,id 
      FROM users
      WHERE id = ${userId}
    `;

    // const userName = userResult[0]?.email?.split("@")[0] || "User";
    const userName = userResult[0]?.name || "User";
    console.log("[API] User name:", userName);

    // Get user streak
    const streakResult = await sql`
      SELECT current_streak, longest_streak, total_lessons_completed
      FROM user_streaks
      WHERE user_id = ${userId}
    `;

    const streak = streakResult[0] || {
      current_streak: 0,
      longest_streak: 0,
      total_lessons_completed: 0,
    };

    // Get badges
    const badgesResult = await sql`
      SELECT badge_id, badge_name, earned_at
      FROM user_badges
      WHERE user_id = ${userId}
      ORDER BY earned_at DESC
    `;

    const response = {
      userResult: userResult,
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
      total_lessons_completed: streak.total_lessons_completed,
      user_name: userName,
      weekly_completion: 0,
      lessons_to_go: 3,
      badges: badgesResult || [],
    };

    console.log("[API] Stats response sent for user:", userName);
    return res.status(200).json(response);
  } catch (error) {
    console.error("[API] Stats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
