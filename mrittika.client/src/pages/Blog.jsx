import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); // সার্চের জন্য নতুন স্টেট

    useEffect(() => {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error(err));
    }, []);

    // ফিল্টার এবং সার্চ লজিক একসাথে
    const filteredBlogs = blogs.filter(blog => {
        // ১. ক্যাটাগরি চেক
        const matchesCategory =
            filter === 'All' ||
            (filter === 'Showpiece' && blog.isHandmadeShowpiece) ||
            (filter === 'Cutlery' && blog.isClayCutlery);

        // ২. সার্চ টার্ম চেক (টাইটেল অথবা কন্টেন্টের ভেতর আছে কি না)
        const matchesSearch =
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <h1 className="page-title">Crafting Stories</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                Explore the art of handmade terracotta.
            </p>

            {/* সার্চ এবং ফিল্টার কন্টেইনার */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
                flexWrap: 'wrap',
                gap: '20px'
            }}>
                {/* সার্চ বার (বাম পাশে) */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search products (e.g. water, pot)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 25px',
                            borderRadius: '30px',
                            border: '2px solid #eee',
                            outline: 'none',
                            fontSize: '1rem',
                            transition: 'border-color 0.3s',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#a67c52'}
                        onBlur={(e) => e.target.style.borderColor = '#eee'}
                    />
                </div>

                {/* ক্যাটাগরি ফিল্টার (ডান পাশে) */}
                <div style={{ position: 'relative' }}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '12px 45px 12px 25px',
                            borderRadius: '30px',
                            border: '2px solid #a67c52',
                            backgroundColor: '#fff',
                            color: '#a67c52',
                            fontWeight: '600',
                            cursor: 'pointer',
                            outline: 'none',
                            appearance: 'none',
                            minWidth: '250px',
                            fontSize: '1rem'
                        }}
                    >
                        <option value="All">All Categories</option>
                        <option value="Showpiece">Handmade Clay Showpiece</option>
                        <option value="Cutlery">Clay Cutlery</option>
                    </select>
                    <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#a67c52' }}>▼</span>
                </div>
            </div>

            {/* প্রোডাক্ট গ্রিড */}
            <div className="blog-grid">
                {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blog => (
                        <div key={blog.id} className="blog-card">
                            <div className="blog-img-box">
                                <img src={`http://localhost:5010${blog.imageUrl}`} alt={blog.title} />
                            </div>
                            <div className="blog-info">
                                <h3 style={{ marginBottom: '5px' }}>{blog.title}</h3>
                                <span style={{ fontSize: '0.75rem', color: '#a67c52', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>
                                    {blog.isHandmadeShowpiece ? "Showpiece" : "Cutlery"}
                                </span>
                                <p>{blog.content.substring(0, 60)}...</p>
                                <Link to={`/blog/${blog.id}`} className="see-more-link">
                                    See more &rarr;
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    // রেজাল্ট না থাকলে এই মেসেজ দেখাবে
                    <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '100px 0' }}>
                        <h2 style={{ color: '#ccc' }}>No products found at this moment.</h2>
                        <p style={{ color: '#999' }}>Try searching with a different keyword.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;