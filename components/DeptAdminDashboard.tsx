import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReportsForDepartment, updateReportStatus } from '../services/apiService';
import { Report, ReportStatus } from '../types';
import ReportCard from './ReportCard';
import MapComponent from './MapComponent';
import Spinner from './Spinner';

const DeptAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReportStatus | 'All'>('All');

  useEffect(() => {
    const fetchReports = async () => {
      if (user?.department) {
        try {
          setLoading(true);
          const fetchedReports = await getReportsForDepartment(user.department);
          setReports(fetchedReports);
        } catch (err) {
          setError('Failed to fetch reports.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReports();
  }, [user]);

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await updateReportStatus(reportId, newStatus);
      setReports(prevReports =>
        prevReports.map(report =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
    } catch (err) {
      alert('Failed to update status.');
    }
  };
  
  const filteredReports = useMemo(() => {
    if (filter === 'All') return reports;
    return reports.filter(report => report.status === filter);
  }, [reports, filter]);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-neutral mb-2">
        {user?.department} Department Dashboard
      </h1>
      <p className="text-gray-500 mb-6">Welcome, {user?.name}. Here are the latest reports.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Incoming Reports</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as ReportStatus | 'All')}
              className="p-2 border rounded-md bg-white shadow-sm focus:ring-primary focus:border-primary"
            >
              <option value="All">All Statuses</option>
              {Object.values(ReportStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <ReportCard key={report.id} report={report} onStatusChange={handleStatusChange} isAdminView={true} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No reports found for this filter.</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Issue Map</h2>
          <MapComponent reports={reports} />
        </div>
      </div>
    </div>
  );
};

export default DeptAdminDashboard;
