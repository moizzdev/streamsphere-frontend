import React, { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, File as FileIcon, Play, Pause, Download, X, ChevronLeft, ChevronRight, Video as VideoIcon } from "lucide-react";
import { mmss, formatBytes } from "../../../lib/helpers";

/* Grid of image/video attachments on a single message — 1 up to 4+,
   Instagram/iMessage-style. Click any tile to open the full-screen
   MediaLightbox. BACKEND HOOK: attachment.url should be a hosted URL
   after upload (see fileToAttachment / MessageInput's handleFilePick). */
export function MediaGrid({ attachments, onOpen }) {
  const media = (attachments || []).filter((a) => a.type === "image" || a.type === "video");
  if (media.length === 0) return null;

  const cols = media.length === 1 ? 1 : 2;
  const showOverflow = media.length > 4;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 3,
        marginBottom: 6,
        borderRadius: 12,
        overflow: "hidden",
        maxWidth: media.length === 1 ? 240 : 240,
      }}
    >
      {media.slice(0, 4).map((att, i) => (
        <div
          key={i}
          onClick={() => onOpen(i)}
          className="icon-btn"
          style={{
            position: "relative",
            cursor: "zoom-in",
            aspectRatio: media.length === 1 ? "4/3" : "1/1",
            background: "linear-gradient(135deg,#1C1F2C,#252939)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {att.url ? (
            att.type === "video" ? (
              <video src={att.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
            ) : (
              <img src={att.url} alt={att.name || "attachment"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )
          ) : att.type === "video" ? (
            <VideoIcon size={22} color="#5C6072" />
          ) : (
            <ImageIcon size={22} color="#5C6072" />
          )}
          {att.type === "video" && (
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.25)" }}>
              <Play size={18} color="#fff" fill="#fff" />
            </span>
          )}
          {showOverflow && i === 3 && (
            <span style={{ position: "absolute", inset: 0, background: "rgba(10,11,16,0.62)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>
              +{media.length - 4}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* Non-media file chip (pdf, zip, docs, etc). */
export function FileAttachmentChip({ attachment }) {
  return (
    <a
      href={attachment.url || "#"}
      download={attachment.name}
      className="icon-btn"
      style={{ display: "flex", alignItems: "center", gap: 8, background: "#151824", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 10px", marginBottom: 6, textDecoration: "none", maxWidth: 220 }}
    >
      <FileIcon size={16} color="#B4FF39" style={{ flexShrink: 0 }} />
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#F5F6FA", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{attachment.name || "file"}</span>
        {attachment.size != null && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: "#7A7F93" }}>{formatBytes(attachment.size)}</span>}
      </span>
      {attachment.url && <Download size={13} color="#7A7F93" style={{ marginLeft: "auto", flexShrink: 0 }} />}
    </a>
  );
}

/* Renders whichever non-media/non-voice attachments exist as file
   chips underneath the media grid. */
export function FileAttachmentsList({ attachments }) {
  const files = (attachments || []).filter((a) => a.type === "file" || a.type === "audio");
  if (files.length === 0) return null;
  return (
    <>
      {files.map((f, i) => (
        <FileAttachmentChip key={i} attachment={f} />
      ))}
    </>
  );
}

/* Full-screen media viewer with left/right navigation across every
   image/video attached to the message it was opened from. */
export function MediaLightbox({ items, index, onClose, onNavigate }) {
  if (!items || items.length === 0) return null;
  const item = items[index];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onNavigate(Math.min(items.length - 1, index + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,7,11,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <X size={22} color="#fff" className="icon-btn" style={{ position: "absolute", top: 24, right: 28, cursor: "pointer" }} onClick={onClose} />
      {item.url && (
        <a href={item.url} download={item.name} onClick={(e) => e.stopPropagation()} className="icon-btn" style={{ position: "absolute", top: 24, right: 68, cursor: "pointer" }}>
          <Download size={20} color="#fff" />
        </a>
      )}

      {index > 0 && (
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          style={{ position: "absolute", left: 20, width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ChevronLeft size={20} color="#fff" />
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "82vw", maxHeight: "82vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {item.url ? (
          item.type === "video" ? (
            <video src={item.url} controls autoPlay style={{ maxWidth: "82vw", maxHeight: "82vh", borderRadius: 8 }} />
          ) : (
            <img src={item.url} alt={item.name || "attachment"} style={{ maxWidth: "82vw", maxHeight: "82vh", borderRadius: 8, objectFit: "contain" }} />
          )
        ) : (
          <div style={{ width: 320, height: 220, background: "#1C1F2C", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {item.type === "video" ? <VideoIcon size={40} color="#5C6072" /> : <ImageIcon size={40} color="#5C6072" />}
          </div>
        )}
      </div>

      {index < items.length - 1 && (
        <button
          className="icon-btn"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          style={{ position: "absolute", right: 20, width: 40, height: 40, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ChevronRight size={20} color="#fff" />
        </button>
      )}

      {items.length > 1 && (
        <span style={{ position: "absolute", bottom: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#fff", opacity: 0.7 }}>
          {index + 1} / {items.length}
        </span>
      )}
    </div>
  );
}

/* Working voice-note player — real <audio> playback with a scrubbing
   progress bar, driven off timeupdate/loadedmetadata/ended events.
   BACKEND HOOK: `attachment.url` is a local blob: URL created at
   record time (see MessageInput.stopRecording). Swap it for the
   hosted URL you get back after uploading the recorded Blob to your
   storage so playback survives reloads and works for other users. */
export function VoiceNoteBubble({ attachment, mine }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(attachment.duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onLoaded = () => {
      if (isFinite(audio.duration)) setDuration(audio.duration);
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

  const seek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
    setProgress(ratio);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: mine ? "rgba(0,0,0,0.18)" : "#1C1F2C", borderRadius: 14, padding: "9px 12px", minWidth: 195 }}>
      <audio ref={audioRef} src={attachment.url} preload="metadata" />
      <button
        onClick={toggle}
        className="icon-btn"
        style={{ width: 30, height: 30, borderRadius: 999, border: "none", background: "#B4FF39", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
      >
        {playing ? <Pause size={13} color="#0A0B10" /> : <Play size={13} color="#0A0B10" style={{ marginLeft: 1 }} />}
      </button>
      <div onClick={seek} style={{ flex: 1, cursor: "pointer", padding: "8px 0" }}>
        <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, background: "#B4FF39", transition: playing ? "width 0.1s linear" : "none" }} />
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: mine ? "#F5F6FA" : "#7A7F93", flexShrink: 0 }}>{mmss(duration)}</span>
    </div>
  );
}
