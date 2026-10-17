import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getAllProducts } from "../../features/productSlice/productSlice";
import { ImagePlus, Search, ArrowUpRight } from "lucide-react";
const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-track {
  background: #07070d;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(#6c5ce7, #1abc9c);
}
/* =========================
   ANIMATIONS
========================= */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes scan {
  from {
    transform: translateX(-120%) skewX(-18deg);
  }
  to {
    transform: translateX(350%) skewX(-18deg);
  }
}
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .35;
  }
}
/* =========================
   PAGE
========================= */
.page {
  font-family: 'Inter', system-ui, sans-serif;
  background:
    radial-gradient(
      circle at 80% 0%,
      rgba(108,92,231,.10),
      transparent 30%
    ),
    #07070d;
  color: #e0e0f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.mono {
  font-family: 'JetBrains Mono', monospace;
}
.display {
  font-family: 'Space Grotesk', sans-serif;
}
/* =========================
   HEADER
========================= */
.market-header {
  padding: 28px 0 26px;
  margin-bottom: 26px;
  border-bottom: 1px solid rgba(255,255,255,.07);
  position: relative;
  animation: fadeUp .45s ease both;
}
.market-header::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 150px;
  height: 1px;
  background: linear-gradient(
    90deg,
    #6c5ce7,
    #1abc9c,
    transparent
  );
}
.eyebrow {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #513bfa;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  letter-spacing: .16em;
  text-transform: uppercase;
  margin-bottom: 9px;
}
.live-dot {
  width: 5px;
  height: 5px;
  background: #1abc9c;
  box-shadow: 0 0 10px rgba(26,188,156,.8);
  animation: pulse 2s infinite;
}
.market-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(30px, 5vw, 52px);
  line-height: 1;
  font-weight: 700;
  letter-spacing: -.045em;
  color: #f5f5fa;
  margin-bottom: 10px;
}
.market-title span {
  color: #6c5ce7;
}
.market-subtitle {
  color: #56566a;
  font-size: 12px;
  line-height: 1.6;
  max-width: 520px;
}
/* =========================================================
   STREAMSPHERE SEARCH
========================================================= */
.search-area {
  width: 100%;
  max-width: 900px;
  margin: 22px auto 0;
}
.search-box {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.09);
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    0 100%
  );
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}
.search-box:focus-within {
  border-color: rgba(108, 92, 231, 0.55);
  background: rgba(108, 92, 231, 0.035);
  box-shadow:
    0 0 0 1px rgba(108, 92, 231, 0.08),
    0 15px 40px rgba(0, 0, 0, 0.2);
}
.search-icon {
  flex-shrink: 0;
  margin-left: 9px;
  color: #555568;
  transition: color 0.2s ease;
}
.search-box:focus-within .search-icon {
  color: #8b7cff;
}
.search-box input {
  flex: 1;
  min-width: 0;
  height: 42px;
  border: none;
  outline: none;
  background: transparent;
  color: #f2f2f8;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 13px;
}
.search-box input::placeholder {
  color: #454555;
}
/* CLEAR */
.search-clear {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.035);
  color: #666679;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}
.search-clear:hover {
  color: white;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}
/* SEARCH BUTTON */
.search-button {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 18px;
  border: 1px solid rgba(108, 92, 231, 0.5);
  background: #6c5ce7;
  color: white;
  font-family: "JetBrains Mono", monospace;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
  cursor: pointer;
  clip-path: polygon(
    0 0,
    calc(100% - 7px) 0,
    100% 7px,
    100% 100%,
    0 100%
  );
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}
.search-button:hover {
  background: #7c6cf0;
  transform: translateY(-1px);
  box-shadow:
    0 8px 25px rgba(108, 92, 231, 0.25);
}
.search-button:active {
  transform: translateY(0);
}
.search-button svg {
  transition: transform 0.2s ease;
}
.search-button:hover svg {
  transform: scale(1.1);
}
/* RESULT INFO */
.search-result-info {
  margin-top: 9px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #414152;
  font-family: "JetBrains Mono", monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.search-result-info strong {
  color: #74738a;
}
/* MOBILE */
@media (max-width: 600px) {
  .search-box {
    padding: 5px;
  }
  .search-button {
    width: 44px;
    padding: 0;
  }
  .search-button span {
    display: none;
  }
  .search-result-info {
    padding: 0 2px;
  }
}
/* =========================
   PRODUCT GRID
========================= */
.product-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
/* =========================
   CARD
========================= */
.product-card {
  position: relative;
  background: rgba(255,255,255,.025);
  border: 1px solid rgba(255,255,255,.06);
  overflow: hidden;
  cursor: pointer;
  clip-path: polygon(
    0 0,
    calc(100% - 12px) 0,
    100% 12px,
    100% 100%,
    0 100%
  );
  animation: fadeUp .4s ease both;
  transition:
    transform .22s ease,
    border-color .22s ease,
    background .22s ease,
    box-shadow .22s ease;
}
.product-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,.045);
  border-color: rgba(108,92,231,.4);
  box-shadow:
    5px 5px 0 rgba(108,92,231,.10),
    0 15px 35px rgba(0,0,0,.28);
}
/* =========================
   IMAGE
========================= */
.product-image {
  position: relative;
  width: 100%;
  height: 165px;
  overflow: hidden;
  background:
    linear-gradient(
      135deg,
      rgba(108,92,231,.13),
      rgba(26,188,156,.04)
    );
  display: flex;
  align-items: center;
  justify-content: center;
}
.product-image-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition:
    transform .55s cubic-bezier(.16,1,.3,1),
    filter .3s ease;
}
.product-card:hover .product-image-bg {
  transform: scale(1.07);
  filter: brightness(1.08);
}
.product-image::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(7,7,13,.8),
      transparent 65%
    );
  pointer-events: none;
}
.product-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: -70%;
  width: 35%;
  height: 100%;
  z-index: 2;
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,.12),
      transparent
    );
  transform: skewX(-18deg);
}
.product-card:hover .product-image::before {
  animation: scan .7s ease forwards;
}
/* =========================
   NO IMAGE
========================= */
.no-image {
  position: relative;
  z-index: 1;
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #383849;
  border: 1px solid rgba(108,92,231,.2);
  transform: rotate(45deg);
}
.no-image svg {
  transform: rotate(-45deg);
}
/* =========================
   PRODUCT NUMBER
========================= */
.product-number {
  position: absolute;
  z-index: 3;
  top: 10px;
  left: 10px;
  padding: 5px 7px;
  background: rgba(7,7,13,.75);
  border-left: 2px solid #6c5ce7;
  color: #77778a;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  backdrop-filter: blur(5px);
}
/* =========================
   ARROW
========================= */
.product-arrow {
  position: absolute;
  z-index: 4;
  right: 10px;
  bottom: 10px;
  width: 29px;
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6c5ce7;
  color: white;
  opacity: 0;
  transform: translateY(5px);
  transition:
    opacity .2s,
    transform .2s;
}
.product-card:hover .product-arrow {
  opacity: 1;
  transform: translateY(0);
}
/* =========================
   BODY
========================= */
.product-body {
  padding: 13px 15px 15px;
  border-top: 1px solid rgba(255,255,255,.045);
}
.product-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #d9d9e5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color .2s;
}
.product-card:hover .product-title {
  color: white;
}
.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.product-price {
  color: #a29bfe;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 700;
}
.product-user {
  color: #454557;
  font-size: 10px;
}
.product-user span {
  color: #707086;
}
/* =========================
   STATES
========================= */
.state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #414152;
  animation: fadeUp .35s ease both;
}
.state-icon {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(108,92,231,.18);
  color: #555568;
  clip-path: polygon(
    0 0,
    calc(100% - 8px) 0,
    100% 8px,
    100% 100%,
    0 100%
  );
}
.state-title {
  color: #6a6a7d;
  font-size: 13px;
}
.state-text {
  color: #3e3e4d;
  font-size: 11px;
}
/* =========================
   RESPONSIVE
========================= */
@media (max-width: 600px) {
  .market-title {
    font-size: 38px;
  }
  .product-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .product-image {
    height: 145px;
  }
  .product-body {
    padding: 11px;
  }
  .product-user {
    display: none;
  }
}
@media (max-width: 400px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  .product-image {
    height: 185px;
  }
}
`;
function ProductCard({ p, index, onView }) {
  return (
    <div
      className="product-card"
      style={{
        animationDelay: `${index * 45}ms`,
      }}
      onClick={() => onView(p.id)}
    >
      <div className="product-image">
        {p.coverImage ? (
          <div
            className="product-image-bg"
            style={{
              backgroundImage: `url(${p.coverImage})`,
            }}
          />
        ) : (
          <div className="no-image">
            <ImagePlus size={22} />
          </div>
        )}
        <div className="product-number">
          #{String(index + 1).padStart(2, "0")}
        </div>
        <div className="product-arrow">
          <ArrowUpRight size={15} />
        </div>
      </div>
      <div className="product-body">
        <div className="product-title">
          {p.title}
        </div>
        <div className="product-meta">
          <div className="product-price">
            ${p.price}
          </div>
          {p.USER?.name && (
            <div className="product-user">
              by <span>{p.USER.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: allProducts, loading } = useSelector(
    (state) => state.products.products
  );
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const handleSearch = () => {
  setQuery(searchInput.trim());
  };
  
  const handleClearSearch = () => {
    setSearchInput("");
    setQuery("");
  };
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  const filtered = (allProducts || []).filter((p) =>
  p.title?.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="page">
      <style>{S}</style>
      <Navbar />
      <div
        style={{
          flex: 1,
          padding: "0 clamp(16px, 3vw, 32px) 35px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* HEADER */}
        <div className="market-header">
          <div className="eyebrow">
            Find a Product on Sphere
          </div>
          <h1 className="market-title">
            Merchandise<span>.</span>
          </h1>
          <p className="market-subtitle">
            Explore products, creator merchandise and
            exclusive drops from the StreamSphere community.
          </p>
         <div className="search-area">
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
        
            <Search
              size={16}
              className="search-icon"
            />
        
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search merchandise, creators, products..."
              aria-label="Search products"
            />
        
            {searchInput && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
        
            <button
              type="submit"
              className="search-button"
            >
              <Search size={14} />
              <span>SEARCH</span>
            </button>
        
          </form>
        
          <div className="search-result-info">
        
            <span>
              {query
                ? `Results for "${query}"`
                : "Browse all merchandise"}
            </span>
        
            <strong>
              {filtered.length} ITEMS
            </strong>
        
          </div>
        
        </div>
        </div>
        {/* LOADING */}
        {loading && filtered.length === 0 && (
          <div className="state">
            <div className="state-icon">
              <Search size={18} />
            </div>
            <div className="state-title">
              Loading products...
            </div>
            <div className="state-text">
              Please wait
            </div>
          </div>
        )}
        {/* EMPTY */}
        {!loading && filtered.length === 0 && (
          <div className="state">
            <div className="state-icon">
              <Search size={18} />
            </div>
            <div className="state-title">
              {query
                ? "No products match your search."
                : "No products listed yet."}
            </div>
            <div className="state-text">
              {query
                ? "Try another search."
                : "Products will appear here once listed."}
            </div>
          </div>
        )}
        {/* PRODUCTS */}
        {filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map((p, index) => (
              <ProductCard
                key={p.id}
                p={p}
                index={index}
                onView={(id) =>
                  navigate(`/products/${id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}