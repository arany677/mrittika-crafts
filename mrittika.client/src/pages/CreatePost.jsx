import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    // ড্রপডাউন স্টেট
    const [isOpen, setIsOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('Select Type');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedType === 'Select Type') { alert("Please select a type"); return; }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('authorName', user.name);
        formData.append('image', image);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('selectedType', selectedType); // এটি কন্ট্রোলারে যাবে

        const res = await fetch('/api/blogs/create', { method: 'POST', body: formData });
        if (res.ok) { alert("Sent to Admin!"); navigate('/blog'); }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-box" style={{ maxWidth: '600px' }}>
                <h1>Create New Post</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" required onChange={(e) => setTitle(e.target.value)} />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" placeholder="Price" required onChange={(e) => setPrice(e.target.value)} />
                        <input type="number" placeholder="Quantity" required onChange={(e) => setQuantity(e.target.value)} />
                    </div>

                    {/* কাস্টম ড্রপডাউন ডিজাইন */}
                    <div style={{ position: 'relative', marginBottom: '15px' }}>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                background: '#000', color: '#fff', padding: '15px', borderRadius: '5px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                            }}
                        >
                            <span>{selectedType === 'Select Type' ? 'Type' : selectedType}</span>
                            <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>▼</span>
                        </div>

                        {isOpen && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, width: '100%', background: '#000',
                                borderTop: '1px solid #444', zIndex: 10, borderRadius: '0 0 5px 5px'
                            }}>
                                <div
                                    className="type-option"
                                    onClick={() => { setSelectedType('Handmade Clay showpiece'); setIsOpen(false); }}
                                    style={{ padding: '12px', color: '#fff', borderBottom: '1px solid #333', cursor: 'pointer' }}
                                >
                                    Handmade Clay showpiece
                                </div>
                                <div
                                    className="type-option"
                                    onClick={() => { setSelectedType('Clay Cutlery'); setIsOpen(false); }}
                                    style={{ padding: '12px', color: '#fff', cursor: 'pointer' }}
                                >
                                    Clay Cutlery
                                </div>
                            </div>
                        )}
                    </div>

                    <label style={{ textAlign: 'left', display: 'block', fontSize: '0.8rem', color: '#666' }}>Upload Image</label>
                    <input type="file" accept="image/*" required onChange={(e) => setImage(e.target.files[0])} />

                    <textarea rows="6" placeholder="Write your story..." required onChange={(e) => setContent(e.target.value)}
                        style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd' }}></textarea>

                    <button type="submit" className="submit-btn">Submit for Approval</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;