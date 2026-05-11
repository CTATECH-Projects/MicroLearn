import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@/lib/db';

const LEARNING_TRACKS = [
  { id: 'web-design', title: 'Web Design', description: 'Learn web design fundamentals', icon: '🎨', order: 1 },
  { id: 'productivity', title: 'Productivity', description: 'Boost your productivity skills', icon: '⚡', order: 2 },
  { id: 'communication', title: 'Communication', description: 'Master communication skills', icon: '💬', order: 3 },
  { id: 'coding', title: 'Coding Fundamentals', description: 'Learn coding basics', icon: '💻', order: 4 },
];

const LESSONS_DATA = [
  // Web Design
  { id: 'wd-1', trackId: 'web-design', title: 'Color Theory Basics', description: 'Understanding colors', order: 1 },
  { id: 'wd-2', trackId: 'web-design', title: 'Typography Essentials', description: 'Font selection guide', order: 2 },
  { id: 'wd-3', trackId: 'web-design', title: 'Layout & Grid Systems', description: 'Grid design', order: 3 },
  { id: 'wd-4', trackId: 'web-design', title: 'UI Components', description: 'Design components', order: 4 },
  { id: 'wd-5', trackId: 'web-design', title: 'Responsive Design', description: 'Mobile design', order: 5 },
  { id: 'wd-6', trackId: 'web-design', title: 'Accessibility Design', description: 'Accessible design', order: 6 },
  { id: 'wd-7', trackId: 'web-design', title: 'Design Systems', description: 'Design systems', order: 7 },
  { id: 'wd-8', trackId: 'web-design', title: 'User Research', description: 'Research methods', order: 8 },
  { id: 'wd-9', trackId: 'web-design', title: 'Prototyping', description: 'Prototyping tools', order: 9 },
  { id: 'wd-10', trackId: 'web-design', title: 'Design Handoff', description: 'Dev handoff', order: 10 },
  // Productivity
  { id: 'pd-1', trackId: 'productivity', title: 'Time Management', description: 'Manage time', order: 1 },
  { id: 'pd-2', trackId: 'productivity', title: 'Goal Setting', description: 'Set goals', order: 2 },
  { id: 'pd-3', trackId: 'productivity', title: 'Prioritization', description: 'Prioritize tasks', order: 3 },
  { id: 'pd-4', trackId: 'productivity', title: 'Focus Techniques', description: 'Stay focused', order: 4 },
  { id: 'pd-5', trackId: 'productivity', title: 'Task Management', description: 'Manage tasks', order: 5 },
  { id: 'pd-6', trackId: 'productivity', title: 'Decision Making', description: 'Make decisions', order: 6 },
  { id: 'pd-7', trackId: 'productivity', title: 'Delegation', description: 'Delegate tasks', order: 7 },
  { id: 'pd-8', trackId: 'productivity', title: 'Work-Life Balance', description: 'Balance life', order: 8 },
  { id: 'pd-9', trackId: 'productivity', title: 'Habit Building', description: 'Build habits', order: 9 },
  { id: 'pd-10', trackId: 'productivity', title: 'Energy Management', description: 'Manage energy', order: 10 },
  // Communication
  { id: 'cm-1', trackId: 'communication', title: 'Active Listening', description: 'Listen actively', order: 1 },
  { id: 'cm-2', trackId: 'communication', title: 'Clear Speaking', description: 'Speak clearly', order: 2 },
  { id: 'cm-3', trackId: 'communication', title: 'Body Language', description: 'Understand body language', order: 3 },
  { id: 'cm-4', trackId: 'communication', title: 'Conflict Resolution', description: 'Resolve conflicts', order: 4 },
  { id: 'cm-5', trackId: 'communication', title: 'Presentation Skills', description: 'Present effectively', order: 5 },
  { id: 'cm-6', trackId: 'communication', title: 'Emotional Intelligence', description: 'Emotional awareness', order: 6 },
  { id: 'cm-7', trackId: 'communication', title: 'Feedback Delivery', description: 'Give feedback', order: 7 },
  { id: 'cm-8', trackId: 'communication', title: 'Negotiation', description: 'Negotiate effectively', order: 8 },
  { id: 'cm-9', trackId: 'communication', title: 'Networking', description: 'Build networks', order: 9 },
  { id: 'cm-10', trackId: 'communication', title: 'Written Communication', description: 'Write effectively', order: 10 },
  // Coding
  { id: 'cd-1', trackId: 'coding', title: 'Programming Basics', description: 'Learn basics', order: 1 },
  { id: 'cd-2', trackId: 'coding', title: 'Variables & Data Types', description: 'Data types', order: 2 },
  { id: 'cd-3', trackId: 'coding', title: 'Control Flow', description: 'If/else and loops', order: 3 },
  { id: 'cd-4', trackId: 'coding', title: 'Functions', description: 'Function basics', order: 4 },
  { id: 'cd-5', trackId: 'coding', title: 'Arrays & Objects', description: 'Collections', order: 5 },
  { id: 'cd-6', trackId: 'coding', title: 'DOM Manipulation', description: 'DOM basics', order: 6 },
  { id: 'cd-7', trackId: 'coding', title: 'APIs & HTTP', description: 'API calls', order: 7 },
  { id: 'cd-8', trackId: 'coding', title: 'Version Control', description: 'Git basics', order: 8 },
  { id: 'cd-9', trackId: 'coding', title: 'Debugging', description: 'Debug code', order: 9 },
  { id: 'cd-10', trackId: 'coding', title: 'Best Practices', description: 'Code standards', order: 10 },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Seed tracks
    for (const track of LEARNING_TRACKS) {
      await sql`
        INSERT INTO learning_tracks (id, title, description, icon, "order", lessons_count)
        VALUES (${track.id}, ${track.title}, ${track.description}, ${track.icon}, ${track.order}, 10)
        ON CONFLICT (id) DO NOTHING
      `;
    }

    // Seed lessons
    for (const lesson of LESSONS_DATA) {
      await sql`
        INSERT INTO lessons (id, track_id, title, description, "order")
        VALUES (${lesson.id}, ${lesson.trackId}, ${lesson.title}, ${lesson.description}, ${lesson.order})
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return res.status(200).json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({ error: 'Failed to seed database' });
  }
}
