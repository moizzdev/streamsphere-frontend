import React, { useState } from "react";
import { Smile, Reply, Pin, Copy, Pencil, Trash2, Check, CheckCheck, Forward } from "lucide-react";
import { REACTION_SET, CONTACTS } from "../../../data/mockData";
import { MediaGrid, FileAttachmentsList, VoiceNoteBubble } from "./Attachments";

export function ReactionChips({ reactions, onReact }) {
  const entries = Object.entries(reactions || {}).filter(([, c]) => c > 0);
  if (entries.length === 0) return null;
  return (
    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
      {entries.map(([emoji, count]) => (
        <button
          key={emoji}
          onClick={() => onReact(emoji)}
          className="reaction-chip"
          style={{ display: "flex", alignItems: "center", gap: 4, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 999, padding: "2px 7px", cursor: "pointer", fontSize: 11.5, color: "#F5F6FA", fontFamily: "'Inter', sans-serif" }}
        >
          <span>{emoji}</span>
          <span style={{ color: "#7A7F93", fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{count}</span>
        </button>
      ))}
    </div>
  );
}

function ActionIcon({ icon, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="icon-btn"
      style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", borderRadius: 6, cursor: "pointer", color: danger ? "#FF4D4D" : "#C9CCDA" }}
    >
      {icon}
    </button>
  );
}

/* Floating quick-reaction + action bar that appears on hover/tap. */
function MessageHoverActions({ onReply, onCopy, onPin, onEdit, onDelete, onReact, onForward, mine, visible }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  if (!visible) return null;
  return (
    <div className="msg-actions pop-in" style={{ position: "absolute", top: -34, [mine ? "right" : "left"]: 0, display: "flex", alignItems: "center", gap: 2, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 4, boxShadow: "0 8px 20px rgba(0,0,0,0.4)", zIndex: 20 }}>
      <div style={{ position: "relative" }}>
        <ActionIcon icon={<Smile size={14} />} onClick={() => setPickerOpen((v) => !v)} title="React" />
        {pickerOpen && (
          <div className="pop-in" style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, display: "flex", gap: 3, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 5, boxShadow: "0 8px 20px rgba(0,0,0,0.4)" }}>
            {REACTION_SET.map((e) => (
              <span
                key={e}
                onClick={() => {
                  onReact(e);
                  setPickerOpen(false);
                }}
                style={{ cursor: "pointer", fontSize: 15, padding: 2 }}
                className="emoji-pop"
              >
                {e}
              </span>
            ))}
          </div>
        )}
      </div>
      <ActionIcon icon={<Reply size={14} />} onClick={onReply} title="Reply" />
      <ActionIcon icon={<Forward size={14} />} onClick={onForward} title="Forward" />
      <ActionIcon icon={<Pin size={14} />} onClick={onPin} title="Pin" />
      <ActionIcon icon={<Copy size={14} />} onClick={onCopy} title="Copy" />
      {mine && <ActionIcon icon={<Pencil size={14} />} onClick={onEdit} title="Edit" />}
      {mine && <ActionIcon icon={<Trash2 size={14} />} onClick={onDelete} title="Delete" danger />}
    </div>
  );
}

function StatusTicks({ status }) {
  // BACKEND HOOK: drive this from real delivery/read receipts pushed
  // over your socket connection (sent -> delivered -> read).
  if (status === "read") return <CheckCheck size={13} color="#B4FF39" />;
  if (status === "delivered") return <CheckCheck size={13} color="#7A7F93" />;
  return <Check size={13} color="#7A7F93" />;
}

export function MessageBubble({
  msg,
  mine,
  isGroup,
  showSenderLabel,
  onReply,
  onPin,
  onDelete,
  onEdit,
  onReact,
  onForward,
  onOpenLightbox,
  highlight,
  isPinned,
  editingId,
  setEditingId,
  onSaveEdit,
}) {
  const [hovered, setHovered] = useState(false);
  const isEditing = editingId === msg.id;
  const [draft, setDraft] = useState(msg.text);
  const sender = !mine && isGroup ? CONTACTS.find((c) => c.id === msg.sender) : null;

  const copyText = () => {
    // BACKEND HOOK: none needed — pure clipboard write.
    if (navigator.clipboard) navigator.clipboard.writeText(msg.text || "");
  };

  const mediaItems = (msg.attachments || []).filter((a) => a.type === "image" || a.type === "video");

  return (
    <div
      id={`msg-${msg.id}`}
      style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 10, position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ maxWidth: "68%", position: "relative" }} className="bubble-in">
        <MessageHoverActions
          visible={hovered && !isEditing}
          mine={mine}
          onReply={() => onReply(msg)}
          onCopy={copyText}
          onPin={() => onPin(msg)}
          onEdit={() => setEditingId(msg.id)}
          onDelete={() => onDelete(msg.id)}
          onReact={(emoji) => onReact(msg.id, emoji)}
          onForward={() => onForward(msg)}
        />

        {showSenderLabel && sender && (
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 11.5, color: sender.color?.[0] || "#B4FF39", marginBottom: 2, paddingInline: 4 }}>{sender.name}</div>
        )}

        {msg.replyTo && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, padding: "5px 10px", borderLeft: "2px solid #7C3AED", background: "rgba(124,58,237,0.08)", borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#B7B9C8" }}>
            <Reply size={11} color="#7C3AED" />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.replyTo.text}</span>
          </div>
        )}

        {msg.attachments?.some((a) => a.type === "voice") &&
          msg.attachments
            .filter((a) => a.type === "voice")
            .map((a, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <VoiceNoteBubble attachment={a} mine={mine} />
              </div>
            ))}

        <MediaGrid attachments={msg.attachments} onOpen={(idx) => onOpenLightbox(mediaItems, idx)} />
        <FileAttachmentsList attachments={msg.attachments} />

        {isEditing ? (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSaveEdit(msg.id, draft);
                  setEditingId(null);
                }
                if (e.key === "Escape") setEditingId(null);
              }}
              style={{ flex: 1, background: "#1C1F2C", border: "1px solid #7C3AED", borderRadius: 10, padding: "8px 12px", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 14, outline: "none" }}
            />
            <button
              className="icon-btn"
              onClick={() => {
                onSaveEdit(msg.id, draft);
                setEditingId(null);
              }}
              style={{ background: "#B4FF39", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            >
              <Check size={14} color="#0A0B10" />
            </button>
          </div>
        ) : (
          msg.text && (
            <div
              style={{
                padding: "9px 14px",
                borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: mine ? "linear-gradient(135deg, #7C3AED, #FF3D77)" : "#1C1F2C",
                color: "#F5F6FA",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                lineHeight: 1.4,
                wordBreak: "break-word",
                outline: highlight ? "2px solid #B4FF39" : isPinned ? "1px solid rgba(255,176,32,0.5)" : "none",
                outlineOffset: 2,
              }}
            >
              {msg.forwardedFrom && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10.5, opacity: 0.75, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                  <Forward size={10} /> Forwarded
                </div>
              )}
              {msg.text}
              {msg.edited && <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 6 }}>(edited)</span>}
            </div>
          )
        )}

        <ReactionChips reactions={msg.reactions} onReact={(emoji) => onReact(msg.id, emoji)} />

        <span style={{ display: "flex", gap: 5, alignItems: "center", marginTop: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", justifyContent: mine ? "flex-end" : "flex-start", paddingInline: 4 }}>
          {isPinned && <Pin size={9} color="#FFB020" fill="#FFB020" />}
          {msg.time}
          {mine && <StatusTicks status={msg.status} />}
        </span>
      </div>
    </div>
  );
}
