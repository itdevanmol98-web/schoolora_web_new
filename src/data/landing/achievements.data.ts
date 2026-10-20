export interface AchievementItem {
  id: string;
  code: string;
  year: string;
  awardName: string;
  issuingOrganization: string;
  description: string;
}

export const achievementsData: AchievementItem[] = [
  {
    id: 'a1',
    code: 'Achievement 01',
    year: '2024',
    awardName: 'Excellence in EdTech Innovation',
    issuingOrganization: 'National Education Council',
    description: 'Recognized for pioneering AI-assisted school management and automated administrative workflows.',
  },
  {
    id: 'a2',
    code: 'Achievement 02',
    year: '2024',
    awardName: 'Best School ERP Solution',
    issuingOrganization: 'Digital Institutional Summit',
    description: 'Awarded for exceptional multi-branch architecture, data security standards, and seamless parent engagement.',
  },
  {
    id: 'a3',
    code: 'Achievement 03',
    year: '2025',
    awardName: 'Emerging SaaS Platform of the Year',
    issuingOrganization: 'Indian Tech Leadership Forum',
    description: 'Commended for empowering K-12 institutions with zero-downtime cloud reliability and dedicated 24/7 client support.',
  },
];
