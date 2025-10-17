// src/pages/Schedule.jsx
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listDoctorsByType, DOCTOR_TYPES } from "../api/doctors";
import { getSlots, createAppointment } from "../api/appointments.api";
import { ymdLocal, fmt } from "../api/time";
import DateInput from "../components/DateInput";
import SlotPicker from "../components/SlotPicker";
import { useNavigate } from "react-router-dom";

/** Simple inline stepper to avoid extra deps */
function Stepper({ step }) {
  const labels = ["Select Specialization", "Choose Doctor & Time", "Add Notes & Confirm", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {labels.map((label, i) => {
        const idx = i + 1;
        const active = idx <= step;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={[
                "h-8 w-8 rounded-full flex items-center justify-center text-sm",
                active ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600",
              ].join(" ")}
            >
              {idx}
            </div>
            <div className="hidden sm:block text-sm text-gray-700">{label}</div>
            {i < labels.length - 1 && <div className="w-6 sm:w-12 h-px bg-gray-300" />}
          </div>
        );
      })}
    </div>
  );
}

export default function Schedule() {
  const nav = useNavigate();
  const qc = useQueryClient();

  // --- wizard state
  const [step, setStep] = useState(1);
  const [doctorType, setDoctorType] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState(ymdLocal(new Date()));
  const [slot, setSlot] = useState(null);

  // notes (only "reason" is sent to backend; rest is UI polish)
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [firstVisit, setFirstVisit] = useState(true);
  const [useInsurance, setUseInsurance] = useState(false);

  // --- Step 1: types
  function selectType(t) {
    setDoctorType(t);
    setDoctor(null);
    setSlot(null);
    setStep(2);
  }

  // --- Step 2: doctors & slots
  const doctorsQ = useQuery({
    queryKey: ["doctors", doctorType],
    queryFn: () => listDoctorsByType(doctorType),
    enabled: step >= 2 && !!doctorType,
  });

  const slotsQ = useQuery({
    queryKey: ["slots", doctor?._id, date, 30],
    queryFn: () => getSlots(doctor._id, date, 30),
    enabled: step >= 2 && !!doctor?._id && !!date,
  });

  useEffect(() => {
    // reset slot when date or doctor changes
    setSlot(null);
  }, [date, doctor?._id]);

  const slots = useMemo(() => slotsQ.data?.slots || [], [slotsQ.data]);

  // --- Create appointment
  const createMut = useMutation({
    mutationFn: () =>
      createAppointment({
        doctorId: doctor._id,
        start: slot.start,
        end: slot.end,
        reason: reason?.trim() || "",
      }),
    onSuccess: (appt) => {
      qc.invalidateQueries(["appointments"]);
      // Show confirmation step
      setStep(4);
      // Store last appt in state to render confirmation
      setConfirmation(appt);
    },
    onError: async () => {
      alert("Slot was taken. Refreshing slots.");
      await slotsQ.refetch();
    },
  });

  const [confirmation, setConfirmation] = useState(null);

  // --- Step navigation guards
  function nextFromStep2() {
    if (!doctor || !slot) return;
    setStep(3);
  }
  function back() {
    if (step === 2) {
      setDoctor(null);
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-center">Book Appointment</h1>
      <Stepper step={step} />

      {/* STEP 1: Select specialization */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-4 py-3 border-b">
            <div className="font-medium">Select Doctor by Specialization</div>
            <div className="text-sm text-gray-500">Choose the medical specialty you need</div>
          </div>
          <div className="p-4 space-y-2">
            {DOCTOR_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => selectType(t)}
                className={[
                  "w-full text-left bg-white border rounded-xl px-4 py-3 hover:bg-blue-50",
                  doctorType === t ? "border-blue-400 ring-1 ring-blue-200 bg-blue-50" : "border-gray-200",
                ].join(" ")}
              >
                <div className="font-medium">{t}</div>
                <div className="text-sm text-gray-500">
                  {t === "Cardiologist" && "Heart & Cardiovascular"}
                  {t === "Pediatric" && "Children's Health"}
                  {t === "Dermatologist" && "Skin Conditions"}
                  {t === "Orthopedic" && "Bones & Joints"}
                  {t === "Neurologist" && "Brain & Nervous System"}
                  {t === "Opthalmologist" && "Eye Care"}
                  {t === "Outpatient Department (OPD)" && "General OPD"}
                </div>
              </button>
            ))}

            <div className="pt-3 flex justify-end">
              <button
                disabled={!doctorType}
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Continue to Doctor Selection →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Choose doctor & time */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-4 py-3 border-b">
            <div className="font-medium">Select Doctor & Time Slot</div>
            <div className="text-sm text-gray-500">
              Available {doctorType} Doctors — {date}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Doctors list */}
            <div>
              <label className="block text-sm mb-1">Doctors</label>
              {doctorsQ.isLoading ? (
                <div className="text-sm text-gray-500">Loading doctors…</div>
              ) : (doctorsQ.data || []).length === 0 ? (
                <div className="text-sm text-gray-500">No doctors for this specialization.</div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {doctorsQ.data.map((d) => {
                    const active = doctor?._id === d._id;
                    return (
                      <button
                        key={d._id}
                        onClick={() => setDoctor(d)}
                        className={[
                          "text-left p-3 rounded-xl border hover:bg-blue-50",
                          active ? "border-blue-500 bg-blue-50" : "border-gray-200",
                        ].join(" ")}
                      >
                        <div className="font-medium">{d.name || "Dr. (Unnamed)"}</div>
                        <div className="text-xs text-gray-600 mt-0.5">{d.doctorType}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date + Slots */}
            <div className="grid md:grid-cols-3 gap-4 items-start">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <DateInput value={date} onChange={(v) => setDate(v)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Available Time Slots</label>
                {(!doctor || slotsQ.isFetching) && <div className="text-sm text-gray-500">Select a doctor to load slots…</div>}
                {doctor && (
                  <SlotPicker slots={slots} selected={slot} onSelect={setSlot} />
                )}
              </div>
            </div>

            {/* Selected summary */}
            {doctor && slot && (
              <div className="border rounded-xl p-3 bg-blue-50 border-blue-200">
                <div className="text-sm">
                  Selected: <span className="font-medium">{doctor.name}</span> — {fmt(slot.start)} to {fmt(slot.end)} ({doctor.doctorType})
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <button onClick={back} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                ← Back to Specialization
              </button>
              <button
                disabled={!doctor || !slot}
                onClick={nextFromStep2}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                Continue to Notes →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Add notes & confirm */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-4 py-3 border-b">
            <div className="font-medium">Add Notes & Confirm</div>
            <div className="text-sm text-gray-500">Provide additional information for your appointment</div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Reason for Visit (Optional)</label>
              <textarea
                className="mt-1 w-full border rounded-lg px-3 py-2"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe the reason for your visit…"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Additional Notes</label>
              <textarea
                className="mt-1 w-full border rounded-lg px-3 py-2"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information or special requests…"
              />
            </div>

            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={firstVisit} onChange={(e) => setFirstVisit(e.target.checked)} />
                First visit to this doctor
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={useInsurance} onChange={(e) => setUseInsurance(e.target.checked)} />
                Use insurance coverage
              </label>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={back} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                ← Back to Doctor Selection
              </button>
              <button
                disabled={createMut.isLoading}
                onClick={() => createMut.mutate()}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
              >
                {createMut.isLoading ? "Confirming…" : "Confirm Appointment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Confirmation */}
      {step === 4 && confirmation && (
        <div className="bg-white rounded-2xl shadow-sm border">
          <div className="px-4 py-3 border-b">
            <div className="font-medium">Appointment Confirmation</div>
            <div className="text-sm text-gray-500">Your appointment has been successfully scheduled</div>
          </div>
          <div className="p-4 space-y-4">
            <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-green-800">
              ✅ Appointment Successfully Confirmed!
            </div>

            <div className="rounded-xl border p-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div><span className="font-medium">Doctor:</span> {confirmation.doctor?.name || doctor?.name}</div>
                <div><span className="font-medium">Specialty:</span> {confirmation.doctor?.specialization || doctor?.doctorType}</div>
                <div><span className="font-medium">Date & Time:</span> {fmt(confirmation.start)} – {fmt(confirmation.end)}</div>
                <div><span className="font-medium">Duration:</span> 30 minutes</div>
                <div><span className="font-medium">Appointment ID:</span> {confirmation.appointmentId}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white" onClick={() => nav("/PatientDash")}>
                ← Back to Dashboard
              </button>
              <button className="px-4 py-2 rounded-lg bg-gray-100" onClick={() => nav(`/appointments/${confirmation.appointmentId}`)}>
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
