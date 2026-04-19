
import { User, Report, ReportStatus, Department, OverallAnalytics, DepartmentAnalytics, Role } from '../types';

const API_URL = 'http://localhost:4000/api';

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: Role.USER })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Registration failed');
  }
  const user = await res.json();
  return user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  const user = await res.json();
  return user;
};

export const getReportsForUser = async (userId: string): Promise<Report[]> => {
  const res = await fetch(`${API_URL}/reports/user/${userId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch reports');
  }
  const reports = await res.json();
  return reports.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.userName || '',
    title: r.title,
    description: r.description,
    category: r.category,
    status: r.status,
    imageUrl: r.image_url,
    submittedAt: r.submitted_at ? new Date(r.submitted_at) : new Date(),
    location: {
      lat: r.latitude,
      lng: r.longitude
    }
  }));
};

export const getReportsForDepartment = async (department: Department): Promise<Report[]> => {
  const res = await fetch(`${API_URL}/reports/department/${department}`);
  if (!res.ok) {
    throw new Error('Failed to fetch department reports');
  }
  const reports = await res.json();
  return reports.map((r: any) => ({
    id: r.id,
    userId: r.user_id,
    userName: r.userName || '',
    title: r.title,
    description: r.description,
    category: r.category,
    status: r.status,
    imageUrl: r.image_url,
    submittedAt: r.submitted_at ? new Date(r.submitted_at) : new Date(),
    location: {
      lat: r.latitude,
      lng: r.longitude
    }
  }));
};

export const submitReport = async (
  data: { title: string; description: string; category: Department; imageUrl: string; location: { lat: number, lng: number } },
  user: { id: string }
): Promise<Report> => {
  const res = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      location: data.location,
      userId: user.id
    })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to submit report');
  }
  return await res.json();
};

export const updateReportStatus = async (reportId: string, newStatus: ReportStatus): Promise<Report> => {
  const res = await fetch(`${API_URL}/reports/${reportId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update report status');
  }
  return await res.json();
};

// Analytics endpoints would need to be implemented in the backend for real data
export const getOverallAnalytics = async (): Promise<OverallAnalytics> => {
  const res = await fetch('/api/analytics/overall');
  if (!res.ok) throw new Error('Failed to fetch overall analytics');
  return await res.json();
};

export const getDepartmentAnalytics = async (department: string): Promise<any> => {
  const res = await fetch(`/api/analytics/department/${encodeURIComponent(department)}`);
  if (!res.ok) throw new Error('Failed to fetch department analytics');
  return await res.json();
};
