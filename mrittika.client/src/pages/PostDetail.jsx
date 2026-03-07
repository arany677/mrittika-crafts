import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = ({ user }) => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [buyQty, setBuyQty] = useState(1);
    const [limitError, setLimitError] = useState("");

    useEffect(() => {
        fetch(`/api/blogs/${id}`)
            .then(res => res.json())
            .then(data => setBlog(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!blog) return <div className="container" style={{ padding: '100px 0' }}>Loading...</div>;

    const subtotal = buyQty * blog.price;

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
            sellerEmail: blog.authorEmail // CRITICAL: Links order to seller
        };

        if (existingIndex > -1) {
            cart[existingIndex].quantity += buyQty;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); // Update Navbar Icon
        alert("Added to cart! Click the cart icon to complete purchase.");
    };

    const qtyBtnStyle = {
        backgroundColor: '#ffffff',
        color: '#000000',
        border: '2px solid #000',
        width: '45px', height: '45px',
        borderRadius: '50%', fontSize: '1.5rem',
        fontWeight: 'bold', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    };

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <Link to="/blog" style={{ color: '#a67c52', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Stories</Link>

            <div style={{ display: 'flex', gap: '50px', marginTop: '30px', flexWrap: 'wrap' }}>
                <div style={{ flex: 2 }}>
                    <img src={`http://localhost:5010${blog.imageUrl}`} alt={blog.title}
                        style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '25px' }} />
                    <h1 style={{ fontSize: '2.5rem', margin: '20px 0 10px', color: '#000' }}>{blog.title}</h1>
                    <p style={{ color: '#a67c52' }}>By: {blog.authorName}</p>
                    <hr style={{ margin: '30px 0', opacity: 0.1 }} />
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>{blog.content}</p>
                </div>

                {user && user.role === 'Buyer' && (
                    <div style={{ flex: 1, background: '#fcf8f5', padding: '35px', borderRadius: '25px', height: 'fit-content', border: '1px solid #eee' }}>
                        <h2 style={{ color: '#5d3111', margin: '0 0 10px 0' }}>Price: BDT {blog.price}</h2>
                        <p style={{ color: '#666' }}>Stock: <strong style={{ color: '#28a745' }}>{blog.quantity}</strong></p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '25px', margin: '25px 0' }}>
                            <button onClick={handleDecrease} style={qtyBtnStyle}>-</button>
                            <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#000' }}>{buyQty}</span>
                            <button onClick={handleIncrease} style={qtyBtnStyle}>+</button>
                        </div>

                        {limitError && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '15px' }}>{limitError}</p>}

                        <div style={{ background: '#5d3111', color: 'white', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
                            Subtotal: <strong>{subtotal} BDT</strong>
                        </div>

                        {/* RENAME TO CONFIRM */}
                        <button onClick={handleConfirm} className="action-btn cart-btn">Confirm</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;