export interface IntegrationItem {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'Connected' | 'Ready' | 'Verified';
  brandColor: string;
  iconType: string;
}

export const integrationsData: IntegrationItem[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    category: 'Communication',
    description: 'Instant fee receipts, absent alerts and circulars directly to parents WhatsApp.',
    status: 'Connected',
    brandColor: '#25D366',
    iconType: 'MessageSquare',
  },
  {
    id: 'sms',
    name: 'DLT SMS Gateways',
    category: 'Telecom',
    description: 'Govt-compliant high-throughput SMS delivery for urgent alerts and OTP verification.',
    status: 'Connected',
    brandColor: '#2563EB',
    iconType: 'Send',
  },
  {
    id: 'email',
    name: 'Email SMTP / SES',
    category: 'Communication',
    description: 'High-deliverability monthly newsletters, term report cards, and fee invoices.',
    status: 'Connected',
    brandColor: '#EA4335',
    iconType: 'Mail',
  },
  {
    id: 'tally',
    name: 'Tally ERP & Prime',
    category: 'Accounting',
    description: 'Direct 1-click XML ledger sync of fee collections, expenses, and bank vouchers.',
    status: 'Verified',
    brandColor: '#005984',
    iconType: 'FileSpreadsheet',
  },
  {
    id: 'payment',
    name: 'Payment Gateways',
    category: 'Finance',
    description: 'UPI, Razorpay, PayU, PhonePe, Paytm & Netbanking with auto-reconciliation.',
    status: 'Connected',
    brandColor: '#10B981',
    iconType: 'CreditCard',
  },
  {
    id: 'biometric',
    name: 'Biometric & RFID',
    category: 'Hardware',
    description: 'Direct integration with eSSL, Matrix, ZKTeco thumb, face and card scanners.',
    status: 'Verified',
    brandColor: '#8B5CF6',
    iconType: 'Fingerprint',
  },
  {
    id: 'gps',
    name: 'GPS Fleet Tracking',
    category: 'Transport',
    description: 'Hardware GPS trackers on school buses streaming live coordinates to parent app.',
    status: 'Connected',
    brandColor: '#F97316',
    iconType: 'Navigation',
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    category: 'Virtual Class',
    description: '1-click online classes, staff video meetings, and virtual parent-teacher conferences.',
    status: 'Connected',
    brandColor: '#00AC47',
    iconType: 'Video',
  },
  {
    id: 'zoom',
    name: 'Zoom Education',
    category: 'Virtual Class',
    description: 'Scheduled live lecture links embedded directly in student daily timetables.',
    status: 'Connected',
    brandColor: '#2D8CFF',
    iconType: 'Video',
  },
  {
    id: 'android',
    name: 'Android Apps',
    category: 'Mobile App',
    description: 'Dedicated white-label or Axionexa branded native apps for parents, teachers & drivers.',
    status: 'Connected',
    brandColor: '#3DDC84',
    iconType: 'Smartphone',
  },
  {
    id: 'ios',
    name: 'iOS Apps',
    category: 'Mobile App',
    description: 'Smooth, secure iPhone & iPad mobile experience for parents, students and management.',
    status: 'Connected',
    brandColor: '#000000',
    iconType: 'Smartphone',
  },
  {
    id: 'cloud',
    name: 'Cloud Storage',
    category: 'Infrastructure',
    description: 'AWS S3 and Google Cloud storage for safe archiving of school documents and photos.',
    status: 'Connected',
    brandColor: '#00B4D8',
    iconType: 'Cloud',
  },
];
