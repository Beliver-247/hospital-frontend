import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAppointments } from "../api/appointments.api";
import AppointmentCard from "../components/AppointmentCard";
import DateInput from "../components/DateInput";
import { Button, Card, CardBody } from "../components/ui";

export default function MyAppointments() {
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["appointments", { mine: "true", status, from, to }],
    queryFn: () =>
      listAppointments({
        mine: "true",
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const items = data?.items || [];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Appointments</h1>

      <Card>
        <CardBody className="grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All</option>
              <option>PENDING</option>
              <option>CONFIRMED</option>
              <option>COMPLETED</option>
              <option>CANCELLED</option>
              <option>NO_SHOW</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">From</label>
            <DateInput value={from} onChange={setFrom} />
          </div>
          <div>
            <label className="block text-sm mb-1">To</label>
            <DateInput value={to} onChange={setTo} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setStatus("");
                setFrom("");
                setTo("");
              }}
            >
              Reset
            </Button>
            <Button onClick={() => refetch()}>
              {isLoading ? "Loading…" : "Apply"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {isLoading && <div>Loading…</div>}
      {!isLoading && items.length === 0 && (
        <div className="text-gray-500">No appointments match your filters.</div>
      )}
      <div className="grid gap-3">
        {items.map((a) => (
          <AppointmentCard key={a._id} appt={a} />
        ))}
      </div>
    </div>
  );
}
