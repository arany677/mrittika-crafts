import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [signupRole, setSignupRole] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const payload = isLogin
            ? { email: formData.email, password: formData.password }
            : { ...formData, role: signupRole };

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
                    // --- DYNAMIC POPUP MESSAGE LOGIC ---
                    if (signupRole === 'Buyer') {
                        alert("Registration successful as a Buyer! You can now sign in.");
                    } else if (signupRole === 'Seller') {
                        alert("Registration successful! Sellers please wait for Admin approval.");
                    }

                    // Clear the Form Data
                    setFormData({ name: '', email: '', password: '' });

                    // Clear the Signup Role
                    setSignupRole(null);

                    // Switch back to Login View
                    setIsLogin(true);
                }
            } else {
                alert(data.message || "Error occurred");
            }
        } catch (err) {
            console.error("Auth error:", err);
            alert("Backend is offline. Please start the C# server.");
        }
    };

    // --- VIEW 1: SIGNUP ROLE SELECTION (The Box Design) ---
    if (!isLogin && !signupRole) {
        return (
            <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
                <p style={{ cursor: 'pointer', color: '#a67c52', textAlign: 'left' }} onClick={() => setIsLogin(true)}>&larr; Back to Login</p>

                <h1 style={{ marginBottom: '10px', color: '#000', fontWeight: '700' }}>Join Mrittika</h1>
                <p style={{ color: '#666', marginBottom: '40px' }}>Choose how you want to use the platform</p>

                <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div onClick={() => setSignupRole('Buyer')} className="role-card">
                        <div className="role-icon">🛒</div>
                        <h3>Buyer</h3>
                        <p>I want to explore and buy terracotta crafts.</p>
                    </div>

                    <div onClick={() => setSignupRole('Seller')} className="role-card">
                        <div className="role-icon">🏺</div>
                        <h3>Seller</h3>
                        <p>I am an artisan who wants to sell my work.</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: LOGIN OR REGISTRATION FORM ---
    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-box">
                {!isLogin && (
                    <p style={{ cursor: 'pointer', color: '#a67c52', textAlign: 'left' }} onClick={() => setSignupRole(null)}>&larr; Back</p>
                )}

                <h2 style={{ marginTop: '15px', color: '#000', fontWeight: '700' }}>
                    {isLogin ? 'Sign In' : `${signupRole} Sign Up`}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '25px' }}>
                    {isLogin ? 'Enter your credentials to continue' : 'Please fill in your details'}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="modal-input"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="modal-input"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="modal-input"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <p style={{ marginTop: '25px', cursor: 'pointer', fontSize: '0.9rem', color: '#a67c52', fontWeight: '500' }}
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setSignupRole(null);
                        setFormData({ name: '', email: '', password: '' });
                    }}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
            </div>
        </div>
    );
};

export default Login;