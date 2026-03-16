import React, { useState, useEffect, useRef } from 'react';

const AskAnything = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I am Mrittika's AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userQuery = input;
        setMessages(prev => [...prev, { text: userQuery, isBot: false }]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch('/api/chatbot/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userQuery })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { text: "I'm having trouble connecting to my brain. Ask me about buying or selling pottery!", isBot: true }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#a67c52', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Mrittika AI Assistant</h2>

            <div style={{
                height: '450px', borderRadius: '25px', overflowY: 'auto',
                padding: '25px', backgroundColor: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-line', border: '1px solid #eee'
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.isBot ? 'left' : 'right', marginBottom: '20px' }}>
                        <div style={{
                            display: 'inline-block', padding: '12px 18px', borderRadius: '18px',
                            backgroundColor: m.isBot ? '#f0f0f0' : '#a67c52',
                            color: m.isBot ? '#333' : '#fff',
                            maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.6'
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '10px' }}>Assistant is thinking...</div>}
                <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input
                    style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', color: '#000', backgroundColor: '#fff' }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} style={{ padding: '0 30px', backgroundColor: '#a67c52', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default AskAnything;