import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Navbar = ({ user, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Controls the welcome dropdown
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({ location: '', phone: '', isCod: false });

    const navigate = useNavigate();

    // Load Cart Items
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
    const toggleProfile = () => setIsProfileOpen(!isProfileOpen); // Toggle welcome dropdown
    const toggleCart = () => setIsCartOpen(!isCartOpen);
    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
    };

    const estimatedTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckoutButtonClick = () => {
        if (!user) { alert("Please login first!"); navigate('/login'); return; }
        if (cartItems.length === 0) return;
        setShowModal(true);
    };

    const handleFinalConfirm = async () => {
        if (!shippingInfo.location || !shippingInfo.phone || !shippingInfo.isCod) {
            alert("Please fill all fields and check Cash on Delivery.");
            return;
        }

        const phoneRegex = /^01[0-9]{9}$/;
        if (!phoneRegex.test(shippingInfo.phone)) {
            alert("Invalid Number! It must start with '01' and be 11 digits.");
            return;
        }

        const orderData = {
            buyerEmail: user.email,
            location: shippingInfo.location,
            contactNumber: shippingInfo.phone,
            totalAmount: estimatedTotal,
            orderItems: cartItems.map(item => ({
                productId: item.id,
                productName: item.title,
                quantity: item.quantity,
                price: item.price,
                sellerEmail: item.sellerEmail
            }))
        };

        try {
            const res = await fetch('/api/orders/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                alert("Purchase Successful ✅.");
                localStorage.removeItem('cart');
                updateCart();
                setShowModal(false);
                setIsCartOpen(false);
                navigate('/blog');
            }
        } catch (err) {
            alert("Connection error");
        }
    };

    return (
        <header className="navbar-wrapper">
            <div className="container navbar">
                <div className="logo">
                    <Link to="/" onClick={closeMenu}><img src="/logo.png" alt="Mrittika" /></Link>
                </div>

                <div className="nav-right">
                    <div className="menu-icon" onClick={toggleMenu}>{isMenuOpen ? '✕' : '☰'}</div>

                    <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>Blog</Link></li>

                        {user && user.role === 'Admin' && (
                            <>
                                <li><Link to="/admin" style={{ color: 'red' }} onClick={closeMenu}>Verify</Link></li>
                                <li><Link to="/admin/profiles" style={{ color: 'red' }} onClick={closeMenu}>Manage Team</Link></li>
                                <li><Link to="/admin/team-list" style={{ color: '#a67c52' }} onClick={closeMenu}>Team List</Link></li>
                            </>
                        )}
                        {user && user.role === 'Seller' && (
                            <>
                                <li><Link to="/create-post" style={{ color: '#a67c52' }} onClick={closeMenu}>+ Create Post</Link></li>
                                <li><Link to="/seller/orders" style={{ color: '#a67c52' }} onClick={closeMenu}>Orders</Link></li>
                            </>
                        )}
                        <li><Link to="/about" onClick={closeMenu}>About us</Link></li>
                        <li><Link to="/contact" onClick={closeMenu}>Contact us</Link></li>
                    </ul>

                    <div className="auth-nav-group">
                        {/* --- PROFILE ICON & DROPDOWN --- */}
                        <div style={{ position: 'relative' }}>
                            <button className="icon-btn" onClick={toggleProfile} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a67c52' }}>
                                <FaUserCircle />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-dropdown" style={{
                                    position: 'absolute', top: '45px', right: '0', background: 'white',
                                    padding: '15px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                                    zIndex: 1000, minWidth: '180px', textAlign: 'left', border: '1px solid #eee'
                                }}>
                                    {user ? (
                                        <>
                                            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#333' }}>Welcome back!</p>
                                            <p style={{ margin: '0 0 10px 0', color: '#a67c52', fontSize: '0.9rem' }}>{user.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#999' }}>Role: {user.role}</p>
                                        </>
                                    ) : (
                                        <Link to="/login" onClick={closeMenu} style={{ textDecoration: 'none', color: '#a67c52', fontWeight: 'bold' }}>Please Log In</Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {user && user.role === 'Buyer' && (
                            <div className="icon-btn-static" style={{ position: 'relative', cursor: 'pointer', fontSize: '1.4rem', color: '#333' }} onClick={toggleCart}>
                                <FaShoppingCart />
                                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                            </div>
                        )}

                        {user ? (
                            <button className="sign-in-btn" onClick={() => { onLogout(); closeMenu(); navigate('/'); }}>Logout</button>
                        ) : (
                            <Link to="/login" onClick={closeMenu}><button className="sign-in-btn">Sign in</button></Link>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CART SIDEBAR --- */}
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
                                        <h4 style={{ color: '#000' }}>{item.title}</h4>
                                        <div style={{ color: '#666', fontSize: '0.8rem' }}>BDT {item.price} x {item.quantity}</div>
                                        <span className="delete-icon" onClick={() => {
                                            const newCart = cartItems.filter((_, idx) => idx !== i);
                                            localStorage.setItem('cart', JSON.stringify(newCart));
                                            updateCart();
                                        }}>Remove</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: '#000' }}>{item.price * item.quantity}</div>
                                </div>
                            )) : <p style={{ textAlign: 'center', marginTop: '50px' }}>Empty Cart</p>}
                        </div>
                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                    <span>Total:</span>
                                    <strong>BDT {estimatedTotal}</strong>
                                </div>
                                <button className="checkout-red-btn" onClick={handleCheckoutButtonClick}>Check out</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* --- COD POPUP MODAL --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Order Confirmation</h2>
                        <input type="text" placeholder="Delivery Location" className="modal-input" onChange={(e) => setShippingInfo({ ...shippingInfo, location: e.target.value })} />
                        <input type="text" placeholder="Contact Number" className="modal-input" maxLength="11" value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value.replace(/\D/g, '') })} />
                        <div className="checkbox-row"><input type="checkbox" id="cod" onChange={(e) => setShippingInfo({ ...shippingInfo, isCod: e.target.checked })} /><label htmlFor="cod">Cash on Delivery</label></div>
                        <div className="modal-btn-group">
                            <button onClick={handleFinalConfirm} className="confirm-btn">OK</button>
                            <button onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;