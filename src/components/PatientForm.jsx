import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { validatePatient, createPatient } from '../api/patients';
import { uploadFile } from '../api/uploads';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getSession } from '../api/auth';

// --- Schema mirrors server expectations (client-side validation) ---
const schema = z.object({
  personal: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    dob: z.string().min(1, 'Date of birth is required'),
    age: z.union([z.number().int().min(0).max(150), z.null()]).optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    nic: z.string().nullable().optional(),
    passport: z.string().nullable().optional(),
  }),
  contact: z.object({
    address: z.string().min(1, 'Address is required'),
    phone: z.string().nullable().optional(),
    email: z.string().email('Invalid email').nullable().optional(),
  }),
  medical: z.object({
    history: z.string().optional().default(''),
    allergies: z.array(z.string()).optional().default([]),
    conditions: z.array(z.string()).optional().default([]),
  }),
  documents: z
    .array(
      z.object({
        type: z.enum(['ID', 'REPORT']),
        url: z.string().url('Document URL must be a valid URL'),
      })
    )
    .optional()
    .default([]),
});

export default function PatientForm({ mode = 'create' }) {
  const session = getSession();
  const role = session?.user?.role;
  const disabledForPatient = role === 'PATIENT';

  const submissionIdRef = useRef(uuidv4()); // idempotency for this form session

  const [duplicates, setDuplicates] = useState([]);
  const [serverFieldErrors, setServerFieldErrors] = useState([]);

  const defaultValues = useMemo(
    () => ({
      personal: {
        firstName: '',
        lastName: '',
        dob: '',
        age: null,
        gender: 'OTHER',
        nic: '',
        passport: '',
      },
      contact: {
        address: '',
        phone: '',
        email: '',
      },
      medical: {
        history: '',
        allergies: [],
        conditions: [],
      },
      documents: [],
    }),
    []
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  const { register, handleSubmit, setValue, setError, clearErrors, formState } = form;
  const { errors, isSubmitting } = formState;

  const validateMut = useMutation({
    mutationFn: validatePatient,
  });

  const createMut = useMutation({
    mutationFn: createPatient,
  });

  useEffect(() => {
    if (disabledForPatient) {
      // Block interaction if PATIENT
      Object.keys(defaultValues).forEach((k) => {});
    }
  }, [disabledForPatient, defaultValues]);

  const mapServerFieldErrors = (fieldErrors = []) => {
    // server sends { path, msg } where path can be dot-notation. We attach to root + show banner
    setServerFieldErrors(fieldErrors);
    fieldErrors.forEach(({ path, msg }) => {
      // Attempt to map to RHF by translating e.g. "contact.email"
      const rhfPath = path?.replace(/\[(\d+)\]/g, '.$1');
      if (rhfPath) setError(rhfPath, { type: 'server', message: msg });
    });
  };

  const onSubmit = async (values) => {
    if (disabledForPatient) return;

    // Attach idempotency key
    const payload = { ...values, submissionId: submissionIdRef.current };

    setDuplicates([]);
    setServerFieldErrors([]);
    clearErrors();

    // 1) Server-side validate (REQUIRED)
    const validation = await validateMut.mutateAsync(payload).catch((e) => {
      throw e;
    });

    if (validation?.fieldErrors?.length) {
      mapServerFieldErrors(validation.fieldErrors);
      return;
    }

    if (validation?.duplicates?.length) {
      // Show duplicates list and block creation until user decides next step
      setDuplicates(validation.duplicates);
      return;
    }

    // 2) If no fieldErrors & no duplicates → CREATE
    const result = await createMut.mutateAsync(payload);
    alert(`Patient created: ${result?.patientId}`);
    // Soft reset but keep submissionId stable for idempotency re-submits (optional)
    // If you want a brand new create after success, refresh submissionId:
    submissionIdRef.current = uuidv4();
  };

  const onUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, type);
      const current = form.getValues('documents') || [];
      setValue('documents', [...current, { type: res?.type || type, url: res.url }], {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (err) {
      alert(err?.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {disabledForPatient && (
        <div className="rounded-lg border p-3 bg-yellow-50 text-yellow-900">
          Your role (<span className="font-mono">{role}</span>) is not permitted to create patients.
        </div>
      )}

      {!!serverFieldErrors.length && (
        <div className="rounded-lg border p-3 bg-red-50 text-red-800 text-sm">
          <div className="font-medium mb-1">Please fix the highlighted issues:</div>
          <ul className="list-disc ml-5">
            {serverFieldErrors.map((e, idx) => (
              <li key={idx}><span className="font-mono">{e.path}</span>: {e.msg}</li>
            ))}
          </ul>
        </div>
      )}

      {!!duplicates.length && (
        <div className="rounded-lg border p-3 bg-amber-50 text-amber-900">
          <div className="font-semibold mb-1">Possible duplicates found</div>
          <p className="text-sm mb-2">
            We found existing patient(s) matching your inputs. Review before proceeding.
          </p>
          <div className="space-y-2">
            {duplicates.map((p) => (
              <div key={p._id} className="rounded border p-2 bg-white">
                <div className="text-sm">
                  <span className="font-medium">
                    {p?.personal?.firstName} {p?.personal?.lastName}
                  </span>{' '}
                  • <span className="font-mono">{p?.patientId}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {p?.contact?.email || '-'} • {p?.contact?.phone || '-'} • NIC: {p?.personal?.nic || '-'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-sm text-gray-700">
            Next steps:
            <ul className="list-disc ml-5">
              <li>Open an existing record (search/view flow) to update it.</li>
              <li>Or adjust the form and re-validate.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Personal */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-medium mb-3">Personal</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm">First name</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.firstName')}
            />
            {errors?.personal?.firstName && (
              <p className="text-xs text-red-600">{errors.personal.firstName.message}</p>
            )}
          </label>
          <label className="block">
            <span className="text-sm">Last name</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.lastName')}
            />
            {errors?.personal?.lastName && (
              <p className="text-xs text-red-600">{errors.personal.lastName.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">Date of birth</span>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.dob')}
            />
            {errors?.personal?.dob && (
              <p className="text-xs text-red-600">{errors.personal.dob.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">Age (optional)</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.age', {
                setValueAs: (v) => (v === '' ? null : Number(v)),
              })}
            />
            {errors?.personal?.age && (
              <p className="text-xs text-red-600">{errors.personal.age.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">Gender</span>
            <select
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.gender')}
            >
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
            {errors?.personal?.gender && (
              <p className="text-xs text-red-600">{errors.personal.gender.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">NIC</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.nic')}
            />
          </label>

          <label className="block">
            <span className="text-sm">Passport</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('personal.passport')}
            />
          </label>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-medium mb-3">Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block sm:col-span-2">
            <span className="text-sm">Address</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('contact.address')}
            />
            {errors?.contact?.address && (
              <p className="text-xs text-red-600">{errors.contact.address.message}</p>
            )}
          </label>

          <label className="block">
            <span className="text-sm">Phone</span>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('contact.phone')}
            />
          </label>

          <label className="block">
            <span className="text-sm">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              disabled={disabledForPatient || isSubmitting}
              {...register('contact.email')}
            />
            {errors?.contact?.email && (
              <p className="text-xs text-red-600">{errors.contact.email.message}</p>
            )}
          </label>
        </div>
      </section>

      {/* Medical */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-medium mb-3">Medical</h2>
        <label className="block mb-3">
          <span className="text-sm">History</span>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            disabled={disabledForPatient || isSubmitting}
            {...register('medical.history')}
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <TagInput
            label="Allergies"
            value={form.watch('medical.allergies') || []}
            onChange={(arr) => setValue('medical.allergies', arr, { shouldDirty: true })}
            disabled={disabledForPatient || isSubmitting}
          />
          <TagInput
            label="Conditions"
            value={form.watch('medical.conditions') || []}
            onChange={(arr) => setValue('medical.conditions', arr, { shouldDirty: true })}
            disabled={disabledForPatient || isSubmitting}
          />
        </div>
      </section>

      {/* Documents */}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-medium mb-3">Documents</h2>
        <div className="flex gap-4 flex-wrap">
          <label className="block">
            <span className="text-sm">Upload ID (PDF/PNG/JPG/WEBP)</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className="mt-1 block text-sm"
              disabled={disabledForPatient || isSubmitting}
              onChange={(e) => onUpload(e, 'ID')}
            />
          </label>
          <label className="block">
            <span className="text-sm">Upload Report (PDF/PNG/JPG/WEBP)</span>
            <input
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              className="mt-1 block text-sm"
              disabled={disabledForPatient || isSubmitting}
              onChange={(e) => onUpload(e, 'REPORT')}
            />
          </label>
        </div>

        <ul className="mt-3 text-sm list-disc ml-5 space-y-1">
          {(form.watch('documents') || []).map((d, idx) => (
            <li key={idx}>
              <span className="px-2 py-0.5 rounded bg-gray-100 mr-2">{d.type}</span>
              <a className="text-blue-700 underline" href={d.url} target="_blank" rel="noreferrer">
                {d.url}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={disabledForPatient || isSubmitting || validateMut.isPending || createMut.isPending}
          className="rounded-lg bg-gray-900 text-white px-4 py-2.5 disabled:opacity-60"
        >
          {isSubmitting || validateMut.isPending || createMut.isPending ? 'Validating…' : 'Save'}
        </button>

        {(validateMut.isError || createMut.isError) && (
          <div className="text-sm text-red-700">
            {(validateMut.error?.message || createMut.error?.message) ?? 'Something went wrong'}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Note: This form calls <code>/api/patients/validate</code> first. If duplicates are found, creation is blocked
        and duplicates are shown. If clean, it creates with <code>submissionId</code> for idempotency.
      </p>
    </form>
  );
}

// ---- Small tag input (comma/Enter to add) ----
function TagInput({ label, value, onChange, disabled }) {
  const [input, setInput] = useState('');
  return (
    <div>
      <span className="text-sm">{label}</span>
      <div className="mt-1 rounded-lg border p-2 bg-white">
        <div className="flex flex-wrap gap-2">
          {value.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-sm"
            >
              {t}
              <button
                type="button"
                className="text-gray-500 hover:text-black"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                disabled={disabled}
                aria-label={`Remove ${t}`}
              >
                ×
              </button>
            </span>
          ))}
          <input
            className="flex-1 min-w-[120px] outline-none"
            placeholder="Type and press Enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (disabled) return;
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const v = input.trim().replace(/,$/, '');
                if (v) onChange([...value, v]);
                setInput('');
              }
              if (e.key === 'Backspace' && input === '' && value.length > 0) {
                onChange(value.slice(0, -1));
              }
            }}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
