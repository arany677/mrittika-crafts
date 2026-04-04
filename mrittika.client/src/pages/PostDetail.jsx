import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ user }) => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [buyQty, setBuyQty] = useState(1);
    const [limitError, setLimitError] = useState("");

    // --- Social States (Like & Comment) ---
    const [likesCount, setLikesCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    // ডাটা লোড করার ফাংশন
    const fetchPostData = () => {
        const emailParam = user ? `?userEmail=${user.email}` : "";
        fetch(`/api/blogs/${id}${emailParam}`)
            .then(res => res.json())
            .then(data => {
                setBlog(data.blog);
                setLikesCount(data.likesCount);
                setIsLiked(data.isLiked);
                setComments(data.comments);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchPostData();
    }, [id, user]);

    if (!blog) return <div className="container" style={{ padding: '100px 0' }}>Loading...</div>;

    const subtotal = buyQty * blog.price;

    // --- Like Handler ---
    const handleLike = async () => {
        if (!user) return alert("Please login to like this post");
        try {
            await axios.post(`/api/blogs/${id}/like`, JSON.stringify(user.email), {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchPostData(); // আপডেট কাউন্ট আনার জন্য
        } catch (err) { console.error(err); }
    };

    // --- Comment Handlers ---
    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        if (!user) return alert("Please login to comment");

        try {
            await axios.post(`/api/blogs/${id}/comment`, {
                userEmail: user.email,
                userName: user.name,
                text: newComment
            });
            setNewComment("");
            fetchPostData();
        } catch (err) { console.error(err); }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await axios.delete(`/api/blogs/comment/${commentId}`);
                fetchPostData();
            } catch (err) { console.error(err); }
        }
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await axios.put(`/api/blogs/comment/${commentId}`, JSON.stringify(editText), {
                headers: { 'Content-Type': 'application/json' }
            });
            setEditingCommentId(null);
            fetchPostData();
        } catch (err) { console.error(err); }
    };

    // --- Your Existing Cart Logic ---
    const handleIncrease = () => {
        if (buyQty < blog.quantity) {
            setBuyQty(buyQty + 1);
            setLimitError("");
        } else {
            setLimitError("You have reached the available limit");
        }
    };

    const handleDecrease = () => {
        setBuyQty(Math.max(1, buyQty - 1));
        setLimitError("");
    };

    const handleConfirm = () => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(item => item.id === blog.id);

        const cartItem = {
            id: blog.id,
            title: blog.title,
            price: blog.price,
            quantity: buyQty,
            image: blog.imageUrl,
            sellerEmail: blog.authorEmail
        };

        if (existingIndex > -1) {
            cart[existingIndex].quantity += buyQty;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        alert("Added to cart! Click the cart icon to complete purchase.");
    };

    const qtyBtnStyle = {
        backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000',
        width: '45px', height: '45px', borderRadius: '50%', fontSize: '1.5rem',
        fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
    };

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <Link to="/blog" style={{ color: '#a67c52', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Stories</Link>

            <div style={{ display: 'flex', gap: '50px', marginTop: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2 }}>
                    <img src={`http://localhost:5010${blog.imageUrl}`} alt={blog.title}
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '25px' }} />

                    <h1 style={{ fontSize: '2.5rem', margin: '20px 0 10px', color: '#000' }}>{blog.title}</h1>
                    <p style={{ color: '#a67c52', marginBottom: '10px' }}>By: {blog.authorName}</p>

                    {/* --- Like & Comment Count Bar --- */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#007bff' : '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {isLiked ? '👍 Liked' : '👍 Like'} ({likesCount})
                        </button>
                        <span style={{ color: '#666' }}>💬 {comments.length} Comments</span>
                    </div>

                    <hr style={{ margin: '20px 0', opacity: 0.1 }} />
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>{blog.content}</p>

                    {/* --- Comment Section UI --- */}
                    <div style={{ marginTop: '50px', borderTop: '2px solid #eee', paddingTop: '30px' }}>
                        <h3>Comments</h3>

                        {/* Comment Input */}
                        {user ? (
                            <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                                <textarea
                                    style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ddd', minHeight: '80px' }}
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button onClick={handleCommentSubmit} style={{ padding: '0 25px', backgroundColor: '#a67c52', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Post</button>
                            </div>
                        ) : <p><Link to="/login">Login</Link> to comment.</p>}

                        {/* Comments List */}
                        <div style={{ marginTop: '30px' }}>
                            {comments.map((c) => (
                                <div key={c.id} style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '15px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold', color: '#5d3111' }}>{c.userName}</span>

                                        {/* Edit/Delete buttons for Owner Only */}
                                        {user && user.email === c.userEmail && (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => { setEditingCommentId(c.id); setEditText(c.text); }} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                                                <button onClick={() => handleDeleteComment(c.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                            </div>
                                        )}
                                    </div>

                                    {editingCommentId === c.id ? (
                                        <div style={{ marginTop: '10px' }}>
                                            <textarea
                                                style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateComment(c.id)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', marginTop: '5px', cursor: 'pointer' }}>Save</button>
                                            <button onClick={() => setEditingCommentId(null)} style={{ background: 'none', border: 'none', marginLeft: '10px', cursor: 'pointer' }}>Cancel</button>
                                        </div>
                                    ) : (
                                        <p style={{ marginTop: '8px', color: '#444' }}>{c.text}</p>
                                    )}
                                    <small style={{ color: '#999' }}>{new Date(c.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Your Original Buyer Sidebar --- */}
                {user && user.role === 'Buyer' && (
                    <div style={{ flex: 1, background: '#fcf8f5', padding: '35px', borderRadius: '25px', height: 'fit-content', border: '1px solid #eee' }}>
                        <h2 style={{ color: '#5d3111', margin: '0 0 10px 0' }}>Price: BDT {blog.price}</h2>
                        <p style={{ color: '#666' }}>Stock: <strong style={{ color: '#28a745' }}>{blog.quantity}</strong></p>

                        <p style={{ color: '#666' }}>Category: <strong style={{ color: '#5d3111' }}>
                            {blog.isHandmadeShowpiece ? "Handmade Clay showpiece" :
                                blog.isClayCutlery ? "Clay Cutlery" : "General"}
                        </strong></p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', margin: '25px 0' }}>
                            <button onClick={handleDecrease} style={qtyBtnStyle}>-</button>
                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#000' }}>{buyQty}</span>
                            <button onClick={handleIncrease} style={qtyBtnStyle}>+</button>
                        </div>

                        {limitError && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '15px' }}>{limitError}</p>}

                        <div style={{ background: '#5d3111', color: 'white', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
                            Subtotal: <strong>{subtotal} BDT</strong>
                        </div>

                        <button onClick={handleConfirm} className="action-btn cart-btn">Confirm</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;