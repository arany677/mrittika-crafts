import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    // ড্রপডাউনের বাইরে ক্লিক করলে ড্রপডাউন বন্ধ হওয়ার লজিক (Part 1 থেকে)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="navbar-wrapper">
            <div className="container navbar">
                {/* --- Logo --- */}
                <div className="logo">
                    <Link to="/" onClick={closeMenu}>
                        <img src="/logo.png" alt="Mrittika" />
                    </Link>
                </div>

                <div className="nav-right">
                    {/* Hamburger Icon for Mobile */}
                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </div>

                    {/* --- Navigation Links (Merged Part 1 & 2) --- */}
                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>

                        {/* --- Admin Only Links (Part 2 থেকে সব লিঙ্ক রাখা হয়েছে) --- */}
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

                        {/* --- Seller Only Links (Part 2 থেকে) --- */}
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

                    {/* --- Auth Section: Profile -> Cart -> Logout (Part 1 এর স্টাইল) --- */}
                    <div className="auth-nav-group" ref={dropdownRef}>

                        {/* 1. Profile Icon & Dropdown */}
                        <div className="profile-container">
                            <button className="icon-btn" onClick={toggleProfile}>
                                <FaUserCircle />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    {user ? (
                                        <div className="profile-content">
                                            <p className="hi-text">Hi {user.name}</p>
                                            <div className="info-box">
                                                <span>Name: </span> <strong>{user.name}</strong>
                                            </div>
                                            <div className="info-box">
                                                <span>Email: </span> <strong>{user.email || 'N/A'}</strong>
                                            </div>
                                            <p className="welcome-msg">Welcome to Mrittika</p>
                                        </div>
                                    ) : (
                                        <div className="profile-content">
                                            <Link to="/login" className="auth-option-box" onClick={closeMenu}>Log In</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 2. Cart Icon */}
                        <div className="icon-btn-static">
                            <FaShoppingCart />
                        </div>

                        {/* 3. Logout / Sign In Button */}
                        <div className="auth-action-btn">
                            {user ? (
                                <button className="sign-in-btn" onClick={() => { onLogout(); closeMenu(); }}>
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" onClick={closeMenu}>
                                    <button className="sign-in-btn">Sign in</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;