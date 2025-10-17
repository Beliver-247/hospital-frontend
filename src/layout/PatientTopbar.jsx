// src/layout/PatientTopbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../api/useAuth";

export default function PatientTopbar() {
  const { auth } = useAuth();
  const name = auth?.user?.name || "Patient";
  const initials = name.split(" ").map(s => s[0]?.toUpperCase()).slice(0,2).join("");

  return (
    <header className="bg-white/80 backdrop-blur border-b h-14 flex items-center">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/PatientDash" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center font-semibold">🏥</div>
          <span className="font-semibold">MediCare</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-gray-600">
            Welcome back, <span className="font-medium">{name}</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gray-900 text-white grid place-items-center text-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
