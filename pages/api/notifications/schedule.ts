import { NextApiRequest, NextApiResponse } from 'next';
import { processAllNotifications } from '../../lib/notifications';

/**
 * Cron endpoint to process notifications
 * Can be called by Vercel Cron, external trigger, or manual API call
 * 
 * Expected to run every 30 minutes
 * 
 * Usage:
 * - Vercel Cron: Add to vercel.json crons
 * - Manual: POST /api/notifications/schedule with X-CRON-SECRET header
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verify this is a legitimate cron call (optional but recommended)
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
  const providedSecret = req.headers['x-cron-secret'] || req.query?.secret || req.body?.secret;

  if (process.env.NODE_ENV === 'production' && providedSecret !== cronSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!['POST', 'GET'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[cron] Starting notification processing...');
    const startTime = Date.now();

    const results = await processAllNotifications();

    const duration = Date.now() - startTime;
    console.log(`[cron] Completed in ${duration}ms`, results);

    return res.status(200).json({
      success: true,
      message: 'Notifications processed successfully',
      results,
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error('[cron] Error processing notifications:', error);
    return res.status(500).json({
      error: 'Failed to process notifications',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
