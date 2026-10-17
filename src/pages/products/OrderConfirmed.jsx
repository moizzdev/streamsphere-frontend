import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from '../Navbar'
import Footer from "../Footer";
import { getOrder } from "../../features/productSlice/orderSlice";
import { CheckCircle2, Package } from "lucide-react";

export default function OrderConfirmedPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected: order, loading } = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(getOrder(id));
  }, [id, dispatch]);

  return (
    <div style={{ background: "#07070d", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#e0e0f0", fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        {loading && <div style={{ color: "#666" }}>Loading…</div>}

        {!loading && order && (
          <>
            <CheckCircle2 size={56} color="#3ecf8e" style={{ marginBottom: 20 }} />
            <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Order confirmed!</h1>
            <p style={{ color: "#888", marginBottom: 24, maxWidth: 380 }}>
              Thanks — your order has been placed. You'll be contacted at the phone number you provided.
            </p>

            <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: 20, minWidth: 280, textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "#a29bfe" }}>
                <Package size={16} /> <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase" }}>Order #{order.id.slice(0, 8)}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{order.PRODUCT?.title}</div>
              <div style={{ fontSize: 13, color: "#888" }}>Qty {order.quantity} · ${order.totalPrice}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>
                {order.paymentMethod === "cod" ? "Cash on delivery" : "Card (demo)"}
              </div>
            </div>

            <button
              onClick={() => navigate("/products")}
              style={{ marginTop: 28, padding: "12px 28px", background: "linear-gradient(135deg,#6c5ce7,#9b89f5)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Continue shopping
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}