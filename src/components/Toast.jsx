export default function Toast({ kind='success', msg }) {
  if (!msg) return null;
  const style = kind === 'error'
    ? 'bg-red-50 border-red-200 text-red-800'
    : 'bg-emerald-50 border-emerald-200 text-emerald-800';
  return <div className={`rounded-md border px-3 py-2 text-sm ${style}`}>{msg}</div>;
}
