import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [pendingBlogs, setPendingBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null); // To view details

    const fetchData = () => {
        fetch('/api/blogs/pending').then(res => res.json()).then(data => setPendingBlogs(data));
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = (id) => {
        fetch(`/api/blogs/approve/${id}`, { method: 'POST' }).then(() => {
            alert("Post Approved!");
            setSelectedBlog(null);
            fetchData();
        });
    };

    const handleRefuse = (id) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            fetch(`/api/blogs/refuse/${id}`, { method: 'DELETE' }).then(() => {
                alert("Post Rejected/Deleted.");
                setSelectedBlog(null);
                fetchData();
            });
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <h1>Admin Dashboard</h1>

            <h3 style={{ color: '#a67c52', marginTop: '30px' }}>Pending Blog Posts</h3>
            {pendingBlogs.length === 0 ? <p>Nothing to review.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
                    {pendingBlogs.map(b => (
                        <div key={b.id} className="img-box" style={{ padding: '20px', height: 'auto', background: '#fff', textAlign: 'left', border: '1px solid #eee' }}>
                            <h4>{b.title}</h4>
                            <p>By: {b.authorName}</p>
                            <button className="sign-in-btn" style={{ padding: '5px 15px', marginTop: '10px' }} onClick={() => setSelectedBlog(b)}>Review Details</button>
                        </div>
                    ))}
                </div>
            )}

            {/* --- Detail Modal/Section --- */}
            {selectedBlog && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
                    <div className="auth-box" style={{ maxWidth: '800px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button onClick={() => setSelectedBlog(null)} style={{ float: 'right' }}>Close</button>
                        <h2>{selectedBlog.title}</h2>
                        <img src={selectedBlog.imageUrl} alt="preview" style={{ width: '100%', borderRadius: '15px', margin: '20px 0' }} />
                        <p>{selectedBlog.content}</p>
                        <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                            <button className="submit-btn" onClick={() => handleApprove(selectedBlog.id)}>Approve Post</button>
                            <button className="submit-btn" style={{ background: 'red' }} onClick={() => handleRefuse(selectedBlog.id)}>Refuse/Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;