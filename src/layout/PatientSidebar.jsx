// src/layout/PatientSidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../api/useAuth";

function Item({ to = "#", icon, label, active }) {
  const base = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition";
  const cls = active
    ? "bg-blue-50 text-blue-700 border border-blue-200"
    : "text-gray-700 hover:bg-gray-100";
  return (
    <Link to={to} className={`${base} ${cls}`}>
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
        {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export default function PatientSidebar() {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  const nav = useNavigate();

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <Section title="Main">
        <Item to="/PatientDash" icon="🏠" label="Dashboard" active={pathname.startsWith("/PatientDash")} />
        <Item to="/appointments" icon="🗓️" label="Appointments" active={pathname.startsWith("/appointments")} />
        <Item to="#" icon="👩‍⚕️" label="Doctors" />
        <Item to="#" icon="📄" label="Medical Records" />
      </Section>

      <Section title="Health">
        <Item to="#" icon="📈" label="Health Metrics" />
        <Item to="#" icon="💊" label="Prescriptions" />
        <Item to="#" icon="🧪" label="Lab Results" />
      </Section>

      <Section title="Account">
        <Item to="#" icon="⚙️" label="Profile Settings" />
        <Item to="#" icon="💳" label="Billing" />
        <Item to="#" icon="🔔" label="Notifications" />
        <Item to="#" icon="❓" label="Help & Support" />
        <button
          onClick={() => { signOut(); nav("/login", { replace: true }); }}
          className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-700 hover:bg-red-50"
        >
          <span className="text-lg">🚪</span>
          <span>Logout</span>
        </button>
      </Section>
    </div>
  );
}
