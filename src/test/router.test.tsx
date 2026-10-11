import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './test-utils'
import LandingPage from '@/pages/LandingPage'
import DashboardPlaceholderPage from '@/pages/DashboardPlaceholderPage'
import NotFoundPage from '@/pages/NotFoundPage'

describe('Application Pages and Route Views', () => {
  it('renders LandingPage with Schoolora ERP branding', () => {
    renderWithProviders(<LandingPage />, { initialEntries: ['/'] })
    expect(
      screen.getByRole('heading', { level: 1, name: /Schoolora ERP Platform/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Architectural Foundation/i)).toBeInTheDocument()
  })

  it('renders DashboardPlaceholderPage without mock business data', () => {
    renderWithProviders(<DashboardPlaceholderPage />, { initialEntries: ['/dashboard'] })
    expect(screen.getByText(/Schoolora ERP Workspace/i)).toBeInTheDocument()
    expect(screen.getByText(/Student & Academic Records/i)).toBeInTheDocument()
    expect(screen.getByText(/No Active Module Records Yet/i)).toBeInTheDocument()
  })

  it('renders NotFoundPage with 404 message and home link', () => {
    renderWithProviders(<NotFoundPage />, { initialEntries: ['/non-existent'] })
    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /return to home/i })).toBeInTheDocument()
  })
})
