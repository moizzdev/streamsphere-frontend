import React, { useState } from "react";
import { X, BellOff, Pin, Users, UserPlus, UserMinus, LogOut, Pencil, Check, Image as ImageIcon } from "lucide-react";
import { Avatar } from "../shared/Avatar";
import { MenuRow } from "../shared/MenuRow";
import { CONTACTS } from "../../../data/mockData";
import { AddMembersModal } from "./AddMembersModal";

/* Right-hand slide-over with shared media / pinned / mute toggle, and
   (for groups) full member management: view members, add, remove,
   rename the group, and leave.
   BACKEND HOOK: populate `sharedMedia` from a query for attachments
   scoped to this conversation. */
export function InfoPanel({ conv, onClose, pinnedMessages, sharedMedia, onTogglePin, onToggleMute, onRenameGroup, onAddMembers, onRemoveMember, onLeaveGroup }) {
  const [addOpen, setAddOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(conv.name);

  const memberContacts = conv.isGroup ? (conv.members || []).map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean) : [];

  return (
    <div className="slide-in-right" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 300, background: "#101219", borderLeft: "1px solid rgba(255,255,255,0.06)", zIndex: 40, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, color: "#F5F6FA" }}>{conv.isGroup ? "Group info" : "Chat info"}</span>
        <X size={16} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={onClose} />
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "22px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Avatar conv={conv} size={72} />
          {renaming ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "0 20px", width: "100%" }}>
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && nameDraft.trim() && (onRenameGroup(nameDraft.trim()), setRenaming(false))}
                style={{ flex: 1, background: "#1C1F2C", border: "1px solid #7C3AED", borderRadius: 8, padding: "6px 10px", color: "#F5F6FA", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, outline: "none", textAlign: "center" }}
              />
              <button
                className="icon-btn"
                onClick={() => {
                  if (nameDraft.trim()) onRenameGroup(nameDraft.trim());
                  setRenaming(false);
                }}
                style={{ background: "#B4FF39", border: "none", borderRadius: 8, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                <Check size={13} color="#0A0B10" />
              </button>
            </div>
          ) : (
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 17, color: "#F5F6FA", display: "flex", alignItems: "center", gap: 6 }}>
              {conv.name}
              {conv.isGroup && <Pencil size={12} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={() => setRenaming(true)} />}
            </span>
          )}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7A7F93" }}>{conv.isGroup ? `${memberContacts.length} members` : conv.game}</span>
        </div>

        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <MenuRow icon={<BellOff size={13} />} label={conv.muted ? "Unmute notifications" : "Mute notifications"} onClick={() => onToggleMute(conv.id)} />
          <MenuRow icon={<Pin size={13} />} label={conv.pinned ? "Unpin chat" : "Pin chat"} onClick={() => onTogglePin(conv.id)} />
        </div>

        {conv.isGroup && (
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5 }}>
                <Users size={11} /> MEMBERS · {memberContacts.length}
              </span>
              <button onClick={() => setAddOpen(true)} className="icon-btn" style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", background: "#1C1F2C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <UserPlus size={11} color="#B4FF39" />
              </button>
            </div>
            {memberContacts.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 2px" }} className="conv-item">
                <Avatar conv={m} size={30} />
                <span style={{ flex: 1, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#F5F6FA" }}>{m.name}</span>
                <UserMinus size={13} color="#5C6072" className="icon-btn" style={{ cursor: "pointer" }} onClick={() => onRemoveMember(m.id)} title="Remove from group" />
              </div>
            ))}
            <button
              onClick={onLeaveGroup}
              className="icon-btn"
              style={{ width: "100%", marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 0", borderRadius: 8, border: "1px solid rgba(255,77,77,0.25)", background: "rgba(255,77,77,0.08)", color: "#FF4D4D", fontFamily: "'Inter', sans-serif", fontSize: 12.5, cursor: "pointer" }}
            >
              <LogOut size={13} /> Leave group
            </button>
          </div>
        )}

        {sharedMedia.length > 0 && (
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", marginBottom: 10, letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 5 }}>
              <ImageIcon size={11} /> SHARED MEDIA · {sharedMedia.length}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
              {sharedMedia.slice(0, 9).map((a, i) => (
                <div key={i} style={{ aspectRatio: "1/1", borderRadius: 6, overflow: "hidden", background: "#1C1F2C" }}>
                  {a.url ? <img src={a.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><ImageIcon size={16} color="#5C6072" /></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ padding: "14px 18px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", marginBottom: 10, letterSpacing: 0.5 }}>
            PINNED MESSAGES · {pinnedMessages.length}
          </div>
          {pinnedMessages.length === 0 && <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#4A4E5C" }}>Nothing pinned yet.</p>}
          {pinnedMessages.map((m) => (
            <div key={m.id} style={{ padding: "8px 10px", background: "#1C1F2C", borderRadius: 8, marginBottom: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#F5F6FA" }}>
              {m.text || "Attachment"}
            </div>
          ))}
        </div>
      </div>

      {addOpen && (
        <AddMembersModal
          currentMemberIds={conv.members || []}
          onClose={() => setAddOpen(false)}
          onConfirm={(ids) => {
            onAddMembers(ids);
            setAddOpen(false);
          }}
        />
      )}
    </div>
  );
}
