import React, { useEffect, useState } from "react";
import Navbar from "../pages/Navbar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../features/authentication/authenticationSlice";
import { Navigate, useNavigate } from "react-router";
import GoogleAuthButton from '../pages/GoogleAuthButton'
import logo from '../images/logo.png'

/* ==========================================================================
   STREAMSPHERE — PREMIUM LOGIN
   Elegant glassmorphism / dark editorial UI
   ========================================================================== */

const LOGIN_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* ==========================================================================
   RESET
   ========================================================================== */

.ss-login,
.ss-login * {
  box-sizing: border-box;
}

.ss-login {
  --bg: #05050a;
  --panel: rgba(13, 12, 21, 0.72);
  --panel-strong: rgba(16, 14, 26, 0.9);

  --text: #f5f3fb;
  --muted: #8e899f;
  --faint: #575265;

  --purple: #8b5cf6;
  --purple-light: #b9a2ff;
  --purple-deep: #6d3df2;

  --cyan: #35d8dc;
  --pink: #ef72b5;

  --border: rgba(255,255,255,.085);
  --border-hover: rgba(177,151,255,.32);

  --ease: cubic-bezier(.16,1,.3,1);

  min-height: 100vh;
  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% -15%,
      rgba(108,92,231,.13),
      transparent 38%
    ),
    #05050a;

  color: var(--text);
  font-family: "Inter", sans-serif;

  -webkit-font-smoothing: antialiased;
  isolation: isolate;
}

/* ==========================================================================
   BACKGROUND
   ========================================================================== */

.ss-login-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -2;
}

.ss-login-grid {
  position: absolute;
  inset: 0;

  background-image:
    linear-gradient(
      rgba(255,255,255,.025) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.025) 1px,
      transparent 1px
    );

  background-size: 72px 72px;

  mask-image:
    linear-gradient(
      to bottom,
      rgba(0,0,0,.9),
      transparent 75%
    );

  opacity: .35;
}

.ss-login-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
  opacity: .26;
  animation: ss-login-float 12s ease-in-out infinite;
}

.ss-login-glow--one {
  width: 420px;
  height: 420px;
  background: #6338e8;
  top: -190px;
  right: -130px;
}

.ss-login-glow--two {
  width: 360px;
  height: 360px;
  background: #0c9997;
  bottom: -210px;
  left: -140px;
  animation-delay: -4s;
}

.ss-login-glow--three {
  width: 260px;
  height: 260px;
  background: #b33d80;
  top: 42%;
  left: 48%;
  opacity: .07;
  animation-delay: -8s;
}

.ss-login-noise {
  position: absolute;
  inset: 0;
  opacity: .035;
  pointer-events: none;

  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ==========================================================================
   MAIN
   ========================================================================== */

.ss-login-main {
  min-height: calc(100vh - 72px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding:
    64px
    24px
    90px;

  position: relative;
  z-index: 2;
}

/* ==========================================================================
   AUTH LAYOUT
   ========================================================================== */

.ss-auth-shell {
  width: min(100%, 980px);

  display: grid;
  grid-template-columns: .9fr 1.1fr;

  min-height: 570px;

  border: 1px solid rgba(255,255,255,.085);

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.045),
      rgba(255,255,255,.012)
    );

  backdrop-filter: blur(32px) saturate(140%);
  -webkit-backdrop-filter: blur(32px) saturate(140%);

  box-shadow:
    0 40px 100px rgba(0,0,0,.52),
    inset 0 1px 0 rgba(255,255,255,.07);

  position: relative;

  animation:
    ss-auth-enter .8s var(--ease) both;
}

/* top light */
.ss-auth-shell::before {
  content: "";

  position: absolute;

  top: 0;
  left: 8%;
  right: 8%;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(175,151,255,.7),
      transparent
    );

  opacity: .7;
}

/* subtle diagonal highlight */
.ss-auth-shell::after {
  content: "";

  position: absolute;

  width: 300px;
  height: 100%;

  top: 0;
  left: -420px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.035),
      transparent
    );

  transform: skewX(-18deg);

  animation: ss-glass-sweep 7s ease-in-out infinite;

  pointer-events: none;
}

/* ==========================================================================
   BRAND SIDE
   ========================================================================== */

.ss-auth-brand {
  position: relative;

  padding: 52px 44px;

  border-right: 1px solid rgba(255,255,255,.065);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
}

.ss-brand-light {
  position: absolute;

  width: 300px;
  height: 300px;

  top: -150px;
  left: -150px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(139,92,246,.2),
      transparent 70%
    );

  pointer-events: none;
}

.ss-brand-top {
  position: relative;
  z-index: 1;
}

.ss-brand-mark {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 34px;

  border: 1px solid rgba(255,255,255,.12);

  background:
    linear-gradient(
      145deg,
      rgba(139,92,246,.28),
      rgba(139,92,246,.04)
    );

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.12),
    0 12px 35px rgba(108,92,231,.15);

  position: relative;
}

.ss-brand-mark::before {
  content: "";

  position: absolute;
  inset: 7px;

  border: 1px solid rgba(201,184,255,.5);

  transform: rotate(45deg);

  animation: ss-mark-spin 10s linear infinite;
}

.ss-brand-mark span {
  font-family: "Bricolage Grotesque", sans-serif;

  font-size: 16px;
  font-weight: 800;

  color: white;

  position: relative;
  z-index: 2;
}

.ss-brand-kicker {
  font-family: "JetBrains Mono", monospace;

  font-size: 10px;

  letter-spacing: .18em;
  text-transform: uppercase;

  color: var(--purple-light);

  margin-bottom: 15px;
}

.ss-brand-title {
  font-family: "Bricolage Grotesque", sans-serif;

  font-size: clamp(35px, 4vw, 49px);

  line-height: .98;

  letter-spacing: -.045em;

  font-weight: 800;

  max-width: 340px;

  margin: 0;
}

.ss-brand-title span {
  display: block;

  background:
    linear-gradient(
      100deg,
      #fff,
      #b8a4ff 48%,
      #7f63e9
    );

  -webkit-background-clip: text;
  background-clip: text;

  color: transparent;
}

.ss-brand-description {
  max-width: 320px;

  margin-top: 22px;

  color: var(--muted);

  font-size: 13px;

  line-height: 1.8;
}

.ss-brand-bottom {
  position: relative;
  z-index: 2;
}

.ss-status-line {
  display: flex;
  align-items: center;

  gap: 9px;

  font-family: "JetBrains Mono", monospace;

  font-size: 10px;

  letter-spacing: .08em;

  color: #625d70;

  text-transform: uppercase;
}

.ss-status-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #2dd4a0;

  box-shadow:
    0 0 0 4px rgba(45,212,160,.07),
    0 0 12px rgba(45,212,160,.7);

  animation: ss-status-pulse 2s ease-in-out infinite;
}

.ss-brand-line {
  width: 100%;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,.08),
      transparent
    );

  margin-bottom: 16px;
}

/* ==========================================================================
   FORM SIDE
   ========================================================================== */

.ss-auth-form {
  padding: 52px 52px;

  display: flex;
  align-items: center;

  position: relative;
}

.ss-form-inner {
  width: 100%;
  max-width: 390px;
  margin: auto;
}

/* ==========================================================================
   FORM HEADER
   ========================================================================== */

.ss-form-header {
  margin-bottom: 34px;
}

.ss-form-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 9px;

  font-family: "JetBrains Mono", monospace;

  font-size: 9px;

  letter-spacing: .16em;

  text-transform: uppercase;

  color: #777080;

  margin-bottom: 13px;
}

.ss-form-eyebrow::before {
  content: "";

  width: 20px;
  height: 1px;

  background:
    linear-gradient(
      90deg,
      var(--purple),
      transparent
    );
}

.ss-form-title {
  font-family: "Bricolage Grotesque", sans-serif;

  font-size: 34px;

  line-height: 1;

  letter-spacing: -.04em;

  font-weight: 700;

  color: #f7f5fc;

  margin: 0 0 10px;
}

.ss-form-subtitle {
  font-size: 13px;

  color: #777181;

  line-height: 1.65;

  margin: 0;
}

/* ==========================================================================
   ERROR
   ========================================================================== */

.ss-error {
  display: flex;
  align-items: flex-start;
  gap: 11px;

  padding: 12px 13px;

  margin-bottom: 22px;

  border: 1px solid rgba(244,82,82,.2);

  background:
    linear-gradient(
      135deg,
      rgba(244,82,82,.09),
      rgba(244,82,82,.025)
    );

  color: #ef9292;

  font-family: "JetBrains Mono", monospace;

  font-size: 10.5px;

  line-height: 1.55;

  animation: ss-shake .35s ease;
}

.ss-error-icon {
  width: 17px;
  height: 17px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(244,82,82,.3);

  color: #ff8989;

  font-size: 9px;
}

/* ==========================================================================
   FIELDS
   ========================================================================== */

.ss-field {
  margin-bottom: 21px;
}

.ss-field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 8px;
}

.ss-field-label {
  font-family: "JetBrains Mono", monospace;

  font-size: 9.5px;

  letter-spacing: .13em;

  text-transform: uppercase;

  color: #777080;
}

.ss-field-required {
  font-size: 9px;
  color: #4e485b;
}

.ss-input-wrap {
  position: relative;
}

.ss-input {
  width: 100%;

  height: 50px;

  border: 1px solid rgba(255,255,255,.085);

  background:
    linear-gradient(
      135deg,
      rgba(255,255,255,.045),
      rgba(255,255,255,.018)
    );

  color: #eeeaf7;

  outline: none;

  padding: 0 15px;

  font-family: "Inter", sans-serif;

  font-size: 13px;

  transition:
    border-color .25s var(--ease),
    background .25s var(--ease),
    box-shadow .25s var(--ease),
    transform .25s var(--ease);
}

.ss-input::placeholder {
  color: #484352;
}

.ss-input:hover {
  border-color: rgba(255,255,255,.14);

  background:
    rgba(255,255,255,.05);
}

.ss-input:focus {
  border-color: rgba(139,92,246,.6);

  background:
    rgba(139,92,246,.055);

  box-shadow:
    0 0 0 3px rgba(139,92,246,.08),
    0 12px 30px rgba(0,0,0,.18);
}

.ss-input--password {
  padding-right: 48px;
}

.ss-input-icon {
  position: absolute;

  right: 15px;
  top: 50%;

  transform: translateY(-50%);

  width: 26px;
  height: 26px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 0;

  background: transparent;

  color: #5c5668;

  cursor: pointer;

  transition:
    color .2s ease,
    transform .2s ease;
}

.ss-input-icon:hover {
  color: #b9a2ff;

  transform:
    translateY(-50%)
    scale(1.08);
}

.ss-field-error {
  display: block;

  margin-top: 7px;

  color: #e98484;

  font-family: "JetBrains Mono", monospace;

  font-size: 9.5px;

  letter-spacing: .01em;
}

/* ==========================================================================
   FORGOT
   ========================================================================== */

.ss-form-options {
  display: flex;
  justify-content: flex-end;

  margin-top: -5px;
  margin-bottom: 22px;
}

.ss-forgot {
  color: #817b8f;

  font-size: 11px;

  text-decoration: none;

  transition:
    color .2s ease;
}

.ss-forgot:hover {
  color: #b9a2ff;
}

/* ==========================================================================
   LOGIN BUTTON
   ========================================================================== */

.ss-submit {
  position: relative;

  width: 100%;
  height: 52px;

  border: 1px solid rgba(201,184,255,.22);

  background:
    linear-gradient(
      105deg,
      #6940dc 0%,
      #8159eb 45%,
      #6d48d8 100%
    );

  color: white;

  font-family: "Inter", sans-serif;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: .01em;

  cursor: pointer;

  overflow: hidden;

  box-shadow:
    0 12px 30px rgba(92,62,205,.22),
    inset 0 1px 0 rgba(255,255,255,.18);

  transition:
    transform .25s var(--ease),
    box-shadow .25s var(--ease),
    filter .25s ease;
}

.ss-submit::before {
  content: "";

  position: absolute;

  top: 0;
  left: -100%;

  width: 65%;
  height: 100%;

  background:
    linear-gradient(
      100deg,
      transparent,
      rgba(255,255,255,.16),
      transparent
    );

  transform: skewX(-20deg);

  transition: left .65s var(--ease);
}

.ss-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow:
    0 18px 42px rgba(92,62,205,.32),
    inset 0 1px 0 rgba(255,255,255,.2);

  filter: brightness(1.06);
}

.ss-submit:hover:not(:disabled)::before {
  left: 145%;
}

.ss-submit:active:not(:disabled) {
  transform: translateY(0);
}

.ss-submit:disabled {
  cursor: not-allowed;
  opacity: .62;
}

.ss-submit-content {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;
}

.ss-submit-arrow {
  font-size: 14px;

  transition:
    transform .25s var(--ease);
}

.ss-submit:hover .ss-submit-arrow {
  transform: translateX(4px);
}

.ss-spinner {
  width: 15px;
  height: 15px;

  border: 2px solid rgba(255,255,255,.25);

  border-top-color: white;

  border-radius: 50%;

  animation: ss-spin .65s linear infinite;
}

/* ==========================================================================
   DIVIDER
   ========================================================================== */

.ss-divider {
  display: flex;
  align-items: center;

  gap: 13px;

  margin: 25px 0;
}

.ss-divider-line {
  height: 1px;
  flex: 1;

  background:
    rgba(255,255,255,.06);
}

.ss-divider-text {
  font-family: "JetBrains Mono", monospace;

  font-size: 8px;

  letter-spacing: .15em;

  text-transform: uppercase;

  color: #4d4857;
}

/* ==========================================================================
   REGISTER FOOTER
   ========================================================================== */

.ss-register {
  text-align: center;

  font-size: 11.5px;

  color: #686271;
}

.ss-register a {
  color: #b29cff;

  text-decoration: none;

  font-weight: 600;

  margin-left: 4px;

  position: relative;
}

.ss-register a::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;
  bottom: -3px;

  height: 1px;

  background: currentColor;

  transform:
    scaleX(0);

  transform-origin: right;

  transition:
    transform .25s var(--ease);
}

.ss-register a:hover::after {
  transform:
    scaleX(1);

  transform-origin: left;
}

/* ==========================================================================
   SECURITY NOTE
   ========================================================================== */

.ss-security {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 25px;

  color: #46414f;

  font-family: "JetBrains Mono", monospace;

  font-size: 8.5px;

  letter-spacing: .08em;

  text-transform: uppercase;
}

.ss-security-icon {
  width: 13px;
  height: 13px;

  border: 1px solid #514b5a;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 7px;
}

/* ==========================================================================
   ANIMATIONS
   ========================================================================== */

@keyframes ss-auth-enter {
  from {
    opacity: 0;
    transform:
      translateY(22px)
      scale(.985);
  }

  to {
    opacity: 1;
    transform:
      translateY(0)
      scale(1);
  }
}

@keyframes ss-glass-sweep {
  0%,
  58% {
    left: -420px;
  }

  78%,
  100% {
    left: 110%;
  }
}

@keyframes ss-login-float {
  0%,
  100% {
    transform: translate3d(0,0,0);
  }

  50% {
    transform: translate3d(18px,-24px,0);
  }
}

@keyframes ss-status-pulse {
  0%,
  100% {
    opacity: 1;
    box-shadow:
      0 0 0 4px rgba(45,212,160,.07),
      0 0 12px rgba(45,212,160,.7);
  }

  50% {
    opacity: .55;
    box-shadow:
      0 0 0 7px rgba(45,212,160,0),
      0 0 5px rgba(45,212,160,.25);
  }
}

@keyframes ss-mark-spin {
  to {
    transform: rotate(405deg);
  }
}

@keyframes ss-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ss-shake {
  0%,100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  75% {
    transform: translateX(4px);
  }
}

/* ==========================================================================
   RESPONSIVE
   ========================================================================== */

@media (max-width: 850px) {

  .ss-auth-shell {
    grid-template-columns: 1fr;

    max-width: 470px;

    min-height: auto;
  }

  .ss-auth-brand {
    min-height: 250px;

    padding: 32px;

    border-right: 0;

    border-bottom:
      1px solid rgba(255,255,255,.065);
  }

  .ss-brand-mark {
    width: 36px;
    height: 36px;

    margin-bottom: 24px;
  }

  .ss-brand-title {
    font-size: 35px;
  }

  .ss-brand-description {
    margin-top: 14px;
  }

  .ss-brand-bottom {
    display: none;
  }

  .ss-auth-form {
    padding: 40px 32px;
  }
}

@media (max-width: 520px) {

  .ss-login-main {
    padding:
      35px 14px
      55px;
  }

  .ss-auth-shell {
    border-left: 0;
    border-right: 0;
  }

  .ss-auth-brand {
    padding: 28px 22px;
  }

  .ss-auth-form {
    padding: 34px 22px 38px;
  }

  .ss-form-title {
    font-size: 30px;
  }

  .ss-brand-title {
    font-size: 31px;
  }
}

/* ==========================================================================
   ACCESSIBILITY
   ========================================================================== */

.ss-login button:focus-visible,
.ss-login input:focus-visible,
.ss-login a:focus-visible {
  outline: 2px solid rgba(185,162,255,.8);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {

  .ss-login *,
  .ss-login *::before,
  .ss-login *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
`;

/* ==========================================================================
   ICONS
   ========================================================================== */

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3l18 18" />
        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
        <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 9 4 10 8-0.35 1.4-1.05 2.6-2.05 3.7" />
        <path d="M6.7 6.7C4.7 8 3.4 10 2 12c1 4 4.8 8 10 8 1.5 0 2.9-.3 4.1-.9" />
      </svg>
    );
  }

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LoginArrow() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* ==========================================================================
   LOGIN COMPONENT
   ========================================================================== */

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const loading = useSelector(
    (state) => state.authentication.loading
  );

  const { user, error } = useSelector(
    (state) => state.authentication.authentication
  );

  /* --------------------------------------------------------------------------
     LOGIN
     -------------------------------------------------------------------------- */

  const onSubmit = async (data) => {
    const resultAction = await dispatch(
      userLogin({
        email: data.email,
        password: data.password,
      })
    );

    if (userLogin.fulfilled.match(resultAction)) {
      reset();
      navigate('/profile');
    }

  };

  /* --------------------------------------------------------------------------
     EXISTING USER
     -------------------------------------------------------------------------- */

  useEffect(() => {
    if (user) {
      // Navigate here if routing is enabled:
      // navigate("/profile");
    }
  }, [user]);

  /* --------------------------------------------------------------------------
     UI
     -------------------------------------------------------------------------- */

  return (
    <div className="ss-login">

      <style>{LOGIN_STYLES}</style>

      {/* ================================================================
          BACKGROUND
          ================================================================ */}

      <div className="ss-login-bg">
        <div className="ss-login-grid" />
        <div className="ss-login-noise" />

        <div className="ss-login-glow ss-login-glow--one" />
        <div className="ss-login-glow ss-login-glow--two" />
        <div className="ss-login-glow ss-login-glow--three" />
      </div>

      {/* ================================================================
          NAVBAR
          ================================================================ */}

      <Navbar />

      {/* ================================================================
          MAIN
          ================================================================ */}

      <main className="ss-login-main">

        <section className="ss-auth-shell">

          {/* ============================================================
              LEFT BRAND PANEL
              ============================================================ */}

          <aside className="ss-auth-brand">

            <div className="ss-brand-light" />

            <div className="ss-brand-top">
              
                <img className="w-20 h-20" src={logo} alt="" />

              <div className="ss-brand-kicker">
                StreamSphere
              </div>

              <h1 className="ss-brand-title">
                Your stream.
                <span>Your stage.</span>
              </h1>

              <p className="ss-brand-description">
                Everything you need to create, broadcast,
                connect and build your community. All in one place.
              </p>

            </div>

            <div className="ss-brand-bottom">

              <div className="ss-brand-line" />

              <div className="ss-status-line">
                Login
              </div>

            </div>

          </aside>

          {/* ============================================================
              FORM PANEL
              ============================================================ */}

          <section className="ss-auth-form">

            <div className="ss-form-inner">

              {/* Header */}

              <header className="ss-form-header">

                <div className="ss-form-eyebrow">
                  Member access
                </div>

                <h2 className="ss-form-title">
                  Welcome back.
                </h2>

                <p className="ss-form-subtitle">
                  Sign in to continue to your StreamSphere workspace.
                </p>

              </header>

              {/* Server error */}

              {error && (
                <div
                  className="ss-error"
                  role="alert"
                >
                  <span className="ss-error-icon">
                    !
                  </span>

                  <span>
                    {typeof error === "string"
                      ? error
                      : "Sorry! Can't Login Your Account"}
                  </span>
                </div>
              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >

                {/* EMAIL */}

                <div className="ss-field">

                  <div className="ss-field-label-row">

                    <label
                      className="ss-field-label"
                      htmlFor="email"
                    >
                      Email address
                    </label>

                    <span className="ss-field-required">
                      Required
                    </span>

                  </div>

                  <div className="ss-input-wrap">

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="ss-input"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /\S+@\S+\.\S+/,
                          message: "Enter a valid email address",
                        },
                      })}
                    />

                  </div>

                  {errors.email && (
                    <span
                      className="ss-field-error"
                      role="alert"
                    >
                      {errors.email.message}
                    </span>
                  )}

                </div>

                {/* PASSWORD */}

                <div className="ss-field">

                  <div className="ss-field-label-row">

                    <label
                      className="ss-field-label"
                      htmlFor="password"
                    >
                      Password
                    </label>

                    <span className="ss-field-required">
                      Required
                    </span>

                  </div>

                  <div className="ss-input-wrap">

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="ss-input ss-input--password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 5,
                          message: "Password must be at least 5 characters",
                        },
                      })}
                    />

                    <button
                      type="button"
                      className="ss-input-icon"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      <EyeIcon hidden={!showPassword} />
                    </button>

                  </div>

                  {errors.password && (
                    <span
                      className="ss-field-error"
                      role="alert"
                    >
                      {errors.password.message}
                    </span>
                  )}

                </div>

                {/* FORGOT */}

                <div className="ss-form-options">

                  <a
                    href="/forgot-password"
                    className="ss-forgot"
                  >
                    Forgot your password?
                  </a>

                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="ss-submit"
                  disabled={loading}
                >

                  <span className="ss-submit-content">

                    {loading ? (
                      <>
                        <span className="ss-spinner" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Continue to StreamSphere
                        <span className="ss-submit-arrow">
                          <LoginArrow />
                        </span>
                      </>
                    )}

                  </span>

                </button>
                

              </form>
              <br />
                <GoogleAuthButton />

              {/* Divider */}

              <div className="ss-divider">

                <span className="ss-divider-line" />

                <span className="ss-divider-text">
                  New here?
                </span>

                <span className="ss-divider-line" />

              </div>

              {/* Register */}

              <div className="ss-register">

                Don't have a StreamSphere account?

                <a href="/register">
                  Create one
                </a>

              </div>

              {/* Security */}

              <div className="ss-security">

                <span className="ss-security-icon">
                  ✓
                </span>

                Secure account authentication

              </div>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default Login;