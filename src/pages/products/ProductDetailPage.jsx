import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  getProduct,
  getAllProducts,
  clearSelectedProduct,
  deleteProduct,
} from "../../features/productSlice/productSlice";
import { addToCart } from "../../features/productSlice/cartSlice";
import { ShoppingCart, Check } from "lucide-react";

import {
  ArrowLeft,
  ArrowUpRight,
  Trash2,
  ImagePlus,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  User,
  Package,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

html{
  scroll-behavior:smooth;
}

body{
  background:#07070d;
}

::-webkit-scrollbar{
  width:3px;
  height:3px;
}

::-webkit-scrollbar-track{
  background:#07070d;
}

::-webkit-scrollbar-thumb{
  background:linear-gradient(#6c5ce7,#1abc9c);
}

button{
  font-family:inherit;
}

@keyframes fadeUp{
  from{
    opacity:0;
    transform:translateY(16px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

@keyframes fadeRight{
  from{
    opacity:0;
    transform:translateX(14px);
  }
  to{
    opacity:1;
    transform:translateX(0);
  }
}

@keyframes pulse{
  0%,100%{
    opacity:1;
    transform:scale(1);
  }
  50%{
    opacity:.4;
    transform:scale(.75);
  }
}

@keyframes scan{
  0%{
    transform:translateX(-150%) skewX(-18deg);
  }
  100%{
    transform:translateX(400%) skewX(-18deg);
  }
}

@keyframes shimmer{
  0%{
    background-position:-200% 0;
  }
  100%{
    background-position:200% 0;
  }
}

/* =========================
   PAGE
========================= */

.page{
  min-height:100vh;
  display:flex;
  flex-direction:column;

  position:relative;
  overflow:hidden;

  background:
    radial-gradient(
      circle at 78% 5%,
      rgba(108,92,231,.11),
      transparent 30%
    ),
    radial-gradient(
      circle at 10% 55%,
      rgba(26,188,156,.035),
      transparent 25%
    ),
    #07070d;

  color:#e0e0f0;

  font-family:'Inter',system-ui,sans-serif;
}

.page::before{
  content:"";

  position:fixed;
  inset:0;

  pointer-events:none;

  background-image:
    linear-gradient(
      rgba(255,255,255,.012) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.012) 1px,
      transparent 1px
    );

  background-size:45px 45px;

  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 90%
    );
}

.mono{
  font-family:'JetBrains Mono',monospace;
}

.display{
  font-family:'Space Grotesk',sans-serif;
}

/* =========================
   CONTAINER
========================= */

.detail-container{
  flex:1;
  width:100%;
  max-width:1220px;
  margin:0 auto;

  padding:
    0 clamp(16px,3vw,38px)
    45px;

  position:relative;
  z-index:1;
}

/* =========================
   BACK BUTTON
========================= */

.back-btn{
  display:inline-flex;
  align-items:center;
  gap:8px;

  margin:22px 0 20px;

  padding:7px 0;

  background:none;
  border:none;

  color:#555568;

  font-family:'JetBrains Mono',monospace;
  font-size:10px;

  letter-spacing:.08em;
  text-transform:uppercase;

  cursor:pointer;

  transition:
    color .2s,
    transform .2s;
}

.back-btn:hover{
  color:#a29bfe;
  transform:translateX(-4px);
}

/* =========================
   TOP META
========================= */

.product-meta-top{
  display:flex;
  align-items:center;
  gap:8px;

  margin-bottom:11px;

  color:#6c5ce7;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  letter-spacing:.16em;
  text-transform:uppercase;

  animation:fadeUp .35s ease both;
}

.live-dot{
  width:5px;
  height:5px;

  background:#1abc9c;

  box-shadow:
    0 0 10px rgba(26,188,156,.8);

  animation:pulse 2s infinite;
}

/* =========================
   MAIN GRID
========================= */

.detail-grid{
  display:grid;

  grid-template-columns:
    minmax(0,1.3fr)
    minmax(330px,.7fr);

  gap:30px;

  align-items:start;
}

/* =========================
   LEFT
========================= */

.left-column{
  animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both;
}

/* =========================
   IMAGE
========================= */

.hero-image{
  width:100%;
  aspect-ratio:1.1 / 1;

  position:relative;
  overflow:hidden;

  background:
    radial-gradient(
      circle at center,
      rgba(108,92,231,.15),
      transparent 60%
    ),
    #0b0b12;

  border:1px solid rgba(255,255,255,.07);

  clip-path:
    polygon(
      0 0,
      calc(100% - 18px) 0,
      100% 18px,
      100% 100%,
      0 100%
    );

  box-shadow:
    0 25px 70px rgba(0,0,0,.28);
}

.hero-image-bg{
  position:absolute;
  inset:0;

  background-position:center;
  background-size:cover;
  background-repeat:no-repeat;

  transition:
    transform .7s cubic-bezier(.16,1,.3,1),
    filter .35s ease;
}

.hero-image:hover .hero-image-bg{
  transform:scale(1.045);
  filter:brightness(1.08);
}

.hero-image::after{
  content:"";

  position:absolute;
  inset:0;

  pointer-events:none;

  background:
    linear-gradient(
      to top,
      rgba(5,5,10,.72),
      transparent 42%
    );
}

.scan-line{
  position:absolute;

  top:0;
  left:-70%;

  width:30%;
  height:100%;

  z-index:3;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.12),
      transparent
    );

  transform:skewX(-18deg);
}

.hero-image:hover .scan-line{
  animation:scan .8s ease forwards;
}

.image-code{
  position:absolute;
  top:14px;
  left:14px;

  z-index:5;

  padding:6px 9px;

  background:rgba(5,5,10,.72);

  border-left:2px solid #6c5ce7;

  color:#85859a;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  backdrop-filter:blur(8px);
}

.image-status{
  position:absolute;
  right:14px;
  bottom:14px;

  z-index:5;

  display:flex;
  align-items:center;
  gap:7px;

  padding:7px 10px;

  background:rgba(5,5,10,.72);

  color:#4bd6aa;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  backdrop-filter:blur(8px);
}

.status-dot{
  width:5px;
  height:5px;

  background:#1abc9c;

  box-shadow:
    0 0 8px rgba(26,188,156,.8);
}

/* =========================
   NO IMAGE
========================= */

.no-image{
  position:absolute;
  inset:0;

  display:flex;
  align-items:center;
  justify-content:center;

  color:#363648;
}

.no-image-box{
  width:110px;
  height:110px;

  display:flex;
  align-items:center;
  justify-content:center;

  border:1px solid rgba(108,92,231,.16);

  transform:rotate(45deg);
}

.no-image-box svg{
  transform:rotate(-45deg);
}

/* =========================
   PANELS
========================= */

.panel{
  position:relative;

  background:
    linear-gradient(
      145deg,
      rgba(15,13,25,.96),
      rgba(8,8,14,.96)
    );

  border:1px solid rgba(255,255,255,.065);

  clip-path:
    polygon(
      0 0,
      calc(100% - 12px) 0,
      100% 12px,
      100% 100%,
      0 100%
    );
}

.description-panel{
  margin-top:17px;
  padding:21px;

  animation:fadeUp .45s .08s ease both;
}

.section-label{
  display:flex;
  align-items:center;
  gap:8px;

  color:#6c5ce7;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  letter-spacing:.15em;
  text-transform:uppercase;

  margin-bottom:12px;
}

.section-label::before{
  content:"";

  width:15px;
  height:1px;

  background:#6c5ce7;
}

.description{
  color:#858596;

  font-size:13px;
  line-height:1.9;
}

/* =========================
   RELATED
========================= */

.related-section{
  margin-top:25px;

  animation:fadeUp .45s .12s ease both;
}

.related-heading{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;

  margin-bottom:12px;
}

.related-label{
  color:#6c5ce7;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  letter-spacing:.15em;
  text-transform:uppercase;
}

.related-title{
  margin-top:5px;

  color:#d7d7e3;

  font-family:'Space Grotesk',sans-serif;
  font-size:16px;
  font-weight:600;
}

.related-count{
  color:#414151;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;
}

.related-grid{
  display:grid;

  grid-template-columns:
    repeat(4,minmax(0,1fr));

  gap:10px;
}

.related-card{
  position:relative;

  overflow:hidden;

  background:rgba(255,255,255,.022);

  border:1px solid rgba(255,255,255,.055);

  cursor:pointer;

  clip-path:
    polygon(
      0 0,
      calc(100% - 9px) 0,
      100% 9px,
      100% 100%,
      0 100%
    );

  transition:
    transform .2s,
    border-color .2s,
    background .2s;
}

.related-card:hover{
  transform:translateY(-4px);

  border-color:rgba(108,92,231,.4);

  background:rgba(255,255,255,.045);
}

.related-image{
  height:110px;
  width:100%;

  position:relative;

  background-position:center;
  background-size:cover;

  transition:transform .5s ease;
}

.related-card:hover .related-image{
  transform:scale(1.06);
}

.related-image::after{
  content:"";

  position:absolute;
  inset:0;

  background:
    linear-gradient(
      to top,
      rgba(5,5,10,.72),
      transparent 65%
    );
}

.related-body{
  padding:10px 11px;
}

.related-name{
  color:#c9c9d5;

  font-size:11px;
  font-weight:600;

  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}

.related-price{
  margin-top:4px;

  color:#a29bfe;

  font-family:'JetBrains Mono',monospace;
  font-size:10px;
  font-weight:700;
}

.related-arrow{
  position:absolute;

  top:8px;
  right:8px;

  z-index:3;

  width:25px;
  height:25px;

  display:flex;
  align-items:center;
  justify-content:center;

  background:rgba(7,7,13,.72);

  color:#aaaabd;

  opacity:0;

  transform:translateY(-3px);

  transition:
    opacity .2s,
    transform .2s;
}

.related-card:hover .related-arrow{
  opacity:1;
  transform:translateY(0);
}

/* =========================
   BUY COLUMN
========================= */

.buy-box{
  position:sticky;
  top:20px;

  animation:
    fadeRight .45s .05s
    cubic-bezier(.16,1,.3,1)
    both;
}

.buy-panel{
  padding:24px;

  overflow:hidden;
}

.buy-panel::before{
  content:"";

  position:absolute;
  top:0;
  left:0;
  right:0;

  height:1px;

  background:
    linear-gradient(
      90deg,
      #6c5ce7,
      #1abc9c,
      transparent
    );
}

.verified{
  display:flex;
  align-items:center;
  gap:7px;

  margin-bottom:13px;

  color:#4bd6aa;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  letter-spacing:.1em;
  text-transform:uppercase;
}

.product-title{
  font-family:'Space Grotesk',sans-serif;

  font-size:clamp(24px,3vw,34px);

  line-height:1.12;

  font-weight:700;

  letter-spacing:-.035em;

  color:#f2f2f8;
}

.review-placeholder{
  margin-top:9px;

  color:#444454;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  line-height:1.5;
}

.price{
  margin-top:20px;

  color:#f5f5fa;

  font-family:'JetBrains Mono',monospace;

  font-size:31px;
  font-weight:800;
}

.price-caption{
  margin-top:4px;

  color:#414151;

  font-family:'JetBrains Mono',monospace;
  font-size:9px;

  text-transform:uppercase;
  letter-spacing:.08em;
}

.stock{
  display:flex;
  align-items:center;
  gap:7px;

  margin-top:12px;

  color:#46c99d;

  font-family:'JetBrains Mono',monospace;
  font-size:10px;
}

.stock-dot{
  width:6px;
  height:6px;

  background:#1abc9c;

  box-shadow:0 0 8px rgba(26,188,156,.8);
}

/* =========================
   PURCHASE
========================= */

.purchase-box{
  margin-top:21px;
  padding-top:19px;

  border-top:1px solid rgba(255,255,255,.06);
}

.quantity-head{
  display:flex;
  align-items:center;
  justify-content:space-between;

  margin-bottom:10px;

  color:#626274;

  font-family:'JetBrains Mono',monospace;
  font-size:10px;

  letter-spacing:.07em;
  text-transform:uppercase;
}

.quantity-control{
  display:flex;
  align-items:center;

  width:max-content;

  border:1px solid rgba(255,255,255,.09);

  background:rgba(255,255,255,.025);
}

.qty-btn{
  width:36px;
  height:36px;

  border:none;

  display:flex;
  align-items:center;
  justify-content:center;

  background:transparent;

  color:#9292a3;

  cursor:pointer;

  transition:
    background .15s,
    color .15s;
}

.qty-btn:hover{
  background:rgba(108,92,231,.15);
  color:white;
}

.qty-number{
  width:38px;

  text-align:center;

  color:#eee;

  font-family:'JetBrains Mono',monospace;
  font-size:13px;
}

/* =========================
   ACTION BUTTONS
========================= */

.buy-button{
  position:relative;

  width:100%;

  margin-top:17px;
  padding:14px;

  border:none;

  background:
    linear-gradient(
      110deg,
      #6c5ce7,
      #8f7ff0,
      #6c5ce7
    );

  background-size:200% 100%;

  color:white;

  font-size:13px;
  font-weight:800;

  cursor:pointer;

  clip-path:
    polygon(
      0 0,
      calc(100% - 10px) 0,
      100% 10px,
      100% 100%,
      0 100%
    );

  transition:
    transform .2s,
    box-shadow .2s;
}

.buy-button:hover{
  transform:translateY(-2px);

  box-shadow:
    0 12px 30px rgba(108,92,231,.3);

  animation:shimmer 1.1s linear infinite;
}

.contact-button{
  width:100%;

  margin-top:8px;
  padding:13px;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  background:rgba(255,255,255,.03);

  border:1px solid rgba(255,255,255,.09);

  color:#aaa;

  font-size:12px;
  font-weight:700;

  cursor:pointer;

  clip-path:
    polygon(
      0 0,
      calc(100% - 9px) 0,
      100% 9px,
      100% 100%,
      0 100%
    );

  transition:
    background .2s,
    border-color .2s,
    color .2s;
}

.contact-button:hover{
  background:rgba(255,255,255,.065);

  border-color:rgba(108,92,231,.35);

  color:white;
}

.delete-button{
  width:100%;

  margin-top:8px;
  padding:12px;

  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;

  background:rgba(239,68,68,.045);

  border:1px solid rgba(239,68,68,.22);

  color:#db8c8c;

  font-size:11px;
  font-weight:700;

  cursor:pointer;

  transition:
    background .2s,
    border-color .2s,
    color .2s;
}

.delete-button:hover{
  background:rgba(239,68,68,.09);

  border-color:rgba(239,68,68,.45);

  color:#ffaaaa;
}

/* =========================
   TRUST
========================= */

.trust-panel{
  margin-top:11px;
  padding:5px 18px;
}

.trust-row{
  display:flex;
  align-items:center;
  gap:10px;

  padding:12px 0;

  border-bottom:1px solid rgba(255,255,255,.045);

  color:#6f6f81;

  font-size:11px;
}

.trust-row:last-child{
  border-bottom:none;
}

/* =========================
   SELLER
========================= */

.seller-panel{
  margin-top:11px;

  padding:15px;

  display:flex;
  align-items:center;
  gap:11px;
}

.seller-avatar{
  width:42px;
  height:42px;

  flex-shrink:0;

  display:flex;
  align-items:center;
  justify-content:center;

  background:
    linear-gradient(
      135deg,
      #6c5ce7,
      #332d68
    );

  border:1px solid rgba(255,255,255,.12);

  border-radius:50%;
}

.seller-label{
  color:#444454;

  font-family:'JetBrains Mono',monospace;
  font-size:8px;

  text-transform:uppercase;
  letter-spacing:.1em;

  margin-bottom:3px;
}

.seller-name{
  color:#ddd;

  font-size:13px;
  font-weight:700;
}

/* =========================
   LOADING / EMPTY
========================= */

.state{
  min-height:430px;

  display:flex;
  flex-direction:column;

  align-items:center;
  justify-content:center;

  gap:10px;

  animation:fadeUp .35s ease both;
}

.state-icon{
  width:54px;
  height:54px;

  display:flex;
  align-items:center;
  justify-content:center;

  color:#555568;

  border:1px solid rgba(108,92,231,.18);

  clip-path:
    polygon(
      0 0,
      calc(100% - 9px) 0,
      100% 9px,
      100% 100%,
      0 100%
    );
}

.state-title{
  color:#77778a;
  font-size:13px;
}

.state-text{
  color:#414151;
  font-size:11px;
}

/* =========================
   RESPONSIVE
========================= */

@media(max-width:900px){

  .detail-grid{
    grid-template-columns:1fr !important;
  }

  .buy-box{
    position:static;
  }

  .hero-image{
    aspect-ratio:1 / .9;
  }
}

@media(max-width:650px){

  .detail-container{
    padding-left:14px;
    padding-right:14px;
  }

  .buy-panel{
    padding:19px;
  }

  .product-title{
    font-size:27px;
  }

  .price{
    font-size:28px;
  }

  .related-grid{
    grid-template-columns:
      repeat(2,minmax(0,1fr));
  }

  .related-image{
    height:105px;
  }
}

@media(max-width:430px){

  .related-grid{
    grid-template-columns:1fr 1fr;
    gap:8px;
  }

  .related-image{
    height:95px;
  }

  .description-panel{
    padding:17px;
  }
}

.buy-now-btn {
  position: relative;
  width: 100%;
  min-height: 54px;
  padding: 0 20px;
  margin-top: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(167, 139, 250, 0.45);
  border-radius: 12px;

  background:
    linear-gradient(
      110deg,
      #5b21b6 0%,
      #6d28d9 35%,
      #7c3aed 65%,
      #8b5cf6 100%
    );

  color: #fff;
  font-family: Inter, "SF Pro Display", system-ui, sans-serif;
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.01em;

  cursor: pointer;
  overflow: hidden;
  isolation: isolate;

  box-shadow:
    0 8px 24px rgba(109, 40, 217, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);

  transition:
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}


/* subtle animated gradient */
.buy-now-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;

  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(196, 181, 253, 0.22) 40%,
    rgba(167, 139, 250, 0.35) 50%,
    transparent 65%
  );

  transform: translateX(-110%);
  transition: transform 0.65s ease;
}


/* soft bottom glow */
.buy-now-btn::after {
  content: "";
  position: absolute;
  width: 70%;
  height: 30px;
  left: 15%;
  bottom: -22px;

  background: #a78bfa;
  filter: blur(22px);
  opacity: 0;

  transition: opacity 0.3s ease;
  z-index: -1;
}


/* BUTTON CONTENT */
.buy-now-content {
  position: relative;
  z-index: 2;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}


/* PRICE */
.buy-now-price {
  padding-left: 9px;
  margin-left: 2px;

  border-left: 1px solid rgba(255, 255, 255, 0.28);

  color: #ede9fe;
  font-weight: 750;
}


/* ARROW */
.buy-now-arrow {
  font-size: 19px;
  line-height: 1;

  transform: translateX(0);

  transition: transform 0.25s ease;
}


/* HOVER */
.buy-now-btn:hover {
  transform: translateY(-2px);

  border-color: rgba(196, 181, 253, 0.75);

  box-shadow:
    0 12px 32px rgba(109, 40, 217, 0.38),
    0 0 0 4px rgba(124, 58, 237, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.buy-now-btn:hover::before {
  transform: translateX(110%);
}

.buy-now-btn:hover::after {
  opacity: 0.5;
}

.buy-now-btn:hover .buy-now-arrow {
  transform: translateX(4px);
}


/* CLICK */
.buy-now-btn:active {
  transform: translateY(0) scale(0.985);

  box-shadow:
    0 5px 14px rgba(109, 40, 217, 0.28),
    inset 0 2px 4px rgba(0, 0, 0, 0.12);
}


/* KEYBOARD FOCUS */
.buy-now-btn:focus-visible {
  outline: none;

  box-shadow:
    0 0 0 3px rgba(167, 139, 250, 0.3),
    0 10px 30px rgba(109, 40, 217, 0.32);
}


/* MOBILE */
@media (max-width: 600px) {
  .buy-now-btn {
    min-height: 52px;
    padding: 0 16px;
    font-size: 14px;
  }
}


/* ACCESSIBILITY */
@media (prefers-reduced-motion: reduce) {
  .buy-now-btn,
  .buy-now-btn::before,
  .buy-now-btn::after,
  .buy-now-arrow {
    transition: none;
  }
}

`;

/* ==========================================
   RELATED PRODUCT
========================================== */

function RelatedCard({ p, onView }) {
  return (
    <div
      className="related-card"
      onClick={() => onView(p.id)}
    >
      <div
        className="related-image"
        style={{
          background: p.coverImage
            ? `center/cover no-repeat url(${p.coverImage})`
            : "linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))",
        }}
      >
        {!p.coverImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <ImagePlus
              size={19}
              color="#333344"
            />
          </div>
        )}

        <div className="related-arrow">
          <ArrowUpRight size={13} />
        </div>
      </div>

      <div className="related-body">
        <div className="related-name">
          {p.title}
        </div>

        <div className="related-price">
          ${p.price}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN PAGE
========================================== */

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selected: product,
    list: allProducts,
  } = useSelector(
    (state) => state.products.products
  );

  const { user } = useSelector(
    (state) => state.authentication.authentication
  );

  const isLoggedIn = Boolean(user)

  const [qty, setQty] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: product.id, quantity: qty }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  useEffect(() => {
    let cancelled = false;

    setPageLoading(true);
    setNotFound(false);

    dispatch(getProduct(id))
      .unwrap()
      .then(() => {
        if (!cancelled) {
          setPageLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPageLoading(false);
          setNotFound(true);
        }
      });

    dispatch(getAllProducts());

    return () => {
      cancelled = true;
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    setQty(1);
  }, [id]);

  const isOwner =
    product &&
    user &&
    product.userId === user.id;

  const relatedProducts = (allProducts || [])
    .filter(
      (p) =>
        product &&
        p.userId === product.userId &&
        p.id !== product.id
    )
    .slice(0, 4);

  const handleDelete = () => {
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => navigate("/profile"))
      .catch((err) =>
        console.log(
          err,
          "Failed to delete product"
        )
      );
  };

  /*
    Safe numeric conversion.
    This prevents price calculations from
    breaking when the backend returns price
    as a string.
  */
  const numericPrice = Number(
    product?.price || 0
  );

  const totalPrice =
    numericPrice * qty;

  return (
    <div className="page">

      <style>{S}</style>

      <Navbar />

      <main className="detail-container">

        {/* BACK */}

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={14} />
          Back to marketplace
        </button>

        {/* LOADING */}

        {pageLoading && (
          <div className="state">
            <div className="state-icon">
              <Sparkles size={19} />
            </div>

            <div className="state-title">
              Loading product
            </div>

            <div className="state-text">
              Fetching marketplace data...
            </div>
          </div>
        )}

        {/* NOT FOUND */}

        {!pageLoading && notFound && (
          <div className="state">
            <div className="state-icon">
              <Package size={19} />
            </div>

            <div className="state-title">
              Product not found
            </div>

            <div className="state-text">
              This listing may have been removed.
            </div>
          </div>
        )}

        {/* PRODUCT */}

        {!pageLoading &&
          !notFound &&
          product && (
            <>
              <div className="product-meta-top">
                StreamSphere / Marketplace / Product
              </div>

              <div className="detail-grid">

                {/* =================================
                    LEFT COLUMN
                ================================= */}

                <div className="left-column">

                  {/* HERO IMAGE */}

                  <div className="hero-image">

                    {product.coverImage ? (
                      <div
                        className="hero-image-bg"
                        style={{
                          backgroundImage:
                            `url(${product.coverImage})`,
                        }}
                      />
                    ) : (
                      <div className="no-image">
                        <div className="no-image-box">
                          <ImagePlus size={40} />
                        </div>
                      </div>
                    )}

                    <div className="scan-line" />


                    <div className="image-status">
                      AVAILABLE
                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="panel description-panel">

                    <div className="section-label">
                      Description
                    </div>

                    <p className="description">
                      {product.description ||
                        "No description provided for this product."}
                    </p>

                  </div>

                  {/* RELATED PRODUCTS */}

                  {relatedProducts.length > 0 && (
                    <div className="related-section">

                      <div className="related-heading">

                        <div>
                          <div className="related-label">
                            Creator Collection
                          </div>

                          <div className="related-title">
                            More from{" "}
                            {product.USER?.name ||
                              "this seller"}
                          </div>
                        </div>

                        <div className="related-count">
                          {relatedProducts.length} listings
                        </div>

                      </div>

                      <div className="related-grid">

                        {relatedProducts.map(
                          (p) => (
                            <RelatedCard
                              key={p.id}
                              p={p}
                              onView={(pid) =>
                                navigate(
                                  `/products/${pid}`
                                )
                              }
                            />
                          )
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* =================================
                    RIGHT COLUMN
                ================================= */}

                <aside className="buy-box">

                  {/* PRODUCT PANEL */}

                  <div className="panel buy-panel">

                    <div className="verified">
                      <CheckCircle2
                        size={12}
                      />
                      Verified listing
                    </div>

                    <h1 className="product-title">
                      {product.title}
                    </h1>

                    <div className="review-placeholder">
                      NO REVIEWS YET · BE THE FIRST TO
                      LEAVE FEEDBACK
                    </div>

                    <div className="price">
                      ${numericPrice.toFixed(2)}
                    </div>

                    <div className="price-caption">
                      Current marketplace price
                    </div>

                    <div className="stock">
                      IN STOCK — READY TO SHIP
                    </div>

                    {/* QUANTITY */}

                    <div className="purchase-box">

                      <div className="quantity-head">
                        <span>
                          Quantity
                        </span>

                        <span>
                          {qty} item
                          {qty !== 1
                            ? "s"
                            : ""}
                        </span>
                      </div>

                      <div className="quantity-control">

                        <button
                          className="qty-btn"
                          onClick={() =>
                            setQty((q) =>
                              Math.max(
                                1,
                                q - 1
                              )
                            )
                          }
                        >
                          <Minus size={14} />
                        </button>

                        <span className="qty-number">
                          {qty}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() =>
                            setQty(
                              (q) => q + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                    </div>

                    { isLoggedIn ? (
                      <>
                        <button
                      className="buy-now-btn"
                      onClick={() => navigate(`/checkout/${product.id}?qty=${qty}`)}
                      >
                      <span className="buy-now-shine"></span>
                    
                      <span className="buy-now-content">
                        <span>Buy now</span>
                    
                        <span className="buy-now-price">
                          ${(product.price * qty).toFixed(2)}
                        </span>
                    
                        <span className="buy-now-arrow">→</span>
                      </span>
                    </button>
                      </>
                      ) : (
                        <button
                      className="buy-now-btn"
                      onClick={() => navigate("/login")}
                    >
                      <span className="buy-now-shine"></span>
                    
                      <span className="buy-now-content">
                        <span>Buy now</span>
                    
                        <span className="buy-now-price">
                          ${(product.price * qty).toFixed(2)}
                        </span>
                    
                        <span className="buy-now-arrow">→</span>
                      </span>
                    </button>
                      )
                    }

                    {/* cart    */}

                 { isLoggedIn ? (
                  <>                
                  <button
                   onClick={handleAddToCart}
                   disabled={added}
                   className={`
                     group relative w-full overflow-hidden rounded-md px-6 py-3.5
                     font-bold text-sm tracking-wide
                     transition-all duration-300 ease-out
                     active:scale-95
                     ${added
                       ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                       : "bg-white/[0.04] text-gray-200 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10"
                     }
                   `}
                 >
                   <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                 
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     {added ? (
                       <>
                         <Check size={16} className="animate-[bounce_0.4s_ease]" />
                         Added to cart
                       </>
                     ) : (
                       <>
                         <ShoppingCart size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                         Add to cart
                       </>
                     )}
                   </span>
                 </button>
                  </>
                 ) : (
                  <button
                   onClick={handleAddToCart}
                   disabled={added}
                   className={`
                     group relative w-full overflow-hidden rounded-md px-6 py-3.5
                     font-bold text-sm tracking-wide
                     transition-all duration-300 ease-out
                     active:scale-95
                     ${added
                       ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                       : "bg-white/[0.04] text-gray-200 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10"
                     }
                   `}
                 >
                   {/* sweep highlight on hover */}
                   <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                 
                   <span className="relative z-10 flex items-center justify-center gap-2">
                     {added ? (
                       <>
                         <Check size={16} className="animate-[bounce_0.4s_ease]" />
                         <Link to="/login">Add to Cart</Link>
                       </>
                     ) : (
                       <>
                         <ShoppingCart size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" />
                         <Link to="/login">Add to Cart</Link>
                       </>
                     )}
                   </span>
                 </button>
                 )
                 }
                 

                    {/* CONTACT */}

                    <button className="contact-button">
                      <MessageCircle
                        size={14}
                      />
                      <Link to="">Contact seller</Link>
                    </button>

                    {/* DELETE */}

                    {isOwner && (
                      <button
                        className="delete-button"
                        onClick={handleDelete}
                      >
                        <Trash2 size={14} />
                        Delete listing
                      </button>
                    )}

                  </div>

                  {/* TRUST */}

                  <div className="panel trust-panel">

                    <div className="trust-row">
                      <Truck
                        size={15}
                        color="#6c5ce7"
                      />
                      Ships within 2–4 business days
                    </div>

                    <div className="trust-row">
                      <RotateCcw
                        size={15}
                        color="#6c5ce7"
                      />
                      14-day return window
                    </div>

                    <div className="trust-row">
                      <ShieldCheck
                        size={15}
                        color="#6c5ce7"
                      />
                      Buyer protection on all orders
                    </div>

                  </div>

                  {/* SELLER */}

{product.USER && (
  <div
    className="panel seller-panel"
    style={{ cursor: "pointer" }}
    onClick={() => navigate(`/users/${product.userId}`)}
  >

    <div className="seller-avatar">
      <User
        size={17}
        color="#fff"
      />
    </div>

    <div
      style={{
        minWidth:0,
      }}
    >
      <div className="seller-label">
        Listed by
      </div>

      <div className="seller-name">
        {product.USER.name}
      </div>
    </div>

    <ArrowUpRight
      size={15}
      color="#444454"
      style={{
        marginLeft:"auto",
      }}
    />

  </div>
)}

                </aside>

              </div>
            </>
          )}

      </main>

      <Footer />

    </div>
  );
}