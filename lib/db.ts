import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const sql = neon(process.env.DATABASE_URL);

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`
      SELECT id, email, password_hash, created_at FROM users WHERE email = ${email}
    `;
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function createUser(email: string, passwordHash: string) {
  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, created_at, updated_at)
      VALUES (${email}, ${passwordHash}, NOW(), NOW())
      RETURNING id, email, created_at
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function createSession(userId: number, token: string, expiresAt: Date) {
  try {
    const result = await sql`
      INSERT INTO sessions (user_id, token, expires_at, created_at)
      VALUES (${userId}, ${token}, ${expiresAt.toISOString()}, NOW())
      RETURNING id, token, expires_at
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getSessionByToken(token: string) {
  try {
    const result = await sql`
      SELECT id, user_id, token, expires_at FROM sessions
      WHERE token = ${token} AND expires_at > NOW()
    `;
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
}
