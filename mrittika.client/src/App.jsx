import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

// Import Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Import Pages
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';

function App() {
    const location = useLocation();

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // Load user session
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('mrittika_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('mrittika_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('mrittika_user');
    };

    return (
        <div className="App">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<PostDetail />} /> {/* NEW ROUTE */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/create-post" element={<CreatePost user={user} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;