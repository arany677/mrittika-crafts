import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Put your API key here. If the API works, it will be even smarter. 
// If it fails (404), this local logic is now 100% accurate.
const genAI = new GoogleGenerativeAI("AIzaSyD5uuqzERRhohYV289Hb9bzJ9c1sGzYjUs");

const AskAnything = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I am Mrittika's AI Assistant. How can I help you with our pottery services today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    // --- SENIOR LEAD'S PRIORITY LOGIC ---
    const getLocalSmartAnswer = (query) => {
        const q = query.toLowerCase();

        // 1. HIGHEST PRIORITY: BUYING PROCESS
        if (q.includes("buy") || q.includes("purchase") || q.includes("buying") || q.includes("how to get")) {
            return "To buy products on Mrittika: \n• Browse our collection in the Blog section. \n• Click on a product to see details. \n• Add the item to your Shopping Cart. \n• Click the Cart icon in the navbar to Checkout. \n• We offer Cash on Delivery for all handmade items!";
        }

        // 2. HIGHEST PRIORITY: SELLING PROCESS
        if (q.includes("sell") || q.includes("become a seller") || q.includes("be a seller") || q.includes("create post")) {
            return "To sell on Mrittika: \n• You must log in with a 'Seller' account. \n• Click the '+ Create Post' button in the navbar. \n• Upload images of your pottery, set a price, and add a description. \n• Your products will then be visible to all buyers on the platform!";
        }

        // 3. HIGH PRIORITY: DELIVERY
        if (q.includes("delivery") || q.includes("shipping") || q.includes("ship") || q.includes("courier") || q.includes("receive")) {
            return "Our Delivery Process: \n• We package fragile pottery with double-layered bubble wrap. \n• Delivery usually takes 3-5 business days. \n• You can track your order status in your profile. \n• Shipping costs are calculated based on weight and location.";
        }

        // 4. MEDIUM PRIORITY: BENEFITS
        if (q.includes("benefit") || q.includes("advantage") || q.includes("why mrittika")) {
            return "Benefits of Mrittika: \n• Direct support for local grassroots artisans. \n• Authentic 100% handmade clay and terracotta. \n• Eco-friendly and sustainable home decor. \n• Safe shipping for fragile ceramic items.";
        }

        // 5. LOW PRIORITY: PRODUCT INFO
        if (q.includes("product") || q.includes("item") || q.includes("vase") || q.includes("pot") || q.includes("ceramic") || q.includes("clay")) {
            return "We offer a variety of handmade pottery, including: \n• Terracotta Flower Vases \n• Ceramic Dinner Sets \n• Clay Cooking Pots \n• Traditional Home Decor Statues.";
        }

        // 6. LOW PRIORITY: ABOUT/WHO
        if (q.includes("about") || q.includes("who are you") || q.includes("mrittika") || q.includes("website")) {
            return "Mrittika is a specialized platform for handmade pottery. We bridge the gap between rural artisans and urban art lovers through traditional craftsmanship.";
        }

        // 7. IRRELEVANT CHECK (STRICT)
        const relevantKeywords = ["clay", "pottery", "handmade", "artisan", "ceramic", "order", "price", "buy", "sell", "delivery", "mrittika", "help", "about", "benefit"];
        const isRelevant = relevantKeywords.some(key => q.includes(key));

        if (!isRelevant) {
            return "This is not a relevant question for this website. Please ask about Mrittika's products, the buying/selling process, or our delivery services.";
        }

        return null;
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");

        // Check local brain first
        const localAnswer = getLocalSmartAnswer(currentInput);
        if (localAnswer) {
            setTimeout(() => {
                setMessages(prev => [...prev, { text: localAnswer, isBot: true }]);
            }, 600);
            return;
        }

        // Try API if it's relevant but not in quick-match
        setIsTyping(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(`Context: Mrittika Pottery Website. User asks: ${currentInput}`);
            const response = await result.response;
            setMessages(prev => [...prev, { text: response.text(), isBot: true }]);
        } catch (error) {
            console.error("API 404/Error, fallback to general help.");
            setMessages(prev => [...prev, {
                text: "I am Mrittika's Assistant. I can tell you about our products, how to buy/sell, or delivery info. What would you like to know?",
                isBot: true
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#a67c52', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Mrittika AI Assistant</h2>

            <div style={{
                height: '450px', borderRadius: '15px', overflowY: 'auto',
                padding: '25px', backgroundColor: '#333', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                whiteSpace: 'pre-line'
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.isBot ? 'left' : 'right', marginBottom: '20px' }}>
                        <div style={{
                            display: 'inline-block', padding: '12px 18px', borderRadius: '15px',
                            backgroundColor: m.isBot ? '#444' : '#a67c52',
                            color: '#fff', maxWidth: '85%', fontSize: '0.95rem', lineHeight: '1.6'
                        }}>
                            {m.text}
                        </div>
                    </div>
                ))}
                {isTyping && <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '10px' }}>Thinking...</div>}
                <div ref={chatEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <input
                    style={{ flex: 1, padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#333', color: '#fff', outline: 'none' }}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., How to buy? Tell me about delivery."
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    style={{ padding: '0 30px', backgroundColor: '#a67c52', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default AskAnything;