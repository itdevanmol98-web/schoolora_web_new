import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SchoolProfilePage } from '@/pages/school/SchoolProfilePage'
import { SchoolSettingsPage } from '@/pages/school/SchoolSettingsPage'
import { AcademicSessionsPage } from '@/pages/school/AcademicSessionsPage'
import { ClassesSectionsPage } from '@/pages/school/ClassesSectionsPage'
import { SubjectsPage } from '@/pages/school/SubjectsPage'
import { ClassSubjectMappingPage } from '@/pages/school/ClassSubjectMappingPage'
import { TeacherAssignmentsPage } from '@/pages/school/TeacherAssignmentsPage'
import { StudentsListPage } from '@/pages/school/StudentsListPage'
import { StudentRegistrationPage } from '@/pages/school/StudentRegistrationPage'
import { StudentLifecycleOperationsPage } from '@/pages/school/StudentLifecycleOperationsPage'
import { ParentsListPage } from '@/pages/school/ParentsListPage'
import { TeachersListPage } from '@/pages/school/TeachersListPage'
import { axiosClient } from '@/api/axiosClient'

describe('Phase 4 React Pages UI Rendering', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders SchoolProfilePage with academic parameters', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: {} },
    })

    render(
      <MemoryRouter>
        <SchoolProfilePage />
      </MemoryRouter>
    )

    expect(await screen.findByText('School Academic Profile')).toBeInTheDocument()
    expect(screen.getByText('Save Profile')).toBeInTheDocument()
  })

  it('renders SchoolSettingsPage with campus configuration', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <SchoolSettingsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('School Settings & Identity')).toBeInTheDocument()
  })

  it('renders AcademicSessionsPage with action buttons', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <AcademicSessionsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Academic Sessions & Years')).toBeInTheDocument()
    expect(screen.getByText('New Session')).toBeInTheDocument()
  })

  it('renders ClassesSectionsPage with class management', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <ClassesSectionsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Classes & Sections')).toBeInTheDocument()
    expect(screen.getByText('New Class')).toBeInTheDocument()
  })

  it('renders SubjectsPage with subjects catalog', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <SubjectsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Subjects & Curriculum Catalog')).toBeInTheDocument()
    expect(screen.getByText('New Subject')).toBeInTheDocument()
  })

  it('renders ClassSubjectMappingPage with curriculum management', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <ClassSubjectMappingPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Class-Subject Curriculum Mapping')).toBeInTheDocument()
  })

  it('renders TeacherAssignmentsPage with assignment tools', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <TeacherAssignmentsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Teacher & Faculty Assignments')).toBeInTheDocument()
    expect(screen.getByText('Assign Teacher')).toBeInTheDocument()
  })

  it('renders StudentsListPage with student directory and add button', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <StudentsListPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Student Directory & Enrolment')).toBeInTheDocument()
    expect(screen.getAllByText('Admit New Student')[0]).toBeInTheDocument()
  })

  it('renders StudentRegistrationPage with enrollment form fields', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <StudentRegistrationPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Student Admission & Registration')).toBeInTheDocument()
    expect(screen.getByText('Complete Admission & Enrol')).toBeInTheDocument()
  })

  it('renders StudentLifecycleOperationsPage with tabs for transfer, promotion, withdrawal', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <StudentLifecycleOperationsPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Student Lifecycle Operations')).toBeInTheDocument()
    expect(screen.getByText('Section Transfer')).toBeInTheDocument()
    expect(screen.getByText('Academic Promotion')).toBeInTheDocument()
    expect(screen.getByText('Student Withdrawal')).toBeInTheDocument()
  })

  it('renders ParentsListPage with parent registry and add button', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <ParentsListPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Parents & Guardians Directory')).toBeInTheDocument()
    expect(screen.getAllByText('Add Parent / Guardian')[0]).toBeInTheDocument()
  })

  it('renders TeachersListPage with faculty directory and add button', async () => {
    vi.spyOn(axiosClient, 'get').mockResolvedValue({
      data: { data: [] },
    })

    render(
      <MemoryRouter>
        <TeachersListPage />
      </MemoryRouter>
    )

    expect(await screen.findByText('Faculty & Teachers Directory')).toBeInTheDocument()
    expect(screen.getByText('Add Faculty Profile')).toBeInTheDocument()
  })
})
