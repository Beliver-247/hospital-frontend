import { uploadFile } from '../api/uploads';

export default function UploadWidget({ label='Upload', onUploaded, type }) {
  const doUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await uploadFile(file, type);
      onUploaded?.(res);
    } catch (e2) {
      alert(e2?.response?.data?.message || 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };
  return (
    <label className="cursor-pointer px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-50">
      {label}
      <input type="file" accept=".pdf,image/*" className="hidden" onChange={doUpload} />
    </label>
  );
}
