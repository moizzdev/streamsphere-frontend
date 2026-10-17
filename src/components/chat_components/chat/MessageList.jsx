import React from "react";
import { Trophy, Gamepad2, ChevronDown } from "lucide-react";

/* Purely presentational — drive visibility with an `isTyping` prop
   sourced from a websocket "user is typing" event on your backend. */
export function TypingIndicator() {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 10 }} className="bubble-in">
      <div style={{ display: "flex", gap: 4, padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "#1C1F2C" }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "#7A7F93", animation: `typingDot 1.2s ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export function DayDivider({ label = "SQUAD UP · TODAY" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0 16px" }}>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#4A4E5C" }}>
        <Trophy size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

export function EmptyState() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#4A4E5C" }} className="bubble-in">
      <Gamepad2 size={40} strokeWidth={1.4} />
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15 }}>Select a chat to start playing</span>
    </div>
  );
}

export function ScrollToBottomButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <button onClick={onClick} className="pop-in icon-btn" style={{ position: "absolute", bottom: 90, right: 24, width: 36, height: 36, borderRadius: 999, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
      <ChevronDown size={18} color="#F5F6FA" />
    </button>
  );
}

/* Drag-and-drop overlay shown across the message list while the user
   is dragging files over the chat window. Purely visual — the actual
   drop handling lives in StreamChatApp so dropped files can be routed
   straight into the composer's attachment queue. */
export function DropOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div
      className="pop-in"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 15,
        background: "rgba(180,255,57,0.08)",
        border: "2px dashed #B4FF39",
        borderRadius: 12,
        margin: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: "#B4FF39" }}>Drop to send</span>
    </div>
  );
}
