import React from 'react';
import { Report, ReportStatus } from '../types';

interface ReportCardProps {
  report: Report;
  isAdminView?: boolean;
  onStatusChange?: (reportId: string, newStatus: ReportStatus) => void;
}

const getStatusBadgeColor = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.PENDING:
      return 'bg-orange-100 text-orange-800';
    case ReportStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-800';
    case ReportStatus.RESOLVED:
      return 'bg-green-100 text-green-800';
    case ReportStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ReportCard: React.FC<ReportCardProps> = ({ report, isAdminView = false, onStatusChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-xl animate-fade-in">
      {report.imageUrl && report.imageUrl !== '' && (
        <img
          src={report.imageUrl}
          alt={report.title}
          className="w-full md:w-1/3 h-48 md:h-auto object-cover"
        />
      )}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">{report.category}</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(report.status)}`}>
              {report.status}
            </span>
          </div>
          <h3 className="text-lg font-bold mt-1">{report.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{report.description}</p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="text-xs text-gray-500">
                <p>Reported by: {isAdminView ? (report.userName || report.userId) : 'You'}</p>
                <p>On: {report.submittedAt && typeof report.submittedAt.toLocaleDateString === 'function' ? report.submittedAt.toLocaleDateString() : String(report.submittedAt)}</p>
            </div>
            {isAdminView && onStatusChange && (
                <div className="mt-2 sm:mt-0">
                    <select
                        value={report.status}
                        onChange={(e) => onStatusChange(report.id, e.target.value as ReportStatus)}
                        className="text-sm p-1 border rounded-md bg-white shadow-sm focus:ring-primary focus:border-primary"
                        onClick={(e) => e.stopPropagation()} // Prevents card click event
                    >
                        {Object.values(ReportStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
