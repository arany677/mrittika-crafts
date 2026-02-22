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
                <div className="logo">
                    <Link to="/" onClick={closeMenu}><img src="/logo.png" alt="Mrittika" /></Link>
                </div>

                <div className="nav-right">
                    {/* Hamburger Icon - Only visible on Mobile */}
                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </div>

                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>

                        {/* Only show Dashboard if user is Admin */}
                        {user && user.role === 'Admin' && (
                            <li><Link to="/admin" style={{ color: 'red', fontWeight: 'bold' }} onClick={closeMenu}>Dashboard</Link></li>
                        )}
                        {user && user.role === 'Admin' && (
                            <>
                                <li><Link to="/admin" style={{ color: 'red' }}>Verify</Link></li>
                                <li><Link to="/admin/profiles" style={{ color: 'red' }}>Manage Team</Link></li>
                            </>
                        )}

                        {/* NEW: Only show Create Post if user is Seller */}
                        {user && user.role === 'Seller' && (
                            <li><Link to="/create-post" style={{ color: '#a67c52', fontWeight: 'bold' }} onClick={closeMenu}>+ Create Post</Link></li>
                        )}

                        <li><Link to="/about" onClick={closeMenu}>About us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact us</Link></li>
                    </ul>

                    {/* Auth Section */}
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#a67c52' }} className="user-greeting">Hi, {user.name}</span>
                            <button className="sign-in-btn" onClick={() => { onLogout(); closeMenu(); }}>Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" onClick={closeMenu}><button className="sign-in-btn">Sign in</button></Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;