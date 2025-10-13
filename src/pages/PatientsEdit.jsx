import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPatient } from '../api/patients';
import PatientForm from '../components/PatientForm';

export default function PatientsEdit() {
  const { idOrPid } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['patient', idOrPid],
    queryFn: () => getPatient(idOrPid),
  });

  if (isLoading) return <div className="h-48 bg-white border rounded-2xl animate-pulse" />;
  if (error) return <div className="text-red-600">Failed to load</div>;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Edit Patient</h1>
        <p className="text-sm text-gray-600">Update only the fields that changed.</p>
      </div>
      <PatientForm
        mode="edit"
        idOrPid={idOrPid}
        initialData={data}
        onSaved={(p) => navigate(`/patients/${p.patientId || p._id}`, { replace: true })}
      />
    </>
  );
}
