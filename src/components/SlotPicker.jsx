import { fmt } from "../api/time";
export default function SlotPicker({ slots = [], selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {slots.map((s) => {
        const label = `${fmt(s.start)} - ${fmt(s.end)}`;
        const disabled = !s.available;
        const isSel =
          selected && selected.start === s.start && selected.end === s.end;
        return (
          <button
            key={s.start}
            disabled={disabled}
            onClick={() => onSelect(s)}
            className={[
              "px-3 py-2 rounded-lg text-sm border transition",
              disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-blue-50",
              isSel ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
