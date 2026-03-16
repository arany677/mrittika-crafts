import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NotificationPage = ({ user }) => {
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAndReadMessages = async () => {
            if (!user) return;
            try {
                // 1. Fetch the messages
                const res = await axios.get(`/api/contact/notifications/${user.role}/${user.email}`);
                setMessages(res.data);

                // 2. Mark as read in DB
                await axios.post(`/api/contact/mark-as-read/${user.role}/${user.email}`);

                // 3. Trigger navbar update
                window.dispatchEvent(new Event('notificationsSeen'));
            } catch (err) {
                console.error("Error updating notifications", err);
            }
        };
        fetchAndReadMessages();
    }, [user]);

    const handleAction = (msg) => {
        if (user.role === 'Admin') {
            navigate(`/admin/reply/${msg.id}`);
        } else {
            navigate(`/contact`);
        }
    };

    return (
        <div style={{ padding: '100px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: '#a67c52', borderBottom: '2px solid #a67c52', paddingBottom: '10px' }}>
                Notifications
            </h1>
            {messages.length === 0 ? (
                <p style={{ marginTop: '20px', color: '#666' }}>No messages found.</p>
            ) : (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            padding: '20px', border: '1px solid #ddd', borderRadius: '10px',
                            backgroundColor: msg.isRead ? '#fff' : '#fff9f0',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            position: 'relative'
                        }}>
                            {!msg.isRead && <span style={{ position: 'absolute', top: '10px', right: '10px', color: 'red', fontSize: '10px', fontWeight: 'bold' }}>NEW</span>}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <strong>From: {msg.name} ({msg.role})</strong>
                                <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ color: '#444', marginBottom: '15px' }}>{msg.messageBody}</p>
                            <button
                                onClick={() => handleAction(msg)}
                                style={{ padding: '8px 20px', backgroundColor: '#a67c52', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Reply
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationPage;