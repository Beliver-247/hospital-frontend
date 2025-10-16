// src/layout/ReportsLayout.jsx
import ReportsSidebar from '../layout/ReportsSidebar.jsx';
import ReportsTopbar from '../layout/ReportsTopbar.jsx';

export default function ReportsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ReportsSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <ReportsTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}