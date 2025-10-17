import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values) => {
    setServerError('');
    try {
      const data = await login(values);
      const role = data?.user?.role;

      // role-based redirect
      if (role === 'PATIENT') navigate('/PatientDash', { replace: true });
      else navigate('/', { replace: true });
    } catch (e) {
      setServerError(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-6 rounded-2xl border shadow-sm"
      >
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-gray-600 mt-1">Use seeded accounts (doc/staff/patient).</p>

        {serverError && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm">
            {serverError}
          </div>
        )}

        <label className="block mt-5 text-sm font-medium">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ring-gray-900"
          placeholder="doc@example.com"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}

        <label className="block mt-4 text-sm font-medium">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 ring-gray-900"
          placeholder="secret"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}

        <button
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-gray-900 text-white py-2.5 font-medium disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
