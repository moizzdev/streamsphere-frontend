import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from '../Navbar'
import Footer from "../Footer";
import { getMyCart, updateCartItem, removeFromCart } from "../../features/productSlice/cartSlice";
import { Minus, Plus, Trash2, ImagePlus, ShoppingBag } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

.page{font-family:'Inter',system-ui,sans-serif;background:#07070d;color:#e0e0f0;min-height:100vh;display:flex;flex-direction:column;}
.mono{font-family:'JetBrains Mono',monospace;}
.panel{background:linear-gradient(145deg,rgba(12,10,24,.95),rgba(8,6,18,.95));border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:20px;}
.qty-btn{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.03);color:#ccc;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.qty-btn:hover{background:rgba(255,255,255,.08);}
.gb{padding:13px 0;background:linear-gradient(135deg,#6c5ce7,#9b89f5);border:none;border-radius:10px;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;box-shadow:0 0 22px rgba(108,92,231,.4);transition:transform .15s,box-shadow .15s;width:100%;}
.gb:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 30px rgba(108,92,231,.55);}
.gb:disabled{opacity:.5;cursor:not-allowed;}
`;

function CartRow({ item, onQtyChange, onRemove }) {
  const product = item.PRODUCT;
  if (!product) return null;
  return (
    <div style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
      <div style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0, background: product.coverImage ? `center/cover no-repeat url(${product.coverImage})` : "linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {!product.coverImage && <ImagePlus size={18} color="#333" />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</div>
        <div className="mono" style={{ fontSize: 12, color: "#888", marginTop: 3 }}>${product.price} each</div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="qty-btn" onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}><Minus size={13} /></button>
            <span className="mono" style={{ width: 18, textAlign: "center", fontSize: 13 }}>{item.quantity}</span>
            <button className="qty-btn" onClick={() => onQtyChange(item.id, item.quantity + 1)}><Plus size={13} /></button>
          </div>
          <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#f0a0a0", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
            <Trash2 size={13} /> Remove
          </button>
        </div>
      </div>

      <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0", flexShrink: 0 }}>
        ${(product.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading } = useSelector((state) => state.cart.cart);

  useEffect(() => {
    dispatch(getMyCart());
  }, [dispatch]);

  const handleQtyChange = (id, quantity) => {
    dispatch(updateCartItem({ id, quantity }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const total = list.reduce((sum, item) => sum + (item.PRODUCT?.price || 0) * item.quantity, 0);

  // BACKEND HOOK: checking out from the cart currently sends the
  // buyer through the existing single-item checkout flow, one product
  // at a time, since /orders/create only accepts one productId per
  // order right now. A true multi-item "one order, many products"
  // checkout would need the ORDER model extended with an ORDER_ITEMS
  // table — worth building later if a real multi-item cart checkout
  // matters, but this keeps things working today.
  const handleCheckoutFirstItem = () => {
    if (list.length === 0) return;
    const first = list[0];
    navigate(`/checkout/${first.PRODUCT.id}?qty=${first.quantity}`);
  };

  return (
    <div className="page">
      <style>{S}</style>
      <Navbar />

      <div style={{ flex: 1, padding: "clamp(16px,3vw,32px)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <ShoppingBag size={20} color="#6c5ce7" />
          <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 900, color: "#f0f0f0" }}>Your cart</h1>
        </div>

        {loading && list.length === 0 && (
          <div style={{ color: "#666", textAlign: "center", padding: "60px 0" }}>Loading…</div>
        )}

        {!loading && list.length === 0 && (
          <div className="panel" style={{ textAlign: "center", padding: "50px 20px", color: "#555" }}>
            Your cart is empty.
            <div style={{ marginTop: 16 }}>
              <button className="gb" style={{ maxWidth: 220, margin: "0 auto" }} onClick={() => navigate("/products")}>
                Browse merchandise
              </button>
            </div>
          </div>
        )}

        {list.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
            <div className="panel">
              {list.map((item) => (
                <CartRow key={item.id} item={item} onQtyChange={handleQtyChange} onRemove={handleRemove} />
              ))}
            </div>

            <div className="panel">
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#f0f0f0", marginBottom: 16 }}>
                <span>Total</span>
                <span className="mono">${total.toFixed(2)}</span>
              </div>
              <button className="gb" onClick={handleCheckoutFirstItem}>Checkout</button>
              <p style={{ fontSize: 11, color: "#555", marginTop: 10, lineHeight: 1.6 }}>
                Checkout currently processes one item at a time — you'll be taken through checkout for the first item in your cart.
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}