import React, { useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./Subscription.css";

const plans = [
  {
    name: "Starter",
    label: "FOR CASUAL CREATORS",
    monthly: 9,
    yearly: 7,
    description:
      "Everything you need to start building your streaming presence.",
    accent: "blue",
    features: [
      "1 Creator Profile",
      "5 Custom Collections",
      "Basic Analytics",
      "10 GB Cloud Storage",
      "Community Access",
      "Standard Support",
    ],
  },
  {
    name: "Creator",
    label: "MOST POPULAR",
    monthly: 19,
    yearly: 15,
    description:
      "The complete toolkit for serious creators and streamers.",
    accent: "purple",
    popular: true,
    features: [
      "Unlimited Collections",
      "Advanced Analytics",
      "100 GB Cloud Storage",
      "Digital Marketplace",
      "Custom Creator Page",
      "Priority Support",
      "Exclusive Themes",
      "Monetization Tools",
    ],
  },
  {
    name: "Pro Studio",
    label: "FOR PROFESSIONALS",
    monthly: 39,
    yearly: 31,
    description:
      "Maximum power, storage and control for professional creators.",
    accent: "cyan",
    features: [
      "Everything in Creator",
      "500 GB Cloud Storage",
      "Advanced Monetization",
      "Premium Marketplace Tools",
      "Custom Branding",
      "Team Collaboration",
      "API Access",
      "Dedicated Support",
    ],
  },
];

const comparison = [
  ["Creator Profile", "1", "Unlimited", "Unlimited"],
  ["Custom Collections", "5", "Unlimited", "Unlimited"],
  ["Cloud Storage", "10 GB", "100 GB", "500 GB"],
  ["Analytics", "Basic", "Advanced", "Advanced+"],
  ["Marketplace", "—", "✓", "✓"],
  ["Monetization", "—", "✓", "Advanced"],
  ["Custom Branding", "—", "✓", "✓"],
  ["Team Collaboration", "—", "—", "✓"],
  ["API Access", "—", "—", "✓"],
  ["Support", "Standard", "Priority", "Dedicated"],
];

const paymentMethods = [
  {
    id: "card",
    title: "Credit / Debit Card",
    description: "Visa, Mastercard and supported cards",
    icon: "▣",
  },
  {
    id: "paypal",
    title: "PayPal",
    description: "Continue using your PayPal account",
    icon: "P",
  },
  {
    id: "wallet",
    title: "Digital Wallet",
    description: "Fast wallet-based checkout",
    icon: "◉",
  },
];

function Subscription() {
  const [billing, setBilling] = useState("monthly");

  const [stage, setStage] = useState("plans");

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("card");

  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const getPrice = (plan) => {
    if (!plan) return 0;

    return billing === "monthly"
      ? plan.monthly
      : plan.yearly;
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const choosePlan = (plan) => {
    setSelectedPlan(plan);
    setStage("payment");
    goToTop();
  };

  const handleInput = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCardNumber = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

    setForm((previous) => ({
      ...previous,
      cardNumber: value,
    }));
  };

  const handleExpiry = (event) => {
    let value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (value.length > 2) {
      value = `${value.slice(0, 2)} / ${value.slice(2)}`;
    }

    setForm((previous) => ({
      ...previous,
      expiry: value,
    }));
  };

  const continueToReview = () => {
    if (paymentMethod === "card") {
      const cardLength =
        form.cardNumber.replace(/\s/g, "").length;

      if (
        !form.name.trim() ||
        cardLength !== 16 ||
        form.expiry.length < 7 ||
        form.cvv.length < 3
      ) {
        alert("Please enter valid card details.");
        return;
      }
    }

    setStage("review");
    goToTop();
  };

  const confirmSubscription = () => {
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setStage("success");
      goToTop();
    }, 1400);
  };

  const resetSubscription = () => {
    setStage("plans");
    setSelectedPlan(null);
    setPaymentMethod("card");

    setForm({
      name: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    });

    goToTop();
  };

  return (
    <div className="subscription-page">
      <Navbar />

      <main className="subscription-main">

        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div className="subscription-grid" />

        <div className="subscription-glow glow-one" />
        <div className="subscription-glow glow-two" />
        <div className="subscription-glow glow-three" />

        {/* =====================================================
            PLANS
        ====================================================== */}

        {stage === "plans" && (
          <>
            <section className="subscription-hero">

              <div className="hero-badge">
                <span className="badge-dot" />
                STREAMSPHERE PRO
              </div>

              <h1>
                Build your world.
                <span> Own your audience.</span>
              </h1>

              <p>
                Unlock the complete StreamSphere creator ecosystem.
                Powerful tools, premium features and everything you
                need to turn your content into a digital experience.
              </p>

              <div className="billing-wrapper">

                <div className="billing-toggle">

                  <button
                    type="button"
                    className={
                      billing === "monthly"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBilling("monthly")
                    }
                  >
                    Monthly
                  </button>

                  <button
                    type="button"
                    className={
                      billing === "yearly"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setBilling("yearly")
                    }
                  >
                    Yearly

                    <span className="save-badge">
                      SAVE 20%
                    </span>
                  </button>

                </div>

              </div>

            </section>

            {/* ================= PLANS ================= */}

            <section className="plans-section">

              <div className="plans-grid">

                {plans.map((plan) => {
                  const price = getPrice(plan);

                  return (
                    <article
                      className={`plan-card ${plan.accent} ${
                        plan.popular
                          ? "popular"
                          : ""
                      }`}
                      key={plan.name}
                    >

                      {plan.popular && (
                        <div className="popular-ribbon">
                          <span>✦</span>
                          MOST POPULAR
                        </div>
                      )}

                      <div className="plan-top">

                        <div
                          className={`plan-icon ${plan.accent}`}
                        >
                          <div className="icon-core" />
                        </div>

                        <div className="plan-label">
                          {plan.label}
                        </div>

                        <h2>{plan.name}</h2>

                        <p>
                          {plan.description}
                        </p>

                      </div>

                      <div className="price-area">

                        <span className="currency">
                          $
                        </span>

                        <strong>
                          {price}
                        </strong>

                        <span className="period">
                          /month
                        </span>

                      </div>

                      {billing === "yearly" && (
                        <div className="yearly-note">
                          Billed annually · 20% savings
                        </div>
                      )}

                      {/* FUNCTIONAL BUTTON */}

                      <button
                        type="button"
                        className="plan-button"
                        onClick={() =>
                          choosePlan(plan)
                        }
                      >
                        <span>
                          Get started
                        </span>

                        <span className="button-arrow">
                          →
                        </span>
                      </button>

                      <div className="feature-divider" />

                      <div className="includes-title">
                        INCLUDED WITH{" "}
                        {plan.name.toUpperCase()}
                      </div>

                      <ul className="feature-list">

                        {plan.features.map(
                          (feature) => (
                            <li key={feature}>

                              <span className="check">
                                ✓
                              </span>

                              <span>
                                {feature}
                              </span>

                            </li>
                          )
                        )}

                      </ul>

                      <div className="card-reflection" />

                    </article>
                  );
                })}

              </div>

            </section>

            {/* ================= TRUST ================= */}

            <section className="trust-strip">

              <div className="trust-item">
                <strong>99.9%</strong>
                <span>Platform uptime</span>
              </div>

              <div className="trust-line" />

              <div className="trust-item">
                <strong>24/7</strong>
                <span>Creator support</span>
              </div>

              <div className="trust-line" />

              <div className="trust-item">
                <strong>10K+</strong>
                <span>Creators onboard</span>
              </div>

              <div className="trust-line" />

              <div className="trust-item">
                <strong>256-bit</strong>
                <span>Secure encryption</span>
              </div>

            </section>

            {/* ================= SHOWCASE ================= */}

            <section className="feature-showcase">

              <div className="section-heading">

                <div className="mini-label">
                  THE STREAMSPHERE ECOSYSTEM
                </div>

                <h2>
                  More than a subscription.
                  <span>
                    {" "}
                    It's your creator HQ.
                  </span>
                </h2>

                <p>
                  One powerful ecosystem for your
                  profile, community, content,
                  marketplace and audience.
                </p>

              </div>

              <div className="showcase-grid">

                <div className="showcase-card large-card">

                  <div className="showcase-number">
                    01
                  </div>

                  <div className="showcase-icon">
                    ◈
                  </div>

                  <h3>
                    Creator Identity
                  </h3>

                  <p>
                    Build a premium creator profile
                    that brings your content,
                    socials, streams and community
                    together.
                  </p>

                  <div className="fake-profile">

                    <div className="fake-avatar" />

                    <div>

                      <div className="fake-line big" />
                      <div className="fake-line small" />

                    </div>

                    <div className="fake-stat">

                      <strong>
                        48.2K
                      </strong>

                      <span>
                        Followers
                      </span>

                    </div>

                  </div>

                </div>

                <div className="showcase-card">

                  <div className="showcase-number">
                    02
                  </div>

                  <div className="showcase-icon">
                    ◉
                  </div>

                  <h3>
                    Digital Marketplace
                  </h3>

                  <p>
                    Sell presets, overlays, sound
                    packs, courses, digital products
                    and creator resources.
                  </p>

                  <div className="marketplace-orbit">
                    <span>PRESETS</span>
                    <span>LUTS</span>
                    <span>PACKS</span>
                  </div>

                </div>

                <div className="showcase-card">

                  <div className="showcase-number">
                    03
                  </div>

                  <div className="showcase-icon">
                    ⌁
                  </div>

                  <h3>
                    Advanced Analytics
                  </h3>

                  <p>
                    Understand your audience with
                    detailed performance and
                    engagement insights.
                  </p>

                  <div className="analytics-bars">

                    <i style={{ height: "42%" }} />
                    <i style={{ height: "66%" }} />
                    <i style={{ height: "54%" }} />
                    <i style={{ height: "82%" }} />
                    <i style={{ height: "96%" }} />
                    <i style={{ height: "72%" }} />
                    <i style={{ height: "100%" }} />

                  </div>

                </div>

              </div>

            </section>

            {/* ================= COMPARISON ================= */}

            <section className="comparison-section">

              <div className="section-heading">

                <div className="mini-label">
                  COMPARE PLANS
                </div>

                <h2>
                  Choose the level
                  <span>
                    {" "}
                    that fits your world.
                  </span>
                </h2>

              </div>

              <div className="comparison-wrapper">

                <table className="comparison-table">

                  <thead>
                    <tr>
                      <th>FEATURE</th>
                      <th>STARTER</th>

                      <th className="featured-column">
                        CREATOR
                      </th>

                      <th>PRO STUDIO</th>
                    </tr>
                  </thead>

                  <tbody>

                    {comparison.map((row) => (
                      <tr key={row[0]}>

                        <td>
                          {row[0]}
                        </td>

                        <td>
                          {row[1]}
                        </td>

                        <td className="featured-column">
                          {row[2]}
                        </td>

                        <td>
                          {row[3]}
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </section>

            {/* ================= FINAL CTA ================= */}

            <section className="final-cta">

              <div className="cta-glow" />

              <div className="cta-content">

                <div className="mini-label">
                  READY TO ENTER THE SPHERE?
                </div>

                <h2>
                  Your next chapter
                  <span>
                    {" "}
                    starts here.
                  </span>
                </h2>

                <p>
                  Join StreamSphere and turn your
                  digital presence into something
                  people remember.
                </p>

                <button
                  type="button"
                  className="cta-button"
                  onClick={() =>
                    choosePlan(plans[1])
                  }
                >
                  Start creating
                  <span>→</span>
                </button>

                <div className="cta-note">
                  Cancel anytime · Secure checkout
                </div>

              </div>

            </section>
          </>
        )}

        {/* =====================================================
            PAYMENT
        ====================================================== */}

        {stage === "payment" && selectedPlan && (
          <section className="ss-checkout-page">

            <button
              type="button"
              className="ss-checkout-back"
              onClick={resetSubscription}
            >
              ← BACK TO PLANS
            </button>

            <div className="ss-checkout-header">

              <div className="hero-badge">
                <span className="badge-dot" />
                SECURE CHECKOUT
              </div>

              <h1>
                Complete your
                <span>
                  {" "}
                  subscription.
                </span>
              </h1>

              <p>
                You're subscribing to StreamSphere{" "}
                <strong>
                  {selectedPlan.name}
                </strong>.
              </p>

            </div>

            <div className="ss-checkout-layout">

              {/* LEFT */}

              <div className="ss-payment-panel">

                <div className="ss-step-row">

                  <div className="ss-step active">
                    <span>01</span>
                    PAYMENT
                  </div>

                  <div className="ss-step-line" />

                  <div className="ss-step">
                    <span>02</span>
                    REVIEW
                  </div>

                  <div className="ss-step-line" />

                  <div className="ss-step">
                    <span>03</span>
                    COMPLETE
                  </div>

                </div>

                <h3>
                  Payment method
                </h3>

                <div className="ss-payment-methods">

                  {paymentMethods.map(
                    (method) => (
                      <button
                        type="button"
                        key={method.id}
                        className={
                          paymentMethod ===
                          method.id
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setPaymentMethod(
                            method.id
                          )
                        }
                      >

                        <div className="ss-payment-icon">
                          {method.icon}
                        </div>

                        <div className="ss-payment-copy">

                          <strong>
                            {method.title}
                          </strong>

                          <span>
                            {method.description}
                          </span>

                        </div>

                        <div className="ss-radio">
                          {paymentMethod ===
                            method.id && (
                            <span />
                          )}
                        </div>

                      </button>
                    )
                  )}

                </div>

                {paymentMethod === "card" ? (
                  <div className="ss-card-form">

                    <label>
                      CARDHOLDER NAME

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInput}
                        placeholder="MOIZ ASIF"
                      />
                    </label>

                    <label>
                      CARD NUMBER

                      <input
                        type="text"
                        value={form.cardNumber}
                        onChange={handleCardNumber}
                        placeholder="0000 0000 0000 0000"
                      />
                    </label>

                    <div className="ss-form-row">

                      <label>
                        EXPIRY DATE

                        <input
                          type="text"
                          value={form.expiry}
                          onChange={handleExpiry}
                          placeholder="MM / YY"
                        />
                      </label>

                      <label>
                        CVV

                        <input
                          type="password"
                          name="cvv"
                          value={form.cvv}
                          onChange={handleInput}
                          placeholder="•••"
                          maxLength={4}
                        />
                      </label>

                    </div>

                  </div>
                ) : (
                  <div className="ss-external-payment">

                    <div>
                      {paymentMethod === "paypal"
                        ? "P"
                        : "◉"}
                    </div>

                    <h4>
                      {paymentMethod === "paypal"
                        ? "PayPal Checkout"
                        : "Digital Wallet"}
                    </h4>

                    <p>
                      Continue to review and you
                      would normally be redirected
                      to the selected payment
                      provider.
                    </p>

                  </div>
                )}

                <button
                  type="button"
                  className="ss-primary-action"
                  onClick={continueToReview}
                >
                  CONTINUE TO REVIEW
                  <span>→</span>
                </button>

              </div>

              {/* RIGHT */}

              <aside className="ss-order-summary">

                <div className="ss-summary-label">
                  YOUR PLAN
                </div>

                <div
                  className={`ss-summary-card ${selectedPlan.accent}`}
                >

                  <div className="ss-summary-chip">
                    SS
                  </div>

                  <div>
                    <small>
                      STREAMSPHERE PRO
                    </small>

                    <strong>
                      {selectedPlan.name}
                    </strong>

                    <span>
                      CREATOR MEMBERSHIP
                    </span>
                  </div>

                </div>

                <div className="ss-summary-row">

                  <span>
                    Plan
                  </span>

                  <strong>
                    {selectedPlan.name}
                  </strong>

                </div>

                <div className="ss-summary-row">

                  <span>
                    Billing
                  </span>

                  <strong>
                    {billing === "monthly"
                      ? "Monthly"
                      : "Annual"}
                  </strong>

                </div>

                <div className="ss-summary-row">

                  <span>
                    Renewal
                  </span>

                  <strong>
                    Automatic
                  </strong>

                </div>

                <div className="ss-summary-total">

                  <span>
                    TOTAL
                  </span>

                  <strong>
                    ${getPrice(selectedPlan)}

                    <small>
                      /month
                    </small>
                  </strong>

                </div>

                <p>
                  Cancel anytime. No hidden fees.
                </p>

              </aside>

            </div>

          </section>
        )}

        {/* =====================================================
            REVIEW / CONFIRMATION
        ====================================================== */}

        {stage === "review" && selectedPlan && (
          <section className="ss-review-page">

            <div className="hero-badge">
              <span className="badge-dot" />
              FINAL CONFIRMATION
            </div>

            <h1>
              Ready to
              <span>
                {" "}
                enter the Sphere?
              </span>
            </h1>

            <p>
              Check everything once more before
              activating your membership.
            </p>

            <div className="ss-review-card">

              <div className="ss-review-plan">

                <div
                  className={`ss-review-icon ${selectedPlan.accent}`}
                >
                  SS
                </div>

                <div>

                  <small>
                    STREAMSPHERE MEMBERSHIP
                  </small>

                  <h2>
                    {selectedPlan.name}
                  </h2>

                </div>

                <strong>
                  ${getPrice(selectedPlan)}

                  <small>
                    /month
                  </small>
                </strong>

              </div>

              <div className="ss-review-divider" />

              <div className="ss-review-grid">

                <div>
                  <span>
                    PAYMENT METHOD
                  </span>

                  <strong>
                    {
                      paymentMethods.find(
                        (item) =>
                          item.id ===
                          paymentMethod
                      )?.title
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    BILLING
                  </span>

                  <strong>
                    {billing === "monthly"
                      ? "MONTHLY"
                      : "ANNUAL"}
                  </strong>
                </div>

                <div>
                  <span>
                    RENEWAL
                  </span>

                  <strong>
                    AUTOMATIC
                  </strong>
                </div>

              </div>

              <div className="ss-review-actions">

                <button
                  type="button"
                  className="ss-secondary-action"
                  onClick={() =>
                    setStage("payment")
                  }
                >
                  ← EDIT PAYMENT
                </button>

                <button
                  type="button"
                  className="ss-confirm-action"
                  disabled={processing}
                  onClick={confirmSubscription}
                >
                  {processing
                    ? "ACTIVATING..."
                    : "CONFIRM & ACTIVATE →"}
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {stage === "success" && selectedPlan && (
          <section className="ss-success-page">

            <div className="ss-success-check">
              ✓
            </div>

            <div className="hero-badge">
              <span className="badge-dot" />
              SUBSCRIPTION GRANTED
            </div>

            <h1>
              You're officially
              <span>
                {" "}
                inside the Sphere.
              </span>
            </h1>

            <p>
              Your StreamSphere{" "}
              <strong>
                {selectedPlan.name}
              </strong>{" "}
              membership is now active.
            </p>

            <div className="ss-membership-card">

              <div className="ss-membership-top">

                <span>
                  STREAMSPHERE
                </span>

                <span className="active">
                  ACTIVE
                </span>

              </div>

              <div className="ss-membership-chip">
                SS
              </div>

              <div className="ss-membership-name">

                <small>
                  CREATOR MEMBERSHIP
                </small>

                <h2>
                  {selectedPlan.name}
                </h2>

                <strong>
                  ${getPrice(selectedPlan)}

                  <span>
                    /month
                  </span>
                </strong>

              </div>

              <div className="ss-membership-line" />

              <div className="ss-membership-meta">

                <div>
                  <small>
                    STATUS
                  </small>

                  <strong>
                    ACTIVE
                  </strong>
                </div>

                <div>
                  <small>
                    BILLING
                  </small>

                  <strong>
                    {billing === "monthly"
                      ? "MONTHLY"
                      : "ANNUAL"}
                  </strong>
                </div>

                <div>
                  <small>
                    ACCESS
                  </small>

                  <strong>
                    PREMIUM
                  </strong>
                </div>

              </div>

            </div>

            <button
              type="button"
              className="ss-success-button"
              onClick={resetSubscription}
            >
              BACK TO MEMBERSHIPS
              <span>→</span>
            </button>

          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Subscription;