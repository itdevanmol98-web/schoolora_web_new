export interface StudentEnrollment {
  id: string;
  studentId: string;
  sessionId: string;
  classId: string;
  sectionId: string;
  rollNumber?: string;
  status: 'ENROLLED' | 'PROMOTED' | 'TRANSFERRED' | 'WITHDRAWN' | 'GRADUATED';
  startDate?: string;
  endDate?: string;
  session?: { id: string; name: string; code: string };
  class?: { id: string; name: string; code: string };
  section?: { id: string; name: string; code: string };
}

export interface Student {
  id: string;
  tenantId: string;
  schoolId: string;
  admissionNumber?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'WITHDRAWN' | 'SUSPENDED';
  enrollments?: StudentEnrollment[];
  currentEnrollment?: StudentEnrollment;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  email?: string;
  phone?: string;
  address?: string;
  admissionNumber?: string;
  initialEnrollment?: {
    sessionId: string;
    classId: string;
    sectionId: string;
    rollNumber?: string;
  };
}

export interface StudentTransferDto {
  targetClassId: string;
  targetSectionId: string;
  targetRollNumber?: string;
  reason?: string;
}

export interface StudentPromoteDto {
  targetSessionId: string;
  targetClassId: string;
  targetSectionId: string;
  targetRollNumber?: string;
}

export interface StudentWithdrawDto {
  reason: string;
  withdrawalDate: string;
}
