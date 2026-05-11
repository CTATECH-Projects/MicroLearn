import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[API] JWT_SECRET available:', !!process.env.JWT_SECRET);

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Track ID is required' });
  }

  try {
    console.log('[API] Fetching track:', id);

    // Get track details
    const trackResult = await sql`
      SELECT id, title, description, icon, color, lessons_count
      FROM learning_tracks
      WHERE id = ${id}
    `;

    if (trackResult.length === 0) {
      console.log('[API] Track not found:', id);
      return res.status(404).json({ error: 'Track not found' });
    }

    const track = trackResult[0];

    // Get lessons for this track
    const lessonsResult = await sql`
      SELECT id, title, description, duration, image_url, "order"
      FROM lessons
      WHERE track_id = ${id}
      ORDER BY "order" ASC
    `;

    console.log('[API] Found track with', lessonsResult.length, 'lessons');

    // Check if user is authenticated
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');
    let userId: number | null = null;

    console.log('[API] Auth header:', authHeader ? 'present' : 'missing');
    console.log('[API] Token:', token ? `present (length: ${token.length})` : 'missing');

    if (token) {
      try {
        const decoded = verifyToken(token);
        userId = decoded?.userId ?? null;
        console.log('[API] Token verification result:', { decoded, userId });
      } catch (e) {
        console.log('[API] Token verification exception:', e);
        // Token verification failed, proceed without user data
      }
    } else {
      console.log('[API] No token provided in Authorization header');
    }

    // Map lessons with progress info
    let lessons = lessonsResult.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration || 5,
      imageUrl: lesson.image_url,
      completed: false,
      can_start: true,
      hours_until_can_start: 0,
    }));

    // If authenticated, add user progress and cooldown info
    if (userId) {
      console.log('[API] Fetching progress for userId:', userId, 'Lessons:', lessons.map(l => l.id));
      
      lessons = await Promise.all(
        lessons.map(async (lesson: any) => {
          const progressResult = await sql`
            SELECT completed, completed_at, quiz_score
            FROM user_progress
            WHERE user_id = ${userId} AND lesson_id = ${lesson.id}
          `;

          console.log('[API] Progress query for lesson', lesson.id, 'userId', userId, ':', {
            hasResults: progressResult.length > 0,
            result: progressResult[0],
          });

          const progress = progressResult[0];
          let can_start = true;
          let hours_until_can_start = 0;

          if (progress && progress.completed_at) {
            const completedAt = new Date(progress.completed_at).getTime();
            const now = Date.now();
            const hoursPassed = (now - completedAt) / (1000 * 60 * 60);

            if (hoursPassed < 12) {
              can_start = false;
              hours_until_can_start = Math.ceil(12 - hoursPassed);
            }
          }

          return {
            ...lesson,
            completed: progress?.completed || false,
            quiz_score: progress?.quiz_score || null,
            can_start: can_start,
            hours_until_can_start: hours_until_can_start,
          };
        })
      );
    } else {
      console.log('[API] No userId found, skipping progress fetch');
    }

    const response = {
      id: track.id,
      title: track.title,
      description: track.description,
      icon: track.icon || '📚',
      color: track.color || '#EEF2FF',
      lessonsCount: track.lessons_count || 0,
      lessons,
      progressPercentage: userId ? Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100) : 0,
    };

    const completedCount = lessons.filter(l => l.completed).length;
    console.log('[API] Track progress calculated:', {
      trackId: id,
      userId,
      totalLessons: lessons.length,
      completedLessons: completedCount,
      progressPercentage: response.progressPercentage,
      completedLessonIds: lessons.filter(l => l.completed).map(l => l.id),
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error('[API] Get track error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}

