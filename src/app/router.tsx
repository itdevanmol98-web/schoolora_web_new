import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/layouts/RootLayout'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicOnlyRoute from '@/routes/PublicOnlyRoute'
import LandingPage from '@/pages/LandingPage'
import NotFoundPage from '@/pages/NotFoundPage'
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage'
import FirstLoginPasswordChangePage from '@/pages/auth/FirstLoginPasswordChangePage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage'
import SessionsPage from '@/pages/auth/SessionsPage'
import LoginHistoryPage from '@/pages/auth/LoginHistoryPage'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import {
  SuperAdminDashboardPage,
  TenantsListPage,
  TenantDetailPage,
  SchoolsListPage,
  BranchesListPage,
  UsersListPage,
  RolesPermissionsPage,
  DomainsPage,
  SettingsPage,
  AuditLogsPage,
  SubscriptionPlansPage,
  TenantSubscriptionsPage,
  InvoicesPage,
  PaymentsPage,
  CouponsPage,
  BillingAnalyticsPage,
  SchoolProfilePage,
  SchoolSettingsPage,
  AcademicSessionsPage,
  ClassesSectionsPage,
  SubjectsPage,
  ClassSubjectMappingPage,
  TeacherAssignmentsPage,
  StudentsListPage,
  StudentRegistrationPage,
  StudentDetailPage,
  ParentsListPage,
  ParentDetailPage,
  TeachersListPage,
  TeacherDetailPage,
  StudentLifecycleOperationsPage,
} from '@/pages'


export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <NotFoundPage />
      </ErrorBoundary>
    ),
    children: [
      // Public Landing & General Entry
      {
        path: '/',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
        ],
      },

      // Public-Only Auth Routes (Redirects to dashboard if already authenticated)
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'login',
                element: <LoginPage />,
              },
              {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
              },
              {
                path: 'reset-password',
                element: <ResetPasswordPage />,
              },
              {
                path: 'verify-email',
                element: <VerifyEmailPage />,
              },
              {
                path: 'verify-otp',
                element: <OtpVerificationPage />,
              },
            ],
          },
        ],
      },

      // Forced Password Reset Route (Protected, but allows password change for mustChangePassword users)
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: 'first-login-password-change',
                element: <FirstLoginPasswordChangePage />,
              },
            ],
          },
        ],
      },

      // Protected ERP Application Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: 'dashboard',
                element: <SuperAdminDashboardPage />,
              },
              {
                path: 'admin/dashboard',
                element: <SuperAdminDashboardPage />,
              },
              {
                path: 'admin/tenants',
                element: <TenantsListPage />,
              },
              {
                path: 'admin/tenants/:id',
                element: <TenantDetailPage />,
              },
              {
                path: 'admin/schools',
                element: <SchoolsListPage />,
              },
              {
                path: 'admin/branches',
                element: <BranchesListPage />,
              },
              {
                path: 'admin/users',
                element: <UsersListPage />,
              },
              {
                path: 'admin/roles',
                element: <RolesPermissionsPage />,
              },
              {
                path: 'admin/permissions',
                element: <RolesPermissionsPage />,
              },
              {
                path: 'admin/domains',
                element: <DomainsPage />,
              },
              {
                path: 'admin/settings',
                element: <SettingsPage />,
              },
              {
                path: 'admin/audit-logs',
                element: <AuditLogsPage />,
              },
              {
                path: 'admin/subscription-plans',
                element: <SubscriptionPlansPage />,
              },
              {
                path: 'admin/subscriptions',
                element: <TenantSubscriptionsPage />,
              },
              {
                path: 'admin/invoices',
                element: <InvoicesPage />,
              },
              {
                path: 'admin/payments',
                element: <PaymentsPage />,
              },
              {
                path: 'admin/coupons',
                element: <CouponsPage />,
              },
              {
                path: 'admin/billing-analytics',
                element: <BillingAnalyticsPage />,
              },
              // Phase 4: School Administration
              {
                path: 'school-admin/profile',
                element: <SchoolProfilePage />,
              },
              {
                path: 'school-admin/settings',
                element: <SchoolSettingsPage />,
              },
              // Phase 4: Academics
              {
                path: 'academics/sessions',
                element: <AcademicSessionsPage />,
              },
              {
                path: 'academics/classes',
                element: <ClassesSectionsPage />,
              },
              {
                path: 'academics/sections',
                element: <ClassesSectionsPage />,
              },
              {
                path: 'academics/subjects',
                element: <SubjectsPage />,
              },
              {
                path: 'academics/class-subjects',
                element: <ClassSubjectMappingPage />,
              },
              {
                path: 'academics/teacher-assignments',
                element: <TeacherAssignmentsPage />,
              },
              // Phase 4: People (Students, Parents, Teachers)
              {
                path: 'people/students',
                element: <StudentsListPage />,
              },
              {
                path: 'people/students/new',
                element: <StudentRegistrationPage />,
              },
              {
                path: 'people/students/:id',
                element: <StudentDetailPage />,
              },
              {
                path: 'people/parents',
                element: <ParentsListPage />,
              },
              {
                path: 'people/parents/:id',
                element: <ParentDetailPage />,
              },
              {
                path: 'people/teachers',
                element: <TeachersListPage />,
              },
              {
                path: 'people/teachers/:id',
                element: <TeacherDetailPage />,
              },
              // Phase 4: Student Operations (Enrollment & Lifecycle)
              {
                path: 'student-operations/lifecycle',
                element: <StudentLifecycleOperationsPage />,
              },
              {
                path: 'change-password',
                element: <ChangePasswordPage />,
              },
              {
                path: 'sessions',
                element: <SessionsPage />,
              },
              {
                path: 'login-history',
                element: <LoginHistoryPage />,
              },
            ],
          },
        ],
      },

      // Wildcard 404 Route
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])

export default router
