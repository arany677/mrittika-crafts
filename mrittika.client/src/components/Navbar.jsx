import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => (
    <header className="navbar-wrapper">
        <div className="container navbar">
            <div className="logo">
                <Link to="/"><img src="/logo.png" alt="Mrittika" /></Link>
            </div>
            <div className="nav-right">
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/blog">Blog</Link></li>

                    {/* Only show Dashboard if user is Admin */}
                    {user && user.role === 'Admin' && (
                        <li><Link to="/admin" style={{ color: 'red', fontWeight: 'bold' }}>Dashboard</Link></li>
                    )}

                    {/* NEW: Only show Create Post if user is Seller */}
                    {user && user.role === 'Seller' && (
                        <li><Link to="/create-post" style={{ color: '#a67c52', fontWeight: 'bold' }}>+ Create Post</Link></li>
                    )}

                    <li><Link to="/about">About us</Link></li>
                    <li><Link to="/contact">Contact us</Link></li>
                </ul>

                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#a67c52' }}>Hi, {user.name}</span>
                        <button className="sign-in-btn" onClick={onLogout}>Logout</button>
                    </div>
                ) : (
                    <Link to="/login"><button className="sign-in-btn">Sign in</button></Link>
                )}
            </div>
        </div>
    </header>
);

export default Navbar;