export interface AppEcosystemItem {
  id: string;
  roleTitle: string;
  subtitle: string;
  tagline: string;
  badge: string;
  features: string[];
  iconType: 'shield' | 'school' | 'family' | 'teacher' | 'student' | 'bus';
}

export const ecosystemApps: AppEcosystemItem[] = [
  {
    id: 'super-admin',
    roleTitle: 'Super Admin',
    subtitle: 'SaaS Control Panel',
    tagline: 'Multi-branch control, subscription plans & global system security.',
    badge: 'Enterprise',
    features: ['Multi-school group governance', 'Role & permission hierarchies', 'Centralized audit logs'],
    iconType: 'shield',
  },
  {
    id: 'school-admin',
    roleTitle: 'School Admin',
    subtitle: 'Complete ERP Dashboard',
    tagline: 'Day-to-day operations, finance, admissions, exams & office workflows.',
    badge: 'Operations',
    features: ['Admissions & student registers', 'Fee collection & reconciliation', 'Certificate & ID printing'],
    iconType: 'school',
  },
  {
    id: 'parent-app',
    roleTitle: 'Parent App',
    subtitle: 'Fees, Attendance & More',
    tagline: 'Stay connected with homework, report cards, live GPS and fee payments.',
    badge: 'iOS & Android',
    features: ['Instant UPI fee payment', 'Live bus tracking with ETA alerts', 'Leave applications & notice board'],
    iconType: 'family',
  },
  {
    id: 'teacher-app',
    roleTitle: 'Teacher App',
    subtitle: 'Classes, Marks & Tasks',
    tagline: 'Mark attendance in 10 seconds, assign homework & submit exam scores.',
    badge: 'Productivity',
    features: ['Fast mobile attendance', 'Online homework & syllabus logs', 'Direct parent messaging'],
    iconType: 'teacher',
  },
  {
    id: 'student-app',
    roleTitle: 'Student App',
    subtitle: 'Learning & Results',
    tagline: 'Access study notes, examination timetables, library books and scores.',
    badge: 'Empowerment',
    features: ['E-learning & study files', 'Timetable & exam schedules', 'Digital ID & library status'],
    iconType: 'student',
  },
  {
    id: 'driver-app',
    roleTitle: 'Driver App',
    subtitle: 'Routes, GPS & Updates',
    tagline: 'Turn-by-turn route assistance, student boarding checks & parent SOS alerts.',
    badge: 'Safety',
    features: ['Live route GPS broadcasting', 'Student pickup check-in list', 'Emergency panic button'],
    iconType: 'bus',
  },
];
