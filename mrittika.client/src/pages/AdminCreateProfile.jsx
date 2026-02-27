import React, { useState, useEffect } from 'react';

const AdminCreateProfile = () => {
    const [members, setMembers] = useState([]);
    const [editId, setEditId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '', jobStatus: '', email: '', city: '', address: '',
        fbLink: '', instaLink: '', linkedinLink: '', workDescription: ''
    });

    const loadMembers = () => fetch('/api/teammembers').then(res => res.json()).then(data => setMembers(data));
    useEffect(() => { loadMembers(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'id' && key !== 'imageUrl') {
                data.append(key, formData[key] || "");
            }
        });
        if (imageFile) data.append("imageFile", imageFile);

        const url = editId ? `/api/teammembers/${editId}` : '/api/teammembers';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, { method: method, body: data });

        if (res.ok) {
            alert(editId ? "Profile Updated!" : "Profile Created!");
            resetForm();
            loadMembers();
        }
    };

    const resetForm = () => {
        setEditId(null);
        setImageFile(null);
        setFormData({ name: '', jobStatus: '', email: '', city: '', address: '', fbLink: '', instaLink: '', linkedinLink: '', workDescription: '' });
    };

    const handleEdit = (m) => {
        setEditId(m.id);
        setFormData(m);
        window.scrollTo(0, 0);
    };

    return (
        <div className="container" style={{ padding: '60px 0' }}>
            {/* --- Centered Heading --- */}
            <h1 className="page-title">{editId ? "Edit Team Profile" : "Create Team Profile"}</h1>

            <form className="auth-box" style={{ maxWidth: '600px', margin: '0 auto' }} onSubmit={handleSubmit}>
                <div className="auth-form">
                    <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input type="text" placeholder="Job Status (e.g. Student)" value={formData.jobStatus} onChange={e => setFormData({ ...formData, jobStatus: e.target.value })} required />
                    <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                    <input type="text" placeholder="Full Address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />

                    <div style={{ textAlign: 'left', marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.8rem', color: '#666' }}>Profile Picture:</label>
                        <input type="file" onChange={e => setImageFile(e.target.files[0])} />
                    </div>

                    <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <input type="text" placeholder="LinkedIn URL" value={formData.linkedinLink} onChange={e => setFormData({ ...formData, linkedinLink: e.target.value })} />
                    <input type="text" placeholder="Facebook URL" value={formData.fbLink} onChange={e => setFormData({ ...formData, fbLink: e.target.value })} />
                    <input type="text" placeholder="Instagram URL" value={formData.instaLink} onChange={e => setFormData({ ...formData, instaLink: e.target.value })} />
                    <textarea placeholder="Work Description" rows="4" value={formData.workDescription} onChange={e => setFormData({ ...formData, workDescription: e.target.value })} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', color: '#000' }}></textarea>

                    <button type="submit" className="submit-btn">{editId ? "Update" : "Create"}</button>
                    {editId && <button type="button" onClick={resetForm} style={{ background: '#999', marginTop: '10px' }} className="submit-btn">Cancel Edit</button>}
                </div>
            </form>

            <h2 style={{ marginTop: '60px', textAlign: 'center' }}>Team List</h2>
            <div className="blog-grid" style={{ marginTop: '30px' }}>
                {members.map(m => (
                    <div key={m.id} className="blog-card" style={{ padding: '20px', textAlign: 'center' }}>
                        <img src={`http://localhost:5010${m.imageUrl || '/image.png'}`} alt="profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '15px', border: '2px solid #eee' }} />
                        <h3 style={{ color: '#000' }}>{m.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#a67c52', fontWeight: 'bold' }}>{m.jobStatus}</p>
                        <button className="sign-in-btn" style={{ marginTop: '15px', width: '100%' }} onClick={() => handleEdit(m)}>Edit Profile</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCreateProfile;