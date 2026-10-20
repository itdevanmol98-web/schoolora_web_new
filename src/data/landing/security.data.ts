export interface SecurityPillar {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: 'shield' | 'lock' | 'database' | 'refresh';
}

export const securityPillars: SecurityPillar[] = [
  {
    id: 's1',
    title: 'Role-Based Access',
    description: 'Strict granular permissions ensuring teachers, parents and staff only view relevant records.',
    badge: 'Access Control',
    icon: 'shield',
  },
  {
    id: 's2',
    title: 'Secure Authentication',
    description: 'Multi-factor authentication (MFA), encrypted session tokens, and automatic idle logouts.',
    badge: 'Auth Security',
    icon: 'lock',
  },
  {
    id: 's3',
    title: 'Encrypted Data',
    description: 'End-to-end encryption in transit (TLS 1.3) and at rest (AES-256) for all institutional data.',
    badge: 'AES-256',
    icon: 'database',
  },
  {
    id: 's4',
    title: 'Automated Backup',
    description: 'Daily geo-redundant automated cloud backups with point-in-time disaster recovery protocols.',
    badge: 'Disaster Recovery',
    icon: 'refresh',
  },
];

export const securityTags = [
  'Permission Control',
  'Activity Logs',
  'Session Management',
  'Data Backup',
  'Secure File Storage',
  'Audit Trail',
];
