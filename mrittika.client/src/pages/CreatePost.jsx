import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) { alert("Please select an image."); return; }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('authorName', user.name);
        formData.append('image', image);

        const res = await fetch('/api/blogs/create', {
            method: 'POST',
            body: formData // Note: No headers needed for FormData
        });

        if (res.ok) {
            alert("Sent to Admin!");
            navigate('/blog');
        }
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            <div className="auth-box" style={{ maxWidth: '600px' }}>
                <h1>Create New Post</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Title" required onChange={(e) => setTitle(e.target.value)} />

                    <label style={{ textAlign: 'left', display: 'block', fontSize: '0.8rem', color: '#666' }}>Upload Image (Mandatory)</label>
                    <input type="file" accept="image/*" required onChange={(e) => setImage(e.target.files[0])} />

                    <textarea rows="8" placeholder="Write your story..." required onChange={(e) => setContent(e.target.value)}
                        style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', color: '#000' }}></textarea>

                    <button type="submit" className="submit-btn">Submit for Approval</button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;