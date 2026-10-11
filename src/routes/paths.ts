export const PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp',
  DASHBOARD: '/dashboard',
  CHANGE_PASSWORD: '/change-password',
  FIRST_LOGIN_PASSWORD_CHANGE: '/first-login-password-change',
  SESSIONS: '/sessions',
  LOGIN_HISTORY: '/login-history',
  // Phase 3: Super Admin & Multi-Tenant Management
  ADMIN_DASHBOARD: '/admin/dashboard',
  TENANTS: '/admin/tenants',
  TENANT_DETAIL: '/admin/tenants/:id',
  SCHOOLS: '/admin/schools',
  BRANCHES: '/admin/branches',
  USERS: '/admin/users',
  ROLES: '/admin/roles',
  PERMISSIONS: '/admin/permissions',
  DOMAINS: '/admin/domains',
  SETTINGS: '/admin/settings',
  AUDIT_LOGS: '/admin/audit-logs',

  // Phase 3: Subscription & Billing
  SUBSCRIPTIONS: '/admin/subscriptions',
  SUBSCRIPTION_PLANS: '/admin/subscription-plans',
  INVOICES: '/admin/invoices',
  PAYMENTS: '/admin/payments',
  COUPONS: '/admin/coupons',
  BILLING_ANALYTICS: '/admin/billing-analytics',

  // Phase 4: School Administration
  SCHOOL_PROFILE: '/school-admin/profile',
  SCHOOL_SETTINGS: '/school-admin/settings',

  // Phase 4: Academics
  ACADEMIC_SESSIONS: '/academics/sessions',
  CLASSES: '/academics/classes',
  SECTIONS: '/academics/sections',
  SUBJECTS: '/academics/subjects',
  CLASS_SUBJECTS: '/academics/class-subjects',
  TEACHER_ASSIGNMENTS: '/academics/teacher-assignments',

  // Phase 4: People (Students, Parents, Teachers)
  STUDENTS: '/people/students',
  STUDENT_CREATE: '/people/students/new',
  STUDENT_DETAIL: '/people/students/:id',
  PARENTS: '/people/parents',
  PARENT_DETAIL: '/people/parents/:id',
  TEACHERS: '/people/teachers',
  TEACHER_DETAIL: '/people/teachers/:id',

  // Phase 4: Student Operations
  STUDENT_OPERATIONS: '/student-operations/lifecycle',

  NOT_FOUND: '*',
} as const

export type AppPath = (typeof PATHS)[keyof typeof PATHS]
