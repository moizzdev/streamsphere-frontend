import React, { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Smile, Image as ImageIcon, Mic, X, Reply, AlertCircle, File as FileIcon, Film } from "lucide-react";
import { fileToAttachment } from "../../../lib/helpers";

function ReplyPreview({ message, onCancel }) {
  if (!message) return null;
  return (
    <div className="pop-in-top" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "#14161F", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <Reply size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: "#7C3AED", fontFamily: "'JetBrains Mono', monospace" }}>REPLYING TO</div>
        <div style={{ fontSize: 12.5, color: "#F5F6FA", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{message.text || "Attachment"}</div>
      </div>
      <X size={16} color="#7A7F93" className="icon-btn" onClick={onCancel} style={{ cursor: "pointer" }} />
    </div>
  );
}

/* Queued outgoing attachments — shows a real thumbnail for images,
   a film icon for video, a generic file chip otherwise. Supports any
   number/type of file, which is what makes "send everything" work:
   images, videos, docs, zips, etc. can all be queued together. */
function AttachmentPreviewStrip({ items, onRemove }) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", gap: 8, padding: "10px 18px 0", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <div key={i} className="pop-in" style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: item.attachment.type === "image" ? 3 : "5px 9px" }}>
          {item.attachment.type === "image" ? (
            <img src={item.attachment.url} alt={item.attachment.name} style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }} />
          ) : item.attachment.type === "video" ? (
            <div style={{ width: 44, height: 44, borderRadius: 6, background: "#101219", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Film size={16} color="#B4FF39" />
            </div>
          ) : (
            <>
              <FileIcon size={12} color="#B4FF39" />
              <span style={{ fontSize: 11, color: "#F5F6FA", fontFamily: "'Inter', sans-serif", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.attachment.name}</span>
            </>
          )}
          <X
            size={12}
            color="#7A7F93"
            className="icon-btn"
            style={{ cursor: "pointer", position: item.attachment.type === "image" || item.attachment.type === "video" ? "absolute" : "static", top: -5, right: -5, background: item.attachment.type === "image" || item.attachment.type === "video" ? "#1C1F2C" : "transparent", borderRadius: 999, border: item.attachment.type === "image" || item.attachment.type === "video" ? "1px solid rgba(255,255,255,0.15)" : "none" }}
            onClick={() => onRemove(i)}
          />
        </div>
      ))}
    </div>
  );
}

function EmojiPicker({ onPick, onClose }) {
  const emojis = ["😀", "😂", "😍", "🔥", "🎮", "🏆", "😭", "👏", "💀", "🎯", "⚡", "🙌", "😎", "🤝", "💜", "✅"];
  return (
    <div className="pop-in" style={{ position: "absolute", bottom: "100%", left: 18, marginBottom: 8, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.45)", zIndex: 30 }}>
      {emojis.map((e) => (
        <span
          key={e}
          className="emoji-pop"
          onClick={() => {
            onPick(e);
            onClose();
          }}
          style={{ fontSize: 18, cursor: "pointer", textAlign: "center", padding: 4, borderRadius: 6 }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

/* BACKEND HOOKS: onSend should call your API/socket "send message"
   action (text + optional attachments/replyTo/voice-note blob). This
   component stays mostly presentational — it only collects input.
   `initialDraft`/`onDraftChange` let the parent persist an in-progress
   draft per conversation, and `externalFiles` lets drag-and-drop from
   the chat window feed straight into the same attachment queue as the
   paperclip button. */
export function MessageInput({ onSend, replyingTo, onCancelReply, onTyping, initialDraft = "", onDraftChange, externalFiles, onExternalFilesConsumed }) {
  const [value, setValue] = useState(initialDraft);
  const [items, setItems] = useState([]); // [{ file, attachment }]
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micError, setMicError] = useState(null);
  const [levels, setLevels] = useState(Array(22).fill(4));
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const recordTimerRef = useRef(null);

  // Recording internals — all local to the browser. Nothing here
  // talks to a server; only the final Blob (see stopRecording) needs
  // a backend endpoint to actually persist.
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (externalFiles && externalFiles.length) {
      setItems((prev) => [...prev, ...externalFiles.map((file) => ({ file, attachment: fileToAttachment(file) }))]);
      onExternalFilesConsumed?.();
    }
  }, [externalFiles, onExternalFilesConsumed]);

  useEffect(() => {
    if (recording) {
      recordTimerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(recordTimerRef.current);
      setRecordSeconds(0);
    }
    return () => clearInterval(recordTimerRef.current);
  }, [recording]);

  // Safety net: release the mic if the component unmounts (e.g. the
  // user switches conversations) while still recording.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close?.();
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const updateValue = (v) => {
    setValue(v);
    onDraftChange?.(v);
  };

  const submit = () => {
    if (!value.trim() && items.length === 0) return;
    onSend({ text: value.trim(), attachments: items.map((i) => i.attachment) });
    updateValue("");
    setItems([]);
  };

  const handleFilePick = (e) => {
    // BACKEND HOOK: on real send, upload these Files to your storage
    // (S3 / GCS / your API) and attach the resulting URL(s) to the
    // outgoing message payload instead of the local blob: URLs.
    const picked = Array.from(e.target.files || []);
    setItems((prev) => [...prev, ...picked.map((file) => ({ file, attachment: fileToAttachment(file) }))]);
    e.target.value = "";
  };

  const startRecording = async () => {
    setMicError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("Voice notes need microphone access, which this browser doesn't support.");
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

      // Live amplitude bars, purely cosmetic — reflects real mic input.
      const AudioContextRef = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextRef();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        setLevels(Array.from({ length: 22 }, (_, i) => 4 + (data[i % data.length] / 255) * 24));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (err) {
      // BACKEND HOOK: none — this is a permissions/device error from
      // the browser itself (denied mic access, no device, etc).
      setMicError("Microphone access denied. Allow it in your browser's site settings to record.");
    }
  };

  const stopRecording = (send) => {
    const recorder = mediaRecorderRef.current;
    cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.close?.();

    if (!recorder) {
      setRecording(false);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      return;
    }

    recorder.onstop = () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (send && chunksRef.current.length && recordSeconds > 0) {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        const url = URL.createObjectURL(blob);
        // BACKEND HOOK: upload `blob` to your storage here and send the
        // hosted URL instead of the local object URL, e.g.:
        //   const form = new FormData();
        //   form.append("voice", blob, `voice-${Date.now()}.webm`);
        //   const res = await fetch("/api/uploads/voice", { method: "POST", body: form });
        //   const { url: hostedUrl } = await res.json();
        //   onSend({ text: "", attachments: [{ type: "voice", url: hostedUrl, duration: recordSeconds }] });
        onSend({ text: "", attachments: [{ type: "voice", url, duration: recordSeconds }] });
      }
      setRecording(false);
    };
    recorder.stop();
  };

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <ReplyPreview message={replyingTo} onCancel={onCancelReply} />
      <AttachmentPreviewStrip items={items} onRemove={(i) => setItems((prev) => prev.filter((_, idx) => idx !== i))} />
      {emojiOpen && <EmojiPicker onPick={(e) => updateValue(value + e)} onClose={() => setEmojiOpen(false)} />}

      {micError && (
        <div className="pop-in-top" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 18px", background: "rgba(255,77,77,0.08)", borderTop: "1px solid rgba(255,77,77,0.2)" }}>
          <AlertCircle size={13} color="#FF4D4D" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11.5, color: "#F5F6FA", flex: 1 }}>{micError}</span>
          <X size={13} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer" }} onClick={() => setMicError(null)} />
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "#101219" }}>
        {recording ? (
          <div className="pop-in" style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, background: "#1C1F2C", borderRadius: 20, padding: "9px 16px" }}>
            <span className="rec-pulse" style={{ width: 10, height: 10, borderRadius: 999, background: "#FF4D4D", flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#F5F6FA", flexShrink: 0 }}>
              {String(Math.floor(recordSeconds / 60)).padStart(2, "0")}:{String(recordSeconds % 60).padStart(2, "0")}
            </span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 28 }}>
              {levels.map((h, i) => (
                <span key={i} style={{ width: 3, height: h, borderRadius: 999, background: "#B4FF39", transition: "height 0.08s ease", flexShrink: 0 }} />
              ))}
            </div>
            <X size={18} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => stopRecording(false)} title="Cancel" />
            <button onClick={() => stopRecording(true)} className="icon-btn" style={{ width: 30, height: 30, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} title="Send">
              <Send size={14} color="#0A0B10" />
            </button>
          </div>
        ) : (
          <>
            <input ref={fileInputRef} type="file" multiple hidden onChange={handleFilePick} />
            <input ref={mediaInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFilePick} />
            <Paperclip size={20} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => fileInputRef.current?.click()} title="Attach a file" />
            <span style={{ position: "relative" }}>
              <Smile size={20} color={emojiOpen ? "#B4FF39" : "#7A7F93"} className="icon-btn" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => setEmojiOpen((v) => !v)} />
            </span>
            <ImageIcon size={20} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer", flexShrink: 0 }} onClick={() => mediaInputRef.current?.click()} title="Attach photo or video" />

            <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#1C1F2C", borderRadius: 20, padding: "9px 16px" }}>
              <input
                value={value}
                onChange={(e) => {
                  updateValue(e.target.value);
                  onTyping?.(); // BACKEND HOOK: emit a "typing" socket event (debounced) here.
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Send a message..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#F5F6FA", fontFamily: "'Inter', sans-serif", fontSize: 14 }}
              />
            </div>

            {value.trim() || items.length ? (
              <button onClick={submit} className="icon-btn send-pop" style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 16px rgba(180,255,57,0.4)" }}>
                <Send size={16} color="#0A0B10" />
              </button>
            ) : (
              <Mic size={20} color="#7A7F93" className="icon-btn" style={{ cursor: "pointer", flexShrink: 0 }} onClick={startRecording} title="Record a voice note" />
            )}
          </>
        )}
      </div>
    </div>
  );
}
