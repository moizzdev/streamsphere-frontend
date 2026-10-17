import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  Search,
  Send,
  ChevronLeft,
  X,
  Image as ImageIcon,
  Mic,
  Play,
  Pause,
  Gamepad2,
  User,
  Check,
  CheckCheck,
  Trash2,
  Smile,
  Square,
  Paperclip,
  Reply,
} from "lucide-react";
import {
  getMyChats,
  getConversation,
  sendMessage as sendMessageThunk,
  markAsRead,
  searchUsers,
  clearConversation,
  reactToMessage,
  deleteMessage,
  getUnreadCounts,
} from '../../features/chatSlice/chatSlice'

/* ---------------------------------------------------------------
   DESIGN TOKENS
   bg-void:  #0A0B10   bg-panel: #14161F   bg-raised: #1C1F2C
   neon:     #B4FF39   pink:     #FF3D77   text hi:  #F5F6FA
   text mut: #7A7F93
----------------------------------------------------------------*/
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
`;

const QUICK_REACTIONS = ["❤️", "😂", "🔥", "👏", "😮", "😢"];

const COLOR_PAIRS = [
  ["#FF3D77", "#7C3AED"],
  ["#B4FF39", "#1FB2A6"],
  ["#FFB020", "#FF3D77"],
  ["#7C3AED", "#B4FF39"],
];

function colorFor(id) {
  if (!id) return COLOR_PAIRS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
}

function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function mapChatToConversation(entry, unreadCounts) {
  const u = entry.user;
  return {
    id: u.id,
    name: u.name,
    unread: unreadCounts?.[u.id] || 0,
    lastMessage: entry.lastMessage?.text || (entry.lastMessage?.attachmentType ? "Attachment" : ""),
    time: formatTime(entry.lastMessage?.createdAt),
    color: colorFor(u.id),
    avatarUrl: u.avatar,
  };
}

function mapUserToConversation(u) {
  return {
    id: u.id,
    name: u.name,
    unread: 0,
    lastMessage: "",
    time: "",
    color: colorFor(u.id),
    avatarUrl: u.avatar,
  };
}

// Unwraps reactions no matter how many times it got JSON-stringified
// on the way in — defends against a JSON column being double-encoded
// by mistake somewhere in the backend save path.
function parseReactions(raw) {
  let value = raw;
  for (let i = 0; i < 5; i++) {
    if (value == null) return {};
    if (typeof value === "object") return value;
    try {
      value = JSON.parse(value);
    } catch {
      return {};
    }
  }
  return typeof value === "object" ? value : {};
}

function mapChatMessage(msg, myId) {
  return {
    id: msg.id,
    senderId: msg.senderId,
    sender: msg.senderId === myId ? "me" : "them",
    text: msg.text,
    time: formatTime(msg.createdAt),
    createdAt: msg.createdAt,
    isRead: msg.isRead,
    reactions: parseReactions(msg.reactions),
    attachmentType: msg.attachmentType,
    attachmentUrl: msg.attachmentUrl,
  };
}

/* ------------------------------------------------------------------
   PRESENTATIONAL PIECES
------------------------------------------------------------------- */
function Avatar({ conv, size = 48 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: "#232634",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
      }}
    >
      {conv.avatarUrl ? (
        <img src={conv.avatarUrl} alt={conv.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <User size={size * 0.56} color="#6E7286" strokeWidth={1.7} fill="#6E7286" />
      )}
    </div>
  );
}

function ConversationItem({ conv, active, onClick }) {
  const hasUnread = conv.unread > 0;
  return (
    <button
      onClick={onClick}
      className="conv-item"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: active ? "#1C1F2C" : hasUnread ? "rgba(180,255,57,0.05)" : "transparent",
        border: "none",
        borderLeft: active ? "3px solid #B4FF39" : hasUnread ? "3px solid rgba(180,255,57,0.45)" : "3px solid transparent",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Avatar conv={conv} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: hasUnread ? 700 : 600, fontSize: 15, color: "#F5F6FA" }}>{conv.name}</span>
        <p
          style={{
            margin: 0,
            marginTop: 2,
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: hasUnread ? "#F5F6FA" : "#7A7F93",
            fontWeight: hasUnread ? 600 : 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {conv.lastMessage}
        </p>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7A7F93", flexShrink: 0 }}>{conv.time}</span>
      {hasUnread && (
        <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: "#FF3D77", color: "#0A0B10", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", flexShrink: 0 }}>
          {conv.unread}
        </span>
      )}
    </button>
  );
}

function Sidebar({ conversations, activeId, onSelect, query, setQuery, loading, searchResults, searchLoading, onStartChat }) {
  const filtered = conversations.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
  const isSearching = query.trim().length > 0;
  const existingIds = new Set(conversations.map((c) => c.id));
  const newPeople = (searchResults || []).filter((u) => !existingIds.has(u.id));

  return (
    <div style={{ width: 320, flexShrink: 0, background: "#0D0E15", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 19, color: "#F5F6FA", letterSpacing: 0.3 }}>Messages</span>
      </div>

      <div style={{ padding: "0 18px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C1F2C", borderRadius: 10, padding: "8px 12px" }}>
          <Search size={15} color="#7A7F93" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players to chat..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 13, width: "100%" }}
          />
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1, paddingBottom: 8 }}>
        {isSearching && (
          <>
            <div style={{ padding: "6px 18px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", letterSpacing: 0.5 }}>
              PLAYERS
            </div>
            {searchLoading && <p style={{ textAlign: "center", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 13, margin: "8px 0" }}>Searching…</p>}
            {!searchLoading && newPeople.length === 0 && (
              <p style={{ padding: "0 18px", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 12.5, marginBottom: 10 }}>No new players found</p>
            )}
            {newPeople.map((u) => (
              <ConversationItem key={u.id} conv={mapUserToConversation(u)} active={u.id === activeId} onClick={() => onStartChat(u)} />
            ))}
            {filtered.length > 0 && (
              <div style={{ padding: "10px 18px 6px", fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", letterSpacing: 0.5, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 6 }}>
                YOUR CHATS
              </div>
            )}
          </>
        )}

        {loading && filtered.length === 0 && !isSearching && (
          <p style={{ textAlign: "center", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 13, marginTop: 24 }}>Loading chats…</p>
        )}
        {filtered.map((c) => (
          <ConversationItem key={c.id} conv={c} active={c.id === activeId} onClick={() => onSelect(c.id)} />
        ))}
        {!loading && !isSearching && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "#4A4E5C", fontFamily: "'Inter', sans-serif", fontSize: 13, marginTop: 24 }}>
            No chats yet — search a player's name above to start one.
          </p>
        )}
      </div>
    </div>
  );
}

function ChatHeader({ conv, onBack, onViewProfile }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#101219", flexShrink: 0 }}>
      <button onClick={onBack} className="mobile-back" style={{ display: "none", background: "none", border: "none", color: "#F5F6FA", cursor: "pointer" }}>
        <ChevronLeft size={20} />
      </button>
      <div
        onClick={() => onViewProfile(conv.id)}
        style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
      >
        <Avatar conv={conv} size={40} />
        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 16, color: "#F5F6FA" }}>{conv.name}</span>
      </div>
    </div>
  );
}

function VoiceNoteBubble({ url, mine }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnded = () => { setPlaying(false); setProgress(0); };
    const onLoaded = () => { if (isFinite(audio.duration)) setDuration(audio.duration); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoaded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  };

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(Math.floor(duration % 60)).padStart(2, "0");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: mine ? "rgba(0,0,0,0.18)" : "#1C1F2C", borderRadius: 14, padding: "9px 12px", minWidth: 190, marginBottom: 6 }}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <button
        onClick={toggle}
        style={{ width: 30, height: 30, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
      >
        {playing ? <Pause size={13} color="#0A0B10" /> : <Play size={13} color="#0A0B10" style={{ marginLeft: 1 }} />}
      </button>
      <div style={{ flex: 1, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: "#B4FF39" }} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: mine ? "#F5F6FA" : "#7A7F93", flexShrink: 0 }}>{mm}:{ss}</span>
    </div>
  );
}

function StatusTicks({ isRead }) {
  if (isRead) return <CheckCheck size={13} color="#B4FF39" />;
  return <Check size={13} color="#7A7F93" />;
}

/* Instagram-style reaction badge — sits overlapping the bottom corner
   of the bubble rather than as a separate row below it. */
function ReactionBadge({ reactions, mine }) {
  const entries = Object.entries(reactions || {});
  if (entries.length === 0) return null;

  const counts = {};
  entries.forEach(([, emoji]) => { counts[emoji] = (counts[emoji] || 0) + 1; });
  const emojiList = Object.entries(counts);

  return (
    <div
      style={{
        position: "absolute",
        bottom: -10,
        [mine ? "left" : "right"]: -6,
        display: "flex",
        gap: 2,
        background: "#14161F",
        border: "1.5px solid #0A0B10",
        borderRadius: 999,
        padding: "2px 5px",
        zIndex: 3,
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}
    >
      {emojiList.map(([emoji, count]) => (
        <span key={emoji} style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 2 }}>
          {emoji}
          {count > 1 && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#7A7F93" }}>{count}</span>}
        </span>
      ))}
    </div>
  );
}

function MessageBubble({ msg, mine, onReact, onUnsend, onReply }) {
  const [hovered, setHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  const dragStartX = useRef(null);
  const isDragging = useRef(false);

  const handleReactClick = (emoji) => {
    onReact(msg.id, emoji);
    setPickerOpen(false);
  };

  const isReply = msg.text?.startsWith("↳ ") && msg.text.includes("\n");
  const quotedLine = isReply ? msg.text.split("\n")[0].replace("↳ ", "") : null;
  const actualText = isReply ? msg.text.split("\n").slice(1).join("\n") : msg.text;

  const SWIPE_THRESHOLD = 60;
  
  const handleDragStart = (clientX) => {
    dragStartX.current = clientX;
    isDragging.current = true;
  };
  
  const handleDragMove = (clientX) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const delta = clientX - dragStartX.current;
    // Only allow swiping in the "natural" reply direction per bubble
    // side — pulling your own message left, or their message right —
    // same as Instagram. Clamp so it can't drag forever.
    const allowed = mine ? Math.min(0, delta) : Math.max(0, delta);
    setDragX(Math.max(-90, Math.min(90, allowed)));
  };
  
  const handleDragEnd = () => {
    if (Math.abs(dragX) > SWIPE_THRESHOLD) {
      onReply(msg);
    }
    isDragging.current = false;
    dragStartX.current = null;
    setDragX(0);
  };
  
  return (
    <div
  style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 16, position: "relative" }}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
  onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
  onTouchEnd={handleDragEnd}
>
  {/* Reply icon that fades in behind the bubble as you swipe past it */}
  <div
    style={{
      position: "absolute",
      top: "50%",
      [mine ? "right" : "left"]: 0,
      transform: "translateY(-50%)",
      opacity: Math.min(1, Math.abs(dragX) / 60),
      color: "#7C3AED",
      pointerEvents: "none",
    }}
  >
    <Reply size={18} />
  </div>

  <div
    style={{
      maxWidth: "68%",
      position: "relative",
      transform: `translateX(${dragX}px)`,
      transition: isDragging.current ? "none" : "transform 0.2s ease",
    }}
  >
        {/* Hover toolbar: reply / react / unsend. Does NOT close the
            reaction picker on mouse-leave — only hides itself — so
            moving the cursor up into the picker doesn't close it
            before a click can register. */}
        {hovered && (
          <div style={{ position: "absolute", top: -30, [mine ? "right" : "left"]: 0, display: "flex", gap: 2, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 3, zIndex: 5 }}>
            <button onClick={() => onReply(msg)} title="Reply" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <Reply size={14} color="#C9CCDA" />
            </button>
            <button onClick={() => setPickerOpen((v) => !v)} title="React" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
              <Smile size={14} color="#C9CCDA" />
            </button>
            {mine && (
              <button onClick={() => onUnsend(msg.id)} title="Unsend" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <Trash2 size={14} color="#FF4D4D" />
              </button>
            )}
          </div>
        )}

        {pickerOpen && (
          <div style={{ position: "absolute", top: -60, [mine ? "right" : "left"]: 0, display: "flex", gap: 3, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 5, zIndex: 6 }}>
            {QUICK_REACTIONS.map((emoji) => (
              <span
                key={emoji}
                onClick={() => handleReactClick(emoji)}
                style={{ fontSize: 18, cursor: "pointer", padding: 2, lineHeight: 1 }}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}

        {msg.attachmentType === "voice" && msg.attachmentUrl && (
          <VoiceNoteBubble url={msg.attachmentUrl} mine={mine} />
        )}

        {msg.attachmentType === "image" && msg.attachmentUrl && (
          <img
            src={msg.attachmentUrl}
            alt="attachment"
            style={{ maxWidth: 220, maxHeight: 220, borderRadius: 12, marginBottom: msg.text ? 6 : 0, display: "block", objectFit: "cover" }}
          />
        )}

        {msg.attachmentType === "document" && msg.attachmentUrl && (
          <a
            href={msg.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#1C1F2C", padding: "8px 12px", borderRadius: 10, marginBottom: msg.text ? 6 : 0, color: "#F5F6FA", textDecoration: "none", fontSize: 13 }}
          >
            📄 View document
          </a>
        )}

        {msg.text && (
          <div
            onDoubleClick={() => setPickerOpen((v) => !v)}
            style={{
              padding: "9px 14px",
              borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: mine ? "linear-gradient(135deg, #7C3AED, #FF3D77)" : "#1C1F2C",
              color: "#F5F6FA",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.4,
              wordBreak: "break-word",
              cursor: "pointer",
            }}
          >
            {isReply && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, padding: "5px 8px", background: "rgba(0,0,0,0.18)", borderRadius: 8, borderLeft: "2px solid rgba(255,255,255,0.5)", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
                {quotedLine}
              </div>
            )}
            {actualText}
          </div>
        )}

        <ReactionBadge reactions={msg.reactions} mine={mine} />

        <span style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072", justifyContent: mine ? "flex-end" : "flex-start" }}>
          {msg.time}
          {mine && <StatusTicks isRead={msg.isRead} />}
        </span>
      </div>
    </div>
  );
}

function AttachmentPreviewStrip({ image, onRemoveImage }) {
  if (!image) return null;
  return (
    <div style={{ padding: "10px 18px 0" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={image.previewUrl} alt="preview" style={{ maxWidth: 140, maxHeight: 140, borderRadius: 10, display: "block" }} />
        <X
          size={14}
          color="#F5F6FA"
          onClick={onRemoveImage}
          style={{ position: "absolute", top: -6, right: -6, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: 3, cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

function MessageInput({ onSend, replyingTo, onCancelReply }) {
  const [value, setValue] = useState("");
  const [image, setImage] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState(null);
  const fileInputRef = useRef(null);
  const docInputRef = useRef(null);
  const recordTimerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (recording) {
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordSeconds(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [recording]);

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const submit = () => {
    if (!value.trim() && !image) return;
    onSend({ text: value.trim(), image, replyingTo });
    setValue("");
    setImage(null);
    onCancelReply();
  };

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage({ file, previewUrl: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const handleDocPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onSend({ file });
    e.target.value = "";
  };

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("Voice notes aren't supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = window.MediaRecorder?.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      setMicError("Microphone access denied.");
    }
  };

  const stopRecording = (send) => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) {
      setRecording(false);
      return;
    }

    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (send && chunksRef.current.length && recordSeconds > 0) {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: recorder.mimeType });
        onSend({ file });
      }
      setRecording(false);
    };
    recorder.stop();
  };

  return (
    <div style={{ flexShrink: 0 }}>
      <AttachmentPreviewStrip image={image} onRemoveImage={() => setImage(null)} />

      {replyingTo && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "#14161F", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Reply size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: "#7C3AED", fontFamily: "'JetBrains Mono', monospace" }}>REPLYING TO</div>
            <div style={{ fontSize: 12.5, color: "#F5F6FA", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {replyingTo.text || "Attachment"}
            </div>
          </div>
          <X size={16} color="#7A7F93" style={{ cursor: "pointer" }} onClick={onCancelReply} />
        </div>
      )}

      {micError && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "rgba(255,77,77,0.08)" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#F5F6FA", flex: 1 }}>{micError}</span>
          <X size={13} color="#7A7F93" style={{ cursor: "pointer" }} onClick={() => setMicError(null)} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#101219" }}>
        {recording ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, background: "#1C1F2C", borderRadius: 20, padding: "9px 16px" }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: "#FF4D4D" }} />
            <span style={{ fontFamily: "monospace", fontSize: 13, color: "#F5F6FA" }}>
              {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:{String(recordSeconds % 60).padStart(2, "0")}
            </span>
            <span style={{ flex: 1 }} />
            <button onClick={() => stopRecording(false)} style={{ background: "none", border: "none", color: "#7A7F93", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => stopRecording(true)} style={{ width: 30, height: 30, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Square size={12} color="#0A0B10" />
            </button>
          </div>
        ) : (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFilePick} />
            <ImageIcon size={20} color="#7A7F93" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => fileInputRef.current?.click()} />

            <input ref={docInputRef} type="file" accept=".pdf,.doc,.docx,.txt" hidden onChange={handleDocPick} />
            <Paperclip size={20} color="#7A7F93" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => docInputRef.current?.click()} />

            <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#1C1F2C", borderRadius: 20, padding: "9px 16px" }}>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Send a message..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              />
            </div>

            {value.trim() || image ? (
              <button onClick={submit} style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Send size={16} color="#0A0B10" />
              </button>
            ) : (
              <Mic size={20} color="#7A7F93" style={{ cursor: "pointer", flexShrink: 0 }} onClick={startRecording} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#4A4E5C" }}>
      <Gamepad2 size={40} strokeWidth={1.4} />
      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 15 }}>Select a chat to start playing</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   ROOT COMPONENT
------------------------------------------------------------------- */
export default function StreamChatApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myId = useSelector((state) => state.authentication?.authentication?.user?.id);
  const { myChats, conversation, searchResults, searchLoading, unreadCounts } = useSelector((state) => state.chats.chats);
  const chatsLoading = useSelector((state) => state.chats.loading);

  const [activeId, setActiveId] = useState(null);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [query, setQuery] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [localExtras, setLocalExtras] = useState({}); // image previews only, kept local
  const scrollRef = useRef(null);
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    dispatch(getMyChats());
    dispatch(getUnreadCounts());
  }, [dispatch]);

  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    if (!query.trim()) return;
    searchDebounceRef.current = setTimeout(() => {
      dispatch(searchUsers(query.trim()));
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [query, dispatch]);

  const conversations = useMemo(() => (myChats || []).map((entry) => mapChatToConversation(entry, unreadCounts)), [myChats, unreadCounts]);

  const activeConv =
    conversations.find((c) => c.id === activeId) ||
    (pendingNewUser && pendingNewUser.id === activeId ? mapUserToConversation(pendingNewUser) : null);

  const messages = useMemo(() => {
    if (!activeId) return [];
    const backendMessages = (conversation || []).map((m) => mapChatMessage(m, myId));
    const extras = localExtras[activeId] || [];
    return [...backendMessages, ...extras].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversation, activeId, myId, localExtras]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages.length, scrollToBottom]);

  const handleSelect = (id) => {
    setActiveId(id);
    setPendingNewUser(null);
    setReplyingTo(null);
    dispatch(getConversation(id));
    dispatch(markAsRead(id));
    setTimeout(() => dispatch(getUnreadCounts()), 300);
  };

  const handleStartChat = (user) => {
    setActiveId(user.id);
    setPendingNewUser(user);
    setQuery("");
    setReplyingTo(null);
    dispatch(clearConversation());
  };

  const handleSend = ({ text, file, image, replyingTo: replyTarget }) => {
    if (!activeId) return;
    if (!text?.trim() && !file && !image) return;

    // Frontend-only reply: fold a quoted line into the text itself,
    // since there's no replyToId column — this is what MessageBubble
    // detects via the "↳ ...\n" marker to render the quote box.
    let finalText = text?.trim() || "";
    if (replyTarget && finalText) {
      const quotedSnippet = (replyTarget.text || "Attachment").slice(0, 60);
      finalText = `↳ ${quotedSnippet}\n${finalText}`;
    }

    if (finalText || file) {
      dispatch(sendMessageThunk({ receiverId: activeId, text: finalText, file }))
        .unwrap()
        .then(() => {
          dispatch(getConversation(activeId));
          dispatch(getMyChats());
          setPendingNewUser(null);
        })
        .catch((err) => console.log(err, "Failed to send message"));
      return;
    }

    // Images stay local-only for now.
    if (image) {
      setLocalExtras((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] || []),
          {
            id: `local-${Date.now()}`,
            sender: "me",
            text: "",
            time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
            createdAt: new Date().toISOString(),
            attachmentType: "image",
            attachmentUrl: image.previewUrl,
          },
        ],
      }));
    }
  };

  const handleReact = (messageId, emoji) => {
    dispatch(reactToMessage({ id: messageId, emoji }))
      .unwrap()
      .then(() => dispatch(getConversation(activeId)))
      .catch((err) => console.log(err, "Failed to react"));
  };

  const handleUnsend = (messageId) => {
    dispatch(deleteMessage(messageId))
      .unwrap()
      .then(() => {
        dispatch(getConversation(activeId));
        dispatch(getMyChats());
      })
      .catch((err) => console.log(err, "Failed to unsend"));
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#0A0B10", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #1C1F2C; border-radius: 999px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .conv-item { transition: background 0.15s ease; }
        .conv-item:hover { background: #14161f; }
        @media (max-width: 720px) {
          .sidebar-panel { display: none !important; }
          .sidebar-panel.force-show { display: flex !important; width: 100% !important; }
          .mobile-back { display: inline-flex !important; }
        }
      `}</style>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div className={`sidebar-panel${!activeId ? " force-show" : ""}`} style={{ display: "flex", height: "100%" }}>
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelect={handleSelect}
            query={query}
            setQuery={setQuery}
            loading={chatsLoading}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onStartChat={handleStartChat}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#0F1017", minWidth: 0, height: "100%" }}>
          {activeConv ? (
            <>
              <ChatHeader conv={activeConv} onBack={() => setActiveId(null)} onViewProfile={(id) => navigate(`/users/${id}`)} />

              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "18px 20px 4px" }}>
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    msg={m}
                    mine={m.sender === "me"}
                    onReact={handleReact}
                    onUnsend={handleUnsend}
                    onReply={setReplyingTo}
                  />
                ))}
              </div>

              <MessageInput
                onSend={handleSend}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}