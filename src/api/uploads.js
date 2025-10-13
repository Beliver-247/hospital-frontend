import client from './client';

export async function uploadFile(file, type) {
  const form = new FormData();
  form.append('file', file);
  if (type) form.append('type', type); // 'ID' | 'REPORT'
  const { data } = await client.post('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  // { url, originalName, filename, mimeType, size, type }
  return data;
}
