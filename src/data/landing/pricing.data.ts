export interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  priceDisplay: string;
  priceNote: string;
  isPopular?: boolean;
  features: string[];
  specs: {
    studentLimit: string;
    modules: string;
    mobileApps: string;
    communication: string;
    storage: string;
    support: string;
  };
  ctaText: string;
}

export const pricingTiersMonthly: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'For small schools starting their digital journey',
    priceDisplay: 'Contact Sales',
    priceNote: 'Tailored per active student',
    features: [
      'Core Student Information System',
      'Daily Attendance & Roll Call',
      'Basic Fee Collection & Receipts',
      'Class Timetable Management',
      'Standard Notice Board',
    ],
    specs: {
      studentLimit: 'Up to 500 Students',
      modules: 'Core Modules',
      mobileApps: 'Mobile Web App',
      communication: 'Email Support',
      storage: '10 GB Cloud Storage',
      support: 'Standard Email & Ticket',
    },
    ctaText: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    subtitle: 'For growing schools seeking automation & mobile apps',
    priceDisplay: 'Contact Sales',
    priceNote: 'Most cost-effective institutional tier',
    isPopular: true,
    features: [
      'All Starter Features Included',
      'Dedicated Parent & Teacher Apps',
      'Online Payment Gateways & QR',
      'WhatsApp & DLT SMS Alerts',
      'Biometric & RFID Sync Engine',
      'Examination & Report Card Designer',
      'Transport & Fleet GPS Tracking',
    ],
    specs: {
      studentLimit: 'Up to 2,500 Students',
      modules: 'All 48+ Modules',
      mobileApps: 'iOS & Android Apps',
      communication: 'WhatsApp & SMS Included',
      storage: '100 GB Cloud Storage',
      support: 'Priority 24/7 Phone & Chat',
    },
    ctaText: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'For large school groups & multi-branch institutions',
    priceDisplay: 'Contact Sales',
    priceNote: 'Custom rollout & dedicated infrastructure',
    features: [
      'All Professional Features Included',
      'Multi-Branch Central Management',
      'Axionexa AI Analytics Copilot',
      'Custom White-Label Mobile Apps',
      'Dedicated Database Instance',
      'Custom ERP Workflows & Reports',
      'On-Premise or Private Cloud Option',
    ],
    specs: {
      studentLimit: 'Unlimited Students',
      modules: 'Custom Modules & AI Suite',
      mobileApps: 'Custom Branded Native Apps',
      communication: 'Unlimited Multi-Channel',
      storage: 'Unlimited Secure Storage',
      support: 'Dedicated Account Manager',
    },
    ctaText: 'Contact Sales',
  },
];

export const pricingTiersYearly: PricingTier[] = pricingTiersMonthly.map((tier) => ({
  ...tier,
  priceNote: 'Includes 2 months free with annual commitment',
}));
