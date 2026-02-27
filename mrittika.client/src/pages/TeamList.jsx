import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const TeamList = () => {
    const [team, setTeam] = useState([]);

    useEffect(() => {
        fetch('/api/teammembers')
            .then(res => res.json())
            .then(data => setTeam(data))
            .catch(err => console.error("Error fetching team:", err));
    }, []);

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            {/* --- Centered Heading --- */}
            <h1 className="page-title">Admin View: Team Members</h1>
            <p className="page-subtitle">This is the official list of registered team members.</p>

            {team.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999' }}>No team members found.</p>
            ) : (
                <div className="blog-grid">
                    {team.map(m => (
                        <div key={m.id} className="blog-card" style={{ padding: '30px', textAlign: 'center', borderRadius: '25px' }}>
                            <div style={{ width: '120px', height: '120px', margin: '0 auto 15px', borderRadius: '50%', overflow: 'hidden', border: '3px solid #f0f0f0' }}>
                                <img src={`http://localhost:5010${m.imageUrl || '/image.png'}`} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            <h3 style={{ color: '#222', marginBottom: '5px' }}>{m.name}</h3>
                            <p style={{ color: '#a67c52', fontWeight: 'bold', fontSize: '0.9rem' }}>{m.jobStatus}</p>
                            <p style={{ fontSize: '0.8rem', color: '#888', margin: '10px 0' }}>{m.city}</p>

                            <hr style={{ margin: '20px 0', opacity: 0.1 }} />

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                                {m.fbLink && <a href={m.fbLink} target="_blank" rel="noreferrer" style={{ color: '#1877F2', fontSize: '1.2rem' }}><FaFacebook /></a>}
                                {m.instaLink && <a href={m.instaLink} target="_blank" rel="noreferrer" style={{ color: '#E4405F', fontSize: '1.2rem' }}><FaInstagram /></a>}
                                {m.linkedinLink && <a href={m.linkedinLink} target="_blank" rel="noreferrer" style={{ color: '#0A66C2', fontSize: '1.2rem' }}><FaLinkedin /></a>}
                                <a href={`mailto:${m.email}`} style={{ color: '#666', fontSize: '1.2rem' }}><FaEnvelope /></a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamList;