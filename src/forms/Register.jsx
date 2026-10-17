import React, { useState } from "react";
import Navbar from "../pages/Navbar";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../features/authentication/authenticationSlice";
import logo from '../images/logo.png'
import { useNavigate } from "react-router";

const REGISTER_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

.ss-register-page,
.ss-register-page * {
box-sizing: border-box;
}

.ss-register-page {
--bg: #050507;
--surface: #0b0b10;
--surface-2: #101016;
--surface-3: #14141b;

--text: #f5f4f8;
--muted: #858391;
--faint: #55535f;

--purple: #8b5cf6;
--purple-light: #b9a2ff;
--purple-dark: #6840d8;

--cyan: #42d8d2;
--green: #35d39b;
--red: #f08080;

--border: rgba(255,255,255,.085);
--border-hover: rgba(185,162,255,.34);

--ease: cubic-bezier(.16,1,.3,1);

min-height: 100vh;
background:
radial-gradient(
circle at 78% 10%,
rgba(112,78,225,.11),
transparent 28%
),
radial-gradient(
circle at 5% 80%,
rgba(35,175,172,.055),
transparent 25%
),
var(--bg);

color: var(--text);
font-family: "Inter", sans-serif;

position: relative;
overflow: hidden;

isolation: isolate;

-webkit-font-smoothing: antialiased;
}

/* =========================================================
BACKGROUND
========================================================= */

.ss-register-background {
position: fixed;
inset: 0;
pointer-events: none;
z-index: -1;
overflow: hidden;
}

.ss-register-grid {
position: absolute;
inset: 0;

background-image:
linear-gradient(
rgba(255,255,255,.018) 1px,
transparent 1px
),
linear-gradient(
90deg,
rgba(255,255,255,.018) 1px,
transparent 1px
);

background-size: 72px 72px;

mask-image:
linear-gradient(
to bottom,
rgba(0,0,0,.7),
transparent 82%
);

opacity: .42;
}

.ss-register-orb {
position: absolute;
border-radius: 50%;
filter: blur(100px);
pointer-events: none;
opacity: .13;
animation: ssRegisterFloat 12s ease-in-out infinite;
}

.ss-register-orb--one {
width: 420px;
height: 420px;
top: -230px;
right: -130px;
background: #7144ec;
}

.ss-register-orb--two {
width: 330px;
height: 330px;
bottom: -220px;
left: -130px;
background: #159f9b;
animation-delay: -5s;
}

.ss-register-noise {
position: absolute;
inset: 0;

opacity: .025;

background-image:
url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* =========================================================
MAIN
========================================================= */

.ss-register-main {
min-height: calc(100vh - 72px);

display: flex;
align-items: center;
justify-content: center;

padding: 58px 24px 72px;

position: relative;
z-index: 1;
}

/* =========================================================
AUTH SHELL
========================================================= */

.ss-register-shell {
width: min(100%, 1040px);

display: grid;
grid-template-columns: .92fr 1.08fr;

min-height: 650px;

border: 1px solid var(--border);

background:
linear-gradient(
135deg,
rgba(255,255,255,.035),
rgba(255,255,255,.012)
);

box-shadow:
0 40px 100px rgba(0,0,0,.48),
inset 0 1px 0 rgba(255,255,255,.045);

backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);

position: relative;

overflow: hidden;

animation:
ssRegisterEnter .7s var(--ease) both;
}

.ss-register-shell::before {
content: "";

position: absolute;

top: 0;
left: 7%;
right: 7%;

height: 1px;

background:
linear-gradient(
90deg,
transparent,
rgba(185,162,255,.7),
transparent
);

z-index: 5;
}

/* =========================================================
LEFT PANEL
========================================================= */

.ss-register-brand {
position: relative;

padding: 48px;

border-right: 1px solid var(--border);

display: flex;
flex-direction: column;
justify-content: space-between;

overflow: hidden;
}

.ss-register-brand-glow {
position: absolute;

width: 420px;
height: 420px;

top: -250px;
left: -250px;

border-radius: 50%;

background:
radial-gradient(
circle,
rgba(139,92,246,.2),
transparent 68%
);

pointer-events: none;
}

.ss-register-brand-content {
position: relative;
z-index: 2;
}

/* =========================================================
BRAND MARK
========================================================= */

.ss-register-mark {
width: 44px;
height: 44px;

display: flex;
align-items: center;
justify-content: center;

border: 1px solid rgba(255,255,255,.12);

background:
linear-gradient(
145deg,
rgba(139,92,246,.24),
rgba(139,92,246,.035)
);

margin-bottom: 36px;

position: relative;

box-shadow:
inset 0 1px 0 rgba(255,255,255,.1),
0 14px 40px rgba(91,61,190,.14);
}

.ss-register-mark::before {
content: "";

position: absolute;
inset: 8px;

border: 1px solid rgba(185,162,255,.55);

transform: rotate(45deg);

animation:
ssRegisterSpin 9s linear infinite;
}

.ss-register-mark span {
position: relative;
z-index: 2;

font-family: "Bricolage Grotesque", sans-serif;

font-size: 17px;
font-weight: 800;

color: white;
}

/* =========================================================
BRAND TYPOGRAPHY
========================================================= */

.ss-register-kicker {
font-family: "JetBrains Mono", monospace;

font-size: 9px;

letter-spacing: .18em;

text-transform: uppercase;

color: var(--purple-light);

margin-bottom: 15px;
}

.ss-register-heading {
font-family: "Bricolage Grotesque", sans-serif;

font-size: clamp(40px, 4vw, 57px);

line-height: .96;

letter-spacing: -.055em;

font-weight: 800;

max-width: 390px;

margin: 0;
}

.ss-register-heading span {
display: block;

background:
linear-gradient(
105deg,
#ffffff 5%,
#c0adff 52%,
#8061e9 100%
);

-webkit-background-clip: text;
background-clip: text;

color: transparent;
}

.ss-register-description {
max-width: 350px;

margin-top: 22px;

color: var(--muted);

font-size: 13px;

line-height: 1.8;
}

/* =========================================================
PRODUCT PREVIEW
========================================================= */

.ss-register-preview {
margin-top: 44px;

width: 100%;

border: 1px solid rgba(255,255,255,.075);

background:
rgba(255,255,255,.018);

padding: 15px;

position: relative;

box-shadow:
inset 0 1px 0 rgba(255,255,255,.035);
}

.ss-preview-top {
display: flex;
align-items: center;
justify-content: space-between;

padding-bottom: 13px;

border-bottom: 1px solid rgba(255,255,255,.055);

margin-bottom: 13px;
}

.ss-preview-dots {
display: flex;
gap: 5px;
}

.ss-preview-dot {
width: 5px;
height: 5px;
border-radius: 50%;
background: #45434c;
}

.ss-preview-label {
font-family: "JetBrains Mono", monospace;

font-size: 7px;

letter-spacing: .13em;

text-transform: uppercase;

color: #56535f;
}

.ss-preview-body {
display: grid;
grid-template-columns: 1fr 1fr;

gap: 8px;
}

.ss-preview-card {
height: 76px;

border: 1px solid rgba(255,255,255,.055);

background:
linear-gradient(
145deg,
rgba(139,92,246,.07),
rgba(255,255,255,.012)
);

padding: 12px;

display: flex;
flex-direction: column;
justify-content: space-between;
}

.ss-preview-card--wide {
grid-column: span 2;
height: 54px;
}

.ss-preview-line {
width: 42%;

height: 5px;

background: rgba(255,255,255,.08);
}

.ss-preview-line--short {
width: 24%;
}

.ss-preview-line--purple {
width: 58%;

background:
linear-gradient(
90deg,
rgba(139,92,246,.65),
rgba(139,92,246,.12)
);
}

.ss-preview-bars {
height: 24px;

display: flex;
align-items: flex-end;

gap: 3px;
}

.ss-preview-bars span {
flex: 1;

background:
linear-gradient(
to top,
rgba(139,92,246,.55),
rgba(139,92,246,.08)
);

animation:
ssBarPulse 2.4s ease-in-out infinite;
}

.ss-preview-bars span:nth-child(1) {
height: 35%;
}

.ss-preview-bars span:nth-child(2) {
height: 65%;
animation-delay: -.3s;
}

.ss-preview-bars span:nth-child(3) {
height: 48%;
animation-delay: -.6s;
}

.ss-preview-bars span:nth-child(4) {
height: 85%;
animation-delay: -.9s;
}

.ss-preview-bars span:nth-child(5) {
height: 58%;
animation-delay: -1.2s;
}

.ss-preview-bars span:nth-child(6) {
height: 72%;
animation-delay: -1.5s;
}

/* =========================================================
BRAND FOOTER
========================================================= */

.ss-register-brand-footer {
position: relative;
z-index: 2;

padding-top: 25px;

border-top: 1px solid rgba(255,255,255,.06);

display: flex;
align-items: center;
justify-content: space-between;

gap: 20px;
}

.ss-register-status {
display: flex;
align-items: center;
gap: 9px;

color: #5f5c68;

font-family: "JetBrains Mono", monospace;

font-size: 8px;

letter-spacing: .08em;

text-transform: uppercase;
}

.ss-status-dot {
width: 6px;
height: 6px;

flex-shrink: 0;

border-radius: 50%;

background: var(--green);

box-shadow:
0 0 0 4px rgba(53,211,155,.06),
0 0 13px rgba(53,211,155,.55);

animation:
ssStatusPulse 2.2s ease-in-out infinite;
}

.ss-register-version {
color: #414049;

font-family: "JetBrains Mono", monospace;

font-size: 8px;
}

/* =========================================================
FORM PANEL
========================================================= */

.ss-register-form {
padding: 48px 56px;

display: flex;
align-items: center;

position: relative;
}

.ss-register-form-inner {
width: 100%;
max-width: 420px;
margin: auto;
}

/* =========================================================
FORM HEADER
========================================================= */

.ss-form-kicker {
display: flex;
align-items: center;
gap: 9px;

font-family: "JetBrains Mono", monospace;

font-size: 9px;

letter-spacing: .16em;

text-transform: uppercase;

color: #686571;

margin-bottom: 14px;
}

.ss-form-kicker::before {
content: "";

width: 22px;
height: 1px;

background:
linear-gradient(
90deg,
var(--purple),
transparent
);
}

.ss-register-title {
font-family: "Bricolage Grotesque", sans-serif;

font-size: 36px;

line-height: 1;

letter-spacing: -.045em;

font-weight: 700;

margin: 0 0 11px;
}

.ss-register-subtitle {
color: #77737f;

font-size: 12.5px;

line-height: 1.7;

margin: 0 0 30px;
}

/* =========================================================
ERROR
========================================================= */

.ss-register-error {
display: flex;
align-items: flex-start;

gap: 11px;

padding: 12px 13px;

margin-bottom: 22px;

border: 1px solid rgba(240,128,128,.2);

background:
linear-gradient(
135deg,
rgba(240,128,128,.09),
rgba(240,128,128,.025)
);

color: #ee9292;

font-family: "JetBrains Mono", monospace;

font-size: 9.5px;

line-height: 1.55;

animation:
ssRegisterShake .35s ease;
}

.ss-register-error-icon {
width: 17px;
height: 17px;

display: flex;
align-items: center;
justify-content: center;

flex-shrink: 0;

border: 1px solid rgba(240,128,128,.3);

color: #ff9999;

font-size: 9px;
}

/* =========================================================
FIELDS
========================================================= */

.ss-register-field {
margin-bottom: 18px;
}

.ss-register-label-row {
display: flex;
align-items: center;
justify-content: space-between;

margin-bottom: 8px;
}

.ss-register-label {
font-family: "JetBrains Mono", monospace;

font-size: 9px;

letter-spacing: .12em;

text-transform: uppercase;

color: #77727f;
}

.ss-register-required {
color: #47444e;

font-family: "JetBrains Mono", monospace;

font-size: 8px;

text-transform: uppercase;
}

.ss-register-input-wrap {
position: relative;
}

.ss-register-input {
width: 100%;

height: 49px;

padding: 0 14px;

border: 1px solid rgba(255,255,255,.085);

background:
linear-gradient(
135deg,
rgba(255,255,255,.04),
rgba(255,255,255,.015)
);

color: #f0eef5;

outline: none;

font-family: "Inter", sans-serif;

font-size: 12.5px;

transition:
border-color .25s var(--ease),
background .25s var(--ease),
box-shadow .25s var(--ease),
transform .25s var(--ease);
}

.ss-register-input:hover {
border-color: rgba(255,255,255,.14);
}

.ss-register-input:focus {
border-color: rgba(139,92,246,.62);

background:
rgba(139,92,246,.045);

box-shadow:
0 0 0 3px rgba(139,92,246,.075),
0 10px 25px rgba(0,0,0,.16);
}

.ss-register-input::placeholder {
color: #46434e;
}

.ss-register-input.has-error {
border-color: rgba(240,128,128,.42);
}

.ss-register-input.has-error:focus {
box-shadow:
0 0 0 3px rgba(240,128,128,.06);
}

.ss-password-input {
padding-right: 48px;
}

.ss-password-toggle {
position: absolute;

right: 11px;
top: 50%;

width: 28px;
height: 28px;

transform: translateY(-50%);

border: 0;

background: transparent;

color: #5d5966;

cursor: pointer;

display: flex;
align-items: center;
justify-content: center;

transition:
color .2s ease,
transform .2s var(--ease);
}

.ss-password-toggle:hover {
color: var(--purple-light);

transform:
translateY(-50%)
scale(1.06);
}

.ss-field-error {
display: block;

margin-top: 7px;

color: #e98b8b;

font-family: "JetBrains Mono", monospace;

font-size: 8.5px;
}

/* =========================================================
PASSWORD STRENGTH
========================================================= */

.ss-password-strength {
display: flex;

align-items: center;

gap: 7px;

margin-top: 8px;
}

.ss-strength-bars {
display: flex;

gap: 3px;

flex: 1;
}

.ss-strength-bar {
height: 2px;

flex: 1;

background: rgba(255,255,255,.08);

transition:
background .25s ease,
transform .25s var(--ease);
}

.ss-strength-bar.active {
background: var(--purple);
}

.ss-strength-text {
min-width: 48px;

text-align: right;

font-family: "JetBrains Mono", monospace;

font-size: 7px;

text-transform: uppercase;

letter-spacing: .08em;

color: #57535f;
}

/* =========================================================
SUBMIT
========================================================= */

.ss-register-submit {
position: relative;

width: 100%;
height: 51px;

margin-top: 5px;

border: 1px solid rgba(201,184,255,.2);

background:
linear-gradient(
105deg,
#6940dc,
#8058e9 48%,
#6c46d7
);

color: white;

font-family: "Inter", sans-serif;

font-size: 11.5px;

font-weight: 700;

letter-spacing: .01em;

cursor: pointer;

overflow: hidden;

box-shadow:
0 13px 32px rgba(89,59,198,.23),
inset 0 1px 0 rgba(255,255,255,.16);

transition:
transform .25s var(--ease),
box-shadow .25s var(--ease),
filter .25s ease;
}

.ss-register-submit::before {
content: "";

position: absolute;

top: 0;
left: -110%;

width: 62%;
height: 100%;

background:
linear-gradient(
100deg,
transparent,
rgba(255,255,255,.18),
transparent
);

transform: skewX(-20deg);

transition:
left .7s var(--ease);
}

.ss-register-submit:hover:not(:disabled) {
transform: translateY(-2px);

filter: brightness(1.06);

box-shadow:
0 18px 40px rgba(89,59,198,.32),
inset 0 1px 0 rgba(255,255,255,.2);
}

.ss-register-submit:hover:not(:disabled)::before {
left: 145%;
}

.ss-register-submit:active:not(:disabled) {
transform: translateY(0) scale(.995);
}

.ss-register-submit:disabled {
cursor: not-allowed;
opacity: .58;
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
display: flex;

transition:
transform .25s var(--ease);
}

.ss-register-submit:hover .ss-submit-arrow {
transform: translateX(4px);
}

.ss-spinner {
width: 14px;
height: 14px;

border-radius: 50%;

border: 2px solid rgba(255,255,255,.24);

border-top-color: white;

animation:
ssSpinner .65s linear infinite;
}

/* =========================================================
FORM FOOTER
========================================================= */

.ss-register-login {
margin-top: 22px;

text-align: center;

color: #68646f;

font-size: 10.5px;
}

.ss-register-login a {
color: var(--purple-light);

text-decoration: none;

font-weight: 600;

margin-left: 4px;

position: relative;
}

.ss-register-login a::after {
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

.ss-register-login a:hover::after {
transform:
scaleX(1);

transform-origin: left;
}

/* =========================================================
SECURITY
========================================================= */

.ss-register-security {
display: flex;

align-items: center;
justify-content: center;

gap: 7px;

margin-top: 23px;

color: #45414c;

font-family: "JetBrains Mono", monospace;

font-size: 7.5px;

letter-spacing: .08em;

text-transform: uppercase;
}

.ss-security-icon {
width: 13px;
height: 13px;

border: 1px solid #504b58;

display: flex;
align-items: center;
justify-content: center;

font-size: 7px;
}

/* =========================================================
FOCUS
========================================================= */

.ss-register-page button:focus-visible,
.ss-register-page input:focus-visible,
.ss-register-page a:focus-visible {
outline: 2px solid rgba(185,162,255,.85);
outline-offset: 3px;
}

/* =========================================================
ANIMATIONS
========================================================= */

@keyframes ssRegisterEnter {
from {
opacity: 0;
transform:
translateY(20px)
scale(.988);
}

to {
opacity: 1;
transform:
translateY(0)
scale(1);
}
}

@keyframes ssRegisterFloat {
0%,
100% {
transform: translate3d(0,0,0);
}

50% {
transform: translate3d(20px,-20px,0);
}
}

@keyframes ssRegisterSpin {
to {
transform: rotate(405deg);
}
}

@keyframes ssBarPulse {
0%,
100% {
opacity: .55;
transform: scaleY(.88);
}

50% {
opacity: 1;
transform: scaleY(1);
}
}

@keyframes ssStatusPulse {
0%,
100% {
opacity: 1;
box-shadow:
0 0 0 4px rgba(53,211,155,.06),
0 0 13px rgba(53,211,155,.55);
}

50% {
opacity: .55;
box-shadow:
0 0 0 7px rgba(53,211,155,0),
0 0 5px rgba(53,211,155,.22);
}
}

@keyframes ssSpinner {
to {
transform: rotate(360deg);
}
}

@keyframes ssRegisterShake {
0%,
100% {
transform: translateX(0);
}

25% {
transform: translateX(-4px);
}

75% {
transform: translateX(4px);
}
}

/* =========================================================
TABLET
========================================================= */

@media (max-width: 860px) {
.ss-register-main {
padding-top: 38px;
}

.ss-register-shell {
grid-template-columns: 1fr;


max-width: 500px;

min-height: auto;

}

.ss-register-brand {
min-height: 390px;

padding: 36px;

border-right: 0;

border-bottom: 1px solid var(--border);

}

.ss-register-heading {
font-size: 42px;
}

.ss-register-preview {
margin-top: 28px;
}

.ss-register-brand-footer {
display: none;
}

.ss-register-form {
padding: 42px 36px 45px;
}
}

/* =========================================================
MOBILE
========================================================= */

@media (max-width: 540px) {
.ss-register-main {
padding:
28px 13px
45px;
}

.ss-register-shell {
border-left: 0;
border-right: 0;
}

.ss-register-brand {
min-height: 335px;

padding: 30px 22px;

}

.ss-register-mark {
width: 38px;
height: 38px;

margin-bottom: 27px;


}

.ss-register-heading {
font-size: 35px;
}

.ss-register-description {
font-size: 12px;


margin-top: 17px;


}

.ss-register-preview {
display: none;
}

.ss-register-form {
padding:
34px 22px
38px;
}

.ss-register-title {
font-size: 31px;
}

.ss-register-input {
height: 50px;
}
}

/* =========================================================
REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
.ss-register-page *,
.ss-register-page *::before,
.ss-register-page *::after {
animation-duration: .01ms !important;
animation-iteration-count: 1 !important;
transition-duration: .01ms !important;
}
}
`;

/* =========================================================
ICONS
========================================================= */

function EyeIcon({ hidden }) {
if (hidden) {
return ( <svg
     width="15"
     height="15"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="1.7"
     strokeLinecap="round"
     strokeLinejoin="round"
     aria-hidden="true"
   > <path d="M3 3l18 18" /> <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" /> <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5.2 0 9 4 10 8-0.35 1.4-1.05 2.6-2.05 3.7" /> <path d="M6.7 6.7C4.7 8 3.4 10 2 12c1 4 4.8 8 10 8 1.5 0 2.9-.3 4.1-.9" /> </svg>
);
}

return ( <svg
   width="15"
   height="15"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="1.7"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
 > <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /> <circle cx="12" cy="12" r="3" /> </svg>
);
}

function ArrowIcon() {
return ( <svg
   width="15"
   height="15"
   viewBox="0 0 24 24"
   fill="none"
   stroke="currentColor"
   strokeWidth="2"
   strokeLinecap="round"
   strokeLinejoin="round"
   aria-hidden="true"
 > <path d="M5 12h13" /> <path d="m13 6 6 6-6 6" /> </svg>
);
}

/* =========================================================
REGISTER COMPONENT
========================================================= */

function Register() {
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const navigate = useNavigate()

const {
register,
handleSubmit,
watch,
formState: { errors },
reset,
} = useForm();

const dispatch = useDispatch();

const loading = useSelector(
(state) => state.authentication.loading
);

const { error } = useSelector(
(state) => state.authentication.authentication
);

const passwordValue = watch("password", "");

const passwordStrength =
passwordValue.length >= 10
? 4
: passwordValue.length >= 8
? 3
: passwordValue.length >= 5
? 2
: passwordValue.length > 0
? 1
: 0;

const strengthLabel =
passwordStrength === 4
? "Strong"
: passwordStrength === 3
? "Good"
: passwordStrength === 2
? "Fair"
: passwordStrength === 1
? "Weak"
: "";

const onSubmit = async (data) => {

const resultAction = await dispatch(
userRegister({
name: data.name,
email: data.email,
password: data.password,
}));

if (userRegister.fulfilled.match(resultAction)) {
  reset()
  navigate('/login')
}


};

return ( <div className="ss-register-page"> <style>{REGISTER_STYLES}</style>
  <div className="ss-register-background" aria-hidden="true">
    <div className="ss-register-grid" />
    <div className="ss-register-noise" />
    <div className="ss-register-orb ss-register-orb--one" />
    <div className="ss-register-orb ss-register-orb--two" />
  </div>

  <Navbar />

  <main className="ss-register-main">
    <section className="ss-register-shell" aria-label="Create StreamSphere account">

      {/* =====================================================
          BRAND PANEL
      ===================================================== */}

      <aside className="ss-register-brand">
        <div className="ss-register-brand-glow" />

        <div className="ss-register-brand-content">

          <img className="w-20 h-20" src={logo} alt="" />

          <div className="ss-register-kicker">
            StreamSphere
          </div>

          <h1 className="ss-register-heading">
            Build your
            <span>streaming world.</span>
          </h1>

          <p className="ss-register-description">
            Create your StreamSphere account and bring your streams,
            community, clips and digital presence together in one place.
          </p>

          <div className="ss-register-preview" aria-hidden="true">

            <div className="ss-preview-top">
              <div className="ss-preview-dots">
                <span className="ss-preview-dot" />
                <span className="ss-preview-dot" />
                <span className="ss-preview-dot" />
              </div>

              <span className="ss-preview-label">
                StreamSphere / Dashboard
              </span>
            </div>

            <div className="ss-preview-body">

              <div className="ss-preview-card">
                <span className="ss-preview-line" />
                <div className="ss-preview-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="ss-preview-card">
                <span className="ss-preview-line ss-preview-line--short" />
                <span className="ss-preview-line ss-preview-line--purple" />
              </div>

              <div className="ss-preview-card ss-preview-card--wide">
                <span className="ss-preview-line" />
              </div>

            </div>
          </div>

        </div>

        <div className="ss-register-brand-footer">

          <div className="ss-register-status">
            Sign-In
          </div>

          <div className="ss-register-version">
          </div>

        </div>
      </aside>

      {/* =====================================================
          FORM PANEL
      ===================================================== */}

      <section className="ss-register-form">

        <div className="ss-register-form-inner">

          <div className="ss-form-kicker">
            Member registration
          </div>

          <h2 className="ss-register-title">
            Create your account.
          </h2>

          <p className="ss-register-subtitle">
            Start building your StreamSphere identity.
            It only takes a moment.
          </p>

          {error && (
            <div
              className="ss-register-error"
              role="alert"
              aria-live="polite"
            >
              <span className="ss-register-error-icon">
                !
              </span>

              <span>
                {typeof error === "string"
                  ? error
                  : error?.message || "Registration failed"}
              </span>
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >

            {/* NAME */}

            <div className="ss-register-field">

              <div className="ss-register-label-row">
                <label
                  className="ss-register-label"
                  htmlFor="name"
                >
                  Display name
                </label>

                <span className="ss-register-required">
                  Required
                </span>
              </div>

              <div className="ss-register-input-wrap">

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="NightOwlTV"
                  className={
                    "ss-register-input" +
                    (errors.name ? " has-error" : "")
                  }
                  {...register("name", {
                    required: "Name is required",
                  })}
                />

              </div>

              {errors.name && (
                <span
                  className="ss-field-error"
                  role="alert"
                >
                  {errors.name.message}
                </span>
              )}

            </div>

            {/* EMAIL */}

            <div className="ss-register-field">

              <div className="ss-register-label-row">
                <label
                  className="ss-register-label"
                  htmlFor="email"
                >
                  Email address
                </label>

                <span className="ss-register-required">
                  Required
                </span>
              </div>

              <div className="ss-register-input-wrap">

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={
                    "ss-register-input" +
                    (errors.email ? " has-error" : "")
                  }
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

            <div className="ss-register-field">

              <div className="ss-register-label-row">
                <label
                  className="ss-register-label"
                  htmlFor="password"
                >
                  Password
                </label>

                <span className="ss-register-required">
                  Required
                </span>
              </div>

              <div className="ss-register-input-wrap">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  className={
                    "ss-register-input ss-password-input" +
                    (errors.password ? " has-error" : "")
                  }
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
                  className="ss-password-toggle"
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

              {passwordValue.length > 0 && !errors.password && (
                <div className="ss-password-strength">

                  <div className="ss-strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className={
                          "ss-strength-bar" +
                          (level <= passwordStrength
                            ? " active"
                            : "")
                        }
                      />
                    ))}
                  </div>

                  <span className="ss-strength-text">
                    {strengthLabel}
                  </span>

                </div>
              )}

              {errors.password && (
                <span
                  className="ss-field-error"
                  role="alert"
                >
                  {errors.password.message}
                </span>
              )}

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="ss-register-field">

              <div className="ss-register-label-row">
                <label
                  className="ss-register-label"
                  htmlFor="confirmPassword"
                >
                  Confirm password
                </label>

                <span className="ss-register-required">
                  Required
                </span>
              </div>

              <div className="ss-register-input-wrap">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className={
                    "ss-register-input ss-password-input" +
                    (errors.confirmPassword
                      ? " has-error"
                      : "")
                  }
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue ||
                      "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  className="ss-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                >
                  <EyeIcon hidden={!showConfirmPassword} />
                </button>

              </div>

              {errors.confirmPassword && (
                <span
                  className="ss-field-error"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </span>
              )}

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="ss-register-submit"
              disabled={loading}
            >
              <span className="ss-submit-content">

                {loading ? (
                  <>
                    <span
                      className="ss-spinner"
                      aria-hidden="true"
                    />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create your StreamSphere account
                    <span className="ss-submit-arrow">
                      <ArrowIcon />
                    </span>
                  </>
                )}

              </span>
            </button>

          </form>

          {/* LOGIN */}

          <div className="ss-register-login">
            Already have a StreamSphere account?

            <a href="/login">
              Log in
            </a>
          </div>

          {/* SECURITY */}

          <div className="ss-register-security">
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

export default Register;
