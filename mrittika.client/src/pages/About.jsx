import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa'; // Import Logos

const About = () => {
    const [team, setTeam] = useState([]);

    useEffect(() => {
        fetch('/api/teammembers').then(res => res.json()).then(data => setTeam(data));
    }, []);

    return (
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
            <h1 className="page-title">Meet Our Team</h1>

            <div className="blog-grid" style={{ marginTop: '40px' }}>
                {team.map(m => (
                    <div key={m.id} className="blog-card" style={{ padding: '30px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                        {/* Profile Pic */}
                        <div style={{ width: '120px', height: '120px', margin: '0 auto 20px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #a67c52' }}>
                            <img src={`http://localhost:5010${m.imageUrl}`} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <h2 style={{ color: '#222', fontSize: '1.5rem' }}>{m.name}</h2>
                        <p style={{ color: '#a67c52', fontWeight: '600', fontSize: '0.9rem', marginBottom: '10px' }}>{m.jobStatus}</p>
                        <p style={{ fontSize: '0.85rem', color: '#777', lineHeight: '1.6' }}>{m.workDescription}</p>

                        {/* Social Icons Section */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
                            {m.fbLink && <a href={m.fbLink} target="_blank" rel="noreferrer" style={{ color: '#1877F2', fontSize: '1.5rem' }}><FaFacebook /></a>}
                            {m.instaLink && <a href={m.instaLink} target="_blank" rel="noreferrer" style={{ color: '#E4405F', fontSize: '1.5rem' }}><FaInstagram /></a>}
                            {m.linkedinLink && <a href={m.linkedinLink} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', fontSize: '1.5rem' }}><FaLinkedin /></a>}
                            <a href={`mailto:${m.email}`} style={{ color: '#666', fontSize: '1.5rem' }}><FaEnvelope /></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default About;