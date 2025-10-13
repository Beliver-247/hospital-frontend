import { useForm } from 'react-hook-form';
import { login, getSession } from '../api/auth';
import { useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const nav = useNavigate();
  const session = getSession();
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  if (session?.token) return <Navigate to="/" replace />;

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      await login(values);
      nav('/', { replace: true });
    } catch (e) {
      setServerError(e?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-gray-600 mb-4">Use seeded users for dev:</p>
        <ul className="text-xs text-gray-600 mb-4 space-y-1">
          <li>DOCTOR: <code>doc@example.com / secret</code></li>
          <li>STAFF: <code>staff@example.com / secret</code></li>
          <li>PATIENT (blocked): <code>patient@example.com / secret</code></li>
        </ul>

        {serverError && (
          <div className="mb-3 rounded-lg bg-red-50 text-red-700 text-sm p-2">
            {serverError}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            {...register('email', { required: 'Email is required' })}
            autoComplete="username"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring"
            {...register('password', { required: 'Password is required' })}
            autoComplete="current-password"
          />
          {errors.password && <span className="text-xs text-red-600">{errors.password.message}</span>}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 text-white py-2.5 font-medium disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
