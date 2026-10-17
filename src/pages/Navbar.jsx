import React, { useState } from 'react'
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/authentication/authenticationSlice'
import { ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { getMyCart } from "../features/productSlice/cartSlice";
import { getUnreadCounts } from "../features/chatSlice/chatSlice";

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)

  const { user } = useSelector((state) => state.authentication.authentication)
  const unreadCounts = useSelector((state) => state.chats.chats.unreadCounts)
  const unreadTotal = Object.values(unreadCounts || {}).reduce((a, b) => a + Number(b || 0), 0)
  const isLoggedIn = Boolean(user)

  const PUBLIC_LINKS = [
    { label: 'Home', path: '/' },
    { label: 'Merchandise', path: '/products' },
    { label: 'Community', path: '/community' },
    { label: 'about', path: '/about' },
    { label: 'Subscription', path: '/subscription' },
  ]

  const AUTH_ONLY_LINKS = [
    { label: 'Profile', path: '/profile' },
  ]

  const navLinks = isLoggedIn ? [...PUBLIC_LINKS, ...AUTH_ONLY_LINKS] : PUBLIC_LINKS

  const goTo = (path) => {
    navigate(path)
    setMenuOpen(false) // close the sidebar after picking a link
  }

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
    navigate('/login')
  }

  const { list: cartItems } = useSelector((state) => state.cart.cart);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getMyCart())
      dispatch(getUnreadCounts())
    }
  }, [isLoggedIn, dispatch])

  return (
    <>
      <nav className="relative z-40 w-full flex items-center justify-between px-5 py-0 sm:px-8 lg:px-12">
        {/* LEFT: hamburger (mobile only) + logo — both always visible */}
        <div className="flex items-center gap-3">
          {/* Hamburger — only rendered below md, opens the sidebar */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 shrink-0"
          >
            <span className="block h-[2px] w-6 bg-white" />
            <span className="block h-[2px] w-6 bg-white" />
            <span className="block h-[2px] w-4 bg-white" />
          </button>

          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Logo" className="h-14 w-auto object-contain sm:h-20" />
            <div className="text-white font-black text-lg sm:text-xl tracking-tighter uppercase">
              Stream<span className="text-indigo-500">.</span>Sphere
            </div>
          </div>
        </div>

        {/* CENTER: nav links — desktop only, hidden on mobile (moved into sidebar) */}
        <div className="hidden md:flex items-center gap-6 text-white/50 uppercase tracking-[0.2em] text-[10px] font-bold">
          {navLinks.map((item) => (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              className="cursor-pointer hover:text-fuchsia-400 transition-colors"
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* RIGHT: auth area — same on mobile and desktop, never hidden */}
        <div className="flex items-center gap-3 sm:gap-6">
          {isLoggedIn ? (
            <>
              <span
                onClick={() => navigate('/profile')}
                className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-bold text-white/60 hover:text-white transition-colors cursor-pointer tracking-widest"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {user?.name || user?.username || 'Account'}
              </span>

             <button 
                className="text-[10px] uppercase font-bold text-white/60 hover:text-white transition duration-300 tracking-widest relative group"
              > 
                <span className="relative z-10">
                <Link to="/chat" className="relative text-white/60 hover:text-white transition-colors">
                 <svg
                   width="24"
                   height="24"
                   viewBox="0 0 24 24"
                   fill="none"
                   stroke="currentColor"
                   strokeWidth="2"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 >
                   <path d="M22 2L11 13" />
                   <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                 </svg>
               {unreadTotal > 0 && (
                 <span className="absolute -top-1.5 -right-1.5 bg-fuchsia-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                   {unreadTotal > 9 ? '9+' : unreadTotal}
                 </span>
               )}
               </Link>
                </span>
              </button>

              <Link to="/cart" className="relative text-white/60 hover:text-white transition-colors">
                <ShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-fuchsia-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <button 
                className="text-[10px] uppercase font-bold text-white/60 hover:text-blue-400 transition duration-300 tracking-widest relative group"
              > 
                <span className="relative z-10">
                <Link to="/settings" >
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="12" cy="12" r="3"></circle>
                 <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                 </svg>
                </Link>
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-[10px] uppercase font-bold text-white/60 hover:text-white transition duration-300 tracking-widest relative group"
              >
                <span className="relative z-10">Login</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </button>

              <button
                onClick={() => navigate('/register')}
                className="relative group px-4 py-2 sm:px-6 overflow-hidden"
              >
                <div
                  className="absolute inset-0 bg-white/5 border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-black"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
                />
                <span className="relative z-10 text-[10px] uppercase font-bold text-white group-hover:text-black transition-colors duration-300 tracking-widest">
                  Sign-up
                </span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────
          MOBILE SIDEBAR
          Backdrop + slide-in panel. Both are always mounted so
          the transform/opacity transitions can animate; visibility
          is controlled with opacity/pointer-events (backdrop) and
          translate-x (panel), not conditional rendering — that's
          what makes the open/close feel smooth instead of a snap.
          ───────────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Sliding panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] bg-neutral-950 border-r border-white/10 flex flex-col px-6 py-6 transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-1">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
            <div className="text-white font-black text-base tracking-tighter uppercase">
              Stream<span className="text-indigo-500">.</span>Sphere
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="text-white/60 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {navLinks.map((item) => (
            <span
              key={item.path}
              onClick={() => goTo(item.path)}
              className="cursor-pointer text-white/70 hover:text-fuchsia-400 transition-colors uppercase tracking-[0.2em] text-xs font-bold"
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* logged-in extras inside the sidebar too, so mobile has full parity with desktop */}
        {isLoggedIn && (
          <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
            <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-white/50 tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user?.name || user?.username || 'Account'}
            </span>
            <button
              onClick={handleLogout}
              className="text-left text-[10px] uppercase font-bold text-white/60 hover:text-red-400 transition-colors tracking-widest"
            >
              Log out
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

export default Navbar