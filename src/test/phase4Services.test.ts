import { describe, it, expect, vi, beforeEach } from 'vitest'
import { axiosClient } from '@/api/axiosClient'
import { schoolSetupService } from '@/features/schoolSetup/schoolSetupService'
import { academicSessionService } from '@/features/academics/academicSessionService'
import { classSectionService } from '@/features/academics/classSectionService'
import { subjectService } from '@/features/academics/subjectService'
import { teacherService } from '@/features/teachers/teacherService'
import { teacherAssignmentService } from '@/features/teachers/teacherAssignmentService'
import { studentService } from '@/features/students/studentService'
import { parentService } from '@/features/parents/parentService'

describe('Phase 4 API Services Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('School Setup Service', () => {
    it('fetches school setup wizard status', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: {
            isCompleted: true,
            step: 'COMPLETED',
            hasProfile: true,
            hasSessions: true,
          },
        },
      })

      const status = await schoolSetupService.getStatus()
      expect(status.isCompleted).toBe(true)
      expect(status.step).toBe('COMPLETED')
    })

    it('fetches and updates school academic profile', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: {
            timezone: 'America/New_York',
            locale: 'en-US',
            currency: 'USD',
            affiliationNumber: 'AFF-2026-NY-99',
          },
        },
      })

      const profile = await schoolSetupService.getProfile()
      expect(profile.timezone).toBe('America/New_York')

      vi.spyOn(axiosClient, 'put').mockResolvedValueOnce({
        data: {
          data: {
            timezone: 'America/Chicago',
            locale: 'en-US',
            currency: 'USD',
            affiliationNumber: 'AFF-2026-NY-99',
          },
        },
      })

      const updated = await schoolSetupService.updateProfile({ timezone: 'America/Chicago' })
      expect(updated.timezone).toBe('America/Chicago')
    })
  })

  describe('Academic Session Service', () => {
    it('lists academic sessions and creates a new session', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'sess-1',
              name: 'Academic Year 2026-2027',
              code: 'AY-2026-27',
              startDate: '2026-08-01T00:00:00.000Z',
              endDate: '2027-05-31T23:59:59.000Z',
              isCurrent: true,
            },
          ],
          total: 1,
        },
      })

      const res = await academicSessionService.listSessions()
      expect(res.data).toHaveLength(1)
      expect(res.data[0].code).toBe('AY-2026-27')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'sess-2',
            name: 'Academic Year 2027-2028',
            code: 'AY-2027-28',
            startDate: '2027-08-01T00:00:00.000Z',
            endDate: '2028-05-31T23:59:59.000Z',
            isCurrent: false,
          },
        },
      })

      const created = await academicSessionService.createSession({
        name: 'Academic Year 2027-2028',
        code: 'AY-2027-28',
        startDate: '2027-08-01T00:00:00.000Z',
        endDate: '2028-05-31T23:59:59.000Z',
        isCurrent: false,
      })
      expect(created.code).toBe('AY-2027-28')
    })

    it('sets current session and closes session', async () => {
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { message: 'Session activated' },
      })
      const actRes = await academicSessionService.setCurrentSession('sess-1')
      expect(actRes.success).toBe(true)

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { message: 'Session closed' },
      })
      const closeRes = await academicSessionService.closeSession('sess-1')
      expect(closeRes.success).toBe(true)
    })
  })

  describe('Classes & Sections Service', () => {
    it('performs CRUD on classes', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [{ id: 'cls-10', name: 'Grade 10', code: 'CLS-10', numericOrder: 10 }],
          total: 1,
        },
      })
      const list = await classSectionService.listClasses()
      expect(list.data[0].name).toBe('Grade 10')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { data: { id: 'cls-11', name: 'Grade 11', code: 'CLS-11', numericOrder: 11 } },
      })
      const created = await classSectionService.createClass({
        name: 'Grade 11',
        code: 'CLS-11',
        numericOrder: 11,
      })
      expect(created.name).toBe('Grade 11')

      vi.spyOn(axiosClient, 'delete').mockResolvedValueOnce({
        data: { message: 'Deleted' },
      })
      const del = await classSectionService.deleteClass('cls-11')
      expect(del.success).toBe(true)
    })

    it('performs CRUD on sections', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [{ id: 'sec-10a', classId: 'cls-10', name: 'Section A', code: 'SEC-10A', capacity: 35 }],
          total: 1,
        },
      })
      const sections = await classSectionService.listSections({ classId: 'cls-10' })
      expect(sections.data[0].code).toBe('SEC-10A')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { data: { id: 'sec-10b', classId: 'cls-10', name: 'Section B', code: 'SEC-10B', capacity: 30 } },
      })
      const createdSec = await classSectionService.createSection({
        classId: 'cls-10',
        name: 'Section B',
        code: 'SEC-10B',
        capacity: 30,
      })
      expect(createdSec.name).toBe('Section B')
    })
  })

  describe('Curriculum Subjects & Mapping Service', () => {
    it('manages subject catalog and class curriculum mappings', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [{ id: 'sub-phy', name: 'Advanced Physics', code: 'PHY-101', type: 'THEORY', creditHours: 4 }],
          total: 1,
        },
      })
      const subjects = await subjectService.listSubjects()
      expect(subjects.data[0].code).toBe('PHY-101')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: { id: 'map-1', classId: 'cls-10', subjectId: 'sub-phy', isOptional: false },
        },
      })
      const mapped = await subjectService.mapSubjectToClass({
        classId: 'cls-10',
        subjectId: 'sub-phy',
        isOptional: false,
      })
      expect(mapped.subjectId).toBe('sub-phy')

      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [{ id: 'map-1', classId: 'cls-10', subjectId: 'sub-phy', isOptional: false }],
        },
      })
      const classMappings = await subjectService.listClassSubjects('cls-10')
      expect(classMappings).toHaveLength(1)

      vi.spyOn(axiosClient, 'delete').mockResolvedValueOnce({
        data: { message: 'Mapping removed' },
      })
      const unmap = await subjectService.removeClassSubject('map-1')
      expect(unmap.success).toBe(true)
    })
  })

  describe('Teachers & Assignments Service', () => {
    it('creates, lists, and retrieves teacher profile', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'tch-1',
              employeeId: 'EMP-TCH-001',
              firstName: 'John',
              lastName: 'Smith',
              department: 'Science',
              designation: 'Senior Faculty',
            },
          ],
          total: 1,
        },
      })
      const res = await teacherService.listTeachers()
      expect(res.data[0].employeeId).toBe('EMP-TCH-001')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'tch-2',
            employeeId: 'EMP-TCH-002',
            firstName: 'Sarah',
            lastName: 'Connor',
            department: 'Mathematics',
          },
        },
      })
      const newTch = await teacherService.createTeacher({
        email: 'sarah.connor@schoolora.local',
        employeeId: 'EMP-TCH-002',
        firstName: 'Sarah',
        lastName: 'Connor',
        department: 'Mathematics',
      })
      expect(newTch.employeeId).toBe('EMP-TCH-002')
    })

    it('assigns teacher and removes assignment', async () => {
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'asg-1',
            sessionId: 'sess-1',
            teacherId: 'tch-1',
            classId: 'cls-10',
            role: 'SUBJECT_TEACHER',
          },
        },
      })
      const asg = await teacherAssignmentService.createAssignment({
        sessionId: 'sess-1',
        teacherId: 'tch-1',
        classId: 'cls-10',
        role: 'SUBJECT_TEACHER',
      })
      expect(asg.role).toBe('SUBJECT_TEACHER')

      vi.spyOn(axiosClient, 'delete').mockResolvedValueOnce({
        data: { message: 'Assignment removed' },
      })
      const delAsg = await teacherAssignmentService.deleteAssignment('asg-1')
      expect(delAsg.success).toBe(true)
    })
  })

  describe('Students & Academic Lifecycle Service', () => {
    it('manages student admission, transfer, promotion, and withdrawal', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'stu-1',
              firstName: 'Oliver',
              lastName: 'Twist',
              admissionNumber: 'ADM-2026-001',
              status: 'ACTIVE',
            },
          ],
          total: 1,
        },
      })
      const list = await studentService.listStudents()
      expect(list.data[0].firstName).toBe('Oliver')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'stu-2',
            firstName: 'David',
            lastName: 'Copperfield',
            admissionNumber: 'ADM-2026-002',
          },
        },
      })
      const admitted = await studentService.createStudent({
        firstName: 'David',
        lastName: 'Copperfield',
      })
      expect(admitted.firstName).toBe('David')

      // Transfer section
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { success: true, message: 'Transferred successfully' },
      })
      const transferRes = await studentService.transferStudent('stu-1', {
        targetClassId: 'cls-10',
        targetSectionId: 'sec-10b',
        reason: 'Stream preference change',
      })
      expect(transferRes.success).toBe(true)

      // Promote session
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { success: true, message: 'Promoted successfully' },
      })
      const promoteRes = await studentService.promoteStudent('stu-1', {
        targetSessionId: 'sess-2',
        targetClassId: 'cls-11',
        targetSectionId: 'sec-11a',
      })
      expect(promoteRes.success).toBe(true)

      // Withdraw
      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: { success: true, message: 'Withdrawn' },
      })
      const withdrawRes = await studentService.withdrawStudent('stu-1', {
        reason: 'Family relocated',
        withdrawalDate: '2026-10-10',
      })
      expect(withdrawRes.success).toBe(true)
    })
  })

  describe('Parents & Ward Linkage Service', () => {
    it('creates parent and links student ward', async () => {
      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [
            {
              id: 'par-1',
              firstName: 'Robert',
              lastName: 'Morgan',
              relationshipType: 'FATHER',
              phone: '+1-555-0104',
            },
          ],
          total: 1,
        },
      })
      const parents = await parentService.listParents()
      expect(parents.data[0].phone).toBe('+1-555-0104')

      vi.spyOn(axiosClient, 'post').mockResolvedValueOnce({
        data: {
          data: {
            id: 'link-1',
            parentId: 'par-1',
            studentId: 'stu-1',
            relation: 'FATHER',
          },
        },
      })
      const link = await parentService.linkStudent('par-1', {
        studentId: 'stu-1',
        relation: 'FATHER',
      })
      expect(link.relation).toBe('FATHER')

      vi.spyOn(axiosClient, 'get').mockResolvedValueOnce({
        data: {
          data: [{ id: 'link-1', parentId: 'par-1', studentId: 'stu-1', relation: 'FATHER' }],
        },
      })
      const linked = await parentService.getLinkedStudents('par-1')
      expect(linked).toHaveLength(1)

      vi.spyOn(axiosClient, 'delete').mockResolvedValueOnce({
        data: { success: true },
      })
      const unlink = await parentService.unlinkStudent('par-1', 'stu-1')
      expect(unlink.success).toBe(true)
    })
  })
})
