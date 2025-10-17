import client from './client';

// POST /api/doctors
export async function createDoctor({ email, password, name }) {
  const { data } = await client.post('/doctors', { email, password, name });
  return data; // { id, email, name, ... } (whatever backend returns)
}

// GET /api/doctors?q=&limit=
export async function searchDoctors(q = '', limit = 25) {
  const { data } = await client.get('/doctors', { params: { q, limit } });
  // Expect { items: [...] } OR array; normalize:
  return Array.isArray(data) ? { items: data } : data;
}

// DELETE /api/doctors/:id
export async function deleteDoctor(id) {
  const { data } = await client.delete(`/doctors/${encodeURIComponent(id)}`);
  return data; // { ok: true } or similar
}
