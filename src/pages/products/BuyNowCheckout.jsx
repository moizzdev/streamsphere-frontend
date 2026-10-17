import React, { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  LockKeyhole,
  CreditCard,
  Smartphone,
  MapPin,
  ChevronRight,
  CheckCircle2,
  PackageCheck,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import "./BuyNowCheckout.css";

export default function BuyNowCheckout({ product, quantity = 1, onClose, onComplete }) {
  const [qty, setQty] = useState(Math.max(1, Number(quantity) || 1));
  const [payment, setPayment] = useState("card");
  const [step, setStep] = useState("checkout");
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!product) return null;

  const price = Number(product.price) || 0;
  const subtotal = price * qty;
  const shipping = subtotal >= 100 ? 0 : 5;
  const total = subtotal + shipping;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (processing) return;

    setProcessing(true);

    /*
      This component intentionally does not invent a backend/order API.
      Connect your real create-order thunk/API inside this timeout block.
    */
    window.setTimeout(() => {
      setProcessing(false);
      setStep("success");

      if (onComplete) {
        onComplete({
          productId: product.id,
          quantity: qty,
          paymentMethod: payment,
          customer: form,
          subtotal,
          shipping,
          total,
        });
      }
    }, 900);
  };

  const image = product.coverImage || product.image || product.imageUrl;

  return (
    <div className="checkout-overlay" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="checkout-backdrop" onClick={onClose} />

      <section className="checkout-modal">
        <div className="checkout-topbar">
          <div className="checkout-brand">
            <span className="checkout-brand-mark">S</span>
            <div>
              <strong>StreamSphere</strong>
              <span>SECURE CHECKOUT</span>
            </div>
          </div>

          <button className="checkout-close" type="button" onClick={onClose} aria-label="Close checkout">
            <X size={19} />
          </button>
        </div>

        {step === "success" ? (
          <div className="checkout-success">
            <div className="success-orbit">
              <div className="success-icon">
                <CheckCircle2 size={42} />
              </div>
            </div>

            <span className="success-kicker">ORDER CONFIRMED</span>
            <h2>You're all set.</h2>
            <p>
              Your order for <strong>{product.title}</strong> has been received.
            </p>

            <div className="success-card">
              <div>
                <span>ORDER TOTAL</span>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <PackageCheck size={25} />
            </div>

            <button className="checkout-primary success-button" type="button" onClick={onClose}>
              Continue shopping
              <ChevronRight size={17} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="checkout-layout">
              <main className="checkout-main">
                <div className="checkout-heading">
                  <button className="mobile-close-back" type="button" onClick={onClose}>
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <span className="checkout-kicker">ONE STEP AWAY</span>
                    <h1>Complete your order</h1>
                    <p>Fast, secure and protected checkout.</p>
                  </div>
                </div>

                <section className="checkout-section">
                  <div className="section-title">
                    <span>01</span>
                    <div>
                      <h3>Contact details</h3>
                      <p>Where should we send your order?</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <label>
                      <span>Full name</span>
                      <input name="name" value={form.name} onChange={updateField} placeholder="Your name" required />
                    </label>

                    <label>
                      <span>Email address</span>
                      <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
                    </label>

                    <label>
                      <span>Phone number</span>
                      <input name="phone" value={form.phone} onChange={updateField} placeholder="+92 300 0000000" required />
                    </label>

                    <label>
                      <span>City</span>
                      <input name="city" value={form.city} onChange={updateField} placeholder="Karachi" required />
                    </label>

                    <label className="full-field">
                      <span>Delivery address</span>
                      <input name="address" value={form.address} onChange={updateField} placeholder="House, street, area" required />
                    </label>
                  </div>
                </section>

                <section className="checkout-section">
                  <div className="section-title">
                    <span>02</span>
                    <div>
                      <h3>Payment method</h3>
                      <p>Choose how you'd like to pay.</p>
                    </div>
                  </div>

                  <div className="payment-options">
                    <button
                      type="button"
                      className={"payment-option " + (payment === "card" ? "selected" : "")}
                      onClick={() => setPayment("card")}
                    >
                      <span className="payment-icon"><CreditCard size={18} /></span>
                      <span>
                        <strong>Card</strong>
                        <small>Visa, Mastercard & more</small>
                      </span>
                      <span className="radio-dot" />
                    </button>

                    <button
                      type="button"
                      className={"payment-option " + (payment === "mobile" ? "selected" : "")}
                      onClick={() => setPayment("mobile")}
                    >
                      <span className="payment-icon"><Smartphone size={18} /></span>
                      <span>
                        <strong>Mobile wallet</strong>
                        <small>Available payment wallets</small>
                      </span>
                      <span className="radio-dot" />
                    </button>
                  </div>
                </section>

                <div className="checkout-security">
                  <ShieldCheck size={17} />
                  <div>
                    <strong>Protected checkout</strong>
                    <span>Your payment and personal information stay secure.</span>
                  </div>
                  <LockKeyhole size={15} />
                </div>
              </main>

              <aside className="order-panel">
                <div className="order-label">YOUR ORDER</div>

                <div className="product-mini">
                  <div className="product-mini-image">
                    {image ? (
                      <img src={image} alt={product.title || "Product"} />
                    ) : (
                      <span>S</span>
                    )}
                  </div>

                  <div className="product-mini-info">
                    <strong>{product.title}</strong>
                    <span>${price.toFixed(2)} each</span>
                  </div>
                </div>

                <div className="quantity-row">
                  <span>Quantity</span>
                  <div className="quantity-control">
                    <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <strong>{qty}</strong>
                    <button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="price-lines">
                  <div>
                    <span>Subtotal</span>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? "FREE" : "$" + shipping.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="total-line">
                  <span>Total</span>
                  <strong>${total.toFixed(2)}</strong>
                </div>

                <button className="checkout-primary" type="submit" disabled={processing}>
                  {processing ? (
                    <>
                      <span className="checkout-spinner" />
                      Processing order...
                    </>
                  ) : (
                    <>
                      Place order
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <div className="order-note">
                  <MapPin size={14} />
                  <span>Delivery estimates depend on your selected location.</span>
                </div>
              </aside>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
