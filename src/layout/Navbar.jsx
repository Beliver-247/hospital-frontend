import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../api/useAuth.js";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={[
        "text-sm px-3 py-1 rounded transition",
        active ? "bg-blue-600 text-white" : "hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { auth, signOut } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
            🏥
          </span>
          <span>MediCare</span>
        </Link>
        <div className="flex items-center gap-2">
          {auth?.user && (
            <>
              <NavLink to="/PatientDash">Dashboard</NavLink>
              <NavLink to="/schedule">Schedule</NavLink>
              <NavLink to="/appointments">My Appointments</NavLink>
            </>
          )}
          {auth?.user ? (
            <button
              className="text-sm px-3 py-1 rounded bg-gray-800 text-white hover:bg-black"
              onClick={() => {
                signOut();
                nav("/login");
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
