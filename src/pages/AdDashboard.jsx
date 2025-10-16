// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/reports/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-lg font-semibold mb-6">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Healthcare Admin Portal</h1>
        <p className="text-gray-600 mt-2">Welcome, Administrator</p>
        <p className="text-gray-500 text-sm">Monitor and manage your healthcare system</p>
      </div>

      {/* System Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Navigation */}
          <div className="bg-white rounded-lg border p-4">
            <div className="space-y-2">
              <div className="font-medium">Patient Management</div>
              <div className="font-medium">Staff Management</div>
              <div className="font-medium">Reports</div>
              <div className="font-medium">System Settings</div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-500 mb-1">Total Patients</div>
            <div className="text-2xl font-bold">{stats?.totalPatients || 0}</div>
            <div className="text-sm text-green-600">↑ +12% from last month</div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-500 mb-1">Patients with Documents</div>
            <div className="text-2xl font-bold">{stats?.patientsWithDocuments || 0}</div>
            <div className="text-sm text-green-600">{Math.round((stats?.patientsWithDocuments / stats?.totalPatients) * 100) || 0}% coverage</div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-500 mb-1">Reports Generated</div>
            <div className="text-2xl font-bold">1,254</div>
            <div className="text-sm text-red-600">↓ -2% from last month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div></div> {/* Spacer for the first column */}
          <div className="bg-white rounded-lg border p-4">
            <div className="text-sm text-gray-500 mb-1">System Uptime</div>
            <div className="text-2xl font-bold">99.8%</div>
            <div className="text-sm text-green-600">● Excellent</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/patients" 
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Patient Management</div>
              <div className="text-sm text-gray-600">View and manage patient records</div>
            </Link>
            <Link 
              to="/reports" 
              className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium">Reports</div>
              <div className="text-sm text-gray-600">Generate and view system reports</div>
            </Link>
            <div className="block p-3 border border-red-200 bg-red-50 rounded-lg">
              <div className="font-medium text-red-700">Priority Action</div>
              <div className="text-sm text-red-600">Server storage at 85% capacity</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <div className="font-medium">New patient registered: John Smith</div>
              <div className="text-sm text-gray-500">2 minutes ago</div>
            </div>
            <div className="border-b pb-3">
              <div className="font-medium">Staff shift updated by Dr. Johnson</div>
              <div className="text-sm text-gray-500">10 minutes ago</div>
            </div>
            <div className="border-b pb-3">
              <div className="font-medium">System backup completed</div>
              <div className="text-sm text-gray-500">1 hour ago</div>
            </div>
            <div className="border-b pb-3">
              <div className="font-medium">Monthly report generated</div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div>
              <div className="font-medium">Security scan completed</div>
              <div className="text-sm text-gray-500">3 hours ago</div>
            </div>
          </div>
          <button className="w-full mt-4 text-center text-blue-600 text-sm font-medium">
            View all activity
          </button>
        </div>

        {/* System Health & Alerts */}
        <div className="space-y-6">
          {/* Patient Statistics */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Patient Statistics</h3>
            <div className="space-y-3">
              {stats?.genderStats?.map((gender) => (
                <div key={gender._id} className="flex justify-between items-center">
                  <span>{gender._id}</span>
                  <span className="font-medium">{gender.count} patients</span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <div className="text-sm text-gray-500">Top Conditions</div>
                <div className="mt-1 space-y-1">
                  {stats?.topConditions?.slice(0, 3).map((condition) => (
                    <div key={condition._id} className="flex justify-between text-sm">
                      <span>{condition._id}</span>
                      <span>{condition.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold mb-4">Alerts & Notifications</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-700">High Priority</div>
                <div className="text-sm text-red-600">Server storage at 85% capacity</div>
                <div className="text-xs text-red-500 mt-1">Requires immediate attention</div>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-700">Medium Priority</div>
                <div className="text-sm text-yellow-600">Backup system needs maintenance</div>
                <div className="text-xs text-yellow-500 mt-1">Schedule within 24 hours</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-700">Information</div>
                <div className="text-sm text-blue-600">New security update available</div>
                <div className="text-xs text-blue-500 mt-1">Install during maintenance window</div>
              </div>
            </div>
            <button className="w-full mt-4 text-center text-blue-600 text-sm font-medium">
              Manage all alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}