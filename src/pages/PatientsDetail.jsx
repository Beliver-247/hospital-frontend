import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../api/patients';

export default function PatientsDetail() {
  const { idOrPid } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', idOrPid],
    queryFn: () => getPatient(idOrPid),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <div className="text-red-600">Failed to load</div>;
  const p = data;

  return (
    <div className="grid gap-6">
      <header className="bg-white border rounded-2xl p-6 flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">{p.personal?.firstName} {p.personal?.lastName}</h1>
          <div className="text-sm text-gray-600">Patient ID: {p.patientId}</div>
          <div className="text-sm text-gray-600">DOB: {p.personal?.dob?.slice(0,10)} · Gender: {p.personal?.gender}</div>
        </div>
        <Link to={`/patients/${p.patientId || p._id}/edit`} className="px-4 py-2 rounded-md bg-gray-900 text-white">
          Edit
        </Link>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="font-semibold">Latest Vital Signs</h2>
          <p className="text-sm text-gray-500 mt-2">— (not in scope)</p>
        </div>

        <div className="bg-white border rounded-2xl p-6 md:col-span-2">
          <h2 className="font-semibold">Quick Information</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Email" value={p.contact?.email} />
            <Info label="Phone" value={p.contact?.phone} />
            <Info label="Address" value={p.contact?.address} className="sm:col-span-2" />
            <Info label="NIC" value={p.personal?.nic} />
            <Info label="Passport" value={p.personal?.passport} />
          </div>
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold">Documents</h2>
        {!p.documents?.length && <p className="text-sm text-gray-600 mt-2">No documents uploaded.</p>}
        <ul className="mt-2 grid gap-2">
          {p.documents?.map((d,i)=>(
            <li key={i} className="flex items-center justify-between border rounded-md p-2 text-sm bg-gray-50">
              <span className="font-medium">{d.type}</span>
              <a href={d.url} target="_blank" rel="noreferrer" className="text-emerald-700 underline truncate">{d.url}</a>
              <span className="text-xs text-gray-500">{d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : ''}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
function Skeleton() {
  return <div className="h-48 bg-white border rounded-2xl animate-pulse" />;
}
function Info({ label, value, className='' }) {
  return (
    <div className={className}>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value || '—'}</div>
    </div>
  );
}
