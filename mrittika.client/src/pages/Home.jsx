import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <section className="hero">
                <div className="hero-content">
                    <h1>We Make Top Quality Handmade Products</h1>
                    <p>Welcome to Mrittika! Tradition meets creativity in every clay masterpiece. Discover the beauty of handcrafted artistry.</p>
                    <button className="sign-in-btn" style={{ padding: '15px 35px', fontSize: '1rem' }}>View Collection &gt;</button>
                </div>
                <div className="hero-images">
                    <div className="img-box stagger-down">
                        <img src="/hero1.jpg" alt="1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="img-box">
                        <img src="/hero2.jpg" alt="2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                </div>
            </section>

            {/* --- FLOATING AI CHAT ICON --- */}
            <div
                onClick={() => navigate('/contact')}
                style={{
                    position: 'fixed', bottom: '30px', right: '30px',
                    backgroundColor: '#a67c52', width: '65px', height: '65px',
                    borderRadius: '50%', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1000, transition: '0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <MessageCircle color="white" size={32} />
            </div>
        </div>
    );
};

export default Home;