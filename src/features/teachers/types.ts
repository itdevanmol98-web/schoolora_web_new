export interface TeacherProfile {
  id: string;
  tenantId: string;
  schoolId: string;
  userId?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherDto {
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  designation?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  joiningDate?: string;
  phone?: string;
}

export interface UpdateTeacherDto {
  firstName?: string;
  lastName?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  specialization?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface TeacherAssignment {
  id: string;
  tenantId: string;
  schoolId: string;
  sessionId: string;
  teacherId: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  role: 'CLASS_TEACHER' | 'SUBJECT_TEACHER' | 'CO_TEACHER';
  teacher?: TeacherProfile;
  class?: { id: string; name: string; code: string };
  section?: { id: string; name: string; code: string };
  subject?: { id: string; name: string; code: string };
  session?: { id: string; name: string; code: string };
  createdAt: string;
}

export interface CreateTeacherAssignmentDto {
  sessionId: string;
  teacherId: string;
  classId?: string;
  sectionId?: string;
  subjectId?: string;
  role: 'CLASS_TEACHER' | 'SUBJECT_TEACHER' | 'CO_TEACHER';
}
