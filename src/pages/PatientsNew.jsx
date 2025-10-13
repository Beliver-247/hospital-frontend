import PatientForm from '../components/PatientForm';

export default function PatientsNew() {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">Create New Patient</h1>
        <p className="text-sm text-gray-600">Fill the sections below. We’ll validate and check for duplicates.</p>
      </div>
      <PatientForm mode="create" />
    </>
  );
}
