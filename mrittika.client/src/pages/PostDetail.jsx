import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
    const { id } = useParams(); // Gets the ID from the URL
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        fetch(`/api/blogs/${id}`)
            .then(res => res.json())
            .then(data => setBlog(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!blog) return <div className="container" style={{ padding: '100px 0' }}>Loading...</div>;

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <Link to="/blog" style={{ color: '#a67c52', textDecoration: 'none' }}>&larr; Back to Stories</Link>

            <div style={{ marginTop: '30px' }}>
                <img
                    src={`http://localhost:5010${blog.imageUrl}`}
                    alt={blog.title}
                    style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '25px' }}
                />
                <h1 style={{ fontSize: '3rem', margin: '30px 0 10px', color: '#222' }}>{blog.title}</h1>
                <p style={{ color: '#a67c52', fontWeight: '600' }}>By: {blog.authorName}</p>
                <hr style={{ margin: '30px 0', opacity: 0.1 }} />
                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>
                    {blog.content}
                </p>
            </div>
        </div>
    );
};

export default PostDetail;