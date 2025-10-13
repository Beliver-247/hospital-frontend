import PatientForm from '../components/PatientForm';

export default function PatientsNew() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create New Patient</h1>
      <PatientForm mode="create" />
    </div>
  );
}
