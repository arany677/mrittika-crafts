import React from 'react';

const Home = () => (
    <div className="container">
        <section className="hero">
            <div className="hero-content">
                <h1>We Make Top Quality Handmade Products</h1>
                <p>Welcome to Mrittika! Tradition meets creativity in every clay masterpiece. Discover the beauty of handcrafted artistry.</p>
                <button className="sign-in-btn" style={{ padding: '15px 35px', fontSize: '1rem' }}>View Collection &gt;</button>
            </div>
            <div className="hero-images">
                {/* Image 1: Staggered Down */}
                <div className="img-box stagger-down">
                    <img src="/hero1.jpg" alt="1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                {/* Image 2: Normal Height */}
                <div className="img-box">
                    <img src="/hero2.jpg" alt="2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>
        </section>
    </div>
);

export default Home;