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

export const DOCTOR_TYPES = [
  "Cardiologist",
  "Pediatric",
  "Dermatologist",
  "Orthopedic",
  "Neurologist",
  "Opthalmologist", // note: model uses 'Opthalmologist' (typo) – keep as-is
  "Outpatient Department (OPD)",
];

/**
 * Fetch doctors filtered by type.
 * Backend suggestion: GET /users?role=DOCTOR&doctorType=<type>
 * Return shape can be either {items: [...] } or [...] – we normalize.
 */
export async function listDoctorsByType(doctorType) {
  const { data } = await client.get("/users", {
    params: { role: "DOCTOR", doctorType },
  });
  return Array.isArray(data) ? data : data.items || [];
}