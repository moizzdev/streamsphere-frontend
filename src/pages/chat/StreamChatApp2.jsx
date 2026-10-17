import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search, Send, ChevronLeft, X, Image as ImageIcon, Mic, Play, Pause,
  Gamepad2, User, Check, CheckCheck, Trash2, Smile, Square, Paperclip, Reply,
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
} from "../../features/chatSlice/chatSlice";
import "./StreamChatApp.css";

const COLOR_PAIRS = [
  ["#8b5cf6", "#22d3ee"],
  ["#ec4899", "#8b5cf6"],
  ["#22d3ee", "#6366f1"],
  ["#a3e635", "#22d3ee"],
];

function colorFor(id) {
  if (!id) return COLOR_PAIRS[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PAIRS[Math.abs(hash) % COLOR_PAIRS.length];
}

function formatTime(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapChatToConversation(entry, unreadCounts) {
  const u = entry.user;
  return {
    id: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    unread: unreadCounts?.[u.id] || 0,
    lastMessage:
      entry.lastMessage?.text ||
      (entry.lastMessage?.attachmentType ? "Attachment" : ""),
    time: formatTime(entry.lastMessage?.createdAt),
    color: colorFor(u.id),
  };
}

function mapUserToConversation(u) {
  return {
    id: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    unread: 0,
    lastMessage: "",
    time: "",
    color: colorFor(u.id),
  };
}

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

function Avatar({ conv, size = 46 }) {
  const [a, b] = conv.color || COLOR_PAIRS[0];

  return (
    <div
      className="chat-avatar"
      style={{
        "--avatar-size": `${size}px`,
        "--avatar-a": a,
        "--avatar-b": b,
      }}
    >
      {conv.avatarUrl ? (
        <img src={conv.avatarUrl} alt={conv.name} />
      ) : (
        <User size={size * 0.46} strokeWidth={1.6} />
      )}
    </div>
  );
}

function ConversationItem({ conv, active, onClick, index = 0 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`conversation-item ${active ? "is-active" : ""} ${
        conv.unread > 0 ? "has-unread" : ""
      }`}
      style={{ "--item-delay": `${Math.min(index * 35, 280)}ms` }}
    >
      <div className="chat-avatar-wrap">
        <Avatar conv={conv} />
        <span className="presence-dot" />
      </div>

      <div className="conversation-copy">
        <div className="conversation-topline">
          <strong>{conv.name}</strong>
          {conv.time && <time>{conv.time}</time>}
        </div>
        <div className="conversation-bottomline">
          <span>{conv.lastMessage || "Start a conversation"}</span>
          {conv.unread > 0 && (
            <span className="unread-badge">{conv.unread}</span>
          )}
        </div>
      </div>

      <span className="conversation-chevron">›</span>
    </button>
  );
}

function Sidebar({
  conversations,
  activeId,
  onSelect,
  query,
  setQuery,
  loading,
  searchResults,
  searchLoading,
  onStartChat,
}) {
  const filtered = conversations.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const isSearching = query.trim().length > 0;
  const existingIds = new Set(conversations.map((c) => c.id));
  const newPeople = (searchResults || []).filter((u) => !existingIds.has(u.id));

  return (
    <aside className="chat-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Gamepad2 size={18} />
        </div>
        <div>
          <div className="brand-name">
            STREAM<span>LINK</span>
          </div>
          <div className="brand-caption">PRIVATE PLAYER MESSAGING</div>
        </div>
      </div>

      <div className="sidebar-search-shell">
        <div className="sidebar-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="conversation-scroller">
        {isSearching && (
          <>
            <div className="sidebar-section-title">
              <span>DISCOVER</span>
              <div />
            </div>

            {searchLoading && (
              <div className="sidebar-state">
                <span className="tiny-loader" />
                Searching players
              </div>
            )}

            {!searchLoading && newPeople.length === 0 && (
              <div className="sidebar-state">No new players found</div>
            )}

            {newPeople.map((u, index) => (
              <ConversationItem
                key={u.id}
                conv={mapUserToConversation(u)}
                active={u.id === activeId}
                onClick={() => onStartChat(u)}
                index={index}
              />
            ))}

            {filtered.length > 0 && (
              <div className="sidebar-section-title secondary">
                <span>YOUR CHATS</span>
                <div />
              </div>
            )}
          </>
        )}

        {loading && filtered.length === 0 && !isSearching && (
          <div className="sidebar-state">
            <span className="tiny-loader" />
            Loading chats
          </div>
        )}

        {filtered.map((c, index) => (
          <ConversationItem
            key={c.id}
            conv={c}
            active={c.id === activeId}
            onClick={() => onSelect(c.id)}
            index={index}
          />
        ))}

        {!loading && !isSearching && filtered.length === 0 && (
          <div className="sidebar-empty">
            <div className="sidebar-empty-icon">
              <Gamepad2 size={22} />
            </div>
            <strong>No conversations yet</strong>
            <span>Search for a player above and start your first chat.</span>
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <span className="status-pulse" />
        CHAT NETWORK ONLINE
      </div>
    </aside>
  );
}

function ChatHeader({ conv, onBack }) {
  return (
    <header className="chat-header">
      <button
        type="button"
        onClick={onBack}
        className="mobile-back"
        aria-label="Back to chats"
      >
        <ChevronLeft size={19} />
      </button>

      <div className="header-avatar">
        <Avatar conv={conv} size={42} />
        <span />
      </div>

      <div className="chat-header-copy">
        <strong>{conv.name}</strong>
        <span>
          <i /> ACTIVE NOW
        </span>
      </div>

      <div className="header-signal">
        <span />
        <span />
        <span />
      </div>
    </header>
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

    const onTime = () =>
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onLoaded = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };

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

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(Math.floor(duration % 60)).padStart(2, "0");

  return (
    <div className={`voice-bubble ${mine ? "mine" : ""}`}>
      <audio ref={audioRef} src={url} preload="metadata" />

      <button type="button" className="voice-play" onClick={toggle}>
        {playing ? <Pause size={14} /> : <Play size={14} />}
      </button>

      <div className="voice-track">
        <div
          className="voice-progress"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="voice-wave">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              style={{ "--wave-h": `${7 + ((i * 11) % 18)}px` }}
            />
          ))}
        </div>
      </div>

      <span className="voice-duration">
        {mm}:{ss}
      </span>
    </div>
  );
}

const QUICK_REACTIONS = ["❤️", "😂", "🔥", "👏", "😮", "😢"];

function StatusTicks({ isRead }) {
  return isRead ? (
    <CheckCheck size={13} className="message-read" />
  ) : (
    <Check size={13} />
  );
}

function ReactionBadge({ reactions }) {
  const entries = Object.entries(reactions || {});
  if (entries.length === 0) return null;

  const counts = {};
  entries.forEach(([, emoji]) => {
    counts[emoji] = (counts[emoji] || 0) + 1;
  });

  return (
    <div className="reaction-badges">
      {Object.entries(counts).map(([emoji, count]) => (
        <span key={emoji}>
          {emoji}
          {count > 1 && <b>{count}</b>}
        </span>
      ))}
    </div>
  );
}

function MessageBubble({ msg, mine, onReact, onUnsend, onReply }) {
  const [hovered, setHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const isReply = Boolean(
    msg.text?.startsWith("↳ ") && msg.text?.includes("\n")
  );
  const quotedLine = isReply
    ? msg.text.split("\n")[0].replace("↳ ", "")
    : null;
  const actualText = isReply
    ? msg.text.split("\n").slice(1).join("\n")
    : msg.text;

  return (
    <div
      className={`message-row ${mine ? "mine" : "theirs"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (!pickerOpen) setPickerOpen(false);
      }}
    >
      <div className="message-stack">
        {hovered && (
          <div className={`message-tools ${mine ? "tools-right" : ""}`}>
            <button
              type="button"
              onClick={() => onReply(msg)}
              title="Reply"
            >
              <Reply size={14} />
            </button>

            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              title="React"
            >
              <Smile size={14} />
            </button>

            {mine && (
              <button
                type="button"
                onClick={() => onUnsend(msg.id)}
                title="Unsend"
                className="delete-action"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}

        {pickerOpen && (
          <div className={`reaction-picker ${mine ? "picker-right" : ""}`}>
            {QUICK_REACTIONS.map((emoji) => (
              <button
                type="button"
                key={emoji}
                onClick={() => {
                  onReact(msg.id, emoji);
                  setPickerOpen(false);
                }}
              >
                {emoji}
              </button>
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
            className="message-image"
          />
        )}

        {msg.attachmentType === "document" && msg.attachmentUrl && (
          <a
            href={msg.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="document-bubble"
          >
            <Paperclip size={17} />
            <div>
              <strong>Document</strong>
              <span>Open attachment</span>
            </div>
          </a>
        )}

        {msg.text && (
          <div
            className={`message-bubble ${
              mine ? "bubble-mine" : "bubble-theirs"
            }`}
            onDoubleClick={() => setPickerOpen((v) => !v)}
          >
            {isReply && (
              <div className="quoted-message">
                <Reply size={12} />
                <span>{quotedLine}</span>
              </div>
            )}
            <span className="message-text">{actualText}</span>
          </div>
        )}

        <ReactionBadge reactions={msg.reactions} />

        <div className={`message-meta ${mine ? "meta-right" : ""}`}>
          <span>{msg.time}</span>
          {mine && <StatusTicks isRead={msg.isRead} />}
        </div>
      </div>
    </div>
  );
}

function AttachmentPreviewStrip({ image, onRemoveImage }) {
  if (!image) return null;

  return (
    <div className="attachment-preview-area">
      <div className="attachment-preview">
        <img src={image.previewUrl} alt="preview" />
        <button type="button" onClick={onRemoveImage} aria-label="Remove image">
          <X size={13} />
        </button>
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
      recordTimerRef.current = setInterval(
        () => setRecordSeconds((s) => s + 1),
        1000
      );
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
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

      const mimeType = window.MediaRecorder?.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setRecording(true);
    } catch {
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
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType,
        });
        const file = new File([blob], `voice-${Date.now()}.webm`, {
          type: recorder.mimeType,
        });
        onSend({ file });
      }

      setRecording(false);
    };

    recorder.stop();
  };

  return (
    <div className="composer-shell">
      {replyingTo && (
        <div className="replying-strip">
          <div className="replying-icon">
            <Reply size={14} />
          </div>
          <div className="replying-copy">
            <span>REPLYING TO</span>
            <strong>{replyingTo.text || "Attachment"}</strong>
          </div>
          <button
            type="button"
            onClick={onCancelReply}
            aria-label="Cancel reply"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {micError && (
        <div className="composer-error">
          <span>{micError}</span>
          <button
            type="button"
            onClick={() => setMicError(null)}
            aria-label="Dismiss error"
          >
            <X size={13} />
          </button>
        </div>
      )}

      <AttachmentPreviewStrip
        image={image}
        onRemoveImage={() => setImage(null)}
      />

      <div className="composer">
        {recording ? (
          <div className="recording-panel">
            <span className="recording-dot" />

            <div className="recording-copy">
              <span>RECORDING</span>
              <strong>
                {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:
                {String(recordSeconds % 60).padStart(2, "0")}
              </strong>
            </div>

            <div className="recording-wave">
              {Array.from({ length: 20 }).map((_, i) => (
                <i key={i} style={{ "--i": i }} />
              ))}
            </div>

            <button
              type="button"
              className="record-cancel"
              onClick={() => stopRecording(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="record-send"
              onClick={() => stopRecording(true)}
              aria-label="Send voice note"
            >
              <Square size={12} />
            </button>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFilePick}
            />

            <button
              type="button"
              className="composer-tool"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <ImageIcon size={19} />
            </button>

            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              hidden
              onChange={handleDocPick}
            />

            <button
              type="button"
              className="composer-tool"
              onClick={() => docInputRef.current?.click()}
              aria-label="Attach document"
            >
              <Paperclip size={19} />
            </button>

            <div className="composer-input-wrap">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a message..."
              />
              <span className="composer-hint">ENTER TO SEND</span>
            </div>

            {value.trim() || image ? (
              <button
                type="button"
                className="send-button"
                onClick={submit}
                aria-label="Send message"
              >
                <Send size={17} />
              </button>
            ) : (
              <button
                type="button"
                className="composer-tool mic-button"
                onClick={startRecording}
                aria-label="Record voice note"
              >
                <Mic size={19} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="chat-empty">
      <div className="empty-visual">
        <span className="orbit orbit-a" />
        <span className="orbit orbit-b" />
        <div className="empty-core">
          <Gamepad2 size={30} />
        </div>
      </div>

      <div className="empty-kicker">STREAMLINK / DIRECT</div>
      <h2>YOUR SPACE. YOUR PEOPLE.</h2>
      <p>Select a conversation or search for a player to start talking.</p>

      <div className="empty-pills">
        <span>FAST</span>
        <span>PRIVATE</span>
        <span>REAL-TIME</span>
      </div>
    </div>
  );
}

export default function StreamChatApp() {
  const dispatch = useDispatch();

  const myId = useSelector(
    (state) => state.authentication?.authentication?.user?.id
  );

  const {
    myChats,
    conversation,
    searchResults,
    searchLoading,
    unreadCounts,
  } = useSelector((state) => state.chats.chats);

  const chatsLoading = useSelector((state) => state.chats.loading);

  const [activeId, setActiveId] = useState(null);
  const [pendingNewUser, setPendingNewUser] = useState(null);
  const [query, setQuery] = useState("");
  const [localExtras, setLocalExtras] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);

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

  const conversations = useMemo(
    () =>
      (myChats || []).map((entry) =>
        mapChatToConversation(entry, unreadCounts)
      ),
    [myChats, unreadCounts]
  );

  const activeConv =
    conversations.find((c) => c.id === activeId) ||
    (pendingNewUser && pendingNewUser.id === activeId
      ? mapUserToConversation(pendingNewUser)
      : null);

  const messages = useMemo(() => {
    if (!activeId) return [];

    const backendMessages = (conversation || []).map((m) =>
      mapChatMessage(m, myId)
    );

    const extras = localExtras[activeId] || [];

    return [...backendMessages, ...extras].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversation, activeId, myId, localExtras]);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  const handleSelect = (id) => {
    setActiveId(id);
    setPendingNewUser(null);
    dispatch(getConversation(id));
    dispatch(markAsRead(id));
    setTimeout(() => dispatch(getUnreadCounts()), 300);
  };

  const handleStartChat = (user) => {
    setActiveId(user.id);
    setPendingNewUser(user);
    setQuery("");
    dispatch(clearConversation());
  };

  const handleSend = ({ text, file, image, replyingTo }) => {
    if (!activeId) return;
    if (!text?.trim() && !file && !image) return;

    let finalText = text?.trim() || "";

    if (replyingTo && finalText) {
      const quotedSnippet = (replyingTo.text || "Attachment").slice(0, 60);
      finalText = `↳ ${quotedSnippet}\n${finalText}`;
    }

    if (finalText || file) {
      dispatch(
        sendMessageThunk({
          receiverId: activeId,
          text: finalText,
          file,
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getConversation(activeId));
          dispatch(getMyChats());
          setPendingNewUser(null);
        })
        .catch((err) => console.log(err, "Failed to send message"));

      return;
    }

    if (image) {
      setLocalExtras((prev) => ({
        ...prev,
        [activeId]: [
          ...(prev[activeId] || []),
          {
            id: `local-${Date.now()}`,
            sender: "me",
            text: "",
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
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
    <div className="stream-chat-app">
      <div className="chat-grid" />
      <div className="chat-ambient ambient-one" />
      <div className="chat-ambient ambient-two" />

      <div className="chat-workspace">
        <div
          className={`chat-sidebar-container ${
            !activeId ? "mobile-visible" : ""
          }`}
        >
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

        <main className={`chat-main ${activeConv ? "has-chat" : ""}`}>
          {activeConv ? (
            <>
              <ChatHeader
                conv={activeConv}
                onBack={() => setActiveId(null)}
              />

              <div ref={scrollRef} className="messages-area">
                <div className="messages-inner">
                  <div className="conversation-intro">
                    <span />
                    PRIVATE SESSION
                    <span />
                  </div>

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
        </main>
      </div>
    </div>
  );
}
