import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const user = JSON.parse(sessionStorage.getItem('mrittika_user'));

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user) return;
            try {
                const res = await axios.get(`/api/contact/notifications/${user.role}/${user.email}`);
                // Count ONLY messages where isRead is false
                const unread = res.data.filter(m => m.isRead === false).length;
                setCount(unread);
            } catch (err) {
                console.error("Error fetching count", err);
            }
        };

        fetchUnreadCount();

        // Listener to clear count when user views the notification page
        const handleSeen = () => setCount(0);
        window.addEventListener('notificationsSeen', handleSeen);

        const interval = setInterval(fetchUnreadCount, 30000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('notificationsSeen', handleSeen);
        };
    }, [user]);

    return (
        <div style={{ position: 'relative', cursor: 'pointer', padding: '8px' }} onClick={() => navigate('/notifications')}>
            <Bell color="#a67c52" size={26} />
            {count > 0 && (
                <span style={{
                    position: 'absolute', top: '0', right: '0',
                    backgroundColor: 'red', color: 'white', fontSize: '10px',
                    fontWeight: 'bold', borderRadius: '50%', height: '18px', width: '18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid white'
                }}>
                    {count}
                </span>
            )}
        </div>
    );
};

export default NotificationBell;