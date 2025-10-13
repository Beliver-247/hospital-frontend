import client from './client';

export async function validatePatient(payload) {
  // POST /api/patients/validate
  const { data } = await client.post('/patients/validate', payload);
  // data: { fieldErrors: [{path,msg}], duplicates: [...] }
  return data;
}

export async function createPatient(payload) {
  // POST /api/patients — idempotent with submissionId
  const res = await client.post('/patients', payload, {
    // Allow 200 (idempotent) or 201 (created)
    validateStatus: (s) => s === 201 || s === 200,
  });
  return res.data; // { patientId, patient }
}
