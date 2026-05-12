import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';
import bcrypt from 'bcrypt';
import { verifyToken } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { old_password, new_password } = req.body;

  if (!old_password || !new_password) {
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  // Verify token
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user's current password hash
    const userResult = await sql`
      SELECT id, password_hash FROM users WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult[0];

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(old_password, user.password_hash);
    if (!isOldPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, 10);

    // Update password in database
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash}, updated_at = NOW()
      WHERE id = ${userId}
    `;

    console.log('[API] Password changed for user:', userId);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
