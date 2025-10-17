import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSlots, createAppointment } from "../api/appointments.api";
import DateInput from "../components/DateInput";
import SlotPicker from "../components/SlotPicker";
import { ymdLocal } from "../api/time";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, Button, Stepper } from "../components/ui";
import { useToast } from "../components/ui";

const DOCTORS = [
  {
    _id: "000000000000000000000001",
    name: "Dr. Example",
    specialization: "Cardiology",
  },
  {
    _id: "000000000000000000000002",
    name: "Dr. Neural",
    specialization: "Neurology",
  },
];

export default function Schedule() {
  const [doctorId, setDoctorId] = useState(DOCTORS[0]._id);
  const [date, setDate] = useState(ymdLocal(new Date()));
  const [selected, setSelected] = useState(null);
  const qc = useQueryClient();
  const nav = useNavigate();
  const { push, Toasts } = useToast();

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["slots", doctorId, date, 30],
    queryFn: () => getSlots(doctorId, date, 30),
    enabled: !!doctorId && !!date,
  });

  const createMut = useMutation({
    mutationFn: createAppointment,
    onSuccess: (appt) => {
      qc.invalidateQueries(["appointments"]);
      push("ok", "Appointment booked!");
      nav(`/appointments/${appt.appointmentId}`);
    },
    onError: async () => {
      push("error", "Slot was taken. Refreshed slots.");
      await refetch();
    },
  });

  function book() {
    if (!selected) return;
    createMut.mutate({
      doctorId,
      start: selected.start,
      end: selected.end,
      reason: "",
    });
  }

  const slots = data?.slots || [];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Book Appointment</h1>
      <Stepper step={2} />

      <Card>
        <CardHeader
          title="Select Doctor & Time Slot"
          right={
            <Button variant="ghost" onClick={() => refetch()}>
              {isFetching ? "Loading…" : "Refresh"}
            </Button>
          }
        />
        <CardBody className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm mb-1">Doctor</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setSelected(null);
                }}
              >
                {DOCTORS.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Date</label>
              <DateInput
                value={date}
                onChange={(v) => {
                  setDate(v);
                  setSelected(null);
                }}
              />
            </div>
          </div>

          <SlotPicker
            slots={slots}
            selected={selected}
            onSelect={setSelected}
          />

          <div className="pt-2">
            <Button disabled={!selected || createMut.isLoading} onClick={book}>
              {createMut.isLoading ? "Booking…" : "Confirm Appointment"}
            </Button>
          </div>
        </CardBody>
      </Card>
      <Toasts />
    </div>
  );
}
