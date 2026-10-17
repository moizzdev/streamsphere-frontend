import React from "react";
import { Users, User } from "lucide-react";
import { CONTACTS } from "../../../data/mockData";

export function StatusDot({ status }) {
  if (status === "live") {
    return (
      <span style={{ position: "absolute", bottom: -2, right: -2, background: "#0A0B10", borderRadius: 999, padding: 2 }}>
        <span className="live-pulse" style={{ display: "block", width: 14, height: 14, borderRadius: 999, background: "#FF3D77" }} />
      </span>
    );
  }
  if (status === "online") {
    return (
      <span
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: 12,
          height: 12,
          borderRadius: 999,
          background: "#B4FF39",
          border: "2px solid #0A0B10",
        }}
      />
    );
  }
  return null;
}

/* Default profile avatar — Instagram-style neutral silhouette when no
   photo is set. Groups without a custom photo render a small stacked
   cluster of their first two members' initials instead of a single
   silhouette, so they read as multi-person at a glance.
   BACKEND HOOK: pass a real `conv.avatarUrl` (uploaded photo, or a
   group photo) once you have one — it renders in place automatically. */
export function Avatar({ conv, size = 48, ring = false }) {
  const showRing = ring || conv.status === "live";
  const memberContacts = conv.isGroup && conv.members ? conv.members.map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean) : [];

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        className="avatar-pop"
        style={{
          width: size,
          height: size,
          borderRadius: 999,
          background: conv.isGroup ? `linear-gradient(135deg, ${conv.color?.[0] || "#232634"}, ${conv.color?.[1] || "#232634"})` : "#232634",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: showRing ? `0 0 0 2px #0A0B10, 0 0 0 4px ${conv.color?.[0] || "#7A7F93"}66` : "0 0 0 1px rgba(255,255,255,0.07)",
        }}
      >
        {conv.avatarUrl ? (
          <img src={conv.avatarUrl} alt={conv.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : conv.isGroup ? (
          memberContacts.length >= 2 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, width: "100%", height: "100%" }}>
              {memberContacts.slice(0, 4).map((m, i) => (
                <div key={m.id} style={{ background: "rgba(0,0,0,0.28)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.16, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
                  {m.initials}
                </div>
              ))}
            </div>
          ) : (
            <Users size={size * 0.46} color="#fff" strokeWidth={1.7} />
          )
        ) : (
          <User size={size * 0.56} color="#6E7286" strokeWidth={1.7} fill="#6E7286" />
        )}
      </div>
      {conv.status && !conv.isGroup && <StatusDot status={conv.status} />}
    </div>
  );
}
