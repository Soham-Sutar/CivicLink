import { User, Role, Department, Report, ReportStatus, OverallAnalytics, DepartmentAnalytics } from './types';
export const departments = [
  'Potholes',
  'Streetlights',
  'Garbage',
  'Water Works',
  'Parks & Recreation'
];

const ADMIN_PASSWORD = 'adminpassword';

// Changed from let back to const. Data will be managed in apiService with localStorage.
export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'John Citizen', email: 'john@citizen.com', password: 'password123', role: Role.USER },
  { id: 'dept-admin-1', name: 'Alice Smith', email: 'alice@potholes.gov', password: ADMIN_PASSWORD, role: Role.DEPT_ADMIN, department: Department.POTHOLES },
  { id: 'dept-admin-2', name: 'Bob Johnson', email: 'bob@streetlights.gov', password: ADMIN_PASSWORD, role: Role.DEPT_ADMIN, department: Department.STREETLIGHTS },
  { id: 'main-admin-1', name: 'Carol White', email: 'carol@admin.gov', password: ADMIN_PASSWORD, role: Role.MAIN_ADMIN },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'report-1',
    userId: 'user-1',
    userName: 'John Citizen',
    title: 'Deep Pothole on Main St',
    description: 'A very deep and dangerous pothole near the intersection of Main St and 1st Ave. It has damaged my tire.',
    category: Department.POTHOLES,
    status: ReportStatus.PENDING,
    imageUrl: 'https://picsum.photos/seed/pothole1/600/400',
    submittedAt: new Date(2023, 10, 1),
    location: { lat: 40.7128, lng: -74.0060 },
  },
  {
    id: 'report-2',
    userId: 'user-1',
    userName: 'John Citizen',
    title: 'Streetlight out on Oak Ave',
    description: 'The streetlight at the end of Oak Avenue has been out for three days. It is very dark at night.',
    category: Department.STREETLIGHTS,
    status: ReportStatus.IN_PROGRESS,
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
    submittedAt: new Date(2023, 10, 5),
    location: { lat: 40.7150, lng: -74.0080 },
  },
  {
    id: 'report-3',
    userId: 'user-2',
    userName: 'Jane Doe',
    title: 'Overflowing garbage can',
    description: 'The public garbage can in the park is overflowing and attracting pests.',
    category: Department.GARBAGE,
    status: ReportStatus.RESOLVED,
    imageUrl: 'https://picsum.photos/seed/garbage1/600/400',
    submittedAt: new Date(2023, 9, 28),
    location: { lat: 40.7100, lng: -74.0050 },
  },
  {
    id: 'report-4',
    userId: 'user-3',
    userName: 'Peter Jones',
    title: 'Another pothole!',
    description: 'Small pothole forming on Elm Street. Should be fixed before it gets worse.',
    category: Department.POTHOLES,
    status: ReportStatus.RESOLVED,
    imageUrl: 'https://picsum.photos/seed/pothole2/600/400',
    submittedAt: new Date(2023, 9, 15),
    location: { lat: 40.7180, lng: -74.0100 },
  },
   {
    id: 'report-5',
    userId: 'user-4',
    userName: 'Sam Wilson',
    title: 'Flickering street light',
    description: 'The light on the corner of 5th and Pine is flickering constantly. It\'s very distracting.',
    category: Department.STREETLIGHTS,
    status: ReportStatus.PENDING,
    imageUrl: 'https://picsum.photos/seed/light2/600/400',
    submittedAt: new Date(2023, 10, 6),
    location: { lat: 40.7200, lng: -74.0020 },
  },
];

export const MOCK_OVERALL_ANALYTICS: OverallAnalytics = {
  totalReports: 1250,
  totalResolved: 980,
  avgResolutionTimeDays: 3.5,
  reportsByStatus: [
    { name: ReportStatus.PENDING, value: 150 },
    { name: ReportStatus.IN_PROGRESS, value: 120 },
    { name: ReportStatus.RESOLVED, value: 980 },
  ],
  reportsByCategory: [
    { name: Department.POTHOLES, value: 450 },
    { name: Department.STREETLIGHTS, value: 300 },
    { name: Department.GARBAGE, value: 250 },
    { name: Department.WATER, value: 150 },
    { name: Department.PARKS, value: 100 },
  ],
};

export const MOCK_DEPARTMENT_ANALYTICS: DepartmentAnalytics[] = [
    { department: Department.POTHOLES, total: 450, resolved: 380, pending: 40, inProgress: 30 },
    { department: Department.STREETLIGHTS, total: 300, resolved: 250, pending: 30, inProgress: 20 },
    { department: Department.GARBAGE, total: 250, resolved: 220, pending: 20, inProgress: 10 },
    { department: Department.WATER, total: 150, resolved: 100, pending: 30, inProgress: 20 },
    { department: Department.PARKS, total: 100, resolved: 80, pending: 10, inProgress: 10 },
];