import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import AdminCreateProfile from './pages/AdminCreateProfile';
import TeamList from './pages/TeamList';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ user, allowedRoles, children }) => {
    if (!user) {
        // Not logged in -> Kick to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role -> Kick to home
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // --- SECURITY FIX: Use sessionStorage instead of localStorage ---
    // This ensures that when the tab is closed, the user is automatically logged out.
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('mrittika_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLogin = (userData) => {
        setUser(userData);
        sessionStorage.setItem('mrittika_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        sessionStorage.removeItem('mrittika_user');
        navigate('/', { replace: true });
    };

    return (
        <div className="App">
            <Navbar user={user} onLogout={handleLogout} />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<PostDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Login Route: Redirect if already logged in */}
                    <Route path="/login" element={
                        user ? <Navigate to="/" replace /> : <Login onLoginSuccess={handleLogin} />
                    } />

                    {/* Admin Only Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute user={user} allowedRoles={['Admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/profiles" element={
                        <ProtectedRoute user={user} allowedRoles={['Admin']}>
                            <AdminCreateProfile />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/team-list" element={
                        <ProtectedRoute user={user} allowedRoles={['Admin']}>
                            <TeamList />
                        </ProtectedRoute>
                    } />

                    {/* Seller Only Routes */}
                    <Route path="/create-post" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <CreatePost user={user} />
                        </ProtectedRoute>
                    } />

                    {/* Catch all - Redirect to Home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;