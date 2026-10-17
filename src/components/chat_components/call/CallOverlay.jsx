import React, { useEffect, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Volume2, PhoneOff, User, Users } from "lucide-react";
import { CONTACTS } from "../../../data/mockData";

function CallButton({ icon, active, onClick }) {
  return (
    <button onClick={onClick} className="icon-btn" style={{ width: 54, height: 54, borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: active ? "#F5F6FA" : "#1C1F2C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: active ? "#0A0B10" : "#F5F6FA" }}>
      {icon}
    </button>
  );
}

/* Full-screen call overlay for audio/video calls, 1:1 or group party
   calls. BACKEND HOOKS live inside — this is UI-only and expects a
   real media stream to be attached to `localVideoRef` / per-member
   `remoteVideoRef`s by your calling SDK. */
export function CallOverlay({ conv, mode, onEnd }) {
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(mode !== "video");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const memberContacts = conv.isGroup ? conv.members.map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean) : [];

  return (
    <div className="pop-in" style={{ position: "fixed", inset: 0, zIndex: 100, background: "radial-gradient(circle at 50% 30%, #1C1F2C 0%, #0A0B10 70%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      {/* BACKEND HOOK: attach your WebRTC remote MediaStream(s) to real
          <video ref={remoteVideoRef} autoPlay playsInline /> elements
          here instead of these placeholder avatars, one per party
          member when mode === 'video'. */}
      {conv.isGroup ? (
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 420 }}>
          {memberContacts.map((m) => (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div className="ring-pulse" style={{ width: 76, height: 76, borderRadius: 999, background: `linear-gradient(135deg, ${m.color[0]}, ${m.color[1]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>{m.initials}</span>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#C9CCDA" }}>{m.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div className="ring-pulse" style={{ width: 132, height: 132, borderRadius: 999, background: "#232634", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {conv.avatarUrl ? (
              <img src={conv.avatarUrl} alt={conv.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <User size={62} color="#6E7286" strokeWidth={1.6} fill="#6E7286" />
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 24, color: "#F5F6FA", display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          {conv.isGroup && <Users size={18} color="#B4FF39" />}
          {conv.name}
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7A7F93", marginTop: 4 }}>
          {mode === "video" ? "Video call" : "Voice call"} · {mm}:{ss}
        </div>
      </div>

      {/* BACKEND HOOK: local camera preview <video ref={localVideoRef}
          muted autoPlay playsInline /> would render here, positioned
          bottom-right, when camOff is false. */}
      {mode === "video" && !camOff && (
        <div style={{ position: "absolute", bottom: 130, right: 40, width: 160, height: 110, borderRadius: 12, background: "#1C1F2C", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#5C6072" }}>YOUR CAMERA</span>
        </div>
      )}

      <div style={{ display: "flex", gap: 16 }}>
        <CallButton active={muted} onClick={() => setMuted((v) => !v)} icon={muted ? <MicOff size={20} /> : <Mic size={20} />} />
        {mode === "video" && <CallButton active={camOff} onClick={() => setCamOff((v) => !v)} icon={camOff ? <VideoOff size={20} /> : <Video size={20} />} />}
        <CallButton icon={<Volume2 size={20} />} />
        <button onClick={onEnd} className="icon-btn" style={{ width: 54, height: 54, borderRadius: 999, border: "none", background: "#FF4D4D", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 20px rgba(255,77,77,0.5)" }}>
          {mode === "video" ? <VideoOff size={22} color="#fff" /> : <PhoneOff size={22} color="#fff" />}
        </button>
      </div>
    </div>
  );
}
