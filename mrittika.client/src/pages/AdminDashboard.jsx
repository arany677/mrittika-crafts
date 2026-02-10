import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [pendingBlogs, setPendingBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // --- 1. Define all functions first ---

    const loadAllData = async () => {
        try {
            const sellerRes = await fetch('/api/auth/pending-sellers');
            if (sellerRes.ok) {
                const sellerData = await sellerRes.json();
                setPendingSellers(Array.isArray(sellerData) ? sellerData : []);
            }

            const blogRes = await fetch('/api/blogs/pending');
            if (blogRes.ok) {
                const blogData = await blogRes.json();
                setPendingBlogs(Array.isArray(blogData) ? blogData : []);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleApproveSeller = async (id) => {
        const res = await fetch(`/api/auth/approve-seller/${id}`, { method: 'POST' });
        if (res.ok) {
            alert("Seller Approved!");
            loadAllData();
        }
    };

    const handleApproveBlog = async (id) => {
        const res = await fetch(`/api/blogs/approve/${id}`, { method: 'POST' });
        if (res.ok) {
            alert("Blog Post Published!");
            setSelectedBlog(null);
            loadAllData();
        }
    };

    const handleRefuseBlog = async (id) => {
        if (window.confirm("Reject and delete this post?")) {
            const res = await fetch(`/api/blogs/refuse/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Post Removed.");
                setSelectedBlog(null);
                loadAllData();
            }
        }
    };

    // --- 2. Move useEffect to the bottom of the logic section ---
    useEffect(() => {
        loadAllData();
    }, []);

    // --- 3. The UI ---
    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <h1 className="page-title">Admin Dashboard</h1>

            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ color: '#a67c52', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Sellers Awaiting Verification</h3>
                {pendingSellers.length === 0 ? <p style={{ color: '#999', marginTop: '10px' }}>No pending sellers.</p> : (
                    pendingSellers.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#000' }}><strong>{s.name}</strong> ({s.email})</span>
                            <button className="sign-in-btn" style={{ padding: '5px 15px' }} onClick={() => handleApproveSeller(s.id)}>Approve</button>
                        </div>
                    ))
                )}
            </div>

            <div>
                <h3 style={{ color: '#a67c52', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Pending Blog Posts</h3>
                {pendingBlogs.length === 0 ? <p style={{ color: '#999', marginTop: '10px' }}>No posts to review.</p> : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        {pendingBlogs.map(b => (
                            <div key={b.id} className="blog-card" style={{ border: '1px solid #eee', padding: '15px', borderRadius: '15px' }}>
                                <h4 style={{ color: '#000' }}>{b.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: '#666' }}>By: {b.authorName}</p>
                                <button className="sign-in-btn" style={{ marginTop: '10px', width: '100%' }} onClick={() => setSelectedBlog(b)}>Review Details</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for detail viewing */}
            {selectedBlog && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', maxWidth: '600px', width: '90%' }}>
                        <h2 style={{ color: '#000' }}>{selectedBlog.title}</h2>
                        <img src={`http://localhost:5010${selectedBlog.imageUrl}`} alt="preview" style={{ width: '100%', borderRadius: '10px', margin: '15px 0' }} />
                        <p style={{ color: '#333' }}>{selectedBlog.content}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="sign-in-btn" onClick={() => handleApproveBlog(selectedBlog.id)}>Approve</button>
                            <button className="sign-in-btn" style={{ background: 'red' }} onClick={() => handleRefuseBlog(selectedBlog.id)}>Reject & Delete</button>
                            <button className="sign-in-btn" style={{ background: '#999' }} onClick={() => setSelectedBlog(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;