import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [pendingBlogs, setPendingBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);

    // Logic moved inside useEffect to satisfy the "Cascading Renders" rule
    useEffect(() => {
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
                console.error("Dashboard Fetch Error:", err);
            }
        };

        loadAllData();
    }, []);

    const handleApproveSeller = async (id) => {
        const res = await fetch(`/api/auth/approve-seller/${id}`, { method: 'POST' });
        if (res.ok) {
            alert("Seller Approved!");
            // Manual refresh of the state instead of re-calling the whole fetch
            setPendingSellers(pendingSellers.filter(s => s.id !== id));
        }
    };

    const handleApproveBlog = async (id) => {
        const res = await fetch(`/api/blogs/approve/${id}`, { method: 'POST' });
        if (res.ok) {
            alert("Blog Post Approved!");
            setPendingBlogs(pendingBlogs.filter(b => b.id !== id));
            setSelectedBlog(null);
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <h1 className="page-title" style={{ color: '#000' }}>Admin Dashboard</h1>

            <div style={{ marginBottom: '50px' }}>
                <h3 style={{ color: '#a67c52' }}>Pending Seller Approvals</h3>
                {pendingSellers.length === 0 ? <p style={{ color: '#999' }}>No pending sellers.</p> : (
                    pendingSellers.map(s => (
                        <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
                            <span style={{ color: '#000' }}>{s.name} ({s.email})</span>
                            <button className="sign-in-btn" onClick={() => handleApproveSeller(s.id)}>Approve</button>
                        </div>
                    ))
                )}
            </div>

            <div>
                <h3 style={{ color: '#a67c52' }}>Pending Posts</h3>
                <div className="blog-grid">
                    {pendingBlogs.map(b => (
                        <div key={b.id} className="blog-card" style={{ padding: '15px', border: '1px solid #eee' }}>
                            <h4 style={{ color: '#000' }}>{b.title}</h4>
                            <button className="sign-in-btn" onClick={() => setSelectedBlog(b)}>Review</button>
                        </div>
                    ))}
                </div>
            </div>

            {selectedBlog && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
                    <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '90%' }}>
                        <h2 style={{ color: '#000' }}>{selectedBlog.title}</h2>
                        <img src={`http://localhost:5010${selectedBlog.imageUrl}`} alt="post" style={{ width: '100%', borderRadius: '10px', margin: '10px 0' }} />
                        <p style={{ color: '#333' }}>{selectedBlog.content}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="sign-in-btn" onClick={() => handleApproveBlog(selectedBlog.id)}>Approve</button>
                            <button className="sign-in-btn" style={{ background: '#999' }} onClick={() => setSelectedBlog(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;