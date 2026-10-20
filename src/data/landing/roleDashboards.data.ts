export interface RoleWorkspace {
  id: string;
  roleName: string;
  title: string;
  tagline: string;
  metrics: {
    label: string;
    value: string;
    change: string;
  }[];
  modules: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export const roleWorkspaces: RoleWorkspace[] = [
  {
    id: 'principal',
    roleName: 'Principal',
    title: 'Principal Dashboard',
    tagline: "Get complete high-level visibility of your school's daily performance, attendance, and finances.",
    metrics: [
      { label: 'Campus Attendance', value: '94.6%', change: '+1.2% this week' },
      { label: 'Fees Realized', value: '₹12.5L', change: '88% collected' },
      { label: 'Staff Present', value: '84 / 86', change: '97.6% active' },
    ],
    modules: [
      { title: 'School Overview', description: 'Real-time multi-wing operational summary and alerts', icon: 'school' },
      { title: 'Academic Performance', description: 'Track grade analytics, exam comparisons and syllabus status', icon: 'academic' },
      { title: 'Fee Collection Audit', description: 'Monitor cash collections, bank deposits and defaulter lists', icon: 'fee' },
      { title: 'Staff Performance', description: 'Faculty attendance logs, appraisals and lesson plan reviews', icon: 'staff' },
    ],
  },
  {
    id: 'admin',
    roleName: 'Admin',
    title: 'School Administrator Workspace',
    tagline: 'Execute administrative workflows, student documentation, certificates and branch setups.',
    metrics: [
      { label: 'Active Inquiries', value: '142 Leads', change: '+18 today' },
      { label: 'Pending KYC', value: '12 Docs', change: 'Awaiting verify' },
      { label: 'Certificates Issued', value: '84', change: 'TC & Bonafide' },
    ],
    modules: [
      { title: 'Admission Pipeline', description: 'Manage applications, entrance tests and batch enrollments', icon: 'school' },
      { title: 'Student Master Directory', description: 'Instant search, profile updates and parent contact linking', icon: 'staff' },
      { title: 'Certificate Printing', description: 'Automated Transfer Certificates, Character & Bonafide slips', icon: 'academic' },
      { title: 'Notice Broadcasting', description: 'Publish circulars to app, SMS, email and notice board', icon: 'fee' },
    ],
  },
  {
    id: 'teacher',
    roleName: 'Teacher',
    title: 'Teacher Classroom Hub',
    tagline: 'Streamline daily attendance, homework distribution, syllabus tracking and exam grading.',
    metrics: [
      { label: 'Assigned Classes', value: '4 Batches', change: 'Grade 8 & 10' },
      { label: 'Today Attendance', value: '100% Done', change: 'Completed 9:15 AM' },
      { label: 'Pending Grading', value: '14 Papers', change: 'Mathematics Quiz' },
    ],
    modules: [
      { title: 'My Classes & Roster', description: 'Quick student list with photos, health notes and attendance records', icon: 'staff' },
      { title: '1-Click Attendance', description: 'Mark presence in seconds with auto-alert to absent parents', icon: 'school' },
      { title: 'Homework & Study Notes', description: 'Upload assignments with attachments and submission deadlines', icon: 'academic' },
      { title: 'Marks Entry Portal', description: 'Easy spreadsheet-like interface for entering terminal marks', icon: 'fee' },
    ],
  },
  {
    id: 'accountant',
    roleName: 'Accountant',
    title: 'Finance & Accounts Portal',
    tagline: 'Zero-leakage fee management, instant digital receipts, automated discounts and GST reporting.',
    metrics: [
      { label: "Today's Collection", value: '₹1,84,500', change: '34 Transactions' },
      { label: 'Online vs Counter', value: '82% Online', change: 'UPI & Netbanking' },
      { label: 'Unpaid Dues', value: '₹3.2L', change: '28 Students' },
    ],
    modules: [
      { title: 'Fee Counter & Billing', description: 'Collect fees in cash, card, cheque or UPI with instant receipt printing', icon: 'fee' },
      { title: 'Defaulter Follow-ups', description: 'Automated WhatsApp payment reminders with 1-click payment links', icon: 'school' },
      { title: 'Expense Vouchers', description: 'Record petty cash, school maintenance bills and vendor payments', icon: 'staff' },
      { title: 'Tally & Bank Reconciliation', description: '1-click export to Tally ERP and automatic bank statement matching', icon: 'academic' },
    ],
  },
  {
    id: 'hr',
    roleName: 'HR',
    title: 'HR & Staff Operations',
    tagline: 'Comprehensive employee lifecycles, biometric sync, salary slips and leave approvals.',
    metrics: [
      { label: 'Total Employees', value: '86 Personnel', change: 'Teaching & Admin' },
      { label: 'Leaves Pending', value: '3 Requests', change: 'Requires approval' },
      { label: 'Payroll Status', value: 'Processed', change: 'Direct NEFT active' },
    ],
    modules: [
      { title: 'Staff Directory & KYC', description: 'Service books, qualification certificates and bank account files', icon: 'staff' },
      { title: 'Biometric Attendance Sync', description: 'Sync thumb, face & RFID devices with automatic overtime/late calculations', icon: 'school' },
      { title: 'Automated Payroll & Slips', description: 'PF, ESI, TDS calculation with password-protected PDF pay slips', icon: 'fee' },
      { title: 'Leave Management', description: 'Track casual, sick, earned and maternity leave balances', icon: 'academic' },
    ],
  },
  {
    id: 'parent',
    roleName: 'Parent',
    title: 'Parent Mobile Portal',
    tagline: 'Complete transparency into your child’s academic progress, daily attendance, fees and safety.',
    metrics: [
      { label: "Child's Attendance", value: '96.2%', change: 'Present Today' },
      { label: 'Fee Status', value: 'All Paid', change: 'Next due Nov 10' },
      { label: 'Latest Grade', value: 'A+ (92%)', change: 'Mathematics Term 1' },
    ],
    modules: [
      { title: 'Live Bus Tracking', description: 'Real-time GPS bus location with arrival time notifications', icon: 'school' },
      { title: 'Online Fee Payment', description: 'Pay school fees seamlessly via PhonePe, Google Pay, cards or netbanking', icon: 'fee' },
      { title: 'Report Cards & Homework', description: 'Download term report cards and check daily homework tasks', icon: 'academic' },
      { title: 'Teacher Communication', description: 'Receive school circulars and message class teachers directly', icon: 'staff' },
    ],
  },
  {
    id: 'student',
    roleName: 'Student',
    title: 'Student Learning Workspace',
    tagline: 'Access class notes, check homework deadlines, explore library books and view examination schedules.',
    metrics: [
      { label: 'Pending Tasks', value: '2 Homeworks', change: 'Due tomorrow' },
      { label: 'Books Borrowed', value: '1 Active', change: 'Physics Vol. 1' },
      { label: 'Upcoming Exam', value: 'In 12 Days', change: 'Mid-term syllabus' },
    ],
    modules: [
      { title: 'My Daily Timetable', description: 'Check upcoming lecture periods, room numbers and subject teachers', icon: 'school' },
      { title: 'Digital Study Library', description: 'Download textbook chapters, revision notes and video lectures', icon: 'academic' },
      { title: 'Exam Hall Tickets', description: 'Download examination schedules, seating arrangements and marks', icon: 'staff' },
      { title: 'Activity Badges & Clubs', description: 'Participate in school sports, arts, quiz clubs and merit honors', icon: 'fee' },
    ],
  },
];
