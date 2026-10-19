export interface SchoolChallenge {
  id: string;
  title: string;
  problemText: string;
  solutionText: string;
}

export const schoolChallenges: SchoolChallenge[] = [
  {
    id: 'c1',
    title: 'Manual attendance',
    problemText: 'Teachers waste 15-20 minutes every morning taking paper roll calls.',
    solutionText: 'Mark attendance in 1 tap via mobile, RFID or biometric, instantly alerting parents via WhatsApp.',
  },
  {
    id: 'c2',
    title: 'Fee collection follow-ups',
    problemText: 'Accountants spend days dialing parents and manually chasing outstanding fee dues.',
    solutionText: 'Automated SMS/WhatsApp payment links with instant receipts and zero reconciliation errors.',
  },
  {
    id: 'c3',
    title: 'Scattered student records',
    problemText: 'Documents stored across multiple physical registers, files and spreadsheets.',
    solutionText: 'Single 360-degree digital student profile containing academic history, fees, medical & KYC.',
  },
  {
    id: 'c4',
    title: 'Timetable conflicts',
    problemText: 'Manual schedules frequently lead to teacher clashes and double bookings.',
    solutionText: 'Intelligent algorithm automatically optimizes teacher slots and seamlessly handles leaves.',
  },
  {
    id: 'c5',
    title: 'Parent communication gaps',
    problemText: 'Paper diaries often go unread, leading to confusion regarding school notices and events.',
    solutionText: 'Instant official mobile push alerts and WhatsApp circulars delivered in seconds.',
  },
  {
    id: 'c6',
    title: 'Paper-based administration',
    problemText: 'Pounds of paper consumed for admission forms, report cards and hall tickets.',
    solutionText: '100% paperless workflows with digital forms, e-signatures and downloadable PDF reports.',
  },
  {
    id: 'c7',
    title: 'Difficult reporting',
    problemText: 'Principals wait days for compilation of quarterly attendance and cash collections.',
    solutionText: 'Real-time interactive dashboard visuals with 1-click export to Excel and PDF.',
  },
  {
    id: 'c8',
    title: 'Multiple disconnected tools',
    problemText: 'Using one app for SMS, another for fees, and spreadsheets for exams.',
    solutionText: 'One unified, synchronized ERP platform connecting your entire educational ecosystem.',
  },
];
