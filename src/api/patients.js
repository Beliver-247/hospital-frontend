import client from './client';

export async function validatePatient(payload) {
  const { data } = await client.post('/patients/validate', payload);
  return data; // { fieldErrors, duplicates }
}

export async function createPatient(payload) {
  const { data } = await client.post('/patients', payload);
  return data; // { patientId, patient }
}

export async function getPatient(idOrPid) {
  const { data } = await client.get(`/patients/${encodeURIComponent(idOrPid)}`);
  return data; // patient
}

export async function updatePatient(idOrPid, patch) {
  const { data } = await client.patch(`/patients/${encodeURIComponent(idOrPid)}`, patch);
  return data; // { message, patient }
}

export async function searchPatients(q = '', limit = 20) {
  const { data } = await client.get('/patients', { params: { q, limit } });
  return data; // { items: [...] }
}
