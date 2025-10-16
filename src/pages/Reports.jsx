// src/pages/Reports.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Reports() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [reportParams, setReportParams] = useState({
    dataPeriod: 'last_7_days',
    reportType: 'patients_list',
    gender: '',
    ageRange: { min: '', max: '' },
    includeDocuments: false,
    format: 'pdf',
    hasDocuments: ''
  });

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
        includeDocuments: reportParams.includeDocuments.toString()
      });

      if (reportParams.gender) queryParams.append('gender', reportParams.gender);
      if (reportParams.ageRange.min) queryParams.append('ageRange[min]', reportParams.ageRange.min);
      if (reportParams.ageRange.max) queryParams.append('ageRange[max]', reportParams.ageRange.max);
      if (reportParams.hasDocuments) queryParams.append('hasDocuments', reportParams.hasDocuments);

      const response = await fetch(`http://localhost:4000/api/reports/generate?${queryParams}`);
      
      if (reportParams.format === 'excel' || reportParams.format === 'csv') {
        // Download the file
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patients_report_${Date.now()}.${reportParams.format === 'excel' ? 'xlsx' : 'csv'}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else if (reportParams.format === 'pdf') {
        // For PDF, we'll generate it on the client side
        const data = await response.json();
        setReportData(data.data);
        generatePDF(data.data);
      } else {
        const data = await response.json();
        setReportData(data.data);
        // Display JSON data
        console.log('Report data:', data.data);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const generatePDF = (data) => {
    // Simple PDF generation using window.print() and CSS
    const printWindow = window.open('', '_blank');
    const patients = data.data || [];
    
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Patient Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .summary { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Patient Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="summary">
          <p><strong>Total Patients:</strong> ${data.totalPatients}</p>
          <p><strong>Report Type:</strong> ${data.reportType}</p>
          <p><strong>Generated At:</strong> ${new Date(data.generatedAt).toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Contact</th>
              <th>Conditions</th>
            </tr>
          </thead>
          <tbody>
            ${patients.map(patient => `
              <tr>
                <td>${patient.patientId}</td>
                <td>${patient.personal.firstName} ${patient.personal.lastName}</td>
                <td>${patient.personal.age || 'N/A'}</td>
                <td>${patient.personal.gender}</td>
                <td>${patient.contact.phone}<br/>${patient.contact.email}</td>
                <td>${patient.medical.conditions.join(', ') || 'None'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Confidential Patient Report - Generated by Healthcare System</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getFilteredPatientCount = () => {
    // This would ideally come from the API, but for now we'll estimate
    let baseCount = 2847; // Default from your data
    if (reportParams.gender) baseCount = Math.round(baseCount * 0.4);
    if (reportParams.ageRange.min || reportParams.ageRange.max) baseCount = Math.round(baseCount * 0.6);
    return baseCount;
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
          <span>Generate Patient Reports</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Generate Patient Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Report Parameters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Parameters */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Report Parameters</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Period</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.dataPeriod}
                  onChange={(e) => setReportParams(prev => ({ ...prev, dataPeriod: e.target.value }))}
                >
                  <option value="last_7_days">Last 7 days</option>
                  <option value="last_30_days">Last 30 days</option>
                  <option value="last_90_days">Last 90 days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.reportType}
                  onChange={(e) => setReportParams(prev => ({ ...prev, reportType: e.target.value }))}
                >
                  <option value="patients_list">Patient List</option>
                  <option value="patient_summary">Patient Summary</option>
                  <option value="medical_conditions">Medical Conditions</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Additional Filters</h3>
              
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.gender}
                  onChange={(e) => setReportParams(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="">All Genders</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Age Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Age Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min age"
                    className="border rounded-lg px-3 py-2"
                    value={reportParams.ageRange.min}
                    onChange={(e) => setReportParams(prev => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, min: e.target.value }
                    }))}
                  />
                  <input
                    type="number"
                    placeholder="Max age"
                    className="border rounded-lg px-3 py-2"
                    value={reportParams.ageRange.max}
                    onChange={(e) => setReportParams(prev => ({
                      ...prev,
                      ageRange: { ...prev.ageRange, max: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Document Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Status</label>
                <select 
                  className="w-full border rounded-lg px-3 py-2"
                  value={reportParams.hasDocuments}
                  onChange={(e) => setReportParams(prev => ({ ...prev, hasDocuments: e.target.value }))}
                >
                  <option value="">All Patients</option>
                  <option value="true">With Documents</option>
                  <option value="false">Without Documents</option>
                </select>
              </div>

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

              {/* Include Documents */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportParams.includeDocuments}
                  onChange={(e) => setReportParams(prev => ({ ...prev, includeDocuments: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Include patient documents in export</span>
              </label>
            </div>
          </div>

          {/* Report Generation Progress */}
          {generating && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">Generating Patient Reports</h3>
              <p className="text-gray-600 mb-6">Please wait while we process your request and generate the reports...</p>
              
              <div className="space-y-4">
                {[
                  'Validating parameters',
                  'Querying database',
                  'Extracting patient records and data',
                  'Generating report',
                  'Compiling final documents',
                  'Final processing and quality checks'
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
                <div className="text-gray-500">Data Range</div>
                <div className="font-medium">Last 7 days</div>
              </div>
              <div>
                <div className="text-gray-500">Gender</div>
                <div className="font-medium">{reportParams.gender ? reportParams.gender : 'All'}</div>
              </div>
              <div>
                <div className="text-gray-500">Age Range</div>
                <div className="font-medium">
                  {reportParams.ageRange.min || reportParams.ageRange.max 
                    ? `${reportParams.ageRange.min || 'Any'} - ${reportParams.ageRange.max || 'Any'}`
                    : 'All ages'
                  }
                </div>
              </div>
              <div>
                <div className="text-gray-500">Estimated Patient Count</div>
                <div className="font-medium">{getFilteredPatientCount().toLocaleString()} patients</div>
              </div>
              <div>
                <div className="text-gray-500">Format</div>
                <div className="font-medium capitalize">{reportParams.format.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-gray-500">Includes</div>
                <div className="font-medium space-y-1">
                  <div>• Patient Demographics</div>
                  <div>• Contact Information</div>
                  <div>• Medical Conditions</div>
                  {reportParams.includeDocuments && <div>• Document Links</div>}
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
            <h3 className="font-semibold mb-4">Report Statistics</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Reports</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage Used</span>
                <span className="font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">This Month</span>
                <span className="font-medium">24 reports</span>
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Recent Reports</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Patient List</span>
                <span className="text-blue-600 cursor-pointer">Download</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Medical Summary</span>
                <span className="text-blue-600 cursor-pointer">Download</span>
              </div>
              <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span>Billing Report</span>
                <span className="text-blue-600 cursor-pointer">Download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}