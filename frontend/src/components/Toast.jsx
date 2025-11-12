import React from "react";

export default function Toast({ show, message, type = "success", onClose }) {
  if (!show) return null;

  // Choose background color based on toast type
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error" || type === "danger"
      ? "bg-red-600"
      : type === "warning"
      ? "bg-yellow-500"
      : "bg-blue-600";

  return (
    <div
      className={`${bgColor} fixed bottom-6 right-6 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-4 transition-all duration-300`}
      role="alert"
    >
      <span className="font-medium">{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white text-lg leading-none"
      >
        ✕
      </button>
    </div>
  );
}
