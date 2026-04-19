import React, { useState, useEffect } from 'react';
import { getOverallAnalytics, getDepartmentAnalytics } from '../services/apiService';
import { OverallAnalytics, DepartmentAnalytics } from '../types';
import AnalyticsChart from './AnalyticsChart';
import Spinner from './Spinner';

const MainAdminDashboard: React.FC = () => {
  const [overallData, setOverallData] = useState<OverallAnalytics | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentAnalytics[]>([]);
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const overall = await getOverallAnalytics();
        // Import departments from constants
        const { departments } = await import('../constants');
        const departmentResults = await Promise.all(
          departments.map(async dept => {
            const stats = await getDepartmentAnalytics(dept);
            return { department: dept, ...stats };
          })
        );
        setOverallData(overall);
        setDepartmentData(departmentResults);
      } catch (err) {
        setError('Failed to fetch analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!overallData) return <p className="text-center">No data available.</p>;

  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold text-neutral mb-2">Administrative Dashboard</h1>
      <p className="text-gray-500 mb-8">High-level overview of all municipal operations.</p>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md animate-slide-in-up">
          <h3 className="text-gray-500">Total Reports</h3>
          <p className="text-4xl font-bold text-primary">{overallData.totalReports !== undefined && overallData.totalReports !== null ? overallData.totalReports.toLocaleString() : 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md animate-slide-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-gray-500">Total Resolved</h3>
          <p className="text-4xl font-bold text-secondary">{overallData.totalResolved !== undefined && overallData.totalResolved !== null ? overallData.totalResolved.toLocaleString() : 'N/A'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md animate-slide-in-up" style={{ animationDelay: '200ms' }}>
          <h3 className="text-gray-500">Avg. Resolution Time</h3>
          <p className="text-4xl font-bold text-accent">{overallData.avgResolutionTimeDays !== undefined && overallData.avgResolutionTimeDays !== null ? overallData.avgResolutionTimeDays + ' Days' : 'N/A'}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnalyticsChart
          title="Reports by Category"
          type="bar"
          data={overallData.reportsByCategory}
        />
        <AnalyticsChart
          title="Reports by Status"
          type="pie"
          data={overallData.reportsByStatus}
        />
      </div>

      {/* Department Performance Table */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Department Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-base-200">
              <tr>
                <th className="p-3 font-semibold">Department</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Resolved</th>
                <th className="p-3 font-semibold">Pending</th>
                <th className="p-3 font-semibold">In Progress</th>
                <th className="p-3 font-semibold">Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map(dept => (
                <tr key={dept.department} className="border-b border-base-300">
                  <td className="p-3 font-medium">{dept.department}</td>
                  <td className="p-3">{dept.total}</td>
                  <td className="p-3 text-green-600">{dept.resolved}</td>
                  <td className="p-3 text-orange-500">{dept.pending}</td>
                  <td className="p-3 text-blue-500">{dept.inProgress}</td>
                  <td className="p-3 font-semibold">{((dept.resolved / dept.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainAdminDashboard;
