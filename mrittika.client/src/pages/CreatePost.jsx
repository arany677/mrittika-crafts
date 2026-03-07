import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [selectedType, setSelectedType] = useState('Handmade Clay showpiece');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // FIXED: Declare formData ONLY ONCE
        const formData = new FormData();

        formData.append("title", title);
        formData.append("content", content);
        formData.append("authorName", user.name);
        formData.append("authorEmail", user.email); // Sending the email for notifications
        formData.append("image", image);
        formData.append("price", price);
        formData.append("quantity", quantity);
        formData.append("selectedType", selectedType);

        try {
            const res = await fetch('/api/blogs/create', {
                method: 'POST',
                body: formData // No headers needed for FormData
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                navigate('/blog'); // Take them back to blog page
            } else {
                alert(data.message || "Error creating post");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Connection error. Is the server running?");
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-box" style={{ maxWidth: '600px' }}>
                <h1 className="page-title">Create New Post</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="number" placeholder="Price" required value={price} onChange={(e) => setPrice(e.target.value)} />
                        <input type="number" placeholder="Quantity" required value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>

                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="auth-input" style={{ width: '100%', padding: '12px', borderRadius: '8px' }}>
                        <option value="Handmade Clay showpiece">Handmade Clay showpiece</option>
                        <option value="Clay Cutlery">Clay Cutlery</option>
                    </select>

                    <label style={{ textAlign: 'left', fontSize: '0.8rem', color: '#666' }}>Upload Image</label>
                    <input type="file" required onChange={(e) => setImage(e.target.files[0])} />

                    <textarea placeholder="Write your story..." rows="6" required value={content} onChange={(e) => setContent(e.target.value)}
                        style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', color: '#000' }}></textarea>

                    <button type="submit" className="submit-btn">Submit for Approval</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;