import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId;
    const { pushToken } = req.body;

    if (!pushToken || typeof pushToken !== 'string') {
      return res.status(400).json({ error: 'Push token is required' });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if token already exists
    const existingToken = await prisma.expoPushToken.findUnique({
      where: { token: pushToken },
    });

    if (existingToken && existingToken.user_id !== userId) {
      // Token exists for another user, remove it
      await prisma.expoPushToken.delete({
        where: { token: pushToken },
      });
    }

    // Upsert the token for this user
    const result = await prisma.expoPushToken.upsert({
      where: { token: pushToken },
      update: {
        updated_at: new Date(),
      },
      create: {
        user_id: userId,
        token: pushToken,
      },
    });

    return res.status(200).json({
      message: 'Push token registered successfully',
      token: result.token,
    });
  } catch (error) {
    console.error('[push-token] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
