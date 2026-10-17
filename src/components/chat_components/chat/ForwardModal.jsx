import React, { useState } from "react";
import { X, Forward, Check, Search } from "lucide-react";
import { Avatar } from "../shared/Avatar";

/* Pick one or more conversations to forward a message into.
   BACKEND HOOK: onConfirm should call your "send message" API once
   per target conversation with the same text/attachments payload and
   a `forwardedFrom` marker — StreamChatApp's handleForward already
   does this against local state as a stand-in. */
export function ForwardModal({ message, conversations, onClose, onConfirm }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);

  const filtered = conversations.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,11,16,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bubble-in" style={{ width: 340, maxHeight: "78vh", display: "flex", flexDirection: "column", background: "#14161F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, color: "#F5F6FA", display: "flex", alignItems: "center", gap: 8 }}>
            <Forward size={15} color="#B4FF39" /> Forward message
          </span>
          <X size={16} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        <div style={{ padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#7A7F93", background: "#1C1F2C", borderRadius: 8, padding: "7px 10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {message?.text || "Attachment"}
          </div>
        </div>

        <div style={{ padding: "12px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C1F2C", borderRadius: 10, padding: "8px 12px" }}>
            <Search size={14} color="#7A7F93" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats..." style={{ background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13, width: "100%" }} />
          </div>
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "0 10px 10px" }}>
          {filtered.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className="conv-item"
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", textAlign: "left" }}
              >
                <Avatar conv={c} size={36} />
                <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#F5F6FA" }}>{c.name}</span>
                <span style={{ width: 18, height: 18, borderRadius: 999, border: isSelected ? "none" : "1px solid #3A3D4A", background: isSelected ? "#B4FF39" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {isSelected && <Check size={11} color="#0A0B10" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            disabled={selected.length === 0}
            onClick={() => onConfirm(selected)}
            className="icon-btn"
            style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: selected.length ? "#B4FF39" : "#2A2D3A", color: selected.length ? "#0A0B10" : "#5C6072", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.4, cursor: selected.length ? "pointer" : "not-allowed" }}
          >
            {selected.length ? `SEND TO ${selected.length}` : "SELECT A CHAT"}
          </button>
        </div>
      </div>
    </div>
  );
}
