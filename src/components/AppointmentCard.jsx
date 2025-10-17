import { Link } from "react-router-dom";
import { fmt } from "../api/time";
import { Card, CardBody, Badge } from "./ui";

const color = {
  PENDING: "amber",
  CONFIRMED: "green",
  COMPLETED: "gray",
  CANCELLED: "red",
  NO_SHOW: "red",
};

export default function AppointmentCard({ appt }) {
  const s = fmt(appt.start),
    e = fmt(appt.end);
  return (
    <Card>
      <CardBody className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{appt.appointmentId}</div>
          <div className="font-medium">
            {appt.doctor?.name}{" "}
            <span className="text-xs text-gray-500">
              ({appt.doctor?.specialization})
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {s} → {e}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge color={color[appt.status] || "gray"}>{appt.status}</Badge>
          <Link
            className="text-blue-600 text-sm hover:underline"
            to={`/appointments/${appt.appointmentId}`}
          >
            View
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
