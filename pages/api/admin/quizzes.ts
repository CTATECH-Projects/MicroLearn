import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetQuizzes(req, res);
  } else if (req.method === 'POST') {
    return handleCreateQuiz(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateQuiz(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteQuiz(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetQuizzes(req: NextApiRequest, res: NextApiResponse) {
  const { lessonId } = req.query;

  try {
    let query = 'SELECT id, question, options, correct_answer, explanation, lesson_id, "order", created_at FROM quizzes';
    const params: any[] = [];

    if (lessonId) {
      query += ' WHERE lesson_id = $1';
      params.push(lessonId);
    }

    query += ' ORDER BY "order" ASC, created_at DESC';

    const quizzes = params.length > 0 
      ? await sql(query, params)
      : await sql(query);
    
    console.log('[Admin] Fetched quizzes:', quizzes.length);
    return res.status(200).json(quizzes);
  } catch (error) {
    console.error('[Admin] Get quizzes error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateQuiz(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { question, options, correctAnswer, explanation, lessonId, order } = req.body;

  if (!question || !options || correctAnswer === undefined || !lessonId) {
    return res.status(400).json({ error: 'Missing required fields: question, options, correctAnswer, lessonId' });
  }

  try {
    const newQuiz = await sql`
      INSERT INTO quizzes (question, options, correct_answer, explanation, lesson_id, "order", created_at)
      VALUES (${question}, ${JSON.stringify(options)}, ${correctAnswer}, ${explanation || null}, ${lessonId}, ${order || 0}, NOW())
      RETURNING id, question, options, correct_answer, explanation, lesson_id, "order"
    `;

    console.log('[Admin] Quiz created:', newQuiz[0].id);
    return res.status(201).json(newQuiz[0]);
  } catch (error) {
    console.error('[Admin] Create quiz error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateQuiz(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id, question, options, correctAnswer, explanation, lessonId, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Quiz ID is required' });
  }

  try {
    const updatedQuiz = await sql`
      UPDATE quizzes
      SET 
        question = COALESCE(${question}, question),
        options = COALESCE(${options ? JSON.stringify(options) : null}, options),
        correct_answer = COALESCE(${correctAnswer}, correct_answer),
        explanation = COALESCE(${explanation}, explanation),
        lesson_id = COALESCE(${lessonId}, lesson_id),
        "order" = COALESCE(${order}, "order")
      WHERE id = ${id}
      RETURNING id, question, options, correct_answer, explanation, lesson_id, "order"
    `;

    if (updatedQuiz.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    console.log('[Admin] Quiz updated:', id);
    return res.status(200).json(updatedQuiz[0]);
  } catch (error) {
    console.error('[Admin] Update quiz error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDeleteQuiz(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Quiz ID is required' });
  }

  try {
    const result = await sql`DELETE FROM quizzes WHERE id = ${id}`;

    console.log('[Admin] Quiz deleted:', id);
    return res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('[Admin] Delete quiz error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
