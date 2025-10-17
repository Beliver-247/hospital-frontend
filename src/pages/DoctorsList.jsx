import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchDoctors, deleteDoctor } from '../api/doctors';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function DoctorsList() {
  const qc = useQueryClient();
  const [q, setQ] = useState('');
  const [toast, setToast] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['doctors', q],
    queryFn: () => searchDoctors(q, 50),
  });

  const delMut = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: (res) => {
      const ok = res?.deletedCount > 0;
      setToast({ kind: ok ? 'success' : 'error', msg: ok ? 'Doctor deleted' : 'No doctor deleted' });
      qc.invalidateQueries({ queryKey: ['doctors'] });
    },
    onError: (e) => setToast({ kind: 'error', msg: e?.response?.data?.message || 'Delete failed' }),
  });

  const onDelete = (id, label) => {
    if (!confirm(`Delete doctor "${label}"? This cannot be undone.`)) return;
    delMut.mutate(id);
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Doctors</h1>
          <p className="text-sm text-gray-600">Create and manage doctor accounts (STAFF only).</p>
        </div>
        <Link to="/doctors/new" className="px-3 py-2 bg-gray-900 text-white rounded-md">New Doctor</Link>
      </div>

      {toast && <Toast kind={toast.kind} msg={toast.msg} />}

      <div className="bg-white border rounded-2xl p-3">
        <div className="p-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full md:w-80 rounded-xl border px-4 py-2 outline-none focus:ring-2 ring-emerald-600"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Type</th>
              <th className="p-3">ID</th>
              <th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3" colSpan={5}>Loading…</td></tr>}

            {data?.items?.map((d) => (
              <tr key={d.id || d._id} className="border-b last:border-0">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.email}</td>
                <td className="p-3">{d.doctorType || '—'}</td>
                <td className="p-3">{d.id || d._id}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onDelete(d.id || d._id, d.name || d.email)}
                    className="px-3 py-1.5 border rounded-md hover:bg-red-50 text-red-700"
                    disabled={delMut.isPending}
                  >
                    {delMut.isPending ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}

            {!isLoading && !data?.items?.length && (
              <tr><td className="p-3 text-gray-600" colSpan={5}>No doctors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
