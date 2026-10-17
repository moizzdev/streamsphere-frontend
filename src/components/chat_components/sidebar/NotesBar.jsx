import React, { useState } from "react";
import { Plus, Pencil, X, User } from "lucide-react";
import { Avatar } from "../shared/Avatar";

/* Instagram-style "Notes" strip above the conversation list.
   BACKEND HOOKS: fetch active notes for the signed-in user's friends,
   and POST/DELETE the signed-in user's own note when the composer
   below is used (see onPost/onClear wired from StreamChatApp). */
export function NotesBar({ notes, myNote, onOpenComposer, onClearMyNote }) {
  return (
    <div className="notes-scroll" style={{ display: "flex", gap: 16, padding: "14px 16px 16px", overflowX: "auto", overflowY: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {myNote ? (
          <div className="note-hover pop-in" style={{ position: "relative", cursor: "pointer" }} onClick={onOpenComposer}>
            <div className="note-tooltip">{myNote}</div>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: "#232634",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 2px #0A0B10, 0 0 0 4px rgba(180,255,57,0.5)",
              }}
            >
              <User size={26} color="#B4FF39" strokeWidth={1.7} fill="#B4FF39" />
            </div>
            <span
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 17,
                height: 17,
                borderRadius: 999,
                background: "#B4FF39",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #0A0B10",
              }}
            >
              <Pencil size={8} color="#0A0B10" strokeWidth={2.4} />
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClearMyNote();
              }}
              className="icon-btn"
              style={{
                position: "absolute",
                top: -5,
                right: -5,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "#1C1F2C",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={9} color="#7A7F93" />
            </span>
          </div>
        ) : (
          <button
            onClick={onOpenComposer}
            className="icon-btn"
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "1px dashed #3A3D4A",
              background: "#14161F",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Plus size={18} color="#7A7F93" />
          </button>
        )}
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#7A7F93" }}>Your note</span>
      </div>

      {notes.map((n) => (
        <div key={n.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}>
          <div style={{ position: "relative" }} className="note-hover">
            <div className="note-tooltip">
              {n.note}
              <span
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: "5px solid #1C1F2C",
                }}
              />
            </div>
            <Avatar conv={n} size={48} ring />
          </div>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 10,
              color: "#7A7F93",
              maxWidth: 56,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {n.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* Modal for posting/editing the signed-in user's own note (the
   Instagram-style "what's happening right now" bubble). Frontend-only
   here — see BACKEND HOOK in StreamChatApp's handlePostNote for where
   this plugs into your API. */
export function NoteComposer({ onClose, onSubmit, initialText = "" }) {
  const [text, setText] = useState(initialText);
  const max = 60;

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,11,16,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bubble-in" style={{ width: 300, background: "#14161F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 20, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: "#F5F6FA" }}>Share a note</span>
          <X size={16} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>
        <textarea
          autoFocus
          value={text}
          maxLength={max}
          onChange={(e) => setText(e.target.value)}
          placeholder="queueing ranked, brb boss fight…"
          style={{ width: "100%", minHeight: 72, resize: "none", background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10, color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13, outline: "none" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072" }}>
            {text.length}/{max} · visible 24h
          </span>
          <button
            disabled={!text.trim()}
            onClick={() => {
              onSubmit(text.trim());
              onClose();
            }}
            className="icon-btn"
            style={{
              padding: "7px 18px",
              borderRadius: 999,
              border: "none",
              background: text.trim() ? "#B4FF39" : "#2A2D3A",
              color: text.trim() ? "#0A0B10" : "#5C6072",
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 0.4,
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
}
