// src/pages/AppointmentsReports.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AppointmentsReports() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [reportParams, setReportParams] = useState({
    reportType: 'appointments_list',
    status: '',
    specialization: '',
    startDate: '',
    endDate: '',
    location: '',
    includePatientDetails: false,
    format: 'pdf'
  });

  const specializations = [
    'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 
    'Dermatology', 'Psychiatry', 'Surgery', 'Emergency'
  ];

  const statusOptions = [
    'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW'
  ];

  useEffect(() => {
    if (generating) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setGenerating(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [generating]);

const handleGenerateReport = async () => {
  setGenerating(true);
  setProgress(0);
  
  try {
    const queryParams = new URLSearchParams({
      type: reportParams.reportType,
      format: reportParams.format === 'excel' ? 'csv' : 'json',
      includePatientDetails: reportParams.includePatientDetails.toString()
    });

    if (reportParams.status) queryParams.append('status', reportParams.status);
    if (reportParams.specialization) queryParams.append('specialization', reportParams.specialization);
    
    // Use 'start' and 'end' parameters instead of 'startDate' and 'endDate'
    if (reportParams.startDate) queryParams.append('start', reportParams.startDate);
    if (reportParams.endDate) queryParams.append('end', reportParams.endDate);
    
    if (reportParams.location) queryParams.append('location', reportParams.location);

    console.log('API Call URL:', `http://localhost:4000/api/reports/generate?${queryParams}`);
    
    const response = await fetch(`http://localhost:4000/api/reports/generate?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Handle different formats
    if (reportParams.format === 'excel' || reportParams.format === 'csv') {
      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportParams.reportType}_${Date.now()}.${reportParams.format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else if (reportParams.format === 'pdf') {
      // For PDF, we'll generate it on the client side
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
        generatePDF(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate report');
      }
    } else {
      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate report');
      }
    }
  } catch (error) {
    console.error('Failed to generate report:', error);
    alert(`Failed to generate report: ${error.message}`);
  } finally {
    setGenerating(false);
  }
};

  const generatePDF = (data) => {
    const printWindow = window.open('', '_blank');
    const appointments = data.data || [];
    const isStatsReport = reportParams.reportType === 'appointments_stats';
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointments Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .summary { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${isStatsReport ? 'Appointments Statistics Report' : 'Appointments List Report'}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <p><strong>Report Type:</strong> ${data.reportType}</p>
          <p><strong>Total Records:</strong> ${data.totalAppointments || appointments.length}</p>
          <p><strong>Generated At:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
        </div>

        ${isStatsReport ? generateStatsContent(data) : generateListContent(appointments)}
        
        <div class="footer">
          <p>Confidential Healthcare Report - Generated by Healthcare System</p>
        </div>
      </body>
      </html>
    `;

    function generateStatsContent(data) {
      return `
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Appointments</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${data.totalAppointments}</p>
          </div>
          <div class="stat-card">
            <h3>Average Duration</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${Math.round(data.durationStats.avgDuration)} min</p>
          </div>
        </div>

        <h3>Appointments by Status</h3>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${data.statusStats.map(stat => `
              <tr>
                <td>${stat._id}</td>
                <td>${stat.count}</td>
                <td>${((stat.count / data.totalAppointments) * 100).toFixed(1)}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h3>Appointments by Specialization</h3>
        <table>
          <thead>
            <tr>
              <th>Specialization</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${data.specializationStats.map(stat => `
              <tr>
                <td>${stat._id || 'Not Specified'}</td>
                <td>${stat.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    function generateListContent(appointments) {
      return `
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => `
              <tr>
                <td>${apt.appointmentId}</td>
                <td>${apt.patient.name}</td>
                <td>${apt.doctor.name}</td>
                <td>${apt.specialization}</td>
                <td>${new Date(apt.start).toLocaleString()}</td>
                <td>${apt.durationMinutes} min</td>
                <td>${apt.location}</td>
                <td>${apt.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/" className="hover:text-gray-700">Dashboard</Link>
          <span>›</span>
          <Link to="/reports" className="hover:text-gray-700">Reports</Link>
          <span>›</span>
          <span>Appointments Reports</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Appointments Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Report Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Parameters */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Appointments Report Parameters</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.reportType}
                  onChange={(e) => setReportParams(prev => ({ ...prev, reportType: e.target.value }))}
                >
                  <option value="appointments_list">Appointments List</option>
                  <option value="appointments_stats">Appointments Statistics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.status}
                  onChange={(e) => setReportParams(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All Status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.specialization}
                  onChange={(e) => setReportParams(prev => ({ ...prev, specialization: e.target.value }))}
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.location}
                  onChange={(e) => setReportParams(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.startDate}
                  onChange={(e) => setReportParams(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.endDate}
                  onChange={(e) => setReportParams(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Additional Options</h3>
              
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <div className="flex gap-4">
                  {['pdf', 'excel', 'csv', 'json'].map(format => (
                    <label key={format} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={reportParams.format === format}
                        onChange={(e) => setReportParams(prev => ({ ...prev, format: e.target.value }))}
                        className="text-blue-600"
                      />
                      <span className="text-sm capitalize">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Include Patient Details */}
              {reportParams.reportType === 'appointments_list' && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={reportParams.includePatientDetails}
                    onChange={(e) => setReportParams(prev => ({ ...prev, includePatientDetails: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Include detailed patient information</span>
                </label>
              )}
            </div>
          </div>

          {/* Report Generation Progress */}
          {generating && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Generating Appointments Report</h3>
              <p className="text-gray-600 mb-6">Please wait while we process your request and generate the report...</p>
              
              <div className="space-y-4">
                {[
                  'Validating parameters',
                  'Querying database',
                  'Processing appointments data',
                  'Generating report format',
                  'Compiling final documents',
                  'Final quality checks'
                ].map((step, index) => (
                  <div key={step} className="flex items-center justify-between">
                    <span className={`text-sm ${progress >= (index + 1) * 15 ? 'text-green-600' : 'text-gray-500'}`}>
                      {step}
                    </span>
                    <span className={`text-sm ${progress >= (index + 1) * 15 ? 'text-green-600' : 'text-gray-500'}`}>
                      {progress >= (index + 1) * 15 ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Progress: {progress}%</span>
                  <span>Estimated time remaining: {Math.max(0, (100 - progress) / 10)}s</span>
                </div>
              </div>
            </div>
          )}

          {/* Report Preview */}
          {reportData && reportParams.format === 'json' && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Report Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(reportData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Selected Parameters */}
        <div className="space-y-6">
          {/* Selected Parameters */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Selected Parameters</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-500">Report Type</div>
                <div className="font-medium capitalize">{reportParams.reportType.replace('_', ' ')}</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-medium">{reportParams.status || 'All'}</div>
              </div>
              <div>
                <div className="text-gray-500">Specialization</div>
                <div className="font-medium">{reportParams.specialization || 'All'}</div>
              </div>
              <div>
                <div className="text-gray-500">Date Range</div>
                <div className="font-medium">
                  {reportParams.startDate || reportParams.endDate 
                    ? `${reportParams.startDate || 'Any'} to ${reportParams.endDate || 'Any'}`
                    : 'All dates'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-500">Location</div>
                <div className="font-medium">{reportParams.location || 'All locations'}</div>
              </div>
              <div>
                <div className="text-gray-500">Format</div>
                <div className="font-medium capitalize">{reportParams.format.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-gray-500">Includes</div>
                <div className="font-medium space-y-1">
                  <div>• Appointment Details</div>
                  <div>• Patient Information</div>
                  <div>• Doctor Information</div>
                  {reportParams.includePatientDetails && <div>• Detailed Patient Data</div>}
                  {reportParams.reportType === 'appointments_stats' && <div>• Statistical Analysis</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {generating ? 'Generating Report...' : `Generate ${reportParams.format.toUpperCase()} Report`}
          </button>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Appointments Overview</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Appointments</span>
                <span className="font-medium">1,856</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pending</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Confirmed</span>
                <span className="font-medium">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}