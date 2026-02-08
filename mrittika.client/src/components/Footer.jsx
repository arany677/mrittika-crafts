import React from 'react';

const Footer = () => (
    <footer className="footer-wrapper">
        <div className="container">
            <div className="footer-grid">
                <div>
                    <h2>Mrittika</h2>
                    <p>Handmade excellence from rural artisans. Bridging tradition and the modern world.</p>
                </div>
                <div>
                    <h3>Explore</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>Collection</li>
                        <li>Artisans</li>
                    </ul>
                </div>
                <div>
                    <h3>Support</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li>Feedback</li>
                        <li>Help Center</li>
                    </ul>
                </div>
                <div>
                    <h3>Contact</h3>
                    <p>admin@mrittika.com</p>
                </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: '40px', opacity: 0.4, fontSize: '0.8rem', borderTop: '1px solid #666', paddingTop: '20px' }}>
                © 2026 Mrittika Crafts. All Rights Reserved.
            </p>
        </div>
    </footer>
);

export default Footer;