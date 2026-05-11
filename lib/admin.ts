import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './jwt';
import { sql } from './db';

export async function requireAdmin(req: NextApiRequest, res: NextApiResponse): Promise<number | null> {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Unauthorized - no token provided' });
    return null;
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      res.status(401).json({ error: 'Unauthorized - invalid token' });
      return null;
    }

    // Check if user is admin
    const userResult = await sql`
      SELECT role FROM users WHERE id = ${decoded.userId}
    `;

    if (userResult.length === 0 || userResult[0].role !== 'admin') {
      res.status(403).json({ error: 'Forbidden - admin access required' });
      return null;
    }

    return decoded.userId;
  } catch (error) {
    console.error('[Admin Auth] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return null;
  }
}
