import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const DOCTOR_TYPES = [
  'Cardiologist',
  'Pediatric',
  'Dermatologist',
  'Orthopedic',
  'Neurologist',
  'Opthalmologist',
  'Outpatient Department (OPD)',
];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  doctorType: z.enum(DOCTOR_TYPES, { required_error: 'Doctor type is required' }),
});

export default function DoctorForm({ onSubmit, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', doctorType: DOCTOR_TYPES[0] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 bg-white border rounded-2xl p-6 max-w-lg">
      <h2 className="font-semibold">Create Doctor</h2>

      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input type="email" className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600" {...register('email')} />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Temporary password</label>
        <input type="password" className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600" {...register('password')} />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Doctor type</label>
        <select className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600" {...register('doctorType')}>
          {DOCTOR_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.doctorType && <p className="text-sm text-red-600 mt-1">{errors.doctorType.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button disabled={isSubmitting} className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-50">
          {isSubmitting ? 'Creating…' : 'Create Doctor'}
        </button>
        <p className="text-sm text-gray-600">Creates a DOCTOR role user with the selected specialty.</p>
      </div>
    </form>
  );
}
