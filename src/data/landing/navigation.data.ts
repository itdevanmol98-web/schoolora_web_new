export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  badge?: string;
  dropdownItems?: {
    title: string;
    description: string;
    href: string;
    icon?: string;
  }[];
}

export const navigationLinks: NavItem[] = [
  { label: 'Home', href: '#home' },
  {
    label: 'Features',
    href: '#features',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Core School ERP', description: 'Centralized institutional foundation', href: '#modules' },
      { title: 'Smart Attendance', description: 'Biometric, RFID & mobile mark-in', href: '#modules' },
      { title: 'Automated Fee Management', description: 'Fee schedules, reminders & gateways', href: '#modules' },
      { title: 'Examination & Grading', description: 'CBSE, ICSE & state board marksheet engine', href: '#modules' },
      { title: 'HR & Staff Payroll', description: 'Biometric integration & salary slips', href: '#modules' },
    ],
  },
  {
    label: 'Modules',
    href: '#modules',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Admissions & CRM', description: 'Inquiry to enrollment lifecycle', href: '#modules' },
      { title: 'Academics & Timetable', description: 'Class routines & syllabus tracking', href: '#modules' },
      { title: 'Student & Parent Portal', description: 'Real-time performance tracking', href: '#apps' },
      { title: 'Transport & GPS', description: 'Live bus tracking & route updates', href: '#modules' },
      { title: 'Library Management', description: 'Barcode cataloging & book tracking', href: '#modules' },
      { title: 'Hostel & Mess', description: 'Room allocation & meal attendance', href: '#modules' },
    ],
  },
  { label: 'AI ERP', href: '#ai-assistant', badge: 'AI' },
  { label: 'Apps', href: '#apps' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Pricing', href: '#pricing' },
  {
    label: 'Resources',
    href: '#resources',
    hasDropdown: true,
    dropdownItems: [
      { title: 'Knowledge Hub', description: 'EdTech insights & school guides', href: '#knowledge-hub' },
      { title: 'Product Documentation', description: 'Comprehensive user manuals', href: '#resources' },
      { title: 'Security & Privacy', description: 'Data protection standards', href: '#security' },
      { title: 'Case Studies', description: 'How top schools scale with Axionexa', href: '#testimonials' },
    ],
  },
  { label: 'About', href: '#why-axionexa' },
  { label: 'Contact', href: '#contact' },
];

export const footerNavigation = {
  products: [
    { label: 'School ERP Platform', href: '#home' },
    { label: 'Key Features', href: '#features' },
    { label: 'ERP Modules', href: '#modules' },
    { label: 'AI School Assistant', href: '#ai-assistant' },
    { label: 'Mobile Apps (iOS & Android)', href: '#apps' },
    { label: 'Third-Party Integrations', href: '#integrations' },
    { label: 'Pricing Plans', href: '#pricing' },
  ],
  solutions: [
    { label: 'Multi-Branch School Groups', href: '#modules' },
    { label: 'Academic & Curriculum Management', href: '#modules' },
    { label: 'Fee Collection & Accounting', href: '#modules' },
    { label: 'Staff Payroll & Biometrics', href: '#modules' },
    { label: 'Parent-Teacher Communication', href: '#modules' },
    { label: 'Smart Transport & Fleet GPS', href: '#modules' },
    { label: 'Digital Library & Barcodes', href: '#modules' },
  ],
  company: [
    { label: 'About Axionexa Technologies', href: '#why-axionexa' },
    { label: 'Contact Support & Sales', href: '#contact' },
    { label: 'Careers & Team', href: '#contact' },
    { label: 'Partner Program', href: '#contact' },
    { label: 'Resources & Guides', href: '#knowledge-hub' },
  ],
  support: [
    { label: 'Help Center & FAQs', href: '#contact' },
    { label: 'API Documentation', href: '#integrations' },
    { label: 'Contact Dedicated Support', href: '#contact' },
    { label: 'Schedule Guided Demo', href: '#demo-modal' },
  ],
  contact: {
    phone: '+91 98765 43210',
    email: 'info@axionexa.com',
    address: 'Axionexa Technologies Pvt. Ltd., West Champaran, Bihar, India',
  },
};
