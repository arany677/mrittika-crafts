import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// --- Navbar Component ---
const Navbar = () => (
    <nav className="navbar">
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
            <button className="sign-in-btn">Sign in</button>
        </div>
    </nav>
);

// --- Footer Component ---
const Footer = () => (
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-about">
                <h2>Mrittika</h2>
                <p>Promoting traditional terracotta artistry across the globe.</p>
            </div>
            <div className="footer-links">
                <h3>Explore</h3>
                <ul><li><Link to="/about" style={{ color: '#d0d0d0', textDecoration: 'none' }}>About Us</Link></li></ul>
            </div>
            <div className="footer-links">
                <h3>Support</h3>
                <ul><li>Feedback</li></ul>
            </div>
            <div className="footer-links">
                <h3>Get in Touch</h3>
                <p>Questions? Write us a message.</p>
            </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '50px', opacity: 0.4, fontSize: '0.8rem' }}>
            © 2026 Mrittika. All Rights Reserved.
        </p>
    </footer>
);

// --- PAGE COMPONENTS ---

const Home = () => (
    <section className="hero">
        <div className="hero-content">
            <h1>We Make Top Quality Handmade Products</h1>
            <p>
                Welcome to Mrittika! Discover the beauty of handcrafted artistry at Mrittika,
                where tradition meets creativity.
            </p>
            <button className="view-collection-btn">View Collection &gt;</button>
        </div>

        <div className="hero-images">
            <div className="img-wrapper wrapper-left">
                <img src="/hero1.jpg" alt="Terracotta 1" />
            </div>
            <div className="img-wrapper">
                <img src="/hero2.jpg" alt="Terracotta 2" />
            </div>
        </div>
    </section>
);

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Waiting for backend...", err));
    }, []);

    return (
        <div style={{ padding: '100px 8%', textAlign: 'center', minHeight: '60vh' }}>
            <h1>Crafting Stories</h1>
            {blogs.length === 0 ? (
                <p style={{ marginTop: '50px', color: '#999' }}>
                    No blogs available yet. They will appear here after admin approval.
                </p>
            ) : (
                <div className="blog-grid">
                    {/* Blog mapping will go here later */}
                </div>
            )}
        </div>
    );
};

const About = () => (
    <div style={{ padding: '100px 8%', minHeight: '60vh' }}>
        <h1>About Mrittika</h1>
        <p style={{ marginTop: '20px' }}>Supporting rural artisans through digital access.</p>
    </div>
);

const Contact = () => (
    <div style={{ padding: '100px 8%', minHeight: '60vh' }}>
        <h1>Contact Us</h1>
        <p style={{ marginTop: '20px' }}>Email: contact@mrittika.com</p>
    </div>
);

// --- MAIN APP COMPONENT ---
function App() {
    return (
        <div className="App">
            <Navbar />
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;