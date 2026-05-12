import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface NotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';

/**
 * Send a push notification via Expo
 */
export async function sendPushNotification(payload: NotificationPayload) {
  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: payload.token,
        sound: 'default',
        title: payload.title,
        body: payload.body,
        data: payload.data || {},
      }),
    });

    const result = await response.json();
    console.log('[notifications] Expo response:', result);
    return result;
  } catch (error) {
    console.error('[notifications] Failed to send notification:', error);
    throw error;
  }
}

/**
 * Send daily reminder notification if user hasn't completed lesson today
 */
export async function sendDailyReminderNotification(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      expo_push_tokens: { take: 1 },
      notificationState: true,
      streaks: true,
    },
  });

  if (!user || user.expo_push_tokens.length === 0) {
    return null;
  }

  const token = user.expo_push_tokens[0].token;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check if lesson was already completed today
  const completedToday = await prisma.userProgress.findFirst({
    where: {
      user_id: userId,
      completed: true,
      completed_at: {
        gte: today,
      },
    },
  });

  if (completedToday) {
    return null; // Already completed today
  }

  // Check if we already sent a reminder in the last 3 hours
  const notifState = user.notificationState;
  if (notifState?.last_reminder_at) {
    const hoursSinceLastReminder = (now.getTime() - notifState.last_reminder_at.getTime()) / (1000 * 60 * 60);
    if (hoursSinceLastReminder < 3) {
      return null; // Don't send yet, wait 3 hours
    }
  }

  const userName = user.name ? user.name.split(' ')[0] : 'there';
  
  await sendPushNotification({
    token,
    title: 'Time to Learn!',
    body: `Hi ${userName}, don't forget to take a lesson today!`,
    data: { screen: 'lessons' },
  });

  // Update notification state
  await prisma.notificationState.upsert({
    where: { user_id: userId },
    update: {
      last_reminder_at: now,
    },
    create: {
      user_id: userId,
      last_reminder_at: now,
    },
  });

  return { sent: true };
}

/**
 * Send countdown notification when next lesson is becoming available
 */
export async function sendCountdownNotification(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      expo_push_tokens: { take: 1 },
      notificationState: true,
      streaks: true,
    },
  });

  if (!user || user.expo_push_tokens.length === 0 || !user.streaks?.next_lesson_available_at) {
    return null;
  }

  const token = user.expo_push_tokens[0].token;
  const now = new Date();
  const availableAt = new Date(user.streaks.next_lesson_available_at);
  const msUntilAvailable = availableAt.getTime() - now.getTime();
  const hoursUntil = msUntilAvailable / (1000 * 60 * 60);
  const minutesUntil = msUntilAvailable / (1000 * 60);
  const notifState = user.notificationState;

  // Send 5-hour countdown (and only once)
  if (hoursUntil <= 5 && hoursUntil > 4.5 && !notifState?.countdown_five_hours_sent) {
    await sendPushNotification({
      token,
      title: 'Get Ready!',
      body: 'Your next lesson is unlocking in about 5 hours. Get ready to continue your learning journey!',
      data: { screen: 'lessons' },
    });

    await prisma.notificationState.update({
      where: { user_id: userId },
      data: { countdown_five_hours_sent: true },
    });

    return { sent: true, type: '5_hours' };
  }

  // Send 30-minute countdown (and only once)
  if (minutesUntil <= 30 && minutesUntil > 25 && !notifState?.countdown_thirty_mins_sent) {
    await sendPushNotification({
      token,
      title: 'Almost Time!',
      body: 'Your new lesson is unlocking in 30 minutes. Prepare yourself for the next challenge!',
      data: { screen: 'lessons' },
    });

    await prisma.notificationState.update({
      where: { user_id: userId },
      data: { countdown_thirty_mins_sent: true },
    });

    return { sent: true, type: '30_minutes' };
  }

  return null;
}

/**
 * Reset notification state when user completes a lesson
 */
export async function resetNotificationStateOnLessonCompletion(userId: number, nextAvailableAt: Date) {
  await prisma.notificationState.upsert({
    where: { user_id: userId },
    update: {
      last_lesson_completed_at: new Date(),
      countdown_five_hours_sent: false,
      countdown_thirty_mins_sent: false,
      last_reminder_at: null,
    },
    create: {
      user_id: userId,
      last_lesson_completed_at: new Date(),
    },
  });

  // Update the user streak with next lesson available time
  await prisma.userStreak.update({
    where: { user_id: userId },
    data: {
      next_lesson_available_at: nextAvailableAt,
    },
  });
}

/**
 * Process all users and send appropriate notifications
 * Called by the cron job every 30 minutes
 */
export async function processAllNotifications() {
  try {
    console.log('[notifications] Starting processAllNotifications...');
    
    // Get all users with at least one push token
    const users = await prisma.user.findMany({
      where: {
        expo_push_tokens: {
          some: {}
        }
      },
      include: {
        expo_push_tokens: true,
        streaks: true,
        notificationState: true,
      },
    });

    console.log(`[notifications] Found ${users.length} users with push tokens`);

    const results = {
      processed: 0,
      sent: 0,
      errors: 0,
    };

    for (const user of users) {
      try {
        // Send daily reminder if no lesson completed today
        const reminderResult = await sendDailyReminderNotification(user.id);
        if (reminderResult) {
          results.sent++;
        }

        // Send countdown notifications
        const countdownResult = await sendCountdownNotification(user.id);
        if (countdownResult) {
          results.sent++;
        }

        results.processed++;
      } catch (error) {
        console.error(`[notifications] Error processing user ${user.id}:`, error);
        results.errors++;
      }
    }

    console.log('[notifications] processAllNotifications completed:', results);
    return results;
  } catch (error) {
    console.error('[notifications] Error in processAllNotifications:', error);
    throw error;
  }
}
