import React from "react";
import { Link } from "react-router";
import logo from "../../images/logo.png";

/* ------------------------------------------------------------------
   NAVBAR — UNCHANGED. Do not modify this component in any way.
   Exact recreation of the provided marketing-site navbar (same
   classes, spacing, hover states, clip-path "Join" button).
   BACKEND HOOKS: wire onNavigate to your router, and the Login/Join
   buttons to your auth flow.
------------------------------------------------------------------- */
export default function Navbar({ onNavigate }) {
  return (
    <nav className="relative z-20 w-full flex items-center justify-between px-8 py-0 sm:px-12">
      {/* Logo Restored */}
      <div className="flex items-center gap-1">
        <img src={logo} alt="Logo" className="h-20 w-auto object-contain" />
        <div className="text-white font-black text-xl tracking-tighter uppercase">
          Stream<span className="text-indigo-500">.</span>Sphere
        </div>
      </div>

      {/* NAVIGATION ITEMS - Modern & Spaced */}
      <div className="hidden md:flex items-center gap-6 text-white/50 uppercase tracking-[0.2em] text-[10px] font-bold">
        <Link to="/" className="hover:text-fuchsia-400 transition-colors">HOME</Link>
        <Link to="products" className="hover:text-fuchsia-400 transition-colors">Merchandise</Link>
        <Link to="chat" className="hover:text-fuchsia-400 transition-colors">Chat</Link>
        <Link to="about" className="hover:text-fuchsia-400 transition-colors">about</Link>
        <Link to="profile" className="hover:text-fuchsia-400 transition-colors">profile</Link>
      </div>

      {/* Auth - Cyberic Buttons */}
      <div className="flex items-center gap-6">
        <button className="text-[10px] uppercase font-bold text-white/60 hover:text-white transition duration-300 tracking-widest relative group">
          <span className="relative z-10">Login</span>
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
        </button>

        <button className="relative group px-6 py-2 overflow-hidden">
          {/* Geometric Background */}
          <div
            className="absolute inset-0 bg-white/5 border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black"
            style={{ clipPath: "polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)" }}
          />
          <span className="relative z-10 text-[10px] uppercase font-bold text-white group-hover:text-black transition-colors duration-300 tracking-widest">
            Join
          </span>
        </button>
      </div>
    </nav>
  );
}
