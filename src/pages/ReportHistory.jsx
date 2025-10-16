// src/pages/ReportHistory.jsx
import { useState } from 'react';

export default function ReportHistory() {
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    date: ''
  });

  const reports = [
    {
      id: 'RPT-2024-001',
      type: 'Patient Summary',
      generatedAt: 'Jan 15, 2024 09:30 AM',
      recordCount: 1347,
      status: 'completed',
      size: '2.4 MB'
    },
    {
      id: 'RPT-2024-002',
      type: 'Billing Reports',
      generatedAt: 'Jan 15, 2024 11:45 AM',
      recordCount: 19,
      status: 'completed',
      size: '0.8 MB'
    },
    {
      id: 'RPT-2024-003',
      type: 'Inventory Summary',
      generatedAt: 'Jan 16, 2024 08:15 AM',
      recordCount: 426,
      status: 'completed',
      size: '1.2 MB'
    },
    {
      id: 'RPT-2024-004',
      type: 'Rating Reports',
      generatedAt: 'Jan 16, 2024 02:30 PM',
      recordCount: 2369,
      status: 'processing',
      size: '3.1 MB'
    },
    {
      id: 'RPT-2024-005',
      type: 'Patient List',
      generatedAt: 'Jan 14, 2024 10:20 AM',
      recordCount: 749,
      status: 'completed',
      size: '1.8 MB'
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Report History</h1>
        <p className="text-gray-600 mt-1">View and manage all generated reports</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select 
              className="border rounded-lg px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">All Types</option>
              <option value="patient_summary">Patient Summary</option>
              <option value="billing">Billing Reports</option>
              <option value="inventory">Inventory Summary</option>
              <option value="rating">Rating Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              className="border rounded-lg px-3 py-2 text-sm"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2 text-sm"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div className="flex-1"></div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 self-end">
            Export All
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Record Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.generatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.recordCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Download</button>
                      <button className="text-gray-600 hover:text-gray-800">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
            <span className="font-medium">24</span> results
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">1</button>
            <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}