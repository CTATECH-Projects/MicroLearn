import { NextApiRequest, NextApiResponse } from 'next';
import { neon } from '@neondatabase/serverless';
import bcryptjs from 'bcryptjs';
import { generateToken, getTokenExpiration } from '@/lib/jwt';

const sql = neon(process.env.DATABASE_URL || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user
    const user = await sql`SELECT id, password_hash FROM users WHERE email = ${email}`;
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await bcryptjs.compare(password, user[0].password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user[0].id);
    const expiresAt = getTokenExpiration();

    console.log('[API] User logged in:', user[0].id, 'Token generated');

    return res.status(200).json({
      token,
      expiresAt: expiresAt.toISOString(),
      userId: user[0].id,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
