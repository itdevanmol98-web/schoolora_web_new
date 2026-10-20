export interface DashboardTabContent {
  id: string;
  name: string;
  badge: string;
  stats: {
    label: string;
    value: string;
    sublabel: string;
    color: string;
  }[];
  chartTitle: string;
  donutTitle: string;
  recentActivities: {
    title: string;
    detail: string;
    time: string;
    type: 'fee' | 'admission' | 'academic' | 'leave';
  }[];
  upcomingEvents: {
    name: string;
    date: string;
    tag: string;
  }[];
}

export const dashboardTabs: DashboardTabContent[] = [
  {
    id: 'admin',
    name: 'Admin Dashboard',
    badge: 'Central Command',
    stats: [
      { label: 'Total Students', value: '1,248', sublabel: '+12 this month', color: '#2563EB' },
      { label: 'Present Today', value: '1,166', sublabel: '93.4% attendance', color: '#10B981' },
      { label: 'Fee Collection', value: '₹12,50,200', sublabel: '88% of monthly target', color: '#FF6B00' },
      { label: 'Total Staff', value: '86', sublabel: '98% on duty today', color: '#8B5CF6' },
    ],
    chartTitle: 'Monthly Attendance Trend',
    donutTitle: 'Fee Collection Breakdown',
    recentActivities: [
      { title: 'New Admission Enrolled', detail: 'Aarav Kumar (Grade 7-B)', time: '10m ago', type: 'admission' },
      { title: 'Term Fee Collected', detail: 'Rahul Sharma (Grade 10-A) • ₹18,500', time: '25m ago', type: 'fee' },
      { title: 'Staff Leave Approved', detail: 'Mrs. Neha Patel (TGT Science)', time: '1h ago', type: 'leave' },
      { title: 'Parent Inquiry Received', detail: 'Pooja Singh (Kindergarten)', time: '2h ago', type: 'academic' },
    ],
    upcomingEvents: [
      [
        { name: 'Mid-Term Examinations', date: 'Oct 12, 2026', tag: 'Exams' },
        { name: 'Parent-Teacher Meeting', date: 'Oct 18, 2026', tag: 'PTM' },
        { name: 'Annual Sports Day', date: 'Nov 05, 2026', tag: 'Sports' },
      ],
    ][0],
  },
  {
    id: 'academic',
    name: 'Academic',
    badge: 'Curriculum & Exams',
    stats: [
      { label: 'Total Batches', value: '38 Classes', sublabel: 'Pre-K to Grade 12', color: '#2563EB' },
      { label: 'Avg Exam Score', value: '84.2%', sublabel: '+4.1% over last term', color: '#10B981' },
      { label: 'Syllabus Covered', value: '72%', sublabel: 'On track for Term 1', color: '#00B4D8' },
      { label: 'Active Homeworks', value: '64 Tasks', sublabel: 'Submitted online', color: '#8B5CF6' },
    ],
    chartTitle: 'Class-Wise Grade Distribution',
    donutTitle: 'Subject Mastery Breakdown',
    recentActivities: [
      { title: 'Grade 10 Mathematics Marks', detail: 'Published by Mr. Verma', time: '15m ago', type: 'academic' },
      { title: 'Weekly Physics Assignment', detail: 'Uploaded for Grade 12-A', time: '40m ago', type: 'academic' },
      { title: 'Question Bank Updated', detail: 'Chemistry Term 1 sample papers', time: '2h ago', type: 'academic' },
    ],
    upcomingEvents: [
      { name: 'CBSE Registration Deadline', date: 'Oct 08, 2026', tag: 'CBSE' },
      { name: 'Science Exhibition', date: 'Oct 24, 2026', tag: 'Academics' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    badge: 'Accounts & Dues',
    stats: [
      { label: 'Total Received', value: '₹48.2 Lakhs', sublabel: 'Quarter 2 receipts', color: '#10B981' },
      { label: 'Pending Dues', value: '₹5.4 Lakhs', sublabel: '42 student accounts', color: '#EF4444' },
      { label: 'Online Payments', value: '78%', sublabel: 'UPI, QR & Cards', color: '#00B4D8' },
      { label: 'Expenses Approved', value: '₹6.8 Lakhs', sublabel: 'Staff payroll & vendor', color: '#FF6B00' },
    ],
    chartTitle: 'Fee Realization Trend',
    donutTitle: 'Payment Channel Ratio (UPI / Cash / Bank)',
    recentActivities: [
      { title: 'Instant UPI Fee Settlement', detail: 'Sneha Roy • ₹22,000 via PhonePe', time: '5m ago', type: 'fee' },
      { title: 'Bus Fee Paid', detail: 'Karan Mehra • ₹4,500', time: '18m ago', type: 'fee' },
      { title: 'Vendor Invoice Cleared', detail: 'Stationery Supplies • ₹35,400', time: '1h ago', type: 'fee' },
    ],
    upcomingEvents: [
      { name: 'Quarter 3 Fee Due Date', date: 'Oct 15, 2026', tag: 'Fees' },
      { name: 'Financial Audit', date: 'Nov 01, 2026', tag: 'Accounts' },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    badge: 'Payroll & Staff',
    stats: [
      { label: 'Teaching Faculty', value: '62 Staff', sublabel: '100% verified KYC', color: '#2563EB' },
      { label: 'Non-Teaching Staff', value: '24 Staff', sublabel: 'Administration & logistics', color: '#8B5CF6' },
      { label: 'Attendance Ratio', value: '98.2%', sublabel: 'Biometric verified', color: '#10B981' },
      { label: 'Payroll Processed', value: '100%', sublabel: 'September slips generated', color: '#FF6B00' },
    ],
    chartTitle: 'Faculty Punctuality & Logs',
    donutTitle: 'Department Staff Distribution',
    recentActivities: [
      { title: 'Salary Disbursed', detail: 'Direct NEFT transfer completed', time: '1d ago', type: 'leave' },
      { title: 'Teacher Appraised', detail: 'Annual evaluation completed', time: '2d ago', type: 'academic' },
    ],
    upcomingEvents: [
      { name: 'Faculty Training Workshop', date: 'Oct 20, 2026', tag: 'Workshop' },
      { name: 'Staff Welfare Meeting', date: 'Oct 28, 2026', tag: 'Meeting' },
    ],
  },
  {
    id: 'principal',
    name: 'Principal',
    badge: 'Executive Oversight',
    stats: [
      { label: 'Total Enrollment', value: '1,248 Students', sublabel: '98% retention rate', color: '#2563EB' },
      { label: 'Daily Attendance', value: '94.6%', sublabel: 'Across all 12 grades', color: '#10B981' },
      { label: 'Fee Collection', value: '92%', sublabel: 'Zero unaccounted arrears', color: '#00B4D8' },
      { label: 'Parent Satisfaction', value: '4.9 / 5', sublabel: 'Based on 450+ app ratings', color: '#FF6B00' },
    ],
    chartTitle: 'School Growth & Retention Overview',
    donutTitle: 'Overall Department Efficiency Index',
    recentActivities: [
      { title: 'Executive Summary Generated', detail: 'Automated by Axionexa AI Copilot', time: '30m ago', type: 'academic' },
      { title: 'Board Exam Circular Approved', detail: 'Dispatched to Grade 10 & 12 parents', time: '2h ago', type: 'academic' },
    ],
    upcomingEvents: [
      { name: 'Management Trustee Meeting', date: 'Oct 10, 2026', tag: 'Trustee' },
      { name: 'District Merit Felicitation', date: 'Nov 14, 2026', tag: 'Award' },
    ],
  },
];
