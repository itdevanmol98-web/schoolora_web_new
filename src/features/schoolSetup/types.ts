export interface SchoolSetupStatus {
  isCompleted?: boolean
  step?: string
  hasProfile?: boolean
  hasSessions?: boolean
  hasClasses?: boolean
  hasTeachers?: boolean
  message?: string
}

export interface SchoolProfile {
  id?: string
  schoolId?: string
  name?: string
  code?: string
  timezone?: string
  locale?: string
  dateFormat?: string
  currency?: string
  academicYearStartMonth?: number
  gradingSystem?: string
  attendanceType?: string
  affiliationNumber?: string
  logoUrl?: string
  website?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  createdAt?: string
  updatedAt?: string
}

export type SchoolAcademicProfile = SchoolProfile

export interface UpdateSchoolProfilePayload {
  timezone?: string
  locale?: string
  dateFormat?: string
  currency?: string
  academicYearStartMonth?: number
  gradingSystem?: string
  attendanceType?: string
  affiliationNumber?: string
  website?: string
  logoUrl?: string
}
