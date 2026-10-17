import { useState, useEffect, useRef } from "react";
import logo from "../images/logo.png";

const LINK_GROUPS = [
  {
    title: "Product",
    links: [
      "Dashboard",
      "Analytics",
      "Stream Manager",
      "Clip Editor",
      "Overlay Studio",
      "Alert Builder",
    ],
  },
  {
    title: "Community",
    links: [
      "Browse Posts",
      "Live Rooms",
      "Member Directory",
      "Events",
      "Leaderboard",
      "Creator Fund",
    ],
  },
  {
    title: "Resources",
    links: [
      "Documentation",
      "API Reference",
      "Blog",
      "Changelog",
      "Help Center",
    ],
  },
  {
    title: "Company",
    links: [
      "About",
      "Careers",
      "Press",
      "Partnerships",
      "Contact",
    ],
  },
];

const SOCIALS = [
  { name: "Twitch", mono: "T", col: "#9b59b6" },
  { name: "YouTube", mono: "YT", col: "#e74c3c" },
  { name: "Kick", mono: "K", col: "#1abc9c" },
  { name: "Discord", mono: "D", col: "#6c5ce7" },
  { name: "X", mono: "X", col: "#e0e0f0" },
];

const LEGAL = [
  "Terms",
  "Privacy",
  "Cookies",
  "Accessibility",
  "DMCA",
];

/* =========================================================
   ANIMATED WAVEFORM
========================================================= */

function WaveformStrip({ height = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame;
    let width = 0;
    let actualHeight = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      const ratio = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      width = rect.width;
      actualHeight = rect.height;

      canvas.width = width * ratio;
      canvas.height = actualHeight * ratio;

      ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
      );
    };

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    const points = Array.from(
      { length: 150 },
      (_, i) =>
        Math.sin(i * 0.25) * 0.2
    );

    let time = 0;

    const draw = () => {
      time += 0.035;

      points.shift();

      const value =
        Math.sin(time * 1.7) * 0.3 +
        Math.sin(time * 3.3) * 0.13 +
        Math.sin(time * 6.2) * 0.06 +
        (Math.random() - 0.5) * 0.12;

      points.push(
        Math.max(
          -1,
          Math.min(1, value)
        )
      );

      ctx.clearRect(
        0,
        0,
        width,
        actualHeight
      );

      const center =
        actualHeight / 2;

      const step =
        width / (points.length - 1);

      const gradient =
        ctx.createLinearGradient(
          0,
          0,
          width,
          0
        );

      gradient.addColorStop(
        0,
        "#6c5ce7"
      );

      gradient.addColorStop(
        0.5,
        "#a29bfe"
      );

      gradient.addColorStop(
        1,
        "#1abc9c"
      );

      /* glow line */
      ctx.beginPath();

      points.forEach((value, index) => {
        const x = index * step;

        const y =
          center -
          value *
            center *
            0.78;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineWidth = 3;

      ctx.strokeStyle =
        "rgba(108,92,231,.08)";

      ctx.shadowBlur = 18;

      ctx.shadowColor =
        "rgba(108,92,231,.55)";

      ctx.stroke();

      /* main line */
      ctx.beginPath();

      points.forEach((value, index) => {
        const x = index * step;

        const y =
          center -
          value *
            center *
            0.78;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineWidth = 1.1;
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 0;
      ctx.stroke();

      /* subtle fill */
      ctx.lineTo(width, center);
      ctx.lineTo(0, center);
      ctx.closePath();

      ctx.fillStyle =
        "rgba(108,92,231,.025)";

      ctx.fill();

      animationFrame =
        requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height,
        display: "block",
      }}
    />
  );
}

/* =========================================================
   SCROLL REVEAL
========================================================= */

function useInView(
  threshold = 0.12
) {
  const ref = useRef(null);

  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

function Reveal({
  children,
  delay = 0,
}) {
  const [ref, visible] =
    useInView();

  return (
    <div
      ref={ref}
      className={
        visible
          ? "footer-reveal footer-visible"
          : "footer-reveal"
      }
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   LOGO
========================================================= */

function Logo({ size = 34 }) {
  return (
    <div
      className="footer-logo"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <img
        src={logo}
        alt="StreamSphere"
        style={{
          width: size * 2,
          height: size * 2,
          objectFit: "contain",
          display: "block",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          fontWeight: 900,
          fontSize: size * 0.5,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        Stream
        <span
          style={{
            background:
              "linear-gradient(90deg,#a29bfe,#6c5ce7)",
            WebkitBackgroundClip:
              "text",
            WebkitTextFillColor:
              "transparent",
          }}
        >
          Sphere
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

.ssf{
  position:relative;
  overflow:hidden;

  background:
    radial-gradient(
      circle at 80% 20%,
      rgba(108,92,231,.07),
      transparent 30%
    ),
    radial-gradient(
      circle at 15% 80%,
      rgba(26,188,156,.025),
      transparent 28%
    ),
    #05050a;

  color:#e0e0f0;

  border-top:1px solid rgba(255,255,255,.06);

  font-family:
    'Inter',
    system-ui,
    sans-serif;
}

.ssf *,
.ssf *::before,
.ssf *::after{
  box-sizing:border-box;
}

.ssf-mono{
  font-family:
    'JetBrains Mono',
    monospace;
}

.ssf-display{
  font-family:
    'Space Grotesk',
    sans-serif;
}


/* =========================================================
   BACKGROUND GRID
========================================================= */

.ssf-grid{
  position:absolute;
  inset:0;

  pointer-events:none;

  opacity:.34;

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

  background-size:
    42px 42px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 82%
    );
}


/* =========================================================
   TOP GLOW
========================================================= */

.ssf-glow{
  position:absolute;

  width:460px;
  height:460px;

  top:-300px;
  right:-100px;

  pointer-events:none;

  background:
    radial-gradient(
      circle,
      rgba(108,92,231,.13),
      transparent 68%
    );

  filter:blur(5px);
}


/* =========================================================
   MAIN CONTAINER
========================================================= */

.ssf-px{
  position:relative;

  max-width:1220px;

  margin:0 auto;

  padding-left:
    clamp(18px,4vw,46px);

  padding-right:
    clamp(18px,4vw,46px);
}


/* =========================================================
   REVEAL
========================================================= */

.footer-reveal{
  opacity:0;

  transform:
    translateY(18px);

  transition:
    opacity .7s
      cubic-bezier(.16,1,.3,1),
    transform .7s
      cubic-bezier(.16,1,.3,1);
}

.footer-visible{
  opacity:1;

  transform:none;
}


/* =========================================================
   WAVE AREA
========================================================= */

.ssf-wave-wrap{
  position:relative;

  height:62px;

  border-bottom:
    1px solid
    rgba(255,255,255,.035);
}

.ssf-wave-fade{
  position:absolute;
  inset:0;

  pointer-events:none;

  background:
    linear-gradient(
      90deg,
      #05050a 0%,
      transparent 9%,
      transparent 91%,
      #05050a 100%
    );
}


/* =========================================================
   LIVE BAR
========================================================= */

.ssf-livebar{
  display:flex;
  align-items:center;
  gap:9px;

  min-height:50px;

  border-bottom:
    1px solid
    rgba(255,255,255,.045);
}

.ssf-live-dot{
  width:6px;
  height:6px;

  flex-shrink:0;

  background:#e74c3c;

  box-shadow:
    0 0 12px
    rgba(231,76,60,.65);

  animation:
    ssf-pulse
    1.6s ease infinite;
}

.ssf-live-text{
  color:#373747;

  font-size:10px;

  letter-spacing:.14em;

  text-transform:uppercase;
}


/* =========================================================
   MAIN
========================================================= */

.ssf-main{
  display:grid;

  grid-template-columns:
    300px
    minmax(0,1fr);

  gap:
    clamp(45px,7vw,80px);

  padding-top:
    clamp(48px,7vw,72px);
}


/* =========================================================
   BRAND
========================================================= */

.ssf-brand{
  position:relative;
}

.ssf-brand-line{
  width:34px;
  height:2px;

  margin-top:22px;

  background:
    linear-gradient(
      90deg,
      #6c5ce7,
      #1abc9c
    );

  box-shadow:
    0 0 14px
    rgba(108,92,231,.45);
}

.ssf-description{
  max-width:290px;

  margin:
    18px 0 25px;

  color:#414154;

  font-size:13px;

  line-height:1.8;
}


/* =========================================================
   CTA
========================================================= */

.ssf-cta-row{
  display:flex;

  gap:8px;

  margin-bottom:25px;
}

.ssf-btn-primary{
  position:relative;

  padding:
    12px 17px;

  overflow:hidden;

  color:#fff;

  border:1px solid
    rgba(255,255,255,.12);

  background:
    linear-gradient(
      110deg,
      #6c5ce7,
      #8d7ff0,
      #6c5ce7
    );

  background-size:200% 100%;

  font-weight:800;
  font-size:11px;

  cursor:pointer;

  font-family:inherit;

  clip-path:
    polygon(
      0 0,
      calc(100% - 8px) 0,
      100% 8px,
      100% 100%,
      0 100%
    );

  box-shadow:
    0 8px 25px
    rgba(108,92,231,.18);

  transition:
    transform .2s,
    box-shadow .2s;
}

.ssf-btn-primary::after{
  content:"";

  position:absolute;

  top:0;
  left:-120%;

  width:70%;
  height:100%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.16),
      transparent
    );

  transform:skewX(-20deg);

  transition:left .5s;
}

.ssf-btn-primary:hover{
  transform:translateY(-2px);

  box-shadow:
    0 14px 32px
    rgba(108,92,231,.3);
}

.ssf-btn-primary:hover::after{
  left:150%;
}

.ssf-btn-secondary{
  padding:
    12px 16px;

  color:#5b5b6c;

  background:
    rgba(255,255,255,.025);

  border:
    1px solid
    rgba(255,255,255,.08);

  font-weight:700;
  font-size:11px;

  cursor:pointer;

  font-family:inherit;

  transition:
    color .2s,
    background .2s,
    border-color .2s,
    transform .2s;

  clip-path:
    polygon(
      0 0,
      calc(100% - 7px) 0,
      100% 7px,
      100% 100%,
      0 100%
    );
}

.ssf-btn-secondary:hover{
  color:#bbb8d5;

  background:
    rgba(108,92,231,.07);

  border-color:
    rgba(108,92,231,.3);

  transform:translateY(-2px);
}


/* =========================================================
   SOCIAL
========================================================= */

.ssf-socials{
  display:flex;

  gap:7px;
}

.ssf-social{
  position:relative;

  width:35px;
  height:35px;

  display:flex;
  align-items:center;
  justify-content:center;

  color:#414151;

  background:
    rgba(255,255,255,.022);

  border:
    1px solid
    rgba(255,255,255,.075);

  font-family:
    'JetBrains Mono',
    monospace;

  font-size:10px;
  font-weight:800;

  cursor:pointer;

  transition:
    transform .22s,
    color .22s,
    border-color .22s,
    box-shadow .22s,
    background .22s;
}

.ssf-social:hover{
  transform:
    translateY(-4px);

  background:
    rgba(255,255,255,.045);
}


/* =========================================================
   LINKS
========================================================= */

.ssf-linkgrid{
  display:grid;

  grid-template-columns:
    repeat(4,minmax(0,1fr));

  gap:
    24px;
}

.ssf-group-title{
  display:flex;
  align-items:center;
  gap:7px;

  margin-bottom:13px;

  color:#303044;

  font-size:9px;
  font-weight:700;

  letter-spacing:.15em;

  text-transform:uppercase;
}

.ssf-group-title::before{
  content:"";

  width:12px;
  height:1px;

  background:
    linear-gradient(
      90deg,
      #6c5ce7,
      transparent
    );
}

.ssf-link{
  position:relative;

  display:flex;
  align-items:center;

  width:max-content;

  gap:6px;

  padding:
    4px 0;

  color:#3d3d51;

  text-decoration:none;

  font-size:12px;

  cursor:pointer;

  transition:
    color .18s,
    transform .18s;
}

.ssf-link:hover{
  color:#aaa4d8;

  transform:
    translateX(3px);
}

.ssf-arrow{
  color:#6c5ce7;

  opacity:0;

  transform:
    translateX(-5px);

  transition:
    opacity .18s,
    transform .18s;
}

.ssf-link:hover
.ssf-arrow{
  opacity:1;

  transform:
    translateX(0);
}


/* =========================================================
   NEWSLETTER
========================================================= */

.ssf-newsletter{
  display:flex;

  align-items:center;
  justify-content:space-between;

  gap:25px;

  margin-top:42px;

  padding:
    22px 0;

  border-top:
    1px solid
    rgba(255,255,255,.05);

  border-bottom:
    1px solid
    rgba(255,255,255,.035);
}

.ssf-news-title{
  color:#c9c9d4;

  font-family:
    'Space Grotesk',
    sans-serif;

  font-size:14px;
  font-weight:600;
}

.ssf-news-text{
  margin-top:4px;

  color:#363647;

  font-size:11px;
}

.ssf-news-form{
  display:flex;

  gap:7px;

  width:340px;
}

.ssf-input{
  width:100%;

  padding:
    11px 13px;

  color:#ddd;

  background:
    rgba(255,255,255,.025);

  border:
    1px solid
    rgba(255,255,255,.08);

  outline:none;

  font-family:inherit;
  font-size:11px;

  transition:
    border-color .2s,
    background .2s,
    box-shadow .2s;
}

.ssf-input:focus{
  background:
    rgba(108,92,231,.045);

  border-color:
    rgba(108,92,231,.48);

  box-shadow:
    0 0 0 3px
    rgba(108,92,231,.08);
}

.ssf-input::placeholder{
  color:#353546;
}

.ssf-success{
  display:flex;
  align-items:center;

  gap:8px;

  color:#6dd5bd;

  font-size:11px;
  font-weight:600;

  animation:
    ssf-check .35s ease;
}

.ssf-success-icon{
  width:19px;
  height:19px;

  display:flex;
  align-items:center;
  justify-content:center;

  border:
    1px solid
    rgba(26,188,156,.35);

  background:
    rgba(26,188,156,.08);

  color:#6dd5bd;
}


/* =========================================================
   SIGNAL DIVIDER
========================================================= */

.ssf-small-wave{
  margin-top:8px;

  opacity:.7;
}


/* =========================================================
   BOTTOM
========================================================= */

.ssf-bottom{
  display:flex;

  align-items:center;
  justify-content:space-between;

  gap:20px;

  padding:
    13px 0 32px;
}

.ssf-copyright{
  display:flex;
  align-items:center;

  gap:9px;

  color:#202031;

  font-size:9px;
}

.ssf-legal{
  display:flex;

  gap:17px;

  flex-wrap:wrap;
}

.ssf-legal-item{
  color:#28283a;

  font-size:10px;

  cursor:pointer;

  transition:
    color .18s;
}

.ssf-legal-item:hover{
  color:#8580ae;
}

.ssf-status{
  display:flex;

  align-items:center;

  gap:10px;
}

.ssf-status-text{
  display:flex;

  align-items:center;

  gap:6px;

  color:#29293a;

  font-family:
    'JetBrains Mono',
    monospace;

  font-size:9px;
}

.ssf-status-dot{
  width:5px;
  height:5px;

  background:#2ecc71;

  box-shadow:
    0 0 9px
    rgba(46,204,113,.5);

  animation:
    ssf-pulse 2.4s ease infinite;
}

.ssf-top{
  display:flex;

  align-items:center;

  gap:6px;

  padding:
    7px 10px;

  color:#474759;

  background:
    rgba(255,255,255,.025);

  border:
    1px solid
    rgba(255,255,255,.07);

  font-family:inherit;

  font-size:10px;
  font-weight:700;

  cursor:pointer;

  transition:
    color .18s,
    border-color .18s,
    background .18s,
    transform .18s;
}

.ssf-top:hover{
  color:#a29bfe;

  background:
    rgba(108,92,231,.07);

  border-color:
    rgba(108,92,231,.3);

  transform:
    translateY(-2px);
}


/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes ssf-pulse{
  0%,100%{
    opacity:1;
    transform:scale(1);
  }

  50%{
    opacity:.3;
    transform:scale(1.7);
  }
}

@keyframes ssf-check{
  from{
    opacity:0;
    transform:
      translateY(5px)
      scale(.95);
  }

  to{
    opacity:1;
    transform:none;
  }
}


/* =========================================================
   RESPONSIVE
========================================================= */

@media(max-width:950px){

  .ssf-main{
    grid-template-columns:1fr;
    gap:48px;
  }

  .ssf-brand{
    max-width:520px;
  }

  .ssf-description{
    max-width:480px;
  }

  .ssf-linkgrid{
    grid-template-columns:
      repeat(2,minmax(0,1fr));
  }
}


@media(max-width:650px){

  .ssf-main{
    padding-top:42px;
  }

  .ssf-cta-row{
    flex-direction:column;

    align-items:stretch;

    max-width:280px;
  }

  .ssf-btn-primary,
  .ssf-btn-secondary{
    width:100%;
  }

  .ssf-newsletter{
    align-items:flex-start;

    flex-direction:column;

    gap:17px;
  }

  .ssf-news-form{
    width:100%;
  }

  .ssf-bottom{
    align-items:center;

    flex-direction:column;

    text-align:center;

    padding-bottom:25px;
  }

  .ssf-copyright{
    justify-content:center;
  }

  .ssf-legal{
    justify-content:center;
  }

  .ssf-status{
    flex-direction:column;

    gap:10px;
  }
}


@media(max-width:430px){

  .ssf-linkgrid{
    gap:30px 14px;
  }

  .ssf-live-text{
    font-size:8px;
    letter-spacing:.1em;
  }

  .ssf-news-form{
    flex-direction:column;
  }

  .ssf-news-form
  .ssf-btn-primary{
    width:100%;
  }

  .ssf-social{
    width:33px;
    height:33px;
  }
}
`;

export default function Footer() {
  const [email, setEmail] =
    useState("");

  const [subscribed, setSubscribed] =
    useState(false);

  const [error, setError] =
    useState(false);

  const handleSubscribe = () => {
    const valid =
      email.includes("@") &&
      email.includes(".");

    if (valid) {
      setSubscribed(true);
      setError(false);
    } else {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 900);
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="ssf">

      <style>
        {CSS}
      </style>

      {/* background decoration */}
      <div className="ssf-grid" />
      <div className="ssf-glow" />

      {/* =================================================
          MAIN WAVEFORM
      ================================================= */}

      <div className="ssf-wave-wrap">

        <WaveformStrip
          height={62}
        />

        <div className="ssf-wave-fade" />

      </div>

      {/* =================================================
          LIVE STATUS
      ================================================= */}

      <div className="ssf-px ssf-livebar">

        <span className="ssf-mono ssf-live-text">
          Broadcasting on StreamSphere
          {" "}—{" "}
          1,847 creators live now
        </span>

      </div>

      {/* =================================================
          MAIN FOOTER
      ================================================= */}

      <div className="ssf-px">

        <div className="ssf-main">

          {/* BRAND */}
          <Reveal>

            <div className="ssf-brand">

              <Logo size={35} />

              <p className="ssf-description">
                The stage for the internet's
                next generation of creators.
                24.8K streamers already
                broadcasting.
              </p>

              <div className="ssf-cta-row">

                <button className="ssf-btn-primary">
                  Start Streaming
                </button>

                <button className="ssf-btn-secondary">
                  Explore Community
                </button>
 

              </div>

              <div className="ssf-socials">



    <div className="relative">
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
      >
        <defs>
          <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
          </clipPath>
        </defs>
      </svg>

      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl" />

      <div className="relative flex items-end gap-x-2 p-2">

        {/* GitHub */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center shadow-lg border border-gray-600/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.562 21.8 24 17.302 24 12 24 5.373 18.627 0 12 0z" />
            </svg>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg border border-blue-500/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
        </div>

        {/* YouTube */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg border border-red-500/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        </div>

        {/* Discord */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg border border-indigo-500/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037A19.7363 19.7363 0 0 0 4.772 4.37a.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1922.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.198.3728.2924a.077.077 0 0 1-.0066.1276c-.598.3428-1.2202.6442-1.873.8914a.076.076 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.3332 0 1.2108 0 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189z" />
            </svg>
          </div>
        </div>

        {/* Facebook */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.099 4.388 23.093 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.7 4.533-4.7 1.313 0 2.686.235 2.686.235v2.973h-1.514c-1.491 0-1.956.93-1.956 1.887v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.099 24 12.073z" />
            </svg>
          </div>
        </div>

        {/* Instagram */}
        <div className="relative">
          <div
            style={{ clipPath: "url(#squircleClip)" }}
            className="w-10 h-10 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg border border-pink-400/50 cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                stroke="currentColor"
                strokeWidth="2"
              />

              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />

              <circle
                cx="17.5"
                cy="6.5"
                r="1.2"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

      </div>
    </div>
  
    
              </div>

            </div>

          </Reveal>

          {/* LINKS */}
          <div>

            <div className="ssf-linkgrid">

              {LINK_GROUPS.map(
                (group, groupIndex) => (

                  <Reveal
                    key={
                      group.title
                    }
                    delay={
                      groupIndex *
                      0.06
                    }
                  >

                    <div>

                      <div className="ssf-mono ssf-group-title">
                        {group.title}
                      </div>

                      <div
                        style={{
                          display:
                            "flex",
                          flexDirection:
                            "column",
                        }}
                      >

                        {group.links.map(
                          (
                            link,
                            index
                          ) => (

                            <a
                              key={
                                index
                              }
                              className="ssf-link"
                            >
                              {link}

                              <span className="ssf-arrow">
                                →
                              </span>
                            </a>

                          )
                        )}

                      </div>

                    </div>

                  </Reveal>

                )
              )}

            </div>

            {/* NEWSLETTER */}
            <Reveal delay={0.22}>

              <div className="ssf-newsletter">

                <div>

                  <div className="ssf-news-title">
                    Get the signal
                  </div>

                  <div className="ssf-news-text">
                    Product news and creator
                    spotlights, twice a month.
                  </div>

                </div>

                <div className="ssf-news-form">

                  {subscribed ? (

                    <div className="ssf-success">

                      <span className="ssf-success-icon">
                        ✓
                      </span>

                      You're subscribed.

                    </div>

                  ) : (

                    <>
                      <input
                        className="ssf-input"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) =>
                          setEmail(
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key ===
                            "Enter"
                          ) {
                            handleSubscribe();
                          }
                        }}
                        style={{
                          borderColor:
                            error
                              ? "rgba(231,76,60,.6)"
                              : undefined,
                        }}
                      />

                      <button
                        className="ssf-btn-primary"
                        onClick={
                          handleSubscribe
                        }
                      >
                        Subscribe
                      </button>
                    </>

                  )}

                </div>

              </div>

            </Reveal>

          </div>

        </div>

      </div>

      {/* =================================================
          SECOND SIGNAL
      ================================================= */}

      <div className="ssf-px ssf-small-wave">

        <WaveformStrip
          height={20}
        />

      </div>

      {/* =================================================
          BOTTOM BAR
      ================================================= */}

      <div className="ssf-px">

        <div className="ssf-bottom">

          <div className="ssf-copyright">

            <Logo size={18} />

            <span className="ssf-mono">
              © 2025 StreamSphere, Inc.
            </span>

          </div>

          <div className="ssf-legal">

            {LEGAL.map(
              (item) => (

                <span
                  key={item}
                  className="ssf-legal-item"
                >
                  {item}
                </span>

              )
            )}

          </div>

          <div className="ssf-status">

            <div className="ssf-status-text">

              <span className="ssf-status-dot" />

              All systems
              operational

            </div>

            <button
              className="ssf-top"
              onClick={
                scrollTop
              }
            >
              ↑
              <span>
                Top
              </span>
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
}