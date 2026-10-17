import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from '../Navbar'
import Footer from "../Footer";
import { getProduct, clearSelectedProduct } from "../../features/productSlice/productSlice";
import { createOrder } from "../../features/productSlice/orderSlice";
import { MapPin, CreditCard, Truck, Check, ImagePlus, ChevronLeft } from "lucide-react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap');

.page{font-family:'Inter',system-ui,sans-serif;background:#07070d;color:#e0e0f0;min-height:100vh;display:flex;flex-direction:column;}
.mono{font-family:'JetBrains Mono',monospace;}
.panel{background:linear-gradient(145deg,rgba(12,10,24,.95),rgba(8,6,18,.95));border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:24px;}
.field{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px;color:#eee;font-family:'Inter',sans-serif;font-size:13.5px;outline:none;transition:border-color .15s;}
.field:focus{border-color:#6c5ce7;}
.field::placeholder{color:#444;}
.label{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:#77727f;letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px;display:block;}
.gb{padding:13px 0;background:linear-gradient(135deg,#6c5ce7,#9b89f5);border:none;border-radius:10px;color:#fff;font-weight:800;font-size:14px;cursor:pointer;font-family:inherit;box-shadow:0 0 22px rgba(108,92,231,.4);transition:transform .15s,box-shadow .15s;width:100%;}
.gb:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 30px rgba(108,92,231,.55);}
.gb:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}
.fb{padding:13px 0;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#ccc;font-weight:700;font-size:14px;cursor:pointer;font-family:inherit;width:100%;}
.pay-option{display:flex;align-items:center;gap:12px;padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,.1);cursor:pointer;transition:all .15s;}
.pay-option.selected{border-color:#6c5ce7;background:rgba(108,92,231,.08);}
.step-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;}
.step-dot.done{background:#6c5ce7;color:#fff;}
.step-dot.active{background:rgba(108,92,231,.2);border:1.5px solid #6c5ce7;color:#a29bfe;}
.step-dot.todo{background:rgba(255,255,255,.05);color:#444;}
`;

const STEPS = [
  { id: "address", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

function StepIndicator({ current }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
      {STEPS.map((s, i) => (
        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className={`step-dot ${i < idx ? "done" : i === idx ? "active" : "todo"}`}>
            {i < idx ? <Check size={13} /> : i + 1}
          </div>
          <span style={{ fontSize: 12.5, color: i <= idx ? "#ccc" : "#444", fontWeight: 600 }}>{s.label}</span>
          {i < STEPS.length - 1 && <div style={{ width: 24, height: 1, background: "rgba(255,255,255,.1)" }} />}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const qty = Number(searchParams.get("qty")) || 1;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selected: product } = useSelector((state) => state.products.products);
  const [step, setStep] = useState("address");
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  const [address, setAddress] = useState({
    fullName: "", phone: "", addressLine: "", city: "", postalCode: "", country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    dispatch(getProduct(id));
    return () => dispatch(clearSelectedProduct());
  }, [id, dispatch]);

  const addressValid = address.fullName && address.phone && address.addressLine && address.city && address.country;

  const total = product ? (product.price * qty).toFixed(2) : "0.00";

  const handlePlaceOrder = () => {
    setPlacing(true);
    setPlaceError(null);
    dispatch(createOrder({
      productId: id,
      quantity: qty,
      paymentMethod,
      ...address,
    }))
      .unwrap()
      .then((order) => {
        setPlacing(false);
        navigate(`/order-confirmed/${order.id}`);
      })
      .catch((err) => {
        setPlacing(false);
        setPlaceError(err?.messege || "Failed to place order. Please try again.");
      });
  };

  return (
    <div className="page">
      <style>{S}</style>
      <Navbar />

      <div style={{ flex: 1, padding: "clamp(16px,3vw,32px)", maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: "8px 0", marginBottom: 10 }}>
          <ChevronLeft size={15} /> Back
        </button>

        <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 900, color: "#f0f0f0", marginBottom: 20 }}>Checkout</h1>

        <StepIndicator current={step} />

        {!product ? (
          <div style={{ color: "#666", textAlign: "center", padding: "60px 0" }}>Loading…</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>

            <div className="panel">
              {step === "address" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <MapPin size={16} color="#6c5ce7" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>Shipping address</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label className="label">Full name</label>
                      <input className="field" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="label">Phone number</label>
                      <input className="field" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} placeholder="+92 3xx xxxxxxx" />
                    </div>
                    <div>
                      <label className="label">Street address</label>
                      <input className="field" value={address.addressLine} onChange={(e) => setAddress({ ...address, addressLine: e.target.value })} placeholder="House no, street, area" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div>
                        <label className="label">City</label>
                        <input className="field" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" />
                      </div>
                      <div>
                        <label className="label">Postal code</label>
                        <input className="field" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} placeholder="Optional" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Country</label>
                      <input className="field" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Country" />
                    </div>

                    <button className="gb" disabled={!addressValid} onClick={() => setStep("payment")} style={{ marginTop: 6 }}>
                      Continue to payment
                    </button>
                  </div>
                </>
              )}

              {step === "payment" && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <CreditCard size={16} color="#6c5ce7" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>Payment method</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <div className={`pay-option ${paymentMethod === "cod" ? "selected" : ""}`} onClick={() => setPaymentMethod("cod")}>
                      <Truck size={18} color={paymentMethod === "cod" ? "#a29bfe" : "#666"} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>Cash on delivery</div>
                        <div style={{ fontSize: 11.5, color: "#666" }}>Pay when your order arrives</div>
                      </div>
                    </div>
                    <div className={`pay-option ${paymentMethod === "card" ? "selected" : ""}`} onClick={() => setPaymentMethod("card")}>
                      <CreditCard size={18} color={paymentMethod === "card" ? "#a29bfe" : "#666"} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd" }}>Card</div>
                        <div style={{ fontSize: 11.5, color: "#666" }}>
                          Demo only — no real payment gateway is connected yet, no card is charged.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="fb" onClick={() => setStep("address")}>Back</button>
                    <button className="gb" onClick={() => setStep("review")}>Review order</button>
                  </div>
                </>
              )}

              {step === "review" && (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd", marginBottom: 18 }}>Review your order</div>

                  <div style={{ marginBottom: 18 }}>
                    <div className="label">Shipping to</div>
                    <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.7 }}>
                      {address.fullName}<br />
                      {address.addressLine}, {address.city} {address.postalCode}<br />
                      {address.country} · {address.phone}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div className="label">Payment</div>
                    <div style={{ fontSize: 13, color: "#ccc" }}>
                      {paymentMethod === "cod" ? "Cash on delivery" : "Card (demo)"}
                    </div>
                  </div>

                  {placeError && (
                    <div style={{ fontSize: 12.5, color: "#f0a0a0", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
                      {placeError}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="fb" onClick={() => setStep("payment")} disabled={placing}>Back</button>
                    <button className="gb" onClick={handlePlaceOrder} disabled={placing}>
                      {placing ? "Placing order…" : `Place order — $${total}`}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="panel">
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#6c5ce7", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
                Order summary
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 60, height: 60, borderRadius: 10, flexShrink: 0, background: product.coverImage ? `center/cover no-repeat url(${product.coverImage})` : "linear-gradient(135deg,rgba(108,92,231,.15),rgba(162,155,254,.08))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!product.coverImage && <ImagePlus size={18} color="#333" />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</div>
                  <div className="mono" style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Qty: {qty}</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#888" }}>
                  <span>Subtotal</span><span className="mono">${total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#888" }}>
                  <span>Shipping</span><span className="mono">Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 800, color: "#f0f0f0", marginTop: 6, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,.07)" }}>
                  <span>Total</span><span className="mono">${total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}