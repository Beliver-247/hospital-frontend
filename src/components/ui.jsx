// components/ui.jsx
import { useEffect, useState } from "react";

export function Card({ className = "", children }) {
  return (
    <div
      className={[
        "bg-white rounded-2xl shadow-sm border border-gray-200",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="px-4 py-3 border-b flex items-center justify-between">
      <div>
        <div className="font-medium">{title}</div>
        {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
export function CardBody({ className = "", children }) {
  return <div className={["p-4", className].join(" ")}>{children}</div>;
}

export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "bg-gray-100 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={[base, styles[variant], className].join(" ")}
      {...props}
    />
  );
}

export function Badge({ color = "gray", children }) {
  const map = {
    gray: "bg-gray-100 text-gray-800",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex text-xs px-2 py-1 rounded ${map[color]}`}>
      {children}
    </span>
  );
}
export function Stepper({ step }) {
  const items = [
    "Select Specialization",
    "Choose Doctor & Time",
    "Add Notes & Confirm",
    "Confirmation",
  ];
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {items.map((label, i) => {
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
            {i < items.length - 1 && (
              <div className="w-6 sm:w-12 h-px bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[min(640px,92vw)] rounded-2xl shadow-xl border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// very small toast system for pages
export function useToast() {
  const [toasts, setToasts] = useState([]);
  function push(type, message) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }
  function Toasts() {
    return (
      <div className="fixed bottom-4 right-4 space-y-2 z-[110]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "px-4 py-2 rounded-lg shadow text-sm border",
              t.type === "error"
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-green-50 text-green-800 border-green-200",
            ].join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>
    );
  }
  return { push, Toasts };
}
