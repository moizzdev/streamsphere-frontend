import React, { useState } from "react";
import { X, Search, Check, Users } from "lucide-react";
import { CONTACTS, GROUP_COLOR_PRESETS } from "../../../data/mockData";
import { Avatar } from "../shared/Avatar";

/* Group-creation modal: pick 2+ members, name the group, pick an
   accent color. BACKEND HOOK: onCreate should POST /groups
   { name, memberIds } and use the server-assigned conversation id
   instead of the local one generated in StreamChatApp. */
export function NewGroupModal({ onClose, onCreate }) {
  const [step, setStep] = useState("members"); // "members" | "details"
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("");
  const [color, setColor] = useState(GROUP_COLOR_PRESETS[0]);

  const filtered = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canContinue = selected.length >= 2;
  const canCreate = name.trim().length > 0;

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,11,16,0.72)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bubble-in" style={{ width: 360, maxHeight: "80vh", display: "flex", flexDirection: "column", background: "#14161F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: "#F5F6FA", display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={16} color="#B4FF39" />
            {step === "members" ? "New group" : "Name your group"}
          </span>
          <X size={16} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={onClose} />
        </div>

        {step === "members" ? (
          <>
            <div style={{ padding: "12px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C1F2C", borderRadius: 10, padding: "8px 12px" }}>
                <Search size={14} color="#7A7F93" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search players..."
                  style={{ background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13, width: "100%" }}
                />
              </div>
              {selected.length > 0 && (
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7A7F93", marginTop: 8 }}>{selected.length} selected · min 2</div>
              )}
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
                    <Avatar conv={c} size={38} />
                    <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13.5, color: "#F5F6FA" }}>{c.name}</span>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 999,
                        border: isSelected ? "none" : "1px solid #3A3D4A",
                        background: isSelected ? "#B4FF39" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <Check size={11} color="#0A0B10" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && <p style={{ textAlign: "center", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 12.5, marginTop: 20 }}>No players found</p>}
            </div>

            <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                disabled={!canContinue}
                onClick={() => setStep("details")}
                className="icon-btn"
                style={{ width: "100%", padding: "10px 0", borderRadius: 10, border: "none", background: canContinue ? "#B4FF39" : "#2A2D3A", color: canContinue ? "#0A0B10" : "#5C6072", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.4, cursor: canContinue ? "pointer" : "not-allowed" }}
              >
                CONTINUE
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 999, background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={28} color="#fff" />
                </div>
              </div>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group name"
                style={{ background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none" }}
              />
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7A7F93", marginBottom: 8 }}>ACCENT COLOR</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {GROUP_COLOR_PRESETS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setColor(c)}
                      className="icon-btn"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        border: color === c ? "2px solid #F5F6FA" : "2px solid transparent",
                        background: `linear-gradient(135deg, ${c[0]}, ${c[1]})`,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072" }}>
                {selected.length} members · {CONTACTS.filter((c) => selected.includes(c.id)).map((c) => c.name).join(", ")}
              </div>
            </div>
            <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
              <button onClick={() => setStep("members")} className="icon-btn" style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#F5F6FA", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                BACK
              </button>
              <button
                disabled={!canCreate}
                onClick={() => canCreate && onCreate({ name: name.trim(), memberIds: selected, color })}
                className="icon-btn"
                style={{ flex: 2, padding: "10px 0", borderRadius: 10, border: "none", background: canCreate ? "#B4FF39" : "#2A2D3A", color: canCreate ? "#0A0B10" : "#5C6072", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: 0.4, cursor: canCreate ? "pointer" : "not-allowed" }}
              >
                CREATE GROUP
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
