import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReportsForUser } from '../services/apiService';
import { Report } from '../types';
import ReportCard from './ReportCard';
import Modal from './Modal';
import ReportForm from './ReportForm';
import Spinner from './Spinner';
import { PlusCircleIcon } from './icons';
import MapComponent from './MapComponent';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        try {
          setLoading(true);
          const userReports = await getReportsForUser(user.id);
          setReports(userReports);
        } catch (err) {
          setError('Failed to fetch your reports.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReports();
  }, [user]);

  const handleReportSuccess = (newReport: Report) => {
    setReports(prevReports => [newReport, ...prevReports]);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral">Your Dashboard</h1>
          <p className="text-gray-500 mt-1">Track issues you've reported and view them on the map.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl"
        >
          <PlusCircleIcon className="h-6 w-6" />
          <span className="font-semibold">Report New Issue</span>
        </button>
      </div>

      {loading && <div className="flex justify-center items-center h-64"><Spinner /></div>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Your Reports</h2>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map(report => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">No reports yet!</h3>
                    <p className="text-gray-500 mt-2">Click "Report New Issue" to get started.</p>
                  </div>
                )}
            </div>
            <div className="hidden lg:block">
                <h2 className="text-2xl font-semibold mb-4">Issue Map</h2>
                <MapComponent reports={reports} />
            </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Submit a New Report">
        <ReportForm onSuccess={handleReportSuccess} isOpen={isModalOpen} />
      </Modal>
    </div>
  );
};

export default UserDashboard;