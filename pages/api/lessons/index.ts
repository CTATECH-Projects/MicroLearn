import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[API] Lessons endpoint called');

    // Get authentication token if provided
    const token = req.headers.authorization?.replace('Bearer ', '');
    let userId: number | null = null;

    console.log('[API] Token provided:', !!token);

    if (token) {
      try {
        const decoded = verifyToken(token);
        userId = decoded?.userId ?? null;
        console.log('[API] Token verified, userId:', userId);
      } catch (e) {
        console.log('[API] Token verification error:', e);
        // Token verification failed, proceed without user data
      }
    }

    // Get all tracks with progress if user is authenticated
    const tracksResult = await sql`
      SELECT id, title, icon, color, lessons_count
      FROM learning_tracks
      ORDER BY "order" ASC
    `;

    console.log('[API] Tracks from DB:', tracksResult.length);

    // Transform tracks for frontend - include progress if authenticated
    const tracks = await Promise.all(tracksResult.map(async (track: any) => {
      let progress = 0;
      
      if (userId) {
        try {
          // Count completed lessons in this track
          const progressResult = await sql`
            SELECT COUNT(*) as completed_count
            FROM user_progress up
            JOIN lessons l ON up.lesson_id = l.id
            WHERE l.track_id = ${track.id} AND up.user_id = ${userId} AND up.completed = true
          `;
          
          const completedCount = parseInt(progressResult[0]?.completed_count || 0);
          const totalLessons = track.lessons_count || 1;
          progress = Math.round((completedCount / totalLessons) * 100);
          console.log('[API] Track progress:', { trackId: track.id, completedCount, totalLessons, progress });
        } catch (e) {
          console.log('[API] Could not calculate track progress:', e);
        }
      }
      
      return {
        id: track.id,
        name: track.title,
        emoji: track.icon || '📚',
        lessons: track.lessons_count || 10,
        iconBg: track.color || '#EEF2FF',
        iconColor: '#3B4FFF',
        progress: progress,
      };
    }));

    // Get daily bite - first incomplete lesson for authenticated users, or just first lesson
    let dailyBite = null;

    if (userId) {
      // Get the first lesson that is NOT completed
      const dailyBiteResult = await sql`
        SELECT l.id, l.title, l.description, l.duration
        FROM lessons l
        LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ${userId}
        WHERE up.id IS NULL OR up.completed = FALSE
        ORDER BY l."order" ASC
        LIMIT 1
      `;

      if (dailyBiteResult[0]) {
        const lesson = dailyBiteResult[0];

        // Check if user has completed a lesson in the last 12 hours (cooldown)
        let canStart = true;
        let hoursUntilCanStart = 0;
        let lastCompletedDate: any = null;

        try {
          const streakResult = await sql`
            SELECT last_completed_date
            FROM user_streaks
            WHERE user_id = ${userId}
          `;

          if (streakResult[0] && streakResult[0].last_completed_date) {
            lastCompletedDate = streakResult[0].last_completed_date;
            const completedAt = new Date(lastCompletedDate).getTime();
            const now = Date.now();
            const hoursPassed = (now - completedAt) / (1000 * 60 * 60);

            if (hoursPassed < 12) {
              canStart = false;
              hoursUntilCanStart = Math.ceil(12 - hoursPassed);
            }
          }
        } catch (e) {
          // If user_streaks doesn't exist yet, user can start
          console.log('[API] User streak not found, allowing lesson start');
        }

        dailyBite = {
          lessonId: lesson.id,
          title: lesson.title,
          subtitle: lesson.description || 'Learn something new today',
          duration: `${lesson.duration || 5} min`,
          tag: 'DAILY BITE',
          can_start: canStart,
          hours_until_can_start: hoursUntilCanStart,
          last_completed_date: lastCompletedDate,
        };
      }
    } else {
      // For unauthenticated users, just get the first lesson
      const dailyBiteResult = await sql`
        SELECT l.id, l.title, l.description, l.duration
        FROM lessons l
        ORDER BY l."order" ASC
        LIMIT 1
      `;

      if (dailyBiteResult[0]) {
        const lesson = dailyBiteResult[0];
        dailyBite = {
          lessonId: lesson.id,
          title: lesson.title,
          subtitle: lesson.description || 'Learn something new today',
          duration: `${lesson.duration || 5} min`,
          tag: 'DAILY BITE',
          can_start: true,
          hours_until_can_start: 0,
        };
      }
    }

    // Get continue track (first track with lessons) - with progress
    let continueTrack = null;
    
    if (tracks[0]) {
      continueTrack = {
        id: tracks[0].id,
        name: tracks[0].name,
        emoji: tracks[0].emoji,
        completed: 0,
        total: tracks[0].lessons,
        progress: tracks[0].progress || 0,
        iconBg: tracks[0].iconBg,
        iconColor: tracks[0].iconColor,
        latestLessonTitle: "Start Learning",
        latestLessonDescription: "",
      };
    }

    // Get latest completed lesson title for continue track if authenticated
    if (userId && continueTrack) {
      try {
        const latestCompletedResult = await sql`
          SELECT l.title, l.description
          FROM lessons l
          JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ${userId}
          WHERE up.completed = TRUE
          ORDER BY up.completed_at DESC
          LIMIT 1
        `;

        if (latestCompletedResult[0]) {
          continueTrack.latestLessonTitle = latestCompletedResult[0].title;
          continueTrack.latestLessonDescription = latestCompletedResult[0].description;
        }
      } catch (e) {
        console.log('[API] Could not fetch latest lesson title');
      }
    }

    // Get weekly goal data for authenticated users
    let weeklyGoal = null;

    if (userId) {
      try {
        const weeklyResult = await sql`
          SELECT weekly_lessons_completed, weekly_goal, weekly_reset_date
          FROM user_streaks
          WHERE user_id = ${userId}
        `;

        if (weeklyResult[0]) {
          const streak = weeklyResult[0];
          let weeklyLessons = streak.weekly_lessons_completed || 0;
          
          console.log('[API] Weekly goal calculation:', {
            userId,
            weeklyLessons,
            weeklyGoal: streak.weekly_goal,
            weeklyResetDate: streak.weekly_reset_date,
          });
          let weeklyResetDate = streak.weekly_reset_date;

          // Check if weekly period has expired (7 days)
          if (weeklyResetDate) {
            const daysSinceReset =
              (Date.now() - new Date(weeklyResetDate).getTime()) /
              (1000 * 60 * 60 * 24);

            if (daysSinceReset >= 7) {
              weeklyLessons = 0;
              weeklyResetDate = new Date();
            }
          }

          weeklyGoal = {
            completed: weeklyLessons,
            total: streak.weekly_goal || 7,
            percentage: Math.round((weeklyLessons / (streak.weekly_goal || 7)) * 100),
          };
        }
      } catch (e) {
        // If weekly goal columns don't exist yet, use default values
        console.log('[API] Weekly goal columns not available, using defaults');
        weeklyGoal = {
          completed: 0,
          total: 7,
          percentage: 0,
        };
      }
    }

    const response: any = {
      tracks,
      daily_bite: dailyBite,
      continue_track: continueTrack,
      weekly_goal: weeklyGoal,
      completed_lessons: [],
      current_lesson: null,
    };

    // Get completed lessons and current lesson for authenticated users
    if (userId) {
      try {
        // Get the first lesson the user started today (current or in progress)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const currentLessonResult = await sql`
          SELECT l.id, l.title, l.description, l.duration, up.completed, up.started_at
          FROM lessons l
          LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ${userId}
          WHERE up.started_at >= ${today.toISOString()}
          ORDER BY up.started_at DESC
          LIMIT 1
        `;

        if (currentLessonResult[0]) {
          const lesson = currentLessonResult[0];
          response.current_lesson = {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            duration: lesson.duration || 5,
            completed: lesson.completed || false,
            startedAt: lesson.started_at,
          };
        }
      } catch (e) {
        console.log('[API] Error fetching current lesson:', e);
      }

      try {
        // Get all completed lessons for revisiting
        const completedLessonsResult = await sql`
          SELECT l.id, l.title, l.description, l.duration, up.completed_at
          FROM lessons l
          JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ${userId}
          WHERE up.completed = TRUE
          ORDER BY up.completed_at DESC
        `;

        console.log('[API] Completed lessons query result:', completedLessonsResult.length, 'lessons');

        response.completed_lessons = completedLessonsResult.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration || 5,
          completedAt: lesson.completed_at,
        }));
      } catch (e) {
        console.log('[API] Error fetching completed lessons:', e);
      }
    }

    console.log('[API] Returning:', { tracks: tracks.length, daily_bite: !!dailyBite, continue_track: !!continueTrack, weekly_goal: !!weeklyGoal, completed_lessons: response.completed_lessons.length, current_lesson: !!response.current_lesson });

    return res.status(200).json(response);
  } catch (error) {
    console.error('[API] Get lessons error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}


