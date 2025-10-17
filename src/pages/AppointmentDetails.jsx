import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAppointment,
  cancelAppointment,
  updateAppointment,
  getSlots,
} from "../api/appointments.api";
import { fmt, ymdLocal } from "../api/time";
import SlotPicker from "../components/SlotPicker";
import DateInput from "../components/DateInput";
import { Button, Card, CardBody, Badge, Modal } from "../components/ui";
import { useState } from "react";
import { useToast } from "../components/ui";

export default function AppointmentDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { push, Toasts } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => getAppointment(id),
  });

  const cancelMut = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      qc.invalidateQueries(["appointments"]);
      push("ok", "Appointment cancelled");
      nav("/appointments");
    },
  });

  if (isLoading) return <div>Loading…</div>;
  const a = data;
  const canManage = a.status === "PENDING"; // rule: patients manage their own pending appts

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Appointment {a.appointmentId}</h1>
      <Card>
        <CardBody className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Doctor:</span> {a.doctor?.name} (
            {a.doctor?.specialization})
          </div>
          <div>
            <span className="font-medium">When:</span> {fmt(a.start)} →{" "}
            {fmt(a.end)}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>{" "}
            <Badge
              color={
                a.status === "CONFIRMED"
                  ? "green"
                  : a.status === "PENDING"
                  ? "amber"
                  : a.status === "CANCELLED"
                  ? "red"
                  : "gray"
              }
            >
              {a.status}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Reason:</span> {a.reason || "-"}
          </div>
        </CardBody>
      </Card>

      {canManage && (
        <Rescheduler
          appt={a}
          onDone={() => qc.invalidateQueries(["appointment", id])}
        />
      )}
      {canManage && (
        <div>
          <Button
            variant="danger"
            onClick={() => cancelMut.mutate(a.appointmentId)}
          >
            Cancel Appointment
          </Button>
        </div>
      )}
      <Toasts />
    </div>
  );
}

function Rescheduler({ appt, onDone }) {
  const qc = useQueryClient();
  const { push } = useToast(); // local hook instance okay for push only
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(ymdLocal(new Date(appt.start)));
  const [selected, setSelected] = useState(null);

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["slots", appt.doctor._id, date, 30],
    queryFn: () => getSlots(appt.doctor._id, date, 30),
    enabled: open,
  });

  const patchMut = useMutation({
    mutationFn: ({ start, end }) =>
      updateAppointment(appt.appointmentId, { start, end }),
    onSuccess: (res) => {
      qc.invalidateQueries(["appointments"]);
      push("ok", "Appointment rescheduled");
      setOpen(false);
      onDone?.(res);
    },
    onError: async (err) => {
      if (err?.response?.status === 409) {
        push("error", "That slot was just taken. Refreshing…");
        await refetch();
      } else push("error", "Could not reschedule");
    },
  });

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Reschedule
      </Button>
      <Modal
        open={open}
        title="Reschedule Appointment"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 items-end">
            <div>
              <div className="text-sm text-gray-600">Doctor</div>
              <div className="font-medium">
                {appt.doctor?.name} ({appt.doctor?.specialization})
              </div>
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
            <div className="sm:col-span-2 flex justify-end">
              <Button variant="ghost" onClick={() => refetch()}>
                {isFetching ? "Loading…" : "Refresh Slots"}
              </Button>
            </div>
          </div>
          <SlotPicker
            slots={data?.slots || []}
            selected={selected}
            onSelect={setSelected}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              disabled={!selected || patchMut.isLoading}
              onClick={() =>
                patchMut.mutate({ start: selected.start, end: selected.end })
              }
            >
              {patchMut.isLoading ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
