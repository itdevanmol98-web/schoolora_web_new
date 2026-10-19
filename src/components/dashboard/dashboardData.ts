export interface KpiCardData {
  id: string
  title: string
  value: string
  growth: string
  subtext: string
  bgColor: string
  textColor: string
  iconType: 'schools' | 'students' | 'staff' | 'revenue' | 'subscriptions'
}

export const KPI_DATA: KpiCardData[] = [
  {
    id: 'schools',
    title: 'Total Schools',
    value: '517',
    growth: '+12%',
    subtext: '+54 this month',
    bgColor: '#0284c7', // Cyan / Sky Blue
    textColor: '#ffffff',
    iconType: 'schools',
  },
  {
    id: 'students',
    title: 'Total Students',
    value: '1,00,000+',
    growth: '+18%',
    subtext: '+12,450 this month',
    bgColor: '#10b981', // Emerald Green
    textColor: '#ffffff',
    iconType: 'students',
  },
  {
    id: 'staff',
    title: 'Total Staff',
    value: '5,000+',
    growth: '+14%',
    subtext: '+620 this month',
    bgColor: '#8b5cf6', // Purple
    textColor: '#ffffff',
    iconType: 'staff',
  },
  {
    id: 'revenue',
    title: 'Platform Revenue',
    value: '₹ 12.5L',
    growth: '+28%',
    subtext: '+₹2.7L this month',
    bgColor: '#f97316', // Orange
    textColor: '#ffffff',
    iconType: 'revenue',
  },
  {
    id: 'subscriptions',
    title: 'Active Subscriptions',
    value: '203',
    growth: '+8%',
    subtext: '+14 this month',
    bgColor: '#ec4899', // Pink / Magenta
    textColor: '#ffffff',
    iconType: 'subscriptions',
  },
]

export interface SchoolGrowthItem {
  month: string
  newSchools: number
  totalSchools: number
}

export const SCHOOL_GROWTH_DATA: SchoolGrowthItem[] = [
  { month: 'Jan', newSchools: 18, totalSchools: 28 },
  { month: 'Feb', newSchools: 22, totalSchools: 35 },
  { month: 'Mar', newSchools: 25, totalSchools: 42 },
  { month: 'Apr', newSchools: 30, totalSchools: 48 },
  { month: 'May', newSchools: 36, totalSchools: 55 },
  { month: 'Jun', newSchools: 40, totalSchools: 60 },
  { month: 'Jul', newSchools: 42, totalSchools: 63 },
  { month: 'Aug', newSchools: 45, totalSchools: 66 },
  { month: 'Sep', newSchools: 54, totalSchools: 72 },
  { month: 'Oct', newSchools: 58, totalSchools: 76 },
  { month: 'Nov', newSchools: 62, totalSchools: 80 },
  { month: 'Dec', newSchools: 68, totalSchools: 85 },
]

export interface SubscriptionPlanItem {
  name: string
  count: number
  color: string
}

export const SUBSCRIPTION_PLANS_DATA: SubscriptionPlanItem[] = [
  { name: 'Starter', count: 64, color: '#06b6d4' },       // Cyan
  { name: 'Professional', count: 89, color: '#10b981' },  // Green
  { name: 'Enterprise', count: 32, color: '#f59e0b' },    // Orange/Gold
  { name: 'Custom', count: 18, color: '#8b5cf6' },        // Purple
]

export interface PlatformRevenueItem {
  month: string
  revenue: number
  label: string
}

export const PLATFORM_REVENUE_DATA: PlatformRevenueItem[] = [
  { month: 'Apr', revenue: 6.2, label: '₹6.2L' },
  { month: 'May', revenue: 7.8, label: '₹7.8L' },
  { month: 'Jun', revenue: 9.4, label: '₹9.4L' },
  { month: 'Jul', revenue: 10.6, label: '₹10.6L' },
  { month: 'Aug', revenue: 11.8, label: '₹11.8L' },
  { month: 'Sep', revenue: 12.5, label: '₹12.5L' },
]

export interface ActivityItem {
  id: string
  title: string
  target: string
  timeAgo: string
  iconType: 'school' | 'subscription' | 'user' | 'payment' | 'ticket' | 'module' | 'deactivate' | 'enquiry'
}

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'New school registered',
    target: 'Green Valley School',
    timeAgo: '2 mins ago',
    iconType: 'school',
  },
  {
    id: '2',
    title: 'Subscription renewed',
    target: 'Bright Future Academy',
    timeAgo: '12 mins ago',
    iconType: 'subscription',
  },
  {
    id: '3',
    title: 'New user added',
    target: 'teacher@dps.edu.in',
    timeAgo: '25 mins ago',
    iconType: 'user',
  },
  {
    id: '4',
    title: 'Payment received',
    target: '₹12,000 from Sunrise School',
    timeAgo: '40 mins ago',
    iconType: 'payment',
  },
  {
    id: '5',
    title: 'Support ticket created',
    target: 'Login issue · ABC School',
    timeAgo: '1 hour ago',
    iconType: 'ticket',
  },
  {
    id: '6',
    title: 'Module enabled',
    target: 'Transport Module · XYZ School',
    timeAgo: '2 hours ago',
    iconType: 'module',
  },
  {
    id: '7',
    title: 'School deactivated',
    target: 'Sunrise Public School',
    timeAgo: '3 hours ago',
    iconType: 'deactivate',
  },
  {
    id: '8',
    title: 'New enquiry received',
    target: 'info@sunrise.edu.in',
    timeAgo: '4 hours ago',
    iconType: 'enquiry',
  },
]

export interface QuickActionItem {
  id: string
  label: string
  iconName: 'building' | 'creditCard' | 'userPlus' | 'barChart' | 'layout' | 'send' | 'lifeBuoy' | 'settings'
  path: string
  bgTint: string
  iconColor: string
  borderColor: string
}

export const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: 'add-school',
    label: 'Add School',
    iconName: 'building',
    path: '/admin/schools',
    bgTint: '#eff6ff',
    iconColor: '#2563eb',
    borderColor: '#dbeafe',
  },
  {
    id: 'manage-subscriptions',
    label: 'Manage Subscriptions',
    iconName: 'creditCard',
    path: '/admin/subscriptions',
    bgTint: '#f0fdf4',
    iconColor: '#16a34a',
    borderColor: '#dcfce7',
  },
  {
    id: 'create-user',
    label: 'Create User',
    iconName: 'userPlus',
    path: '/admin/users',
    bgTint: '#faf5ff',
    iconColor: '#9333ea',
    borderColor: '#f3e8ff',
  },
  {
    id: 'view-reports',
    label: 'View Reports',
    iconName: 'barChart',
    path: '/admin/billing-analytics',
    bgTint: '#fffbeb',
    iconColor: '#d97706',
    borderColor: '#fef3c7',
  },
  {
    id: 'manage-templates',
    label: 'Manage Templates',
    iconName: 'layout',
    path: '/academics/subjects',
    bgTint: '#fdf2f8',
    iconColor: '#db2777',
    borderColor: '#fce7f3',
  },
  {
    id: 'send-announcement',
    label: 'Send Announcement',
    iconName: 'send',
    path: '/admin/dashboard',
    bgTint: '#ecfeff',
    iconColor: '#0891b2',
    borderColor: '#cffafe',
  },
  {
    id: 'support-tickets',
    label: 'Support Tickets',
    iconName: 'lifeBuoy',
    path: '/admin/dashboard',
    bgTint: '#fef2f2',
    iconColor: '#dc2626',
    borderColor: '#fee2e2',
  },
  {
    id: 'system-settings',
    label: 'System Settings',
    iconName: 'settings',
    path: '/admin/settings',
    bgTint: '#f8fafc',
    iconColor: '#475569',
    borderColor: '#e2e8f0',
  },
]

export interface SchoolRegistrationRow {
  id: string
  name: string
  location: string
  plan: 'Starter' | 'Professional' | 'Enterprise'
  date: string
  status: 'Active' | 'Pending' | 'Inactive'
}

export const LATEST_SCHOOLS_DATA: SchoolRegistrationRow[] = [
  {
    id: '1',
    name: 'Dev School',
    location: 'Patna, Bihar',
    plan: 'Professional',
    date: 'Sep 17, 2026',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Gyan Sagar Mission',
    location: 'Gaya, Bihar',
    plan: 'Starter',
    date: 'Sep 16, 2026',
    status: 'Active',
  },
  {
    id: '3',
    name: 'ABC Public School',
    location: 'Muzaffarpur, Bihar',
    plan: 'Enterprise',
    date: 'Sep 15, 2026',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Vivekanand Int. School',
    location: 'Purnea, Bihar',
    plan: 'Professional',
    date: 'Sep 15, 2026',
    status: 'Pending',
  },
  {
    id: '5',
    name: 'Maidul Public School',
    location: 'Araria, Bihar',
    plan: 'Starter',
    date: 'Sep 14, 2026',
    status: 'Active',
  },
]

export interface TopSchoolItem {
  rank: number
  name: string
  studentCount: string
}

export const TOP_SCHOOLS_DATA: TopSchoolItem[] = [
  { rank: 1, name: 'DPS Ismailabad', studentCount: '2,459' },
  { rank: 2, name: 'Montessori School', studentCount: '1,377' },
  { rank: 3, name: 'SSVP 3.0', studentCount: '888' },
  { rank: 4, name: 'Sudhakar', studentCount: '818' },
  { rank: 5, name: 'Yug International', studentCount: '565' },
]

export interface PendingApprovalItem {
  id: string
  type: string
  target: string
  count: number
}

export const PENDING_APPROVALS_DATA: PendingApprovalItem[] = [
  {
    id: '1',
    type: 'School Registration Request',
    target: 'Sunrise Academy',
    count: 3,
  },
  {
    id: '2',
    type: 'Subscription Upgrade',
    target: 'Bright Future School',
    count: 5,
  },
  {
    id: '3',
    type: 'Domain Verification',
    target: 'Modern Public School',
    count: 2,
  },
  {
    id: '4',
    type: 'Support Ticket',
    target: 'ABC School',
    count: 7,
  },
]
