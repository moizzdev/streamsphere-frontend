import { useEffect, useRef, useState } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./AboutPage.css";

const TIMELINE = [
  { year: "2019", label: "The Spark", body: "Three burnt-out streamers on a Discord call. One question changed everything: why do we need eleven apps to run one stream?" },
  { year: "2020", label: "Basement Build", body: "Two laptops, one borrowed server, four launch-night crashes — and 200 beta users who stayed up with us anyway." },
  { year: "2021", label: "10K Creators", body: "No ads. No paid marketing. Just streamers telling other streamers they had finally found a platform that understood them." },
  { year: "2022", label: "$4.2M Series A", body: "Overlay Studio and Alert Builder launched, giving creators professional-grade tools for every stream." },
  { year: "2023", label: "Going Global", body: "Fourteen languages, Asia-Pacific infrastructure, and the first Creator Fund — with $800K paid directly to creators." },
  { year: "2024", label: "Platform 2.0", body: "A ground-up rebuild introduced real-time collaboration, AI clip editing, and a more connected community experience." },
  { year: "2025", label: "The Next Chapter", body: "24,800 creators and 98M monthly views. We're still building, still listening, and still creator-first." },
];

const TEAM = [
  { name: "Kai Nakamura", role: "CEO & Co-Founder", initials: "KN", color: "violet", bio: "A creator for six years and former Twitch engineer. Kai set out to build the platform he always wished existed." },
  { name: "Priya Mehta", role: "CTO & Co-Founder", initials: "PM", color: "mint", bio: "Former Google infrastructure engineer focused on dependable systems, low latency, and scale without compromise." },
  { name: "Leo Varga", role: "CPO & Co-Founder", initials: "LV", color: "rose", bio: "A decade building creator products, with one rule: the best product decisions begin by listening." },
  { name: "Zara Osei", role: "Head of Community", initials: "ZO", color: "amber", bio: "Built esports communities from the ground up and makes sure StreamSphere feels like a place, not just a product." },
  { name: "Riku Tanaka", role: "Lead Designer", initials: "RT", color: "blue", bio: "A motion-obsessed designer who sweats every interaction and believes useful interfaces can still feel extraordinary." },
  { name: "Amara Wells", role: "Head of Partnerships", initials: "AW", color: "pink", bio: "Builds creator partnerships and runs the programs that help the StreamSphere ecosystem grow." },
];

const VALUES = [
  { number: "01", title: "Creators come first", body: "Every decision starts with one question: will this make a creator's work better? If not, we rethink it." },
  { number: "02", title: "Respect people's time", body: "No manipulative loops, fake urgency, or engagement traps. We want to earn your attention, never take it." },
  { number: "03", title: "Open by default", body: "A public roadmap, honest incident updates, and clear communication. Trust grows when people know what is happening." },
  { number: "04", title: "Quality over noise", body: "We test with real creators, sweat the details, and ship when the experience is ready — not just when a date arrives." },
  { number: "05", title: "Build together", body: "The community helps shape what comes next. Feedback is not a box to tick; it is part of how we build." },
  { number: "06", title: "Play the long game", body: "We're building tools creators can rely on for years, not chasing the next short-lived trend." },
];

const STATS = [
  { value: "24.8K", label: "Active creators", detail: "across 40 countries" },
  { value: "98M", label: "Monthly views", detail: "powered by creator tools" },
  { value: "$1.2M", label: "Creator payouts", detail: "distributed in 2024" },
  { value: "99.97%", label: "Platform uptime", detail: "12-month rolling average" },
  { value: "<80ms", label: "Global latency", detail: "p95 across regions" },
  { value: "14", label: "Languages", detail: "localised experiences" },
];

const TECH = [
  { category: "Experience", items: ["React", "Next.js", "TypeScript", "Framer Motion"] },
  { category: "Platform", items: ["Node.js", "Go", "Rust", "GraphQL"] },
  { category: "Infrastructure", items: ["AWS", "Cloudflare", "Kubernetes", "Redis"] },
  { category: "Live media", items: ["FFmpeg", "WebRTC", "HLS", "DASH"] },
];

const PRESS = [
  { publication: "TechCrunch", quote: "The platform that wants creators to spend less time managing tools — and more time creating." },
  { publication: "The Verge", quote: "A creator-first approach to the infrastructure behind modern live entertainment." },
  { publication: "WIRED", quote: "Building a connected toolkit for the next generation of digital communities." },
];

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(node);
      }
    }, { threshold: 0.12 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`about-reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}s` }}
    >
      {children}
    </div>
  );
}

function Counter({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let observer;
    let frame;

    const rawNumber = Number(value.replace(/[^0-9.]/g, ""));

    if (!Number.isFinite(rawNumber)) {
      setDisplay(value);
      return;
    }

    const startCount = () => {
      const start = performance.now();
      const duration = 1000;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = rawNumber * eased;

        const formatted = value.includes(".")
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString();

        setDisplay(value.replace(/[\d,.]+/, formatted));

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setDisplay(value);
        }
      };

      frame = requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      startCount();
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          startCount();
          observer.disconnect();
        }
      }, { threshold: 0.5 });

      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

function SectionHeading({ eyebrow, title, description, light = false }) {
  return (
    <Reveal className={`about-section-heading ${light ? "heading-light" : ""}`}>
      <div className="about-eyebrow"><span />{eyebrow}</div>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Reveal>
  );
}

function SignalMark() {
  return (
    <span className="about-signal" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((bar) => (
        <i key={bar} style={{ "--bar": bar }} />
      ))}
    </span>
  );
}

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="ss-about">
      <div className="about-grain" aria-hidden="true" />
      <Navbar />

      <section className={`about-hero ${mounted ? "hero-ready" : ""}`}>
        <div className="about-hero-grid" aria-hidden="true" />
        <div className="about-orb about-orb-one" aria-hidden="true" />
        <div className="about-orb about-orb-two" aria-hidden="true" />

        <div className="about-container about-hero-layout">
          <div className="about-hero-copy">
            <div className="about-eyebrow">
              <span />THE STORY BEHIND THE SPHERE
            </div>

            <h1>
              The future of streaming
              <span>is built <em>together.</em></span>
            </h1>

            <p className="about-hero-description">
              We bring the tools, people, and possibilities of the creator
              world into one connected place — so you can spend less time
              managing your stream and more time making something worth
              watching.
            </p>

            <div className="about-hero-actions">
              <a className="about-button about-button-primary" href="#our-story">
                Explore our story <span>↘</span>
              </a>
              <a className="about-button about-button-secondary" href="#our-team">
                Meet the people <span>↗</span>
              </a>
            </div>

            <div className="about-live-note">
              <span className="about-live-dot" />
              <span className="about-mono">BUILT WITH CREATORS</span>
              <span className="about-note-divider" />
              <span>Designed for what comes next.</span>
            </div>
          </div>

          <div
            className="about-hero-art"
            aria-label="StreamSphere creator ecosystem illustration"
          >
            <div className="about-art-topline">
              <span className="about-mono">SS / CREATOR NETWORK</span>
              <span className="about-art-status"><i /> SYSTEM ONLINE</span>
            </div>

            <div className="about-art-orbit orbit-outer" />
            <div className="about-art-orbit orbit-inner" />
            <div className="about-art-cross cross-horizontal" />
            <div className="about-art-cross cross-vertical" />

            <div className="about-art-core">
              <div className="about-core-symbol"><SignalMark /></div>
              <strong>Stream<span>Sphere</span></strong>
              <small>ONE CREATOR ECOSYSTEM</small>
            </div>

            <div className="about-node node-top">
              <b>01</b><span>CREATE</span><i>✳</i>
            </div>
            <div className="about-node node-right">
              <b>02</b><span>CONNECT</span><i>⌘</i>
            </div>
            <div className="about-node node-bottom">
              <b>03</b><span>GROW</span><i>↗</i>
            </div>
            <div className="about-node node-left">
              <b>04</b><span>THRIVE</span><i>◇</i>
            </div>

            <div className="about-art-footer">
              <span>CONNECTED BY DESIGN</span>
              <span>EST. 2019</span>
            </div>
          </div>
        </div>

        <div className="about-hero-bottom about-container">
          <span className="about-mono">
            INDEPENDENT BY SPIRIT. CONNECTED BY DESIGN.
          </span>
          <a href="#our-mission">
            SCROLL TO DISCOVER <span>↓</span>
          </a>
        </div>
      </section>

      <section className="about-mission" id="our-mission">
        <div className="about-container about-mission-layout">
          <Reveal>
            <div className="about-eyebrow"><span />OUR MISSION</div>
            <div className="about-mission-index about-mono">
              01 / WHY WE EXIST
            </div>
          </Reveal>

          <Reveal delay={0.1} className="about-mission-main">
            <h2>
              Creators deserve tools that are as ambitious as <em>they are.</em>
            </h2>
            <p>
              Streaming is more than going live. It's a craft, a community,
              a business, and a thousand little moments that happen behind
              the scenes. We make those pieces work better together.
            </p>
            <div className="about-signature">
              <span className="about-avatar avatar-violet">KN</span>
              <span>
                <b>Kai Nakamura</b>
                <small>Co-Founder & CEO</small>
              </span>
            </div>
          </Reveal>

          <div className="about-mission-stamp" aria-hidden="true">
            <span>CREATOR</span><b>+</b><span>FIRST</span>
          </div>
        </div>
      </section>

      <section className="about-section" id="our-impact">
        <div className="about-container">
          <SectionHeading
            eyebrow="THE IMPACT"
            title={<>A little idea. <em>A growing movement.</em></>}
            description="The numbers matter because they represent real people building real communities."
          />

          <div className="about-stats-grid">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 0.055}>
                <article className="about-stat-card">
                  <div className="about-stat-top">
                    <span>0{index + 1}</span><i>↗</i>
                  </div>
                  <strong><Counter value={stat.value} /></strong>
                  <h3>{stat.label}</h3>
                  <p>{stat.detail}</p>
                  <div className="about-stat-line" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-story-section" id="our-story">
        <div className="about-container">
          <div className="about-story-intro">
            <SectionHeading
              eyebrow="THE JOURNEY"
              title={<>Built one <em>chapter</em> at a time.</>}
              description="We didn't start with a master plan. We started with a problem creators knew all too well — and kept showing up to solve it."
            />

            <div className="about-story-aside">
              <span className="about-mono">THE TIMELINE</span>
              <strong>2019 <i>—</i> NOW</strong>
              <p>Small beginnings. Bigger possibilities.</p>
            </div>
          </div>

          <div className="about-timeline">
            <div className="about-timeline-track" />

            {TIMELINE.map((item, index) => (
              <Reveal
                key={item.year}
                delay={index * 0.04}
                className={`about-timeline-item ${
                  index % 2 ? "timeline-right" : "timeline-left"
                }`}
              >
                <div className="about-timeline-marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <article className="about-timeline-card">
                  <div className="about-timeline-meta">
                    <span>{item.year}</span>
                    <i>
                      {index === TIMELINE.length - 1
                        ? "CURRENT CHAPTER"
                        : "MILESTONE"}
                    </i>
                  </div>
                  <h3>{item.label}</h3>
                  <p>{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="our-values">
        <div className="about-container">
          <SectionHeading
            eyebrow="WHAT GUIDES US"
            title={<>Principles over <em>promises.</em></>}
            description="These aren't words on a wall. They're the standards we use when making hard decisions."
          />

          <div className="about-values-grid">
            {VALUES.map((value, index) => (
              <Reveal key={value.number} delay={index * 0.045}>
                <article className="about-value-card">
                  <div className="about-value-number">
                    {value.number}<span> / 06</span>
                  </div>
                  <div className="about-value-icon">
                    {["✳", "◈", "↗", "⌁", "◎", "∞"][index]}
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.body}</p>
                  <span className="about-value-arrow">↗</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-team-section" id="our-team">
        <div className="about-container">
          <SectionHeading
            eyebrow="THE PEOPLE"
            title={<>Made by people who <em>get it.</em></>}
            description="A team of builders, designers, and community people who believe the creator economy deserves better tools."
          />

          <div className="about-team-grid">
            {TEAM.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.05}>
                <article className={`about-team-card team-${member.color}`}>
                  <div className="about-team-card-top">
                    <span className="about-mono">TEAM / 0{index + 1}</span>
                    <span className="about-team-arrow">↗</span>
                  </div>

                  <div className="about-team-avatar">
                    {member.initials}<span />
                  </div>

                  <h3>{member.name}</h3>
                  <div className="about-team-role">{member.role}</div>
                  <p>{member.bio}</p>

                  <div className="about-team-bottom">
                    <span>STREAMSPHERE</span><span>● ACTIVE</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="our-tech">
        <div className="about-container about-tech-layout">
          <div className="about-tech-copy">
            <div className="about-eyebrow"><span />UNDER THE HOOD</div>
            <h2>Human-first.<br /><em>Engineered to scale.</em></h2>
            <p>
              Great creator experiences need a foundation that feels invisible.
              We focus on speed, resilience, and dependable tools that stay out
              of the way when it matters most.
            </p>

            <div className="about-uptime-card">
              <div>
                <span className="about-mono">PLATFORM AVAILABILITY</span>
                <strong>99.97<span>%</span></strong>
              </div>

              <div className="about-uptime-visual">
                {Array.from({ length: 21 }, (_, index) => (
                  <div key={index} />
                ))}
              </div>

              <p><span /> Healthy systems. Constant monitoring.</p>
            </div>
          </div>

          <div className="about-tech-grid">
            {TECH.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.07}>
                <article className="about-tech-card">
                  <div className="about-tech-card-head">
                    <span>0{index + 1}</span>
                    <h3>{group.category}</h3>
                  </div>

                  {group.items.map((item) => (
                    <div className="about-tech-item" key={item}>
                      <span>{item}</span><i>↗</i>
                    </div>
                  ))}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section about-press-section">
        <div className="about-container">
          <SectionHeading
            eyebrow="OUT IN THE WORLD"
            title={<>A bigger conversation about <em>creating.</em></>}
          />

          <div className="about-press-grid">
            {PRESS.map((item, index) => (
              <Reveal key={item.publication} delay={index * 0.07}>
                <article className="about-press-card">
                  <div className="about-press-mark">“</div>
                  <p>{item.quote}</p>
                  <div className="about-press-footer">
                    <strong>{item.publication}</strong>
                    <span>EDITORIAL NOTE / 0{index + 1}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="about-press-disclaimer">
            Press quotes are illustrative placeholder copy. Replace with
            verified coverage before publishing.
          </p>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="about-cta-grid" aria-hidden="true" />

        <div className="about-container about-cta-content">
          <div className="about-eyebrow">
            <span />THE NEXT CHAPTER STARTS HERE
          </div>

          <h2>Your community.<br /><em>Your stage.</em></h2>

          <p>
            Bring your ideas, your people, and your next big thing. We'll help
            you build what comes next.
          </p>

          <div className="about-hero-actions">
            <a href="/community" className="about-button about-button-primary">
              Explore the community <span>↗</span>
            </a>
            <a href="#our-story" className="about-button about-button-secondary">
              Back to the beginning <span>↑</span>
            </a>
          </div>

          <div className="about-cta-foot">
            <span className="about-mono">STREAMSPHERE / ABOUT</span>
            <span className="about-mono">MADE FOR THE ONES WHO GO LIVE.</span>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}