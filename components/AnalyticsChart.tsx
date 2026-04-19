import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Department, ReportStatus } from '../types';

interface ChartData {
  name: string;
  value: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type: 'bar' | 'pie';
  title: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6'];

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, type, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <h3 className="text-lg font-semibold text-neutral mb-4">{title}</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
