import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetLessons(req, res);
  } else if (req.method === 'POST') {
    return handleCreateLesson(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateLesson(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteLesson(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetLessons(req: NextApiRequest, res: NextApiResponse) {
  const { trackId } = req.query;

  try {
    let query = 'SELECT id, title, description, duration, content, image_url, track_id, "order", created_at FROM lessons';
    const params: any[] = [];

    if (trackId) {
      query += ' WHERE track_id = $1';
      params.push(trackId);
    }

    query += ' ORDER BY "order" ASC';

    const lessons = await sql(query, params);
    return res.status(200).json(lessons);
  } catch (error) {
    console.error('[Admin] Get lessons error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateLesson(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { title, description, duration = 5, content, imageUrl, trackId, order = 0 } = req.body;

  if (!title || !trackId) {
    return res.status(400).json({ error: 'Missing required fields: title, trackId' });
  }

  try {
    console.log('[Admin] Creating lesson:', { title, trackId });

    const newLesson = await sql`
      INSERT INTO lessons (title, description, duration, content, image_url, track_id, "order", created_at)
      VALUES (${title}, ${description || null}, ${duration}, ${content || null}, ${imageUrl || null}, ${trackId}, ${order}, NOW())
      RETURNING id, title, description, duration, content, image_url, track_id, "order"
    `;

    console.log('[Admin] Lesson created successfully:', newLesson[0]?.id);
    return res.status(201).json(newLesson[0]);
  } catch (error) {
    console.error('[Admin] Create lesson error:', error);
    return res.status(500).json({ error: 'Failed to create lesson', details: String(error) });
  }
}

async function handleUpdateLesson(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id, title, description, duration, content, imageUrl, trackId, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  try {
    console.log('[Admin] Updating lesson:', id, { title, trackId });
    
    const updatedLesson = await sql`
      UPDATE lessons
      SET 
        title = ${title || undefined},
        description = ${description || undefined},
        duration = ${duration || undefined},
        content = ${content || undefined},
        image_url = ${imageUrl || undefined},
        track_id = ${trackId || undefined},
        "order" = ${order || undefined}
      WHERE id = ${id}
      RETURNING id, title, description, duration, content, image_url, track_id, "order"
    `;

    if (updatedLesson.length === 0) {
      console.log('[Admin] Lesson not found:', id);
      return res.status(404).json({ error: 'Lesson not found' });
    }

    console.log('[Admin] Lesson updated successfully:', id);
    return res.status(200).json(updatedLesson[0]);
  } catch (error) {
    console.error('[Admin] Update lesson error:', error);
    return res.status(500).json({ error: 'Failed to update lesson', details: String(error) });
  }
}

async function handleDeleteLesson(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Lesson ID is required' });
  }

  try {
    // Delete associated user progress
    await sql`DELETE FROM user_progress WHERE lesson_id = ${id}`;

    // Delete the lesson
    const result = await sql`DELETE FROM lessons WHERE id = ${id}`;

    console.log('[Admin] Lesson deleted:', id);
    return res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('[Admin] Delete lesson error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
