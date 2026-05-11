import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGetTracks(req, res);
  } else if (req.method === 'POST') {
    return handleCreateTrack(req, res);
  } else if (req.method === 'PUT') {
    return handleUpdateTrack(req, res);
  } else if (req.method === 'DELETE') {
    return handleDeleteTrack(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetTracks(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tracks = await sql`
      SELECT id, title, icon, color, image, lessons_count, "order", created_at
      FROM learning_tracks
      ORDER BY "order" ASC
    `;
    return res.status(200).json(tracks);
  } catch (error) {
    console.error('[Admin] Get tracks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateTrack(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { title, icon = '', color = '', image = '', lessons_count = 0, order = 0 } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTrack = await sql`
      INSERT INTO learning_tracks (title, icon, color, image, lessons_count, "order", created_at)
      VALUES (${title}, ${icon}, ${color}, ${image}, ${lessons_count}, ${order}, NOW())
      RETURNING id, title, icon, color, image, lessons_count, "order"
    `;

    console.log('[Admin] Track created:', newTrack[0].id);
    return res.status(201).json(newTrack[0]);
  } catch (error) {
    console.error('[Admin] Create track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateTrack(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id, title, icon, color, image, lessons_count, order } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    const updatedTrack = await sql`
      UPDATE learning_tracks
      SET 
        title = ${title || 'title'},
        icon = ${icon || null},
        color = ${color || null},
        image = ${image || null},
        lessons_count = ${lessons_count || 0},
        "order" = ${order !== undefined ? order : null}
      WHERE id = ${id}
      RETURNING id, title, icon, color, image, lessons_count, "order"
    `;

    if (updatedTrack.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    console.log('[Admin] Track updated:', id);
    return res.status(200).json(updatedTrack[0]);
  } catch (error) {
    console.error('[Admin] Update track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleDeleteTrack(req: NextApiRequest, res: NextApiResponse) {
  const userId = await requireAdmin(req, res);
  if (!userId) return;

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    // Delete associated lessons first
    await sql`DELETE FROM lessons WHERE track_id = ${id}`;

    // Delete the track
    const result = await sql`DELETE FROM learning_tracks WHERE id = ${id}`;

    console.log('[Admin] Track deleted:', id);
    return res.status(200).json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('[Admin] Delete track error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
