export interface ModuleCard {
  id: string;
  name: string;
  description: string;
  badge?: string;
  iconColor?: string;
}

export interface FeatureCategory {
  id: string;
  label: string;
  modules: ModuleCard[];
}

export const featureCategories: FeatureCategory[] = [
  {
    id: 'admissions',
    label: 'Admissions',
    modules: [
      { id: 'm1', name: 'Online Admission', description: 'Complete online admission process with custom forms & payments.', iconColor: '#FF6B00' },
      { id: 'm2', name: 'Enquiry Management', description: 'Track and manage parent enquiries across phone, web & walk-ins.', iconColor: '#00B4D8' },
      { id: 'm3', name: 'Applicant Tracking', description: 'Monitor application stages, merit lists and interview rounds.', iconColor: '#2563EB' },
      { id: 'm4', name: 'Document Verification', description: 'Digital document uploads, auto-scanning & student KYC filing.', iconColor: '#10B981' },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    modules: [
      { id: 'm5', name: 'Class & Section Management', description: 'Configure academic years, wings, classes, sections and quotas.', iconColor: '#2563EB' },
      { id: 'm6', name: 'Subject & Syllabus Tracking', description: 'Map subject teachers and track lesson completion percentages.', iconColor: '#00B4D8' },
      { id: 'm7', name: 'Intelligent Timetable Generator', description: 'Conflict-free automatic scheduling for teachers and classes.', iconColor: '#FF6B00' },
      { id: 'm8', name: 'Homework & Study Materials', description: 'Assign homework digitally with PDF, video & link attachments.', iconColor: '#8B5CF6' },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    modules: [
      { id: 'm9', name: 'Student Daily Attendance', description: 'Subject-wise or daily attendance with 1-click parent SMS alert.', iconColor: '#00B4D8' },
      { id: 'm10', name: 'Staff Biometric Attendance', description: 'Sync biometric devices, RFID cards and mobile geofencing.', iconColor: '#2563EB' },
      { id: 'm11', name: 'Leave Application & Approval', description: 'Multi-level workflow for student & teacher leave approvals.', iconColor: '#F59E0B' },
      { id: 'm12', name: 'Attendance Analytics & Defaulters', description: 'Automated warnings for students below threshold percentage.', iconColor: '#EF4444' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    modules: [
      { id: 'm13', name: 'Smart Fee Structure Engine', description: 'Configure custom fee heads, installment slabs and scholarships.', iconColor: '#10B981' },
      { id: 'm14', name: 'Online Fee Collection', description: 'UPI, QR code, netbanking & debit card payment gateway integration.', iconColor: '#00B4D8' },
      { id: 'm15', name: 'Instant Digital Receipts', description: 'Automated SMS/WhatsApp receipts with GST compliant invoices.', iconColor: '#FF6B00' },
      { id: 'm16', name: 'Expense & Petty Cash Ledger', description: 'Monitor vendor invoices, departmental budgets and vouchers.', iconColor: '#6366F1' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    modules: [
      { id: 'm17', name: 'Official WhatsApp Integration', description: 'Automated report cards, fee alerts & circulars on WhatsApp.', iconColor: '#10B981' },
      { id: 'm18', name: 'SMS & Email Broadcasting', description: 'High-speed DLT-registered SMS for emergencies and general notices.', iconColor: '#2563EB' },
      { id: 'm19', name: 'Interactive Notice Board', description: 'Publish circulars with targeted roles (parents, teachers, students).', iconColor: '#F59E0B' },
      { id: 'm20', name: 'Parent-Teacher Chat', description: 'Controlled messaging portal protecting teacher personal numbers.', iconColor: '#00B4D8' },
    ],
  },
  {
    id: 'hr',
    label: 'HR & Staff',
    modules: [
      { id: 'm21', name: 'Staff Profiles & Records', description: 'Service books, qualification records, certifications & contracts.', iconColor: '#3B82F6' },
      { id: 'm22', name: 'Automated Payroll Engine', description: 'Calculates basic pay, DA, PF, ESI, TDS and generates salary slips.', iconColor: '#10B981' },
      { id: 'm23', name: 'Staff Leave Ledger', description: 'Tracks casual, sick, earned and maternity leave balances.', iconColor: '#F59E0B' },
      { id: 'm24', name: 'Teacher Performance Reviews', description: 'Track student feedback, syllabus coverage & punctuality metrics.', iconColor: '#8B5CF6' },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    modules: [
      { id: 'm25', name: 'Fleet & Vehicle Records', description: 'Manage buses, vans, fitness certificates, insurance and pollution renewals.', iconColor: '#F97316' },
      { id: 'm26', name: 'Live GPS Bus Tracking', description: 'Parents view real-time bus location and receive arrival alerts.', iconColor: '#00B4D8' },
      { id: 'm27', name: 'Route & Stop Allocation', description: 'Optimize pick-and-drop stops and automated transport fee billing.', iconColor: '#2563EB' },
      { id: 'm28', name: 'Driver & Attendant Profiles', description: 'Police verification records, licenses and contact directory.', iconColor: '#10B981' },
    ],
  },
  {
    id: 'library',
    label: 'Library',
    modules: [
      { id: 'm29', name: 'Barcode Cataloging', description: 'Quick scan accession, Dewey decimal classification & rack locations.', iconColor: '#8B5CF6' },
      { id: 'm30', name: 'Issue & Return Workflow', description: 'Instant barcode check-out, due date alerts and automated fine ledger.', iconColor: '#EC4899' },
      { id: 'm31', name: 'E-Books & Digital Repository', description: 'Store and share digital PDFs, question banks and journals.', iconColor: '#00B4D8' },
      { id: 'm32', name: 'Reading Room Attendance', description: 'Monitor footfalls and popular titles with automated analytics.', iconColor: '#F59E0B' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Analytics',
    modules: [
      { id: 'm33', name: 'Axionexa AI Copilot', description: 'Natural language queries for principal & admin operational reports.', iconColor: '#00B4D8' },
      { id: 'm34', name: 'Attendance Risk Analytics', description: 'Predict potential dropouts and irregular students proactively.', iconColor: '#EF4444' },
      { id: 'm35', name: 'Fee Forecasting Model', description: 'Predict monthly cash flow and highlight chronic payment delays.', iconColor: '#10B981' },
      { id: 'm36', name: 'Adaptive Timetable AI', description: 'Re-assign substitute teachers automatically when a teacher is on leave.', iconColor: '#FF6B00' },
    ],
  },
];
