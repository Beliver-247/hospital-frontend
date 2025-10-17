// src/apl/appointments.api.js
import { API } from './api';

export async function getSlots(doctorId, dateYMD, slotMinutes = 30) {
  const { data } = await API.get('/appointments/slots', { params: { doctorId, date: dateYMD, slotMinutes }});
  return data; // { date, slotMinutes, slots }
}
export async function createAppointment(payload) {
  const { data } = await API.post('/appointments', payload);
  return data.appointment;
}
export async function listAppointments(params = {}) {
  const { data } = await API.get('/appointments', { params });
  return data; // { items, total, page, limit }
}
export async function getAppointment(idOrKey) {
  const { data } = await API.get(`/appointments/${idOrKey}`);
  return data.appointment;
}
export async function updateAppointment(idOrKey, patch) {
  const { data } = await API.patch(`/appointments/${idOrKey}`, patch);
  return data.appointment;
}
export async function cancelAppointment(idOrKey) {
  const { data } = await API.delete(`/appointments/${idOrKey}`);
  return data.appointment;
}
