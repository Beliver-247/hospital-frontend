// src/components/ReportsSidebar.jsx
import { NavLink } from 'react-router-dom';

const reportsNavItems = [
  { to: '/reports', label: 'Generate Reports', icon: '📊' },
  { to: '/reports/history', label: 'Report History', icon: '📋' },
  { to: '/reports/templates', label: 'Report Templates', icon: '📄' },
  { to: '/reports/analytics', label: 'Report Analytics', icon: '📈' },
];

const healthcareNavItems = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/patients', label: 'Patients', icon: '👥' },
  { to: '/appointments', label: 'Appointments', icon: '📅' },
  { to: '/reports', label: 'Reports', icon: '📊' },
  { to: '/staff', label: 'Staff', icon: '👨‍⚕️' },
  { to: '/pharmacy', label: 'Pharmacy', icon: '💊' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function ReportsSidebar() {
  return (
    <aside className="w-64 bg-white border-r shrink-0 hidden md:flex md:flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 grid place-items-center text-white font-bold">H</div>
          <div>
            <div className="font-semibold">HealthCare</div>
            <div className="text-xs text-gray-500">Reports System</div>
          </div>
        </div>
      </div>

      {/* Reports Navigation */}
      <div className="p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Reports
        </div>
        <nav className="space-y-1">
          {reportsNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm ' +
                (isActive
                  ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50')
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Healthcare System Navigation */}
      <div className="p-4 border-t">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Healthcare System
        </div>
        <nav className="space-y-1">
          {healthcareNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm ' +
                (isActive
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-600 hover:bg-gray-50')
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Quick Stats */}
      <div className="mt-auto p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs font-semibold text-gray-500 mb-2">Storage Usage</div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Reports</span>
            <span className="text-sm font-medium">2.4 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <div className="text-xs text-gray-500 mt-2">1,247 reports generated</div>
        </div>
      </div>
    </aside>
  );
}