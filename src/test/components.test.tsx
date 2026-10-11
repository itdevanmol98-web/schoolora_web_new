import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import {
  AppButton,
  AppTextField,
  AppCard,
  AppErrorState,
  AppEmptyState,
  AppSelect,
  AppDialog,
  AppConfirmDialog,
  AppPageHeader,
  AppLoading,
  ErrorBoundary,
} from '@/components/common'

describe('Shared UI Components', () => {
  describe('AppButton', () => {
    it('renders button label and fires onClick', () => {
      const handleClick = vi.fn()
      renderWithProviders(<AppButton onClick={handleClick}>Click Me</AppButton>)

      const btn = screen.getByRole('button', { name: /click me/i })
      expect(btn).toBeInTheDocument()
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('displays loading state and disables button when loading is true', () => {
      const handleClick = vi.fn()
      renderWithProviders(
        <AppButton loading loadingText="Saving..." onClick={handleClick}>
          Submit
        </AppButton>
      )

      const btn = screen.getByRole('button')
      expect(btn).toBeDisabled()
      expect(screen.getByText('Saving...')).toBeInTheDocument()
      fireEvent.click(btn)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('AppTextField', () => {
    it('renders with label and helper text', () => {
      renderWithProviders(
        <AppTextField label="Student Name" helperText="Enter full name" />
      )

      expect(screen.getByLabelText(/student name/i)).toBeInTheDocument()
      expect(screen.getByText('Enter full name')).toBeInTheDocument()
    })

    it('displays error message when error is true', () => {
      renderWithProviders(
        <AppTextField label="Email" error helperText="Invalid institutional email" />
      )

      expect(screen.getByText('Invalid institutional email')).toBeInTheDocument()
    })
  })

  describe('AppCard', () => {
    it('renders title, subtitle, and body content', () => {
      renderWithProviders(
        <AppCard title="Attendance Card" subtitle="Monthly Overview">
          <div>Card Content Body</div>
        </AppCard>
      )

      expect(screen.getByText('Attendance Card')).toBeInTheDocument()
      expect(screen.getByText('Monthly Overview')).toBeInTheDocument()
      expect(screen.getByText('Card Content Body')).toBeInTheDocument()
    })
  })

  describe('AppSelect', () => {
    it('renders select with label and options', () => {
      const handleChange = vi.fn()
      renderWithProviders(
        <AppSelect
          label="Academic Year"
          value="2026"
          onChange={handleChange}
          options={[
            { value: '2025', label: '2024-2025' },
            { value: '2026', label: '2025-2026' },
          ]}
        />
      )

      expect(screen.getByLabelText(/academic year/i)).toBeInTheDocument()
      expect(screen.getByText('2025-2026')).toBeInTheDocument()
    })
  })

  describe('AppDialog', () => {
    it('renders dialog title and content when open', () => {
      const handleClose = vi.fn()
      renderWithProviders(
        <AppDialog
          open={true}
          onClose={handleClose}
          title="Create Record"
          subtitle="Form instructions"
          actions={<button>Save</button>}
        >
          <div>Dialog Content Details</div>
        </AppDialog>
      )

      expect(screen.getByText('Create Record')).toBeInTheDocument()
      expect(screen.getByText('Form instructions')).toBeInTheDocument()
      expect(screen.getByText('Dialog Content Details')).toBeInTheDocument()

      const closeBtn = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('AppConfirmDialog', () => {
    it('renders confirmation text and handles onConfirm and onCancel', () => {
      const handleConfirm = vi.fn()
      const handleCancel = vi.fn()
      renderWithProviders(
        <AppConfirmDialog
          open={true}
          title="Delete Department"
          message="Are you sure you want to delete this department?"
          confirmText="Yes, Delete"
          cancelText="No, Keep"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )

      expect(screen.getByText('Delete Department')).toBeInTheDocument()
      expect(
        screen.getByText('Are you sure you want to delete this department?')
      ).toBeInTheDocument()

      const cancelBtn = screen.getByRole('button', { name: /no, keep/i })
      fireEvent.click(cancelBtn)
      expect(handleCancel).toHaveBeenCalledTimes(1)

      const confirmBtn = screen.getByRole('button', { name: /yes, delete/i })
      fireEvent.click(confirmBtn)
      expect(handleConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('AppPageHeader', () => {
    it('renders title, subtitle, and fires onBack callback', () => {
      const handleBack = vi.fn()
      renderWithProviders(
        <AppPageHeader
          title="Fee Structures"
          subtitle="Manage academic fees and payment categories"
          onBack={handleBack}
          actions={<button>Export</button>}
        />
      )

      expect(screen.getByText('Fee Structures')).toBeInTheDocument()
      expect(
        screen.getByText('Manage academic fees and payment categories')
      ).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()

      const backBtn = screen.getByRole('button', { name: /go back/i })
      fireEvent.click(backBtn)
      expect(handleBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('AppLoading', () => {
    it('renders inline loading spinner with message', () => {
      renderWithProviders(<AppLoading message="Loading student data..." />)
      expect(screen.getByText('Loading student data...')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('AppErrorState', () => {
    it('renders error title and triggers retry callback', () => {
      const handleRetry = vi.fn()
      renderWithProviders(
        <AppErrorState
          title="Network Connection Failed"
          message="Could not reach backend"
          onRetry={handleRetry}
        />
      )

      expect(screen.getByText('Network Connection Failed')).toBeInTheDocument()
      expect(screen.getByText('Could not reach backend')).toBeInTheDocument()

      const retryBtn = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(retryBtn)
      expect(handleRetry).toHaveBeenCalledTimes(1)
    })
  })

  describe('AppEmptyState', () => {
    it('renders empty message and handles action button', () => {
      const handleAction = vi.fn()
      renderWithProviders(
        <AppEmptyState
          title="No Students Registered"
          description="Register new student to begin"
          actionText="Add Student"
          onAction={handleAction}
        />
      )

      expect(screen.getByText('No Students Registered')).toBeInTheDocument()
      expect(screen.getByText('Register new student to begin')).toBeInTheDocument()

      const actionBtn = screen.getByRole('button', { name: /add student/i })
      fireEvent.click(actionBtn)
      expect(handleAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('ErrorBoundary', () => {
    it('catches rendering errors and renders fallback without crashing', () => {
      const ProblemComponent = () => {
        throw new Error('Test crash in child component')
      }

      // Suppress console.error in this expected error test
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      renderWithProviders(
        <ErrorBoundary>
          <ProblemComponent />
        </ErrorBoundary>
      )

      expect(
        screen.getByText('An Unexpected Application Error Occurred')
      ).toBeInTheDocument()
      expect(screen.getByText('Test crash in child component')).toBeInTheDocument()

      spy.mockRestore()
    })
  })
})
