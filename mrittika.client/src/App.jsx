import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

// --- SHARED COMPONENTS ---

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
                    <li><Link to="/about">About us</Link></li>
                    <li><Link to="/contact">Contact us</Link></li>
                </ul>
                {/* If user exists, show name and Logout. Otherwise show Sign In */}
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

const Footer = () => (
    <footer className="footer-wrapper">
        <div className="container">
            <div className="footer-grid">
                <div><h2>Mrittika</h2><p>Handmade excellence from rural artisans.</p></div>
                <div><h3>Explore</h3><ul><li>Collection</li><li>Artisans</li></ul></div>
                <div><h3>Support</h3><ul><li>Help Center</li><li>Feedback</li></ul></div>
                <div><h3>Contact</h3><p>admin@mrittika.com</p></div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '30px', opacity: 0.4, fontSize: '0.8rem' }}>© 2026 Mrittika Crafts</p>
        </div>
    </footer>
);

// --- PAGE COMPONENTS ---

const Home = () => (
    <div className="container">
        <section className="hero">
            <div className="hero-content">
                <h1>We Make Top Quality Handmade Products</h1>
                <p>Welcome to Mrittika! Tradition meets creativity in every clay masterpiece.</p>
                <button className="sign-in-btn" style={{ padding: '15px 30px' }}>View Collection &gt;</button>
            </div>
            <div className="hero-images">
                <div className="img-box stagger-down"><img src="/hero1.jpg" alt="1" /></div>
                <div className="img-box"><img src="/hero2.jpg" alt="2" /></div>
            </div>
        </section>
    </div>
);

const Login = ({ onLoginSuccess }) => {
    const [role, setRole] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : { ...formData, role: role })
            });
            const data = await res.json();
            if (res.ok) {
                if (isLogin) { onLoginSuccess(data); navigate('/'); }
                else { alert("Success! Sellers wait for approval."); setIsLogin(true); }
            } else { alert(data.message || data); }
        } catch (err) { console.error(err); alert("Backend Offline!"); }
    };

    if (!role) return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <h1>Sign in as...</h1>
            <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', marginTop: '40px' }}>
                {['Buyer', 'Seller', 'Admin'].map(r => (
                    <div key={r} onClick={() => setRole(r)} className="auth-box" style={{ width: '220px', cursor: 'pointer', margin: 0 }}>
                        <h3 style={{ color: '#a67c52' }}>{r}</h3>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container">
            <div className="auth-box">
                <p style={{ cursor: 'pointer', color: '#a67c52', textAlign: 'left' }} onClick={() => setRole(null)}>&larr; Back</p>
                <h2 style={{ marginTop: '15px' }}>{role} {isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && role !== 'Admin' && (
                        <input type="text" placeholder="Full Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    )}
                    <input type="email" placeholder="Email Address" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <button type="submit" className="submit-btn">{isLogin ? 'Sign In' : 'Create Account'}</button>
                </form>
                {role !== 'Admin' && (
                    <p style={{ marginTop: '20px', cursor: 'pointer', fontSize: '0.9rem', color: '#a67c52' }} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
                    </p>
                )}
            </div>
        </div>
    );
};

// --- MAIN APP ---
function App() {
    const location = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [location]);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('mrittika_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogin = (userData) => { setUser(userData); localStorage.setItem('mrittika_user', JSON.stringify(userData)); };
    const handleLogout = () => { setUser(null); localStorage.removeItem('mrittika_user'); };

    return (
        <div className="App">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
                    <Route path="/blog" element={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h1>Blog Coming Soon</h1></div>} />
                    <Route path="/about" element={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h1>About Us</h1></div>} />
                    <Route path="/contact" element={<div className="container" style={{ padding: '80px 0', textAlign: 'center' }}><h1>Contact Us</h1></div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}
export default App;