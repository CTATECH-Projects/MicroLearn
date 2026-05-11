import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { lessonId, quizScore } = req.body;

  if (!lessonId) {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  try {
    const decoded = verifyToken(token);
    // ← Add this check
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const userId = decoded.userId;

    const today = new Date().toISOString().split("T")[0];

    // Mark lesson as complete
    await sql`
      INSERT INTO user_progress (user_id, lesson_id, completed, completed_at, quiz_score)
      VALUES (${userId}, ${lessonId}, true, NOW(), ${quizScore || null})
      ON CONFLICT (user_id, lesson_id) DO UPDATE
      SET completed = true, completed_at = NOW(), quiz_score = ${
        quizScore || null
      }
    `;

    // Get or create user streak
    const streakResult = await sql`
      SELECT current_streak, longest_streak, last_completed_date, total_lessons_completed,
             weekly_lessons_completed, weekly_reset_date, weekly_goal
      FROM user_streaks
      WHERE user_id = ${userId}
    `;

    let streak = streakResult[0] || {
      current_streak: 0,
      longest_streak: 0,
      last_completed_date: null,
      total_lessons_completed: 0,
      weekly_lessons_completed: 0,
      weekly_reset_date: null,
      weekly_goal: 7,
    };

    const lastCompletedDate = streak.last_completed_date
      ? new Date(streak.last_completed_date).toISOString().split("T")[0]
      : null;
    let newStreak = streak.current_streak;

    if (lastCompletedDate !== today) {
      if (
        lastCompletedDate ===
        new Date(Date.now() - 86400000).toISOString().split("T")[0]
      ) {
        newStreak = streak.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, streak.longest_streak);

    // Handle weekly goal reset (if 7 days have passed since weekly_reset_date)
    let weeklyLessonsCompleted = 1;
    let weeklyResetDate = new Date();

    if (streakResult.length > 0 && streak.weekly_reset_date) {
      const daysSinceReset =
        (Date.now() - new Date(streak.weekly_reset_date).getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysSinceReset >= 7) {
        // Reset weekly progress
        weeklyLessonsCompleted = 1;
        weeklyResetDate = new Date();
      } else {
        // Continue from previous week
        weeklyLessonsCompleted = streak.weekly_lessons_completed + 1;
        weeklyResetDate = new Date(streak.weekly_reset_date);
      }
    }

    // Update user streak
    if (streakResult.length > 0) {
      await sql`
        UPDATE user_streaks
        SET current_streak = ${newStreak}, longest_streak = ${newLongestStreak}, 
            last_completed_date = NOW(),
            total_lessons_completed = total_lessons_completed + 1,
            weekly_lessons_completed = ${weeklyLessonsCompleted},
            weekly_reset_date = ${weeklyResetDate.toISOString()},
            updated_at = NOW()
        WHERE user_id = ${userId}
      `;
    } else {
      await sql`
        INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_completed_date, total_lessons_completed, weekly_lessons_completed, weekly_reset_date)
        VALUES (${userId}, 1, 1, NOW(), 1, 1, ${new Date().toISOString()})
      `;
    }

    return res.status(200).json({
      success: true,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      weeklyLessonsCompleted: weeklyLessonsCompleted,
      weeklyGoal: 7,
      weeklyPercentage: Math.round((weeklyLessonsCompleted / 7) * 100),
      message: "Lesson completed successfully",
    });
  } catch (error) {
    console.error("Complete lesson error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
