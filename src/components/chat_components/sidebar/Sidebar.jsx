import React, { useState } from "react";
import { Search, Gamepad2, Pin, BellOff, MoreVertical, UserPlus } from "lucide-react";
import { Avatar } from "../shared/Avatar";
import { MenuRow } from "../shared/MenuRow";
import { NotesBar } from "./NotesBar";

function ConversationItem({ conv, active, onClick, onTogglePin, onToggleMute }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        className="conv-item"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 14px",
          background: active ? "#1C1F2C" : "transparent",
          border: "none",
          borderLeft: active ? "3px solid #B4FF39" : "3px solid transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Avatar conv={conv} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 15, color: "#F5F6FA" }}>{conv.name}</span>
            {conv.pinned && <Pin size={11} color="#FFB020" fill="#FFB020" />}
            {conv.muted && <BellOff size={11} color="#7A7F93" />}
            {conv.status === "live" && (
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  fontWeight: 500,
                  color: "#FF3D77",
                  background: "rgba(255,61,119,0.12)",
                  padding: "1px 5px",
                  borderRadius: 4,
                  letterSpacing: 0.5,
                }}
              >
                LIVE
              </span>
            )}
          </div>
          <p
            style={{
              margin: 0,
              marginTop: 2,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: conv.unread ? "#F5F6FA" : "#7A7F93",
              fontWeight: conv.unread ? 500 : 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {conv.typing ? <span style={{ color: "#B4FF39" }}>typing…</span> : conv.lastMessage}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7A7F93" }}>{conv.time}</span>
          {conv.unread > 0 && (
            <span className="unread-badge" style={{ minWidth: 18, height: 18, borderRadius: 999, background: "#FF3D77", color: "#0A0B10", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
              {conv.unread}
            </span>
          )}
        </div>
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="icon-btn"
          style={{ display: "flex", alignItems: "center", color: "#5C6072", padding: 2 }}
        >
          <MoreVertical size={14} />
        </span>
      </button>

      {menuOpen && (
        <div className="pop-in" style={{ position: "absolute", right: 12, top: "100%", zIndex: 30, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", minWidth: 150, boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          <MenuRow
            icon={<Pin size={13} />}
            label={conv.pinned ? "Unpin chat" : "Pin chat"}
            onClick={() => {
              onTogglePin();
              setMenuOpen(false);
            }}
          />
          <MenuRow
            icon={<BellOff size={13} />}
            label={conv.muted ? "Unmute" : "Mute"}
            onClick={() => {
              onToggleMute();
              setMenuOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

/* BACKEND HOOKS: replace `conversations` + `notes` props with data
   fetched on mount (REST) and kept in sync via websocket/subscription.
   `query` now searches both conversation names AND game/message text
   so it doubles as a lightweight global search. */
export function Sidebar({
  conversations,
  notes,
  myNote,
  activeId,
  onSelect,
  query,
  setQuery,
  onOpenComposer,
  onClearMyNote,
  onTogglePin,
  onToggleMute,
  onOpenNewGroup,
}) {
  const q = query.toLowerCase();
  const filtered = conversations
    .filter((c) => c.name.toLowerCase().includes(q) || c.game?.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const onlineCount = conversations.filter((c) => c.status === "online" || c.status === "live").length;

  return (
    <div style={{ width: 320, flexShrink: 0, background: "#0D0E15", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "18px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Gamepad2 size={20} color="#B4FF39" strokeWidth={2.2} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 19, color: "#F5F6FA", letterSpacing: 0.3 }}>
              PARTY CHAT
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* BACKEND HOOK: derive online count from your presence
                service instead of counting local placeholder data. */}
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: "#7A7F93" }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "#B4FF39" }} />
              {onlineCount} online
            </span>
            <button onClick={onOpenNewGroup} className="icon-btn" title="New group" style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "#1C1F2C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <UserPlus size={13} color="#B4FF39" />
            </button>
          </div>
        </div>
      </div>

      <NotesBar notes={notes} myNote={myNote} onOpenComposer={onOpenComposer} onClearMyNote={onClearMyNote} />

      <div style={{ padding: "12px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C1F2C", borderRadius: 10, padding: "8px 12px" }}>
          <Search size={15} color="#7A7F93" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players, games, messages..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13, width: "100%" }}
          />
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 8 }}>
        {filtered.map((c) => (
          <ConversationItem
            key={c.id}
            conv={c}
            active={c.id === activeId}
            onClick={() => onSelect(c.id)}
            onTogglePin={() => onTogglePin(c.id)}
            onToggleMute={() => onToggleMute(c.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 13, marginTop: 24 }}>No players found</p>
        )}
      </div>
    </div>
  );
}
