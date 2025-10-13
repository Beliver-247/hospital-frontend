import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchPatients } from '../api/patients';

export default function PatientsSearch() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const { data, isLoading } = useQuery({
    queryKey: ['patients', 'search', q],
    queryFn: () => searchPatients(q, 50),
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Patients</h1>
          <p className="text-sm text-gray-600">Search and open a patient profile.</p>
        </div>
        <Link to="/patients/new" className="px-3 py-2 bg-gray-900 text-white rounded-md">New Patient</Link>
      </div>

      <div className="bg-white border rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="p-3">Patient</th>
              <th className="p-3">ID</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td className="p-3" colSpan={5}>Loading…</td></tr>
            )}
            {data?.items?.map((p)=>(
              <tr key={p._id} className="border-b last:border-0">
                <td className="p-3 font-medium">{p.personal?.firstName} {p.personal?.lastName}</td>
                <td className="p-3">{p.patientId}</td>
                <td className="p-3">{p.contact?.email || '—'}</td>
                <td className="p-3">{p.contact?.phone || '—'}</td>
                <td className="p-3">
                  <Link to={`/patients/${p.patientId || p._id}`} className="text-emerald-700 underline">View</Link>
                </td>
              </tr>
            ))}
            {!isLoading && !data?.items?.length && (
              <tr><td className="p-3 text-gray-600" colSpan={5}>No results.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
