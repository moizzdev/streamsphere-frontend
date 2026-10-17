import React from "react";
import { ChevronLeft, Search, Phone, Video, Info, Radio, Swords } from "lucide-react";
import { Avatar } from "../shared/Avatar";

export function ChatHeader({ conv, onBack, onStartCall, onOpenSearch, onOpenInfo, searchOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#101219", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <button onClick={onBack} className="mobile-back icon-btn" style={{ display: "none", background: "none", border: "none", color: "#F5F6FA", cursor: "pointer" }}>
          <ChevronLeft size={20} />
        </button>
        <Avatar conv={conv} size={40} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 16, color: "#F5F6FA" }}>{conv.name}</span>
            {conv.status === "live" && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#FF3D77", background: "rgba(255,61,119,0.12)", padding: "2px 6px", borderRadius: 4 }}>
                <Radio size={10} /> LIVE · {conv.viewers}
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: conv.typing ? "#B4FF39" : "#7A7F93", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {conv.typing ? (
              conv.isGroup ? `${conv.typingLabel || "someone"} is typing…` : "typing…"
            ) : (
              <>
                <Swords size={10} style={{ verticalAlign: "-1px", marginRight: 4 }} />
                {conv.game} · {conv.status === "offline" ? conv.lastAt : conv.status}
                {conv.isGroup ? ` · ${conv.members?.length || conv.memberCount} members` : ""}
              </>
            )}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, color: "#7A7F93", alignItems: "center", flexShrink: 0 }}>
        <Search size={18} className="icon-btn" style={{ cursor: "pointer", color: searchOpen ? "#B4FF39" : "#7A7F93" }} onClick={onOpenSearch} />
        {/* BACKEND HOOKS: onStartCall("audio"/"video") should invoke your
            WebRTC / calling SDK (e.g. Twilio, Agora, LiveKit) to open a
            room scoped to this conversation id (all members for groups). */}
        <Phone size={18} className="icon-btn" style={{ cursor: "pointer" }} onClick={() => onStartCall("audio")} />
        <Video size={18} className="icon-btn" style={{ cursor: "pointer" }} onClick={() => onStartCall("video")} />
        <Info size={18} className="icon-btn" style={{ cursor: "pointer" }} onClick={onOpenInfo} />
      </div>
    </div>
  );
}
