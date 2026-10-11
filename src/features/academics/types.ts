export interface AcademicSessionItem {
  id: string
  schoolId?: string
  name: string
  code: string
  startDate: string
  endDate: string
  isCurrent: boolean
  status?: 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
  createdAt?: string
  updatedAt?: string
}

export interface CreateAcademicSessionPayload {
  name: string
  code: string
  startDate: string
  endDate: string
  isCurrent?: boolean
}

export interface ClassItem {
  id: string
  schoolId?: string
  name: string
  code: string
  numericOrder: number
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateClassPayload {
  name: string
  code: string
  numericOrder: number
  description?: string
}

export interface UpdateClassPayload {
  name?: string
  description?: string
  numericOrder?: number
}

export interface SectionItem {
  id: string
  classId: string
  name: string
  code: string
  capacity?: number
  class?: ClassItem
  createdAt?: string
  updatedAt?: string
}

export interface CreateSectionPayload {
  classId: string
  name: string
  code: string
  capacity?: number
}

export interface UpdateSectionPayload {
  name?: string
  capacity?: number
}

export type SubjectType = 'THEORY' | 'PRACTICAL' | 'ELECTIVE' | 'VOCATIONAL'

export interface SubjectItem {
  id: string
  schoolId?: string
  name: string
  code: string
  type: SubjectType | string
  creditHours?: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSubjectPayload {
  name: string
  code: string
  type: SubjectType | string
  creditHours?: number
  description?: string
}

export interface ClassSubjectMappingItem {
  id: string
  classId: string
  subjectId: string
  isOptional: boolean
  class?: ClassItem
  subject?: SubjectItem
  createdAt?: string
}

export interface CreateClassSubjectMappingPayload {
  classId: string
  subjectId: string
  isOptional?: boolean
}

export type AcademicSession = AcademicSessionItem
export type CreateAcademicSessionDto = CreateAcademicSessionPayload
export type AcademicClass = ClassItem
export type CreateClassDto = CreateClassPayload
export type ClassSection = SectionItem
export type CreateSectionDto = CreateSectionPayload
export type Subject = SubjectItem
export type CreateSubjectDto = CreateSubjectPayload
export type ClassSubjectMapping = ClassSubjectMappingItem
export type CreateClassSubjectMappingDto = CreateClassSubjectMappingPayload
