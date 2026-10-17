import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from '../Navbar'
import Footer from "../Footer";
import { getMe, updateProfile, changePassword, logout } from "../../features/authentication/authenticationSlice";
import { User, Lock, LogOut, Eye, EyeOff, Check, AlertCircle } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:#07070d}
::-webkit-scrollbar-thumb{background:linear-gradient(#6c5ce7,#1abc9c);border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.page{font-family:'Inter',system-ui,sans-serif;background:#07070d;color:#e0e0f0;min-height:100vh;display:flex;flex-direction:column;}
.mono{font-family:'JetBrains Mono',monospace;}

.panel{background:linear-gradient(145deg,rgba(12,10,24,.95),rgba(8,6,18,.95));border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:24px;}

.nav-tab{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:10px;cursor:pointer;font-size:13.5px;font-weight:600;color:#777;transition:all .15s;}
.nav-tab:hover{background:rgba(255,255,255,.04);color:#aaa;}
.nav-tab.active{background:rgba(108,92,231,.14);color:#a29bfe;}

.field{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px;color:#eee;font-family:'Inter',sans-serif;font-size:13.5px;outline:none;transition:border-color .15s;}
.field:focus{border-color:#6c5ce7;}
.field::placeholder{color:#444;}
.field:disabled{opacity:.5;cursor:not-allowed;}

.label{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#77727f;letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px;display:block;}

.gb{padding:11px 22px;background:linear-gradient(135deg,#6c5ce7,#9b89f5);border:none;border-radius:10px;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;box-shadow:0 0 20px rgba(108,92,231,.35);transition:transform .15s,box-shadow .15s;}
.gb:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 28px rgba(108,92,231,.5);}
.gb:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}

.toast{display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:10px;font-size:13px;margin-bottom:16px;}
.toast.success{background:rgba(46,204,113,.08);border:1px solid rgba(46,204,113,.3);color:#7ee2a8;}
.toast.error{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.35);color:#f0a0a0;}

@media(max-width:800px){
  .settings-grid{grid-template-columns:1fr!important;}
}
`;

function Toast({ type, message }) {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

function ProfileSection({ user, dispatch }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  const dirty = name !== user.name || email !== user.email;

  const handleSave = () => {
    if (!dirty) return;
    setSaving(true);
    setStatus(null);
    dispatch(updateProfile({ name, email }))
      .unwrap()
      .then(() => {
        setSaving(false);
        setStatus({ type: "success", message: "Profile updated." });
      })
      .catch((err) => {
        setSaving(false);
        setStatus({ type: "error", message: err?.messege || "Failed to update profile." });
      });
  };

  return (
    <div className="panel" style={{ animation: "fadeUp .3s ease both" }}>
      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
        Profile information
      </div>

      <Toast type={status?.type} message={status?.message} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="label">Display name</label>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="label">Email address</label>
          <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Role</label>
          <input className="field" value={user.role} disabled />
        </div>

        <button className="gb" style={{ alignSelf: "flex-start" }} disabled={!dirty || saving} onClick={handleSave}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function PasswordSection({ dispatch }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const canSubmit = currentPassword && newPassword && newPassword === confirmPassword && !saving;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords don't match." });
      return;
    }
    setSaving(true);
    setStatus(null);
    dispatch(changePassword({ currentPassword, newPassword }))
      .unwrap()
      .then(() => {
        setSaving(false);
        setStatus({ type: "success", message: "Password changed successfully." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setSaving(false);
        setStatus({ type: "error", message: err?.messege || "Failed to change password." });
      });
  };

  return (
    <div className="panel" style={{ animation: "fadeUp .3s .05s ease both" }}>
      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 18 }}>
        Change password
      </div>

      <Toast type={status?.type} message={status?.message} />

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label className="label">Current password</label>
          <div style={{ position: "relative" }}>
            <input
              className="field"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              style={{ paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowCurrent((v) => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
              {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="label">New password</label>
          <div style={{ position: "relative" }}>
            <input
              className="field"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters, mixed case, number, symbol"
              style={{ paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowNew((v) => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#666" }}>
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className="label">Confirm new password</label>
          <input
            className="field"
            type={showNew ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <span style={{ fontSize: 11, color: "#f0a0a0", marginTop: 6, display: "block" }}>Passwords don't match</span>
          )}
        </div>

        <button className="gb" style={{ alignSelf: "flex-start" }} disabled={!canSubmit} onClick={handleSubmit}>
          {saving ? "Updating…" : "Update password"}
        </button>
      </div>
    </div>
  );
}

function DangerSection({ dispatch, navigate }) {
  return (
    <div className="panel" style={{ animation: "fadeUp .3s .1s ease both", borderColor: "rgba(239,68,68,.2)" }}>
      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#ef4444", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
        Session
      </div>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 16, lineHeight: 1.6 }}>
        Log out of StreamSphere on this device.
      </p>
      <button
        onClick={() => { dispatch(logout()); navigate("/login"); }}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, border: "1px solid rgba(239,68,68,.4)", background: "rgba(239,68,68,.08)", color: "#f0a0a0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
      >
        <LogOut size={15} /> Log out
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.authentication.loading);
  const { user } = useSelector((state) => state.authentication.authentication);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  if (loading && !user) {
    return (
      <div className="page">
        <style>{S}</style>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page">
        <style>{S}</style>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>You're not logged in.</div>
        <Footer />
      </div>
    );
  }

  const TABS = [
    { id: "profile", label: "Profile", icon: <User size={15} /> },
    { id: "password", label: "Password", icon: <Lock size={15} /> },
    { id: "session", label: "Session", icon: <LogOut size={15} /> },
  ];

  return (
    <div className="page">
      <style>{S}</style>
      <Navbar />

      <div style={{ flex: 1, padding: "clamp(16px,3vw,32px)", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
            Account
          </div>
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 900, color: "#f0f0f0" }}>Settings</h1>
        </div>

        <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {TABS.map((t) => (
              <div key={t.id} className={`nav-tab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
                {t.icon} {t.label}
              </div>
            ))}
          </div>

          <div>
            {tab === "profile" && <ProfileSection user={user} dispatch={dispatch} />}
            {tab === "password" && <PasswordSection dispatch={dispatch} />}
            {tab === "session" && <DangerSection dispatch={dispatch} navigate={navigate} />}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
