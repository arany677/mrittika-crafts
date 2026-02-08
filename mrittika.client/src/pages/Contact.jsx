import React from 'react';

const Contact = () => (
    <div className="container" style={{ padding: '80px 0', minHeight: '70vh' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Contact Us</h1>
        <form className="auth-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input type="text" placeholder="Your Name" required style={{ color: '#000' }} />
            <input type="email" placeholder="Your Email" required style={{ color: '#000' }} />
            <textarea rows="6" placeholder="Your Message"
                style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', color: '#000' }} required>
            </textarea>
            <button type="submit" className="submit-btn">Send Message</button>
        </form>
    </div>
);

export default Contact;