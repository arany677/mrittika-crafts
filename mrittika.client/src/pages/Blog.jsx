import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <h1 className="page-title">Crafting Stories</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '50px' }}>Explore the art of handmade terracotta.</p>

            <div className="blog-grid">
                {blogs.map(blog => (
                    <div key={blog.id} className="blog-card">
                        <div className="blog-img-box">
                            <img src={`http://localhost:5010${blog.imageUrl}`} alt={blog.title} />
                        </div>
                        <div className="blog-info">
                            <h3>{blog.title}</h3>
                            {/* Showing a small preview of the text */}
                            <p>{blog.content.substring(0, 60)}...</p>
                            <Link to={`/blog/${blog.id}`} className="see-more-link">
                                See more &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;