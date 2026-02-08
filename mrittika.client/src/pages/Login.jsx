import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [role, setRole] = useState(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin ? { email: formData.email, password: formData.password } : { ...formData, role: role };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    alert(`Welcome back, ${data.name}!`);
                    onLoginSuccess(data);
                    navigate('/');
                } else {
                    // --- FIX FOR THE POP-UP MESSAGE ---
                    if (role === 'Buyer') {
                        alert("Registration successful! You can now login with your email.");
                    } else if (role === 'Seller') {
                        alert("Registration successful! Please wait for Admin approval before you can login.");
                    }
                    // ----------------------------------
                    setIsLogin(true); // Move user to login screen after signup
                }
            } else {
                // Show specific error from backend (like "Pending approval")
                alert(data.message || data);
            }
        } catch (err) {
            console.error("Auth Error:", err);
            alert("Backend is offline. Please start the C# server.");
        }
    };

    if (!role) return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '40px' }}>Sign in as...</h1>
            <div style={{ display: 'flex', gap: '25px', justifyContent: 'center' }}>
                {['Buyer', 'Seller', 'Admin'].map(r => (
                    <div key={r} onClick={() => setRole(r)} className="auth-box" style={{ width: '220px', cursor: 'pointer', margin: 0 }}>
                        <h3 style={{ color: '#a67c52' }}>{r}</h3>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 0' }}>
            <div className="auth-box">
                <p style={{ cursor: 'pointer', color: '#a67c52', textAlign: 'left', marginBottom: '15px' }} onClick={() => setRole(null)}>&larr; Back</p>
                <h2>{role} {isLogin ? 'Login' : 'Sign Up'}</h2>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && role !== 'Admin' && (
                        <input type="text" placeholder="Full Name" required
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    )}
                    <input type="email" placeholder="Email Address" required
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    <input type="password" placeholder="Password" required
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    <button type="submit" className="submit-btn">{isLogin ? 'Sign In' : 'Create Account'}</button>
                </form>
                {role !== 'Admin' && (
                    <p style={{ marginTop: '20px', cursor: 'pointer', fontSize: '0.9rem', color: '#a67c52' }} onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;