import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [purchaseStatus, setPurchaseStatus] = useState("");
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const updateCart = () => {
        const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(updatedCart);
    };

    useEffect(() => {
        window.addEventListener('cartUpdated', updateCart);
        window.addEventListener('storage', updateCart);
        return () => {
            window.removeEventListener('cartUpdated', updateCart);
            window.removeEventListener('storage', updateCart);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeMenu = () => { setIsMenuOpen(false); setIsProfileOpen(false); };

    const estimatedTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (!user) { alert("Please login first!"); navigate('/login'); return; }
        if (cartItems.length === 0) return;

        try {
            for (const item of cartItems) {
                const uId = user.id || user.Id;

                const orderData = {
                    userId: parseInt(uId),
                    blogId: parseInt(item.id),
                    quantity: parseInt(item.quantity),
                    totalPrice: parseFloat(item.price * item.quantity)
                };

                const res = await fetch('/api/orders/confirm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || "Server Error");
                }
            }

            setPurchaseStatus("Purchase Done ✅");
            localStorage.removeItem('cart');
            updateCart();
            setIsCartOpen(false);

            setTimeout(() => {
                setPurchaseStatus("");
                navigate('/blog');
            }, 3000);

        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <header className="navbar-wrapper" style={{ position: 'relative' }}>
            {purchaseStatus && (
                <div style={{
                    position: 'absolute', top: '70px', left: '50%', transform: 'translateX(-50%)',
                    background: '#28a745', color: 'white', padding: '10px 30px', borderRadius: '5px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', zIndex: 1000, fontWeight: 'bold'
                }}>
                    {purchaseStatus}
                </div>
            )}

            <div className="container navbar">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}><img src="/logo.png" alt="Mrittika" /></Link>
                </div>

                <div className="nav-right">
                    <div className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </div>

                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>

                        {/* --- Admin Only Links (Team List পুনরদ্ধার করা হয়েছে) --- */}
                        {user && user.role === 'Admin' && (
                            <>
                                <li><Link to="/admin" style={{ color: 'red' }} onClick={closeMenu}>Verify</Link></li>
                                <li><Link to="/admin/profiles" style={{ color: 'red' }} onClick={closeMenu}>Manage Team</Link></li>
                                <li>
                                    <Link to="/admin/team-list" style={{ color: '#a67c52', fontWeight: 'bold' }} onClick={closeMenu}>
                                        Team List
                                    </Link>
                                </li>
                            </>
                        )}

                        {user && user.role === 'Seller' && (
                            <li><Link to="/create-post" style={{ color: '#a67c52' }} onClick={closeMenu}>+ Create Post</Link></li>
                        )}

                        <li><Link to="/about" onClick={closeMenu}>About us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact us</Link></li>
                    </ul>

                    <div className="auth-nav-group" ref={dropdownRef}>
                        <div className="profile-container">
                            <button className="icon-btn" onClick={toggleProfile}><FaUserCircle /></button>
                            {isProfileOpen && (
                                <div className="profile-dropdown">
                                    {user ? (
                                        <div className="profile-content">
                                            <p style={{ margin: 0, fontWeight: 'bold' }}>Hi {user.name}</p>
                                        </div>
                                    ) : (
                                        <div className="profile-content"><Link to="/login" onClick={closeMenu}>Log In</Link></div>
                                    )}
                                </div>
                            )}
                        </div>

                        {user && user.role === 'Buyer' && (
                            <div className="icon-btn-static" style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleCart}>
                                <FaShoppingCart />
                                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                            </div>
                        )}

                        <div className="auth-action-btn">
                            {user ? (
                                <button className="sign-in-btn" onClick={() => { onLogout(); closeMenu(); navigate('/'); }}>Logout</button>
                            ) : (
                                <Link to="/login" onClick={closeMenu}><button className="sign-in-btn">Sign in</button></Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* কার্ট সাইডবার */}
            {isCartOpen && (
                <>
                    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
                    <div className="cart-sidebar">
                        <div className="cart-header">
                            <span>PRODUCT</span>
                            <span>TOTAL</span>
                            <button onClick={() => setIsCartOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                        </div>

                        <div className="cart-items-container">
                            {cartItems.length > 0 ? cartItems.map((item, i) => (
                                <div key={i} className="cart-item-row">
                                    <img src={`http://localhost:5010${item.image}`} className="cart-item-img" alt="" />
                                    <div className="cart-item-details">
                                        <h4>{item.title}</h4>
                                        <div className="cart-item-price">BDT {item.price} x {item.quantity}</div>
                                        <span className="delete-icon" onClick={() => {
                                            const newCart = cartItems.filter((_, idx) => idx !== i);
                                            localStorage.setItem('cart', JSON.stringify(newCart));
                                            updateCart();
                                        }}>Remove Item</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>BDT {item.price * item.quantity}</div>
                                </div>
                            )) : <p style={{ textAlign: 'center', marginTop: '50px', color: '#999' }}>Your cart is empty</p>}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ color: '#666' }}>Estimated total</span>
                                    <strong>BDT {estimatedTotal}</strong>
                                </div>
                                <button className="checkout-red-btn" onClick={handleCheckout}>Check out</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </header>
    );
};

export default Navbar;