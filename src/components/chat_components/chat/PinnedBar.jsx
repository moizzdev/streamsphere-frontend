import React from "react";
import { Pin, X, Search } from "lucide-react";

/* Pinned-messages strip. BACKEND HOOK: persist pin/unpin server-side
   so pinned state survives reloads and syncs across devices/members. */
export function PinnedBar({ message, onJump, onUnpin }) {
  if (!message) return null;
  return (
    <div className="pop-in-top" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 20px", background: "rgba(255,176,32,0.08)", borderBottom: "1px solid rgba(255,176,32,0.18)", cursor: "pointer" }} onClick={onJump}>
      <Pin size={13} color="#FFB020" fill="#FFB020" style={{ flexShrink: 0 }} />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#F5F6FA", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        <span style={{ color: "#FFB020", fontWeight: 600 }}>Pinned · </span>
        {message.text || "Attachment"}
      </span>
      <X
        size={14}
        color="#7A7F93"
        className="icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          onUnpin();
        }}
      />
    </div>
  );
}

/* In-chat search: filters the active conversation's messages and
   lets the user jump + auto-highlight a hit. Purely client-side over
   already-loaded messages — for full history search, replace the
   filter in StreamChatApp with a call to your backend search endpoint. */
export function SearchBar({ query, setQuery, results, onJump, onClose }) {
  return (
    <div className="pop-in-top" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", background: "#101219", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <Search size={15} color="#7A7F93" />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search in this chat..."
        style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13 }}
      />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7A7F93" }}>{query ? `${results.length} found` : ""}</span>
      <X size={16} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={onClose} />
    </div>
  );
}
