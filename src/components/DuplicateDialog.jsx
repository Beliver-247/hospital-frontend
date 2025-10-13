import { Link } from 'react-router-dom';

export default function DuplicateDialog({ open, duplicates = [], onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold">Possible duplicates found</h3>
        <p className="text-sm text-gray-600 mt-1">
          Review before creating another record.
        </p>
        <div className="mt-4 max-h-72 overflow-y-auto divide-y">
          {duplicates.map((p) => (
            <div key={p._id} className="py-3 text-sm">
              <div className="font-medium">
                {p.personal?.firstName} {p.personal?.lastName}{' '}
                <span className="text-gray-500">({p.patientId})</span>
              </div>
              <div className="text-gray-700">
                {p.contact?.email || '—'} • {p.contact?.phone || '—'} • NIC: {p.personal?.nic || '—'}
              </div>
              <div className="mt-2 flex gap-2">
                <Link to={`/patients/${p.patientId || p._id}`} className="px-3 py-1.5 border rounded-md">View</Link>
                <Link to={`/patients/${p.patientId || p._id}/edit`} className="px-3 py-1.5 border rounded-md">Update Existing</Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-900 text-white">Close</button>
        </div>
      </div>
    </div>
  );
}
