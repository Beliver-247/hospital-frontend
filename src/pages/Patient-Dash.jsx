// src/pages/Patient-Dash.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { listAppointments } from "../api/appointments.api";
import { Card, CardBody } from "../components/ui"; // if you don't have these, replace with plain divs

function StatCard({ count, title, subtitle, accent = "border-blue-300" , icon = "📅"}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border ${accent} p-4 flex items-start gap-3`}>
      <div className="h-9 w-9 rounded-xl bg-blue-50 grid place-items-center text-lg">{icon}</div>
      <div>
        <div className="text-2xl font-semibold leading-none">{count}</div>
        <div className="text-sm mt-1">{title}</div>
        {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function ActionCard({ to, icon, title, desc }) {
  return (
    <Link to={to} className="block bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
      <div className="h-10 w-10 rounded-xl bg-blue-50 grid place-items-center text-xl mb-3">{icon}</div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-gray-600">{desc}</div>
    </Link>
  );
}

export default function PatientDash() {
  // fetch upcoming (next 7 days) just to show a number; easy heuristic
  const { data } = useQuery({
    queryKey: ["appointments", { mine: "true" }],
    queryFn: () => listAppointments({ mine: "true" }),
  });
  const upcomingCount = (data?.items || []).filter(a => a.status !== "CANCELLED").length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-2">
          Welcome back! Here’s what’s happening with your health today.
        </p>
      </div>

      {/* Top stat row (only the one you asked for) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          count={upcomingCount}
          title="Upcoming Appointments"
          subtitle="+1 from last week"
          accent="border-blue-300"
          icon="📅"
        />
        {/* You can leave the other two slots empty or put lightweight placeholders to keep spacing */}
        <div className="hidden lg:block"></div>
        <div className="hidden lg:block"></div>
      </div>

      {/* Action row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          to="/schedule"
          icon="➕"
          title="Book Appointment"
          desc="Schedule a new appointment with your preferred doctor"
        />
        <ActionCard
          to="#"
          icon="📄"
          title="Medical Records"
          desc="Access your medical history and test results"
        />
        <ActionCard
          to="#"
          icon="🔎"
          title="Find Doctors"
          desc="Search for specialists and healthcare providers"
        />
      </div>
    </div>
  );
}
