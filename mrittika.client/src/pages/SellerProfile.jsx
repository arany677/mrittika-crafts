import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerProfile = ({ user }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (user && user.email) {
            // ব্যাকএন্ডের ফুল URL ব্যবহার করছি
            axios.get(`http://localhost:5010/api/sellers/profile/${user.email}`)
                .then(res => setData(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    if (!data) return <div className="loading">Loading Profile...</div>;

    return (
        <div className="profile-wrapper">
            {/* সেলার ইনফো সেকশন - শুধু নাম এবং ইমেইল রাখা হয়েছে */}
            <div className="seller-info-section">
                <p><strong>Name:</strong> {data.seller.name}</p>
                <p><strong>Email:</strong> {data.seller.email}</p>
            </div>

            <div className="items-divider">
                <span>Items</span>
            </div>

            {/* আইটেম গ্রিড সেকশন */}
            <div className="items-grid">
                {data.items.map((item) => (
                    <div key={item.id} className="modern-item-card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '280px',
                        border: '1px solid #eee',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        backgroundColor: '#fff'
                    }}>
                        {/* ছবির অংশ */}
                        <div style={{ width: '100%', height: '200px', backgroundColor: '#f5f5f5' }}>
                            <img
                                src={`http://localhost:5010${item.imageUrl}`}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        {/* টেক্সট অংশ */}
                        <div style={{ padding: '15px' }}>
                            <h3 style={{ margin: '0', fontSize: '1.2rem', color: '#000' }}>{item.title}</h3>
                            <p style={{ margin: '5px 0', color: '#a67c52', fontWeight: 'bold' }}>BDT {item.price}</p>

                            {/* Sold & Remained সেকশন */}
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f0f0f0' }}>
                                <p style={{ margin: '3px 0', fontSize: '1rem' }}>
                                    <strong>Sold:</strong> {item.sold}
                                </p>
                                <p style={{ margin: '3px 0', fontSize: '1rem' }}>
                                    <strong>Remained:</strong> {item.remained}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerProfile;