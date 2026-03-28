import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import Home from './pages/Home.jsx';
import Blog from './pages/Blog.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import AskAnything from './pages/AskAnything.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import AdminCreateProfile from './pages/AdminCreateProfile';
import TeamList from './pages/TeamList';
import SellerOrders from './pages/SellerOrders';
import NotificationPage from './pages/NotificationPage';
import SellerProfile from './pages/SellerProfile'; // ইমপোর্ট নিশ্চিত করা হয়েছে

// Component to protect routes based on login status and roles
const ProtectedRoute = ({ user, allowedRoles, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    // Load user from sessionStorage immediately to maintain state on refresh
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('mrittika_user');
        if (savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                // 'e' সরিয়ে দেওয়া হয়েছে ESLint এরর ফিক্স করতে
                return null;
            }
        }
        return null;
    });

    // Auto-scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

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
                    <Route path="/blog/:id" element={<PostDetail user={user} />} />
                    <Route path="/about" element={<About />} />

                    {/* DYNAMIC CONTACT ROUTE */}
                    <Route path="/contact" element={
                        (!user || user.role === 'User')
                            ? <AskAnything />
                            : <Contact user={user} />
                    } />

                    {/* Shared Protected Route */}
                    <Route path="/notifications" element={
                        <ProtectedRoute user={user}>
                            <NotificationPage user={user} />
                        </ProtectedRoute>
                    } />

                    {/* Auth Route */}
                    <Route path="/login" element={
                        user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLogin} />
                    } />

                    {/* --- ADMIN PROTECTED ROUTES --- */}
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

                    <Route path="/admin/reply/:replyId" element={
                        <ProtectedRoute user={user} allowedRoles={['Admin']}>
                            <Contact user={user} isAdminReply={true} />
                        </ProtectedRoute>
                    } />

                    {/* --- SELLER PROTECTED ROUTES --- */}
                    <Route path="/create-post" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <CreatePost user={user} />
                        </ProtectedRoute>
                    } />

                    <Route path="/seller/orders" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <SellerOrders user={user} />
                        </ProtectedRoute>
                    } />

                    {/* NEW: Seller Profile Route (Added inside protection) */}
                    <Route path="/seller-profile" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <SellerProfile user={user} />
                        </ProtectedRoute>
                    } />

                    {/* Fallback redirect - This MUST be the last route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;