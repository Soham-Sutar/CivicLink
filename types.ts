export enum Role {
  USER = 'USER',
  DEPT_ADMIN = 'DEPT_ADMIN',
  MAIN_ADMIN = 'MAIN_ADMIN'
}

export enum ReportStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum Department {
  POTHOLES = 'Potholes',
  STREETLIGHTS = 'Streetlights',
  GARBAGE = 'Garbage',
  WATER = 'Water Works',
  PARKS = 'Parks & Recreation'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for mock authentication
  role: Role;
  department?: Department; // Only for DEPT_ADMIN
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: Department;
  status: ReportStatus;
  imageUrl: string;
  submittedAt: Date;
  location: {
    lat: number;
    lng: number;
  };
}

export interface DepartmentAnalytics {
    department: Department;
    total: number;
    resolved: number;
    pending: number;
    inProgress: number;
}

export interface OverallAnalytics {
    totalReports: number;
    totalResolved: number;
    avgResolutionTimeDays: number;
    reportsByStatus: { name: ReportStatus; value: number }[];
    reportsByCategory: { name: Department; value: number }[];
}