export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  iconName: 'Building' | 'LayoutGrid' | 'GraduationCap' | 'Users' | 'Headphones';
}

export const statisticsData: StatItem[] = [
  {
    id: 'schools',
    value: '500+',
    label: 'Schools Managed',
    description: 'Trusted by single & multi-branch institutions',
    iconName: 'Building',
  },
  {
    id: 'modules',
    value: '50+',
    label: 'ERP Modules',
    description: 'Covering every academic & admin lifecycle',
    iconName: 'LayoutGrid',
  },
  {
    id: 'students',
    value: '1,00,000+',
    label: 'Students Managed',
    description: 'Active digital student profiles & records',
    iconName: 'GraduationCap',
  },
  {
    id: 'staff',
    value: '5,000+',
    label: 'Active Staff',
    description: 'Teachers, admins, and support personnel',
    iconName: 'Users',
  },
  {
    id: 'support',
    value: '24/7',
    label: 'Dedicated Support',
    description: 'Direct phone, WhatsApp & ticket assistance',
    iconName: 'Headphones',
  },
];
