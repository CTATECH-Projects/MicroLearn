import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';

// Helper to verify admin
async function requireAdmin(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }

  const token = authHeader.slice(7);
  try {
    const sessions = await sql`
      SELECT user_id FROM sessions WHERE token = ${token} AND expires_at > NOW()
    `;

    if (sessions.length === 0) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return null;
    }

    const user_id = sessions[0].user_id;

    // Check if user is admin
    const users = await sql`
      SELECT role FROM users WHERE id = ${user_id}
    `;

    if (users.length === 0 || users[0].role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
      return null;
    }

    return user_id;
  } catch (error) {
    console.error('[Admin] Auth error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminId = await requireAdmin(req, res);
  if (!adminId) return;

  try {
    // Get total users
    const totalUsersResult = await sql`
      SELECT COUNT(*) as count FROM users WHERE role = 'user'
    `;

    // Get active users (users with activity in last 7 days)
    const activeUsersResult = await sql`
      SELECT COUNT(DISTINCT u.id) as count 
      FROM users u
      JOIN user_progress up ON u.id = up.user_id
      WHERE u.role = 'user' AND up.started_at > NOW() - INTERVAL '7 days'
    `;

    // Get users with active streaks
    const activeStreaksResult = await sql`
      SELECT COUNT(*) as count 
      FROM user_streaks 
      WHERE current_streak > 0
    `;

    // Get user stats with engagement
    const userStatsResult = await sql`
      SELECT 
        u.id,
        u.email,
        u.name,
        u.created_at,
        COALESCE(us.current_streak, 0) as current_streak,
        COALESCE(us.longest_streak, 0) as longest_streak,
        COALESCE(us.total_lessons_completed, 0) as lessons_completed,
        COUNT(DISTINCT up.id) as total_progress,
        COALESCE(AVG(CAST(up.quiz_score AS FLOAT)), 0) as avg_score
      FROM users u
      LEFT JOIN user_streaks us ON u.id = us.user_id
      LEFT JOIN user_progress up ON u.id = up.user_id
      WHERE u.role = 'user'
      GROUP BY u.id, u.email, u.name, u.created_at, us.current_streak, us.longest_streak, us.total_lessons_completed
      ORDER BY COALESCE(us.current_streak, 0) DESC, u.created_at DESC
      LIMIT 100
    `;

    // Get engagement overview
    const engagementOverviewResult = await sql`
      SELECT 
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT CASE WHEN up.completed = true THEN u.id END) as users_completed_lessons,
        COALESCE(AVG(CAST(us.current_streak AS FLOAT)), 0) as avg_streak,
        COALESCE(MAX(us.longest_streak), 0) as max_streak
      FROM users u
      LEFT JOIN user_progress up ON u.id = up.user_id
      LEFT JOIN user_streaks us ON u.id = us.user_id
      WHERE u.role = 'user'
    `;

    const totalUsersCount = parseInt(totalUsersResult[0]?.count) || 0;
    const activeUsersCount = parseInt(activeUsersResult[0]?.count) || 0;
    const activeStreaksCount = parseInt(activeStreaksResult[0]?.count) || 0;

    console.log('[Admin] Users stats:', {
      totalUsers: totalUsersCount,
      activeUsers: activeUsersCount,
      activeStreaks: activeStreaksCount,
      userStats: userStatsResult.length,
    });

    return res.status(200).json({
      totalUsers: totalUsersCount,
      activeUsers: activeUsersCount,
      activeStreaks: activeStreaksCount,
      engagementOverview: engagementOverviewResult[0] || {},
      userStats: userStatsResult || [],
    });
  } catch (error) {
    console.error('[Admin] Get users error:', error);
    return res.status(500).json({ error: 'Internal server error', details: String(error) });
  }
}
