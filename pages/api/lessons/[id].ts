import { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  try {
    console.log("[API] Fetching lesson:", id);

    // Get lesson from database - try exact match first
    let lessonResult: string | any[];

    try {
      lessonResult = await sql`
        SELECT id, title, description, duration, content, image_url, track_id
        FROM lessons
        WHERE id = ${id}
      `;
    } catch (queryError) {
      console.error("[API] Query error:", queryError);
      lessonResult = [];
    }

    // If not found, try to match by title (case-insensitive) for backward compatibility
    if (lessonResult.length === 0) {
      console.log("[API] Lesson not found by ID, trying by title...");
      // Extract a readable title from ID like "cybersecurity-basics-lesson-1" -> "cybersecurity basics"
      const titleFromId = id
        .replace(/lesson-\d+$/, "") // Remove "lesson-N" suffix
        .replace(/-/g, " ")
        .trim();

      try {
        const likePattern = `%${titleFromId}%`;
        lessonResult = await sql`
          SELECT id, title, description, duration, content, image_url, track_id
          FROM lessons
          WHERE LOWER(title) LIKE LOWER(${likePattern})
          LIMIT 1
        `;
      } catch (titleQueryError) {
        console.error("[API] Title query error:", titleQueryError);
        lessonResult = [];
      }
    }

    if (lessonResult.length === 0) {
      console.log("[API] Lesson not found:", id);
      return res.status(404).json({ error: "Lesson not found" });
    }

    const lesson = lessonResult[0];
    console.log("[API] Lesson found:", lesson.title);

    // Parse the content if it's a JSON string, otherwise treat as plain text
    let parsedContent = [];
    
    if (typeof lesson.content === "string") {
      try {
        const parsed = JSON.parse(lesson.content);
        if (Array.isArray(parsed)) {
          parsedContent = parsed;
        } else if (parsed.type) {
          parsedContent = [parsed];
        } else {
          parsedContent = [{ type: "paragraph", text: lesson.content }];
        }
      } catch (e) {
        // If parsing fails, treat as plain text
        parsedContent = [{ type: "paragraph", text: lesson.content }];
      }
    }

    const response = {
      id: lesson.id,
      title: lesson.title,
      level: "Beginner",
      readTime: `${lesson.duration || 5} min read`,
      heroImage:
        lesson.image_url ||
        "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80",
      description: lesson.description,
      sections: parsedContent.length > 0 ? parsedContent : [{ type: "paragraph", text: lesson.description }],
      trackId: lesson.track_id,
    };

    console.log("[API] Lesson response prepared");
    return res.status(200).json(response);
  } catch (error) {
    console.error("[API] Get lesson error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) });
  }
}
