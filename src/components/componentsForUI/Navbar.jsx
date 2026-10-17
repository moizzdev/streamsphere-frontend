import React, { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { href: '#home', label: 'Home' },
        { href: '#about', label: 'Products' },
        { href: '#services', label: 'Merchandise Store' },
        { href: '#portfolio', label: 'Chat' },
        { href: '#contact', label: 'About us' },
    ];

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <a href="#home" className="navbar-logo" onClick={closeMenu}>
                    <span className="logo-icon"></span>
                    <span className="logo-text">Stream-Sphere</span>
                </a>

                <ul className="navbar-menu">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={closeMenu}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="navbar-actions">
                    <button className="navbar-cta">Get Started</button>

                    <button
                        className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                </div>
            </div>

            <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
                <ul className="navbar-mobile-menu">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a href={link.href} onClick={closeMenu}>
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <button className="navbar-cta navbar-cta-mobile" onClick={closeMenu}>
                    Get Started
                </button>
            </div>
        </nav>
    );
}