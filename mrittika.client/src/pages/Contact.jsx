import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ContactUs = ({ user, isAdminReply = false }) => {
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
            const response = await axios.post('/api/contact/send', payload);
            alert(isAdminReply ? "Reply sent successfully!" : "Message sent to Admin!");

            if (isAdminReply) {
                navigate('/notifications');
            } else {
                setFormData({ ...formData, message: '' });
            }
        } catch (err) {
            const errorMsg = err.response?.data || "Something went wrong. Please try again.";
            setError(typeof errorMsg === 'string' ? errorMsg : "Validation Error");
        }
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Loading context...</div>;

    return (
        <div style={{ padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '600px' }}>
                <h1 style={{ color: '#a67c52', marginBottom: '30px' }}>
                    {isAdminReply ? `Replying to User` : "Contact Admin"}
                </h1>

                {isAdminReply && (
                    <p style={{ marginBottom: '10px', color: '#666' }}>
                        Sending response to: <strong>{formData.email}</strong>
                    </p>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        readOnly={!!user}
                        style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#333',
                            color: '#fff',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        readOnly={!!user}
                        style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#333',
                            color: '#fff',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />

                    {error && (
                        <p style={{ color: 'red', fontWeight: 'bold', fontSize: '0.9rem', margin: '0' }}>
                            {error}
                        </p>
                    )}

                    <textarea
                        placeholder="Type your message..."
                        rows="6"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#333',
                            color: '#fff',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            width: 'fit-content',
                            padding: '12px 35px',
                            backgroundColor: '#111',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {isAdminReply ? "Send Reply" : "Send Message"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUs;