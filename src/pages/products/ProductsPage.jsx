import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from '../Navbar'
import Footer from "../Footer";
import { getProduct, getAllProducts, clearSelectedProduct, deleteProduct } from "../../features/productSlice/productSlice";
import { ArrowLeft, Trash2, ImagePlus, Minus, Plus, ShieldCheck, Truck, RotateCcw, MessageCircle, User } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
.page{font-family:'Inter',system-ui,sans-serif;background:#07070d;color:#e0e0f0;min-height:100vh;display:flex;flex-direction:column;}
.mono{font-family:'JetBrains Mono',monospace;}
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:#07070d}
::-webkit-scrollbar-thumb{background:linear-gradient(#6c5ce7,#1abc9c);border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

.back-btn{display:inline-flex;align-items:center;gap:6px;color:#888;font-size:13px;cursor:pointer;background:none;border:none;font-family:inherit;padding:8px 0;}
.back-btn:hover{color:#ccc;}

.panel{background:linear-gradient(145deg,rgba(12,10,24,.95),rgba(8,6,18,.95));border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px;}

.gb{padding:13px 0;background:linear-gradient(135deg,#6c5ce7,#9b89f5);border:none;border-radius:10px;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;box-shadow:0 0 22px rgba(108,92,231,.4);transition:transform .15s,box-shadow .15s;width:100%;}
.gb:hover{transform:translateY(-1px);box-shadow:0 0 30px rgba(108,92,231,.55);}

.fb{padding:13px 0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#ccc;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;transition:all .15s;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;}
.fb:hover{background:rgba(255,255,255,.08);}

.qty-btn{width:32px;height:32px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#ccc;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.qty-btn:hover{background:rgba(255,255,255,.08);}

.trust-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12.5px;color:#888;}
.trust-row:last-child{border-bottom:none;}

.related-card{border-radius:12px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05);overflow:hidden;cursor:pointer;transition:all .15s;}
.related-card:hover{border-color:rgba(108,92,231,.3);transform:translateY(-2px);}

@media(max-width:860px){
  .detail-grid{grid-template-columns:1fr!important;}
  .buy-box{position:static!important;}
}
`;

function StarRow() {
  // BACKEND HOOK: no rating/review system exists yet — this is a
  // neutral placeholder, not fabricated numbers, so it doesn't imply
  // real review data that doesn't back it.
  return (
    <div style={{ fontSize: 12, color: "#444" }}>No reviews yet — be the first to buy and leave feedback.</div>
  );
}

function RelatedCard({ p, onView }) {
  return (
    <div className="related-card" onClick={() => onView(p.id)}>
      <div style={{ width: "100%", height: 110, background: p.coverImage ? `center/cover no-repeat url(${p.coverImage})` : "linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!p.coverImage && <ImagePlus size={18} color="#333" />}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "#ccc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
        <div className="mono" style={{ fontSize: 12, color: "#a29bfe", fontWeight: 700, marginTop: 3 }}>${p.price}</div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selected: product, list: allProducts } = useSelector((state) => state.products.products);
  const { user } = useSelector((state) => state.authentication.authentication);

  const [qty, setQty] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPageLoading(true);
    setNotFound(false);

    dispatch(getProduct(id))
      .unwrap()
      .then(() => {
        if (!cancelled) setPageLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setPageLoading(false);
          setNotFound(true);
        }
      });

    // Fetched independently — its own success/failure never affects
    // whether THIS product is considered found, since it shares the
    // same loading/error fields in productSlice as getProduct.
    dispatch(getAllProducts());

    return () => {
      cancelled = true;
      dispatch(clearSelectedProduct());
    };
  }, [id, dispatch]);

  useEffect(() => {
    setQty(1); // reset quantity stepper when navigating between products
  }, [id]);

  const isOwner = product && user && product.userId === user.id;

  const relatedProducts = (allProducts || []).filter(
    (p) => product && p.userId === product.userId && p.id !== product.id
  ).slice(0, 4);

  const handleDelete = () => {
    dispatch(deleteProduct(id))
      .unwrap()
      .then(() => navigate("/profile"))
      .catch((err) => console.log(err, "Failed to delete product"));
  };

  return (
    <div className="page">
      <style>{S}</style>
      <Navbar />

      <div style={{ flex: 1, padding: "clamp(16px,3vw,32px)", maxWidth: 1160, margin: "0 auto", width: "100%" }}>
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        {pageLoading && (
          <div style={{ color: "#666", textAlign: "center", padding: "80px 0" }}>Loading product…</div>
        )}

        {!pageLoading && notFound && (
          <div style={{ color: "#666", textAlign: "center", padding: "80px 0" }}>
            Couldn't find that product — it may have been removed.
          </div>
        )}

        {!pageLoading && !notFound && product && (
          <>
            <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 28, marginTop: 16, alignItems: "start" }}>

              {/* ── IMAGE ── */}
              <div style={{ animation: "fadeUp .3s ease both" }}>
                <div style={{ width: "100%", aspectRatio: "1.1 / 1", borderRadius: 18, overflow: "hidden", background: product.coverImage ? `center/cover no-repeat url(${product.coverImage})` : "linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,.07)" }}>
                  {!product.coverImage && <ImagePlus size={44} color="#333" />}
                </div>

                {/* ── DESCRIPTION ── */}
                <div className="panel" style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                    Description
                  </div>
                  <p style={{ fontSize: 14, color: "#999", lineHeight: 1.8 }}>
                    {product.description || "No description provided for this product."}
                  </p>
                </div>

                {/* ── MORE FROM THIS SELLER ── */}
                {relatedProducts.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
                      More from {product.USER?.name || "this seller"}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                      {relatedProducts.map((p) => (
                        <RelatedCard key={p.id} p={p} onView={(pid) => navigate(`/products/${pid}`)} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── BUY BOX ── */}
              <div className="buy-box" style={{ position: "sticky", top: 20, animation: "fadeUp .3s .05s ease both" }}>
                <h1 style={{ fontSize: 22, fontWeight: 900, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 8 }}>{product.title}</h1>
                <StarRow />

                <div className="mono" style={{ fontSize: 30, fontWeight: 800, color: "#f0f0f0", margin: "16px 0 4px" }}>
                  ${product.price}
                </div>
                <div style={{ fontSize: 12, color: "#3ecf8e", marginBottom: 20 }}>In stock — ready to ship</div>

                <div className="panel" style={{ padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontSize: 13, color: "#888", fontWeight: 600 }}>Quantity</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
                      <span className="mono" style={{ width: 20, textAlign: "center", fontSize: 14 }}>{qty}</span>
                      <button className="qty-btn" onClick={() => setQty((q) => q + 1)}><Plus size={14} /></button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="gb">Buy now — ${(product.price * qty).toFixed(2)}</button>
                    <button className="fb">
                      <MessageCircle size={15} /> Contact seller
                    </button>
                    {isOwner && (
                      <button
                        onClick={handleDelete}
                        style={{ padding: "11px 0", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.35)", borderRadius: 10, color: "#f0a0a0", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                      >
                        <Trash2 size={14} /> Delete listing
                      </button>
                    )}
                  </div>
                </div>

                <div className="panel" style={{ marginTop: 16, padding: "6px 18px" }}>
                  <div className="trust-row">
                    <Truck size={15} color="#6c5ce7" /> Ships within 2–4 business days
                  </div>
                  <div className="trust-row">
                    <RotateCcw size={15} color="#6c5ce7" /> 14-day return window
                  </div>
                  <div className="trust-row">
                    <ShieldCheck size={15} color="#6c5ce7" /> Buyer protection on all orders
                  </div>
                </div>

                {product.USER && (
                  <div className="panel" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#6c5ce766,#6c5ce7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <User size={18} color="#fff" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>{product.USER.name}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>Seller</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}