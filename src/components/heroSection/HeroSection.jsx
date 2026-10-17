import React from "react";
import logo from "../../images/logo.png";
import CircularText from "../componentsForUI/CircularText";
import BlurText from "../componentsForUI/BlurText";
import FloatingLines from "../componentsForUI/FloatingLines";
import { Link } from "react-router";
import Navbar from "../../pages/Navbar";

export default function HeroSection() {
  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden bg-slate-950 font-sans selection:bg-white selection:text-black">
      {/* 
        CLEAN BACKGROUND:
        - FloatingLines with a subtle, elegant gradient
      */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[6, 6, 6]}
          lineDistance={[12, 12, 12]}
          interactive
          parallax={true}
          animationSpeed={0.8}
          linesGradient={["#6366f1", "#a855f7", "#ec4899"]}
        />
      </div>

      {/* SOFT OVERLAY */}
      <div className="absolute inset-0 z-5 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80" />

      {/* MINIMALIST NAVBAR */}

      <Navbar></Navbar>

      {/* HERO CONTENT - SCALED DOWN FOR BALANCE */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 -mt-10">
        {/* Advanced Modern Cyberic Heading - Scaled Down */}
        <div className="flex flex-col items-center gap-1">
            <span className="text-indigo-400 text-[9px] uppercase tracking-[0.6em] font-black mb-1 animate-pulse">
                Evolution of Streaming
            </span>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] italic">
                <BlurText
                    text="STREAM"
                    delay={100}
                    animateBy="letters"
                    direction="top"
                    className="block"
                />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                    SPHERE
                </span>
            </h1>
        </div>

        {/* Clean Subtitle - Scaled Down */}
        <p className="mt-8 text-sm sm:text-base text-white/60 max-w-xl font-light tracking-wide leading-relaxed">
          The next generation of digital broadcasting. Experience ultra-low latency, 
          unmatched clarity, and a decentralized ecosystem built for creators.
        </p>

        {/* MODERN CYBERIC BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-2">
          {/* Primary Button: Clipped with Glow */}
          <button className="relative group px-10 py-4 overflow-hidden">
            <div className="absolute inset-0 bg-white transition-all duration-500 group-hover:bg-indigo-500 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                 style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }} />
            <span className="relative z-10 text-black group-hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors duration-500">
              Get Started
            </span>
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          {/* Secondary Button: Hollow with Clipped Border */}
          <button className="relative group px-10 py-4 overflow-hidden">
            <Link to="/login">
            <div className="absolute inset-0 border border-white/20 transition-all duration-500 group-hover:border-white group-hover:bg-white/5" 
                 style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }} />
            <span className="relative z-10 text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors duration-500">
                Join
            </span>
            {/* Decorative Dots */}
            <div className="absolute bottom-1 right-3 w-1 h-1 bg-white/20 rounded-full" />
              </Link>       
          </button>
        </div>
      </div>

      {/* BOTTOM RIGHT CIRCULAR TEXT - CLEAN & MINIMAL */}
      <div className="absolute bottom-3 right-3 z-20 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10">
        <div
          className="
            relative
            h-28 w-28
            flex items-center justify-center
            overflow-visible
      
            scale-[0.6]
            sm:scale-[0.75]
            md:scale-90
            lg:scale-100
      
            origin-bottom-right
          "
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/10" />
      
          <CircularText
            text="NEXT*GEN*STREAMING*NOW*"
            onHover="speedUp"
            spinDuration={25}
            className="text-white/40 font-bold text-[8px] tracking-[0.15em]"
          />
      
          {/* Center dot */}
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
