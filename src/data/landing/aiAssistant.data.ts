export interface AIPromptQnA {
  id: string;
  prompt: string;
  response: string;
  tag: string;
}

export const aiFeaturePills = [
  'AI Reports',
  'Smart Insights',
  'Attendance Analysis',
  'Fee Insights',
  'Admission Insights',
  'Academic Analytics',
  'AI Content Assistant',
  'Smart Alerts',
];

export const aiPresetPrompts: AIPromptQnA[] = [
  {
    id: 'p1',
    prompt: 'Which classes have the lowest attendance?',
    response:
      '📊 Class 9-B currently has the lowest weekly attendance at 86.4% (down 5.2% from last week). Major absentees are concentrated on Tuesdays and Fridays. I have automatically flagged 4 chronic absentees and prepared a draft SMS alert for their parents.',
    tag: 'Attendance',
  },
  {
    id: 'p2',
    prompt: "Show today's fee collection.",
    response:
      "💰 Today's total fee collection stands at ₹1,84,500 across 34 successful payments (82% via UPI/Gateway, 18% at the counter). You have reached 88% of your September collection target, with ₹5.4 Lakhs remaining outstanding.",
    tag: 'Finance',
  },
  {
    id: 'p3',
    prompt: 'Which students have pending fees?',
    response:
      '⚠️ There are 42 students with pending fees exceeding 30 days, totaling ₹3,24,000. Top pending grade is Grade 10-A (12 students). Would you like me to trigger an automated WhatsApp reminder with direct payment links to these parents?',
    tag: 'Fees',
  },
  {
    id: 'p4',
    prompt: "Summarize this month's performance.",
    response:
      '📈 Executive Summary for September 2026:\n• Student Attendance: 94.6% average (+1.2%)\n• Fee Collection: ₹48.2L realized (on track)\n• Syllabus Coverage: 74% across Grades 1-12\n• Faculty Punctuality: 98.4% biometric adherence\n• Zero pending administrative compliance issues.',
    tag: 'Analytics',
  },
  {
    id: 'p5',
    prompt: 'Generate a principal report.',
    response:
      '📑 Comprehensive Principal Report generated for academic week 38. Key highlights: 1,248 students enrolled, 86 staff active, Grade 10 Pre-Board schedules finalized, bus routes operating at 99% punctuality. Downloadable PDF is ready for review.',
    tag: 'Reports',
  },
  {
    id: 'p6',
    prompt: 'Create a timetable suggestion.',
    response:
      '🗓️ Timetable Analysis complete! Mrs. Sharma (Science TGT) is on leave today. I suggest allocating period 3 to Mr. Verma (Library) and period 6 to Ms. Anjali (Mathematics revision) to prevent idle classrooms with zero teacher collisions.',
    tag: 'Timetable',
  },
];
