import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Components & Pages
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
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
import SellerOrders from './pages/SellerOrders';

const ProtectedRoute = ({ user, allowedRoles, children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};

function App() {
    const location = useLocation();
    const navigate = useNavigate();

    // Fix: Load user from sessionStorage immediately
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('mrittika_user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

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
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:id" element={<PostDetail user={user} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Only show Login if NOT logged in */}
                    <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLogin} />} />

                    {/* Protected Admin Routes */}
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

                    {/* Protected Seller Route */}
                    <Route path="/create-post" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <CreatePost user={user} />
                        </ProtectedRoute>
                    } />
                    {/* Inside <Routes> */}
                    <Route path="/seller/orders" element={
                        <ProtectedRoute user={user} allowedRoles={['Seller']}>
                            <SellerOrders user={user} />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;