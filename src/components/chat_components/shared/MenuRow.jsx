import React from "react";

export function MenuRow({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className="menu-row"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: danger ? "#FF4D4D" : "#F5F6FA",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12.5,
        textAlign: "left",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
