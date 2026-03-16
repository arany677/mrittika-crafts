import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Contact = ({ user, isAdminReply = false }) => {
    const { replyId } = useParams(); // The ID of the message being replied to
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const prepareForm = async () => {
            if (isAdminReply && replyId) {
                // ADMIN MODE: Fetch the original message to get the Buyer/Seller's info
                try {
                    setLoading(true);
                    const res = await axios.get(`/api/contact/message/${replyId}`);
                    setFormData({
                        name: "Admin", // Admin's identity
                        email: res.data.email, // This is the original sender's email (Target)
                        message: ''
                    });
                } catch (err) {
                    console.error("Context Load Error:", err);
                    setError("Could not load original message context.");
                } finally {
                    setLoading(false);
                }
            } else if (user) {
                // USER MODE: Auto-fill with the logged-in Buyer/Seller's info
                setFormData({
                    name: user.name,
                    email: user.email,
                    message: ''
                });
            }
        };

        prepareForm();
    }, [user, isAdminReply, replyId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation for Admin mode
        if (isAdminReply && !formData.email) {
            setError("Recipient email is missing.");
            return;
        }

        const payload = {
            name: formData.name,
            email: formData.email,
            messageBody: formData.message,
            role: user?.role,
            userId: user?.id,
            parentMessageId: replyId ? parseInt(replyId) : null
        };

        try {
            // FIX: Removed unused 'response' variable to clear ESLint error
            await axios.post('/api/contact/send', payload);
            alert(isAdminReply ? "Reply sent successfully!" : "Message sent to Admin!");

            if (isAdminReply) {
                navigate('/admin'); // Navigating to Admin instead of general notifications for better flow
            } else {
                setFormData({ ...formData, message: '' });
            }
        } catch (err) {
            console.error("Submission Error:", err);
            const errorMsg = err.response?.data || "Something went wrong. Please try again.";
            setError(typeof errorMsg === 'string' ? errorMsg : "Validation Error");
        }
    };

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading context...</div>;

    return (
        <div className="container" style={{ padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 style={{ color: '#a67c52', marginBottom: '30px', textAlign: 'center' }}>
                    {isAdminReply ? `Replying to User` : "Contact Us"}
                </h1>

                {isAdminReply && (
                    <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666' }}>
                        Sending response to: <strong style={{ color: '#000' }}>{formData.email}</strong>
                    </p>
                )}

                <form onSubmit={handleSubmit} className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label className="modal-label">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            readOnly={!!user}
                            className="modal-input"
                            style={{
                                backgroundColor: '#fff',
                                color: '#000',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label className="modal-label">Email Address</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            readOnly={!!user && !isAdminReply}
                            className="modal-input"
                            style={{
                                backgroundColor: '#fff',
                                color: '#000',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '0.9rem', margin: '0' }}>
                            {error}
                        </p>
                    )}

                    <div style={{ textAlign: 'left' }}>
                        <label className="modal-label">Your Message</label>
                        <textarea
                            placeholder="Type your message here..."
                            rows="6"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            className="modal-input"
                            style={{
                                height: 'auto',
                                backgroundColor: '#fff',
                                color: '#000',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '1rem'
                        }}
                    >
                        {isAdminReply ? "Send Reply" : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;