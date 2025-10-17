import { useMutation } from '@tanstack/react-query';
import { createDoctor } from '../api/doctors';
import DoctorForm from '../components/DoctorForm';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';
import { useState } from 'react';

export default function DoctorsNew() {
  const nav = useNavigate();
  const [toast, setToast] = useState(null);

  const createMut = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      setToast({ kind: 'success', msg: 'Doctor account created' });
      nav('/doctors');
    },
    onError: (e) => setToast({ kind: 'error', msg: e?.response?.data?.message || 'Create failed' }),
  });

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-lg font-semibold">Create Doctor</h1>
          <p className="text-sm text-gray-600">Only STAFF can create or delete doctor accounts.</p>
        </div>
        <Link to="/doctors" className="px-3 py-2 bg-white border rounded-md">View Doctors</Link>
      </div>

      {toast && <Toast kind={toast.kind} msg={toast.msg} />}

      <DoctorForm
        isSubmitting={createMut.isPending}
        onSubmit={(values) => createMut.mutate(values)}
      />
    </div>
  );
}
