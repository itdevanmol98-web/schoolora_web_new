import type { Student } from '../students/types';

export interface ParentStudentLink {
  id: string;
  parentId: string;
  studentId: string;
  relation: string;
  isPrimaryContact?: boolean;
  isEmergencyContact?: boolean;
  canPickup?: boolean;
  student?: Student;
  createdAt: string;
}

export interface Parent {
  id: string;
  tenantId: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  relationshipType: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
  students?: ParentStudentLink[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateParentDto {
  firstName: string;
  lastName: string;
  relationshipType: 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';
  email?: string;
  phone?: string;
  occupation?: string;
  address?: string;
}

export interface LinkStudentDto {
  studentId: string;
  relation: string;
  isPrimaryContact?: boolean;
  isEmergencyContact?: boolean;
  canPickup?: boolean;
}
