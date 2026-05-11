import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: lessonId } = req.query;

  if (!lessonId || typeof lessonId !== "string") {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("[API] Fetching quizzes for lesson:", lessonId);

    // Get all quizzes for this lesson, ordered by order field
    const quizzes = await sql`
      SELECT id, lesson_id, question, options, correct_answer, explanation, "order"
      FROM quizzes
      WHERE lesson_id = ${lessonId}
      ORDER BY "order" ASC
    `;

    console.log("[API] Found", quizzes.length, "quizzes");

    if (quizzes.length === 0) {
      console.log("[API] No quizzes found for lesson:", lessonId);
      return res.status(200).json([]);
    }

    // Transform the quizzes to the expected format
    const transformedQuizzes = quizzes.map((quiz: any) => ({
      id: quiz.id,
      question: quiz.question,
      options: typeof quiz.options === "string" 
        ? JSON.parse(quiz.options) 
        : quiz.options,
      correctAnswer: quiz.correct_answer,
      explanation: quiz.explanation,
      order: quiz.order,
    }));

    return res.status(200).json(transformedQuizzes);
  } catch (error) {
    console.error("[API] Get quizzes error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: String(error),
    });
  }
}
