import { NavLink } from 'react-router-dom';
import { getCurrentUser } from '../api/auth';

const navItem = (to, label, icon = null, requireRole) => ({ to, label, icon, requireRole });

const items = [
  navItem('/', 'Dashboard'),
  navItem('/patients/new', 'Create Patient', null, ['DOCTOR','STAFF']),
  navItem('/patients', 'Patients', null, ['DOCTOR','STAFF']),
  // placeholders to mirror left menu
  navItem('/_appointments', 'Appointments'),
  navItem('/_records', 'Records'),
  navItem('/_pharmacy', 'Pharmacy'),
  navItem('/_lab', 'Lab Results'),
  navItem('/_reports', 'Reports'),
];

export default function Sidebar() {
  const role = getCurrentUser()?.role;

  return (
    <aside className="w-60 bg-white border-r shrink-0 hidden md:flex md:flex-col">
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-600 grid place-items-center text-white font-bold">M</div>
          <div>
            <div className="font-semibold">MediCare</div>
            <div className="text-xs text-gray-500">Healthcare System</div>
          </div>
        </div>
      </div>

      <nav className="p-2 space-y-1">
        {items.map((it) => {
          if (it.requireRole && !it.requireRole.includes(role)) return null;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                'block px-3 py-2 rounded-lg text-sm ' +
                (isActive
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50')
              }
            >
              {it.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
