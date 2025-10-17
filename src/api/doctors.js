import client from './client';

// POST /api/doctors
export async function createDoctor({ email, password, name, doctorType }) {
  const { data } = await client.post('/doctors', { email, password, name, doctorType });
  // backend returns { ok, user:{ id, email, role, name, doctorType } }
  return data;
}

// GET /api/doctors?q=&limit=
export async function searchDoctors(q = '', limit = 25) {
  const { data } = await client.get('/doctors', { params: { q, limit } });
  // listDoctors returns an array; normalize to { items }
  return Array.isArray(data) ? { items: data } : data;
}

// DELETE /api/doctors/:id
export async function deleteDoctor(id) {
  const { data } = await client.delete(`/doctors/${encodeURIComponent(id)}`);
  // { deletedCount: number }
  return data;
}
