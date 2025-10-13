import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="bg-white rounded-2xl border p-6">
        <div className="text-sm text-gray-500">Tasks / Patients</div>
        <div className="mt-2 text-3xl font-bold">24</div>
        <div className="text-sm text-emerald-700 mt-1">+5 from yesterday</div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <div className="text-sm text-gray-500">Reports Pending</div>
        <div className="mt-2 text-3xl font-bold">7</div>
        <div className="text-xs text-orange-600 mt-1">2 urgent reviews</div>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <div className="text-sm text-gray-500">Appointments Today</div>
        <div className="mt-2 text-3xl font-bold">12</div>
        <div className="text-xs text-gray-600 mt-1">Next at 2:30 PM</div>
      </div>

      <div className="lg:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-2xl p-6">
        <div className="font-semibold">Quick Patient Access</div>
        <p className="text-sm mt-1 opacity-90">Scan patient QR code for instant record access.</p>
        <button className="mt-4 bg-white/10 hover:bg-white/20 border border-white/30 px-4 py-2 rounded-lg">
          Scan QR Code
        </button>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Recent Patient Updates</div>
          <button className="text-sm text-emerald-700">View All</button>
        </div>
        <div className="mt-4 divide-y">
          {['Emily Rodriguez','Michael Chen','Sarah Williams','Frodo Thompson'].map((n,i)=>(
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{n}</div>
                <div className="text-xs text-gray-600">Lab results updated · 2 mins ago</div>
              </div>
              <div className="flex gap-2">
                <span className="text-xs text-gray-700 border rounded px-2 py-0.5">Normal</span>
                <button className="text-xs text-emerald-700">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link
        to="/patients/new"
        className="lg:col-span-3 bg-white rounded-2xl border p-6 flex items-center justify-between hover:shadow"
      >
        <div>
          <div className="font-semibold">Create New Patient</div>
          <div className="text-sm text-gray-600">Add a patient and automatically check for duplicates.</div>
        </div>
        <div className="px-4 py-2 rounded-lg bg-gray-900 text-white">Start</div>
      </Link>
    </div>
  );
}
