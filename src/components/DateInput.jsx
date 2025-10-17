// src/components/DateInput.jsx
export default function DateInput({ value, onChange }) {
    return (
      <input
        type="date"
        className="border rounded px-3 py-2 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  