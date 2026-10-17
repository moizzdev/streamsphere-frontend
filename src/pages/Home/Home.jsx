import React from 'react'
import CanvasSequence from '../../components/componentsForUI/CanvasSequence_Background'; // Updated component
import Navbar from '../../components/componentsForUI/Navbar';
import DomeGallery from '../../components/componentsForUI/DomeGallery';
import MagicBento from '../../components/componentsForUI/MagicBento';
import StaggeredMenu from '../../components/componentsForUI/StaggeredMenu';
import DotField from '../../components/componentsForUI/DotField'
import {
  MessageCircle,
  ShoppingBag,
  Crown,
  BarChart3,
  CalendarClock,
  Users,
  Check,
} from 'lucide-react';
import './Home.css';
import { Link, Links } from 'react-router';
import HeroSection from '../../components/heroSection/HeroSection';
import FlowingMenu from '../../components/componentsForUI/FlowingMenu'
import SpecularButton from '../../components/componentsForUI/SpecularButton'
import ScrollVelocity from '../../components/componentsForUI/ScrollVelocity';
import Footer from '../Footer';
import ScrollExpand from '../../components/componentsForUI/ScrollExpand';
import PixelSwap from '../../components/componentsForUI/PixelSwap';
import dragon from '../../images/dragon.jpg'
import LogoLoop from '../../components/componentsForUI/LogoLoop';


const STATS = [
  { value: '120K+', label: 'Active Streamers' },
  { value: '4.8M', label: 'Community Members' },
  { value: '9.2K', label: 'Orders Shipped / Day' },
  { value: '99.98%', label: 'Chat Uptime' },
];

const MARQUEE = [
  'NovaPlays', 'Kestrel Live', 'Midnight Circuit', 'Frame By Frame', 'Voltage Studios',
  'Echo Raiders', 'Glasswing', 'Static Habit', 'Northline', 'Afterglow Gaming',
];

const CREATOR_TOOLS = [
  'Full merch storefront with checkout, inventory, and fulfillment built in',
  'Live revenue, retention, and sentiment analytics updated in real time',
  'Drag-and-drop schedule manager with automatic viewer reminders',
  'Tiered subscriptions with automated, same-week payouts',
];

const FAN_PERKS = [
  'Sub-second live chat with custom emotes and reaction storms',
  'Early access and member-only pricing on every merch drop',
  'Badges, roles, and perks that level up the longer you stay',
  'Raid trains and watch parties across your favorite streamers',
];

const FEATURES = [
  {
    icon: MessageCircle,
    tag: '< 50ms Latency',
    title: 'Real-Time Chat',
    desc: 'Messaging engineered for live streams custom emotes, moderation queues, and slow-mode that never feels slow.',
  },
  {
    icon: ShoppingBag,
    tag: 'Zero Setup Fees',
    title: 'Merch & Commerce',
    desc: 'A full storefront under every channel. Launch a drop, take payment, and route fulfillment without a third-party tool.',
  },
  {
    icon: Crown,
    tag: 'Automated Payouts',
    title: 'Memberships & Subs',
    desc: 'Build tiered memberships with custom perks. Payouts land in creator accounts automatically, every week.',
  },
  {
    icon: BarChart3,
    tag: 'Updated Live',
    title: 'Analytics Dashboard',
    desc: 'Revenue, subscriber churn, and chat sentiment in one glanceable view know what worked before the VOD even renders.',
  },
  {
    icon: CalendarClock,
    tag: 'Auto-Reminders',
    title: 'Schedule Manager',
    desc: 'Plan streams, drops, and community events on a shared calendar that notifies your audience the moment it changes.',
  },
  {
    icon: Users,
    tag: 'Cross-Channel',
    title: 'Streamer Community',
    desc: 'Raids, collabs, and cross-promotion tools built to connect creators instead of leaving every channel to grow alone.',
  },
];

const SPOTLIGHTS = [
  {
    quote: 'Moved my merch drops onto StreamSphere and sold out a run in eleven minutes the checkout is baked right into the stream.',
    name: 'Nova Reyes',
    role: 'Variety Streamer, 82K followers',
    initials: 'NR',
  },
  {
    quote: 'The dashboard is the first analytics view that’s actually made me change what I stream, not just admire the chart.',
    name: 'Kestrel Ito',
    role: 'IRL & Music Creator, 41K followers',
    initials: 'KI',
  },
  {
    quote: 'Membership payouts hit my account every week without me touching a spreadsheet. That alone was worth the migration.',
    name: 'Marcus Webb',
    role: 'Competitive Gaming, 156K followers',
    initials: 'MW',
  },
];

const PRICING = [
  {
    name: 'Viewer',
    desc: 'Everything you need to watch and chat',
    price: '0',
    period: 'forever',
    features: [
      'Full access to live chat',
      'Follow unlimited streamers',
      'Standard emote set',
      'Browse the merch marketplace',
    ],
    cta: 'Join Free',
    featured: false,
  },
  {
    name: 'Supporter',
    desc: 'For the community regulars',
    price: '4.99',
    period: 'per month',
    features: [
      'Everything in Viewer',
      'Member badge & custom color',
      'Early access to merch drops',
      'Ad-free viewing across StreamSphere',
      'Priority chat during raids',
    ],
    cta: 'Become a Supporter',
    featured: true,
  },
  {
    name: 'VIP',
    desc: 'Front row, every stream',
    price: '14.99',
    period: 'per month',
    features: [
      'Everything in Supporter',
      'VIP-only chat lane & emotes',
      'Members-only pricing on all merch',
      'Direct access to creator schedules',
      'Vote on upcoming community events',
    ],
    cta: 'Go VIP',
    featured: false,
  },
];

const demoItems = [
  { link: '#', text: 'DIGITAL MARKETPLACE', image: 'https://i.insider.com/5ffc9801d184b30018aae1ac?width=700' },
  { link: '#', text: 'GAMING HUBS', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7nEne_9MeumFFurw6oOqpFrpMWplZkImOLMiIB-q6Wuk1BdvnKovMR1sl&s=10' },
  { link: '#', text: 'MERCH STORE', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvQApVuh91G3ZIsYXdN-dFu2YYJVrzBDX-_3r7veKddKTz3hUelIaS5bQ&s=10' },
  { link: '#', text: 'AI STUDIO', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz_Kti2Kfw_dsTxyzxEuKZK45gaVgIx84LNW8NREhT6omGygi2sCVKb02d&s=10' }
];

export default function Home() {

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'AI-.gen', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Store', ariaLabel: 'our Store', link: '/about' },
    { label: 'Community', ariaLabel: 'View our services', },
    { label: 'chat', ariaLabel: 'communicate',Link : "chat"  },
    { label: 'Profile', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const socialItems = [
    { label: 'Twitter', link: 'https://twitter.com' },
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' }
  ];

  return (
    <>
      <div className="ss-page">

        <div className="ss-noise" />

        <div className="ss-bg-fixed">
          {/* <CanvasSequence /> */}
          <DotField
            dotRadius={1.5}
            dotSpacing={10}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#8B5CF6"
            gradientTo="#C9B8FF"
            glowColor="#120F17"
          />
        </div>

        <div className="ss-content">

          <div className="ss-menu-shell">
            <HeroSection></HeroSection>
          </div>

          {/* ============ ABOUT / HERO ============ */}
          <section id="about" className="ss-section">
            <div className="ss-glow-orb" />
            <div className="ss-hero-grid">

              <div className="ss-hero-copy">


                <h1 className="ss-heading-xl">
                  One Sphere.<br />
                  Every <span className="ss-gradient-text">Stream, Sub &amp; Sale.</span>
                </h1>

                <p className="ss-lede">
                  StreamSphere is the operating system for modern creators chat, commerce,
                  memberships, analytics, and scheduling, fused into one glass-smooth platform
                  built to feel expensive.
                </p>

                <div className="ss-stats-grid">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="ss-stat-card ss-glass">
                      <div className="ss-stat-value">{stat.value}</div>
                      <div className="ss-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ss-preview-card ss-glass">
                <div className="ss-preview-screen">
                  <span className="ss-preview-live">
                  </span>
                  <span className="ss-preview-viewers">12.4K watching</span>
                  <div className="ss-preview-drop">
                    <span className="ss-preview-drop-swatch" />
                    <span className="ss-preview-drop-text">
                      <strong>Drop live: Void Hoodie</strong>
                      <span>214 sold in the last hour</span>
                    </span>
                  </div>
                </div>
                <div className="ss-preview-chat">
                  <div className="ss-preview-msg">
                    <span className="ss-preview-avatar" />
                    <span><strong>kestrel_io</strong>the merch fit is insane</span>
                  </div>
                  <div className="ss-preview-msg">
                    <span className="ss-preview-avatar" />
                    <span><strong>novaplays</strong>just subbed, let's gooo</span>
                  </div>
                  <div className="ss-preview-msg">
                    <span className="ss-preview-avatar" />
                    <span><strong>echo_raider</strong>picking up the hoodie rn</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ============ MARQUEE ============ */}
          <div className="ss-marquee-wrap">
            <div className="ss-marquee-track">
              {[...MARQUEE, ...MARQUEE].map((name, i) => (
                <span className="ss-marquee-item" key={`${name}-${i}`}>
                  <b>{name}</b> &nbsp;·&nbsp; Live on StreamSphere
                </span>
              ))}
            </div>
          </div>

          {/* ============ CREATORS / FANS SPLIT ============ */}
          <section id="platform" className="ss-section">
            <div className="ss-section-veil ss-section-veil--a" />
            <div className="ss-hairline" />
            <div className="ss-split-wrap">
              <div className="ss-section-head">
                <span className="ss-eyebrow">Two Sides, One Sphere</span>
                <h2 className="ss-heading-lg">Built To Run Both Ends Of The Stream</h2>
                <p className="ss-lede ss-lede--center">
                  Every tool a creator needs to run a channel like a business, and every perk a fan
                  needs to feel like part of one.
                </p>
              </div>

              <div className="ss-split-grid">
                <div className="ss-split-card ss-split-card--creator ss-glass">
                  <span className="ss-split-tag ss-split-tag--creator">For Creators</span>
                  <h3 className="ss-split-title">Run your channel like a studio</h3>
                  <p className="ss-split-desc">
                    From first sub to sold-out drop, every commerce and community tool lives under
                    one dashboard no plugins, no third-party checkout, no spreadsheets.
                  </p>
                  <ul className="ss-split-list">
                    {CREATOR_TOOLS.map((item) => (
                      <li key={item}>
                        <span className="ss-split-check"><Check size={13} strokeWidth={3} /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ss-split-card ss-split-card--fan ss-glass">
                  <span className="ss-split-tag ss-split-tag--fan">For Fans</span>
                  <h3 className="ss-split-title">Feel like more than a viewer</h3>
                  <p className="ss-split-desc">
                    Membership on StreamSphere isn’t a badge in a sidebar it’s early drops,
                    faster chat, and a seat at the table for the community you show up for.
                  </p>
                  <ul className="ss-split-list">
                    {FAN_PERKS.map((item) => (
                      <li key={item}>
                        <span className="ss-split-check"><Check size={13} strokeWidth={3} /></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ============ PLATFORM FEATURES ============ */}
          <section id="features" className="ss-section">
            <div className="ss-section-veil ss-section-veil--b" />
            <div className="ss-features-wrap">
              <div className="ss-section-head">
                <span className="ss-eyebrow">Under The Hood</span>
                <h2 className="ss-heading-lg">Every System, Already Connected</h2>
                <p className="ss-lede ss-lede--center">
                  No integrations to wire up. Chat, commerce, memberships, and scheduling already
                  speak to each other on day one.
                </p>
              </div>

              <div className="ss-features-grid">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className="ss-feature-card ss-glass"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="ss-feature-top">
                      <div className="ss-feature-icon">
                        <f.icon size={22} strokeWidth={2} />
                      </div>
                      <span className="ss-feature-index">0{i + 1}</span>
                    </div>
                    <h3 className="ss-feature-title">{f.title}</h3>
                    <p className="ss-feature-desc">{f.desc}</p>
                    <span className="ss-feature-tag">{f.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

            <ScrollVelocity
              texts={['Stream.Sphere', 'Depicts-Future']} 
              velocity={100}
              className="custom-scroll-text"
              numCopies={6}
              damping={50}
              stiffness={400}
            />

          {/* ============ CREATOR SPOTLIGHT ============ */}
          <section id="spotlight" className="ss-section">
            <div className="ss-section-veil ss-section-veil--a" />
            <div className="ss-spotlight-wrap">
              <div className="ss-section-head">
                <span className="ss-eyebrow">Creator Spotlight</span>
                <h2 className="ss-heading-lg">Streamers Who Made The Switch</h2>
              </div>

              <div className="ss-spotlight-grid">
                {SPOTLIGHTS.map((s) => (
                  <div key={s.name} className="ss-spotlight-card ss-glass">
                    <p className="ss-spotlight-quote">“{s.quote}”</p>
                    <div className="ss-spotlight-person">
                      <span className="ss-spotlight-avatar">{s.initials}</span>
                      <div>
                        <div className="ss-spotlight-name">{s.name}</div>
                        <div className="ss-spotlight-role">{s.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ============ MEMBERSHIP / PRICING ============ */}
          <section id="membership" className="ss-section">
            <div className="ss-section-veil ss-section-veil--b" />
            <div className="ss-pricing-wrap">
              <div className="ss-section-head">
                <span className="ss-eyebrow">Membership</span>
                <h2 className="ss-heading-lg">Pick Your Seat In The Community</h2>
                <p className="ss-lede ss-lede--center">
                  Free to watch. Worth paying for once you see what supporters get.
                </p>
              </div>

              <div className="ss-pricing-grid">
                {PRICING.map((tier) => (
                  <div
                    key={tier.name}
                    className={`ss-price-card ss-glass ${tier.featured ? 'ss-price-card--featured' : ''}`}
                  >
                    {tier.featured && <span className="ss-price-popular">Most Popular</span>}
                    <h3 className="ss-price-name">{tier.name}</h3>
                    <p className="ss-price-desc">{tier.desc}</p>
                    <div className="ss-price-amount">
                      <span className="ss-price-number">${tier.price}</span>
                      <span className="ss-price-period">/ {tier.period}</span>
                    </div>
                    <ul className="ss-price-list">
                      {tier.features.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <SpecularButton
                        size="lg"
                        radius={18}
                        tint="#ffffff"
                        tintOpacity={0}
                        blur={0}
                        textColor="#f5f5f5"
                        lineColor="#ffffff"
                        baseColor="#525252"
                        intensity={1}
                        shineSize={10}
                        shineFade={40}
                        thickness={1}
                        speed={0.35}
                        followMouse
                        proximity={250}
                        autoAnimate={false}
                        onClick={() => console.log('clicked')}
                      >
                        <Link to="/subscription">
                         Get Started
                        </Link>
                      </SpecularButton>
                  </div>
                ))}
              </div>
            </div>
          </section> 

          {/* ============ ANALYTICS DASHBOARD ============ */}
          <section id="dashboard" className="ss-section ss-section--dashboard">
            <div className="ss-section-veil ss-section-veil--a" />
            <div className="ss-dashboard-intro">
              <span className="ss-eyebrow">Insights</span>
              <h2 className="ss-heading-lg">Your Growth, Visualized</h2>
              <p className="ss-lede ss-lede--center">
                Revenue, subscribers, chat activity, and merch performance — all in one glowing
                dashboard, updated in real time.
              </p>
            </div>

            <MagicBento
              textAutoHide={true}
              enableStars
              enableSpotlight
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect
              spotlightRadius={400}
              particleCount={12}
              glowColor="139, 92, 246"
              disableAnimations={false}
            />
            
          </section>

          <div style={{ height: '600px', position: 'relative' }}>
            <FlowingMenu items={demoItems}
            speed={15}
            textColor="#ffffff"
            bgColor="#120F17"
            marqueeBgColor="#ffffff"
            marqueeTextColor="#120F17"
            borderColor="#ffffff"
          />
          </div>
          


            {/* <ScrollExpand
              src={dragon}
              alt="Product hero"
              title="Built to scale"
              scrollHint="Scroll inside the frame"
              useWindowScroll
            >
              <h2>Every pixel, everywhere</h2>
              <p>The frame opens up as you scroll and hands the whole stage to your media.</p>
            </ScrollExpand> */}
            



          {/* ============ CONTACT ============ */}
          <section id="contact" className="ss-section ss-section--contact">
            <div className="ss-section-veil ss-section-veil--c" />
            <div className="ss-contact-inner">
              <DomeGallery
                fit={0.8}
                minRadius={600}
                maxVerticalRotationDeg={0}
                segments={34}
                dragDampening={2}
                grayscale={false}
              />
            </div>
          </section>

          {/* ============ FOOTER ============ */}
          <Footer/>

        </div>
      </div>
    </>
  )
}