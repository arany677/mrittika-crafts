import React, { useState, useEffect } from 'react';

const SellerOrders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.email) {
            fetch(`/api/orders/seller-notifications/${user.email}`)
                .then(res => {
                    if (!res.ok) throw new Error("Server error fetching orders");
                    return res.json();
                })
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading orders...</div>;

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <h1 className="page-title" style={{ color: '#000' }}>Incoming Orders</h1>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>Details of customers who want to buy your crafts.</p>

            <div style={{ marginTop: '20px' }}>
                {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: '#f9f9f9', borderRadius: '20px' }}>
                        <p style={{ color: '#999' }}>No orders received yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {orders.map((order, index) => (
                            <div key={index} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '15px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                <div>
                                    <h3 style={{ color: '#a67c52', marginBottom: '5px' }}>{order.productName}</h3>
                                    <p style={{ color: '#000' }}>Quantity: <strong>{order.quantity}</strong></p>
                                    <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '5px' }}>Buyer: {order.buyerEmail}</p>
                                </div>
                                <div style={{ textAlign: 'right', borderLeft: '1px solid #eee', paddingLeft: '20px' }}>
                                    <p style={{ color: '#000' }}><strong>Deliver to:</strong> {order.location}</p>
                                    <p style={{ color: '#000' }}><strong>Contact:</strong> {order.phone}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '10px' }}>
                                        Ordered: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;