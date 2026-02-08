import React from 'react';

const Home = () => (
    <div className="container">
        <section className="hero">
            <div className="hero-content">
                <h1>We Make Top Quality Handmade Products</h1>
                <p>Welcome to Mrittika! Tradition meets creativity in every clay masterpiece.</p>
                <button className="sign-in-btn" style={{ padding: '15px 30px' }}>View Collection &gt;</button>
            </div>
            <div className="hero-images">
                <div className="img-box stagger-down"><img src="/hero1.jpg" alt="1" /></div>
                <div className="img-box"><img src="/hero2.jpg" alt="2" /></div>
            </div>
        </section>
    </div>
);

export default Home;