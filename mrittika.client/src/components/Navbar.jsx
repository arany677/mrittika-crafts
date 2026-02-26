import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    // Logic for mobile menu toggle
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="navbar-wrapper">
            <div className="container navbar">
                {/* --- Left Side: Logo --- */}
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src="/logo.png" alt="Mrittika" />
                    </Link>
                </div>

                {/* --- Right Side: Links & Auth --- */}
                <div className="nav-right">
                    {/* Hamburger Icon - Only visible on Mobile via CSS */}
                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </div>

                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>

                        {/* --- Admin Only Links --- */}
                        {user && user.role === 'Admin' && (
                            <>
                                <li>
                                    <Link to="/admin" style={{ color: 'red', fontWeight: 'bold' }} onClick={closeMenu}>
                                        Verify
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/profiles" style={{ color: 'red', fontWeight: 'bold' }} onClick={closeMenu}>
                                        Manage Team
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/team-list" style={{ color: '#a67c52', fontWeight: 'bold' }} onClick={closeMenu}>
                                        Team List
                                    </Link>
                                </li>
                            </>
                        )}

                        {/* --- Seller Only Links --- */}
                        {user && user.role === 'Seller' && (
                            <li>
                                <Link to="/create-post" style={{ color: '#a67c52', fontWeight: 'bold' }} onClick={closeMenu}>
                                    + Create Post
                                </Link>
                            </li>
                        )}

                        <li><Link to="/about" onClick={closeMenu}>About us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact us</Link></li>
                    </ul>

                    {/* --- Auth Section (Hi, User / Sign In) --- */}
                    <div className="auth-section">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span className="user-greeting" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#a67c52' }}>
                                    Hi, {user.name}
                                </span>
                                <button className="sign-in-btn" onClick={() => { onLogout(); closeMenu(); }}>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={closeMenu}>
                                <button className="sign-in-btn">Sign in</button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;