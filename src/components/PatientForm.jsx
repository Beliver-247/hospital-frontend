import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from '@tanstack/react-query';
import { validatePatient, createPatient, updatePatient } from '../api/patients';
import UploadWidget from './UploadWidget';
import DuplicateDialog from './DuplicateDialog';
import Toast from './Toast';

const schema = z.object({
  personal: z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    dob: z.string().min(1, 'Required'),
    age: z
      .preprocess((v) => (v === '' || v === null ? undefined : Number(v)), z.number().int().positive().optional())
      .nullable()
      .optional(),
    gender: z.enum(['MALE','FEMALE','OTHER'], { required_error: 'Required' }),
    nic: z.string().optional().nullable(),
    passport: z.string().optional().nullable(),
  }),
  contact: z.object({
    address: z.string().min(1, 'Required'),
    phone: z.string().optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
  }),
  medical: z.object({
    history: z.string().optional().default(''),
    allergies: z.array(z.string()).default([]),
    conditions: z.array(z.string()).default([]),
  }),
  documents: z.array(z.object({ type: z.enum(['ID','REPORT']), url: z.string().url() })).default([]),
});

export default function PatientForm({ mode='create', initialData, idOrPid, onSaved }) {
  const [submissionId] = useState(uuidv4());
  const [dupOpen, setDupOpen] = useState(false);
  const [dups, setDups] = useState([]);
  const [toast, setToast] = useState({ kind: 'success', msg: '' });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      personal: { firstName:'', lastName:'', dob:'', age:'', gender:'OTHER', nic:'', passport:'' },
      contact: { address:'', phone:'', email:'' },
      medical: { history:'', allergies:[], conditions:[] },
      documents: [],
    },
    mode: 'onBlur',
  });

  const docs = useFieldArray({ control: form.control, name: 'documents' });

  const validateMut = useMutation({ mutationFn: validatePatient });
  const createMut = useMutation({ mutationFn: createPatient });
  const updateMut = useMutation({ mutationFn: (patch) => updatePatient(idOrPid, patch) });

  const mapServerFieldErrors = (errs=[]) => errs.forEach(({path,msg}) => form.setError(path, { type:'server', message: msg }));

  const onSubmit = async (values) => {
    if (mode === 'edit') {
      try {
        const { patient } = await updateMut.mutateAsync(values);
        setToast({ kind:'success', msg: 'Updated' });
        onSaved?.(patient);
      } catch (e) {
        setToast({ kind:'error', msg: e?.response?.data?.message || 'Update failed' });
      }
      return;
    }

    // create flow: validate -> duplicates -> create
    const payload = { ...values, submissionId };
    try {
      const { fieldErrors, duplicates } = await validateMut.mutateAsync(payload);
      if (fieldErrors?.length) return mapServerFieldErrors(fieldErrors);
      if (duplicates?.length) { setDups(duplicates); setDupOpen(true); return; }

      const { patientId, patient } = await createMut.mutateAsync(payload);
      setToast({ kind:'success', msg:`Created ${patientId}` });
      onSaved?.(patient);
    } catch (e) {
      setToast({ kind:'error', msg: e?.response?.data?.message || 'Save failed' });
    }
  };

  const isBusy = validateMut.isPending || createMut.isPending || updateMut.isPending;

  return (
    <>
      <DuplicateDialog open={dupOpen} duplicates={dups} onClose={() => setDupOpen(false)} />
      {toast.msg && <div className="mb-4"><Toast kind={toast.kind} msg={toast.msg} /></div>}

      {/* Step header */}
      <div className="flex items-center gap-3 text-sm">
        <Step n={1} label="Personal" active />
        <Step n={2} label="Contact" />
        <Step n={3} label="Medical" />
        <Step n={4} label="Documents" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 mt-2">
        {/* personal */}
        <Card title="Personal">
          <div className="grid md:grid-cols-3 gap-4">
            <Input label="First name" reg={form.register('personal.firstName')} err={form.formState.errors?.personal?.firstName?.message} />
            <Input label="Last name" reg={form.register('personal.lastName')} err={form.formState.errors?.personal?.lastName?.message} />
            <Select label="Gender" reg={form.register('personal.gender')} err={form.formState.errors?.personal?.gender?.message}
              options={[['MALE','Male'],['FEMALE','Female'],['OTHER','Other']]} />
            <Input type="date" label="Date of birth" reg={form.register('personal.dob')} err={form.formState.errors?.personal?.dob?.message} />
            <Input type="number" label="Age (optional)" reg={form.register('personal.age')} err={form.formState.errors?.personal?.age?.message} />
            <Input label="NIC" reg={form.register('personal.nic')} err={form.formState.errors?.personal?.nic?.message} />
            <Input label="Passport" reg={form.register('personal.passport')} err={form.formState.errors?.personal?.passport?.message} />
          </div>
        </Card>

        {/* contact */}
        <Card title="Contact">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input label="Address" reg={form.register('contact.address')} err={form.formState.errors?.contact?.address?.message} />
            </div>
            <Input label="Phone" placeholder="+9477..." reg={form.register('contact.phone')} err={form.formState.errors?.contact?.phone?.message} />
            <Input type="email" label="Email" reg={form.register('contact.email')} err={form.formState.errors?.contact?.email?.message} />
          </div>
        </Card>

        {/* medical */}
        <Card title="Medical">
          <label className="block text-sm font-medium">History</label>
          <textarea rows="3" className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600"
            {...form.register('medical.history')} />
          <p className="text-xs text-gray-500 mt-1">You can expand with allergies/conditions later.</p>
        </Card>

        {/* documents */}
        <Card title="Documents">
          <div className="flex items-center gap-2">
            <UploadWidget label="Upload ID" type="ID" onUploaded={(u)=>docs.append({ type: u.type || 'ID', url: u.url })} />
            <UploadWidget label="Upload Report" type="REPORT" onUploaded={(u)=>docs.append({ type: u.type || 'REPORT', url: u.url })} />
          </div>
          <ul className="mt-4 grid gap-2">
            {docs.fields.map((f, i) => (
              <li key={f.id} className="flex items-center justify-between border rounded-md p-2 text-sm bg-gray-50">
                <span className="font-medium">{f.type}</span>
                <a className="underline text-emerald-700 truncate" href={f.url} target="_blank" rel="noreferrer">{f.url}</a>
                <button type="button" className="px-2 py-1 border rounded-md" onClick={()=>docs.remove(i)}>Remove</button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={isBusy}
            className="px-4 py-2 rounded-md bg-gray-900 text-white disabled:opacity-50">
            {isBusy ? (mode === 'edit' ? 'Updating…' : 'Saving…') : (mode === 'edit' ? 'Update Patient' : 'Save Patient')}
          </button>
          <span className="text-sm text-gray-600">
            {mode === 'create' ? 'Validation + duplicate check before create.' : 'Partial PATCH update.'}
          </span>
        </div>
      </form>
    </>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white border rounded-2xl p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Step({ n, label, active }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-7 w-7 grid place-items-center rounded-full text-sm ${active ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{n}</div>
      <div className={`text-sm ${active ? 'text-emerald-700 font-medium' : 'text-gray-600'}`}>{label}</div>
    </div>
  );
}
function Input({ label, reg, err, type='text', placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input type={type} placeholder={placeholder}
        className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600"
        {...reg} />
      {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
    </div>
  );
}
function Select({ label, reg, err, options=[] }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 ring-emerald-600" {...reg}>
        {options.map(([v,l])=> <option key={v} value={v}>{l}</option>)}
      </select>
      {err && <p className="text-sm text-red-600 mt-1">{err}</p>}
    </div>
  );
}
