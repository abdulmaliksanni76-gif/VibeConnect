import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import './Chat.css';
import { Send } from 'lucide-react';

const Chat = () => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  // Get username from localStorage or prompt once
  const currentUser = localStorage.getItem("username") || "Guest"; 
  const conversationId = "default";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch(`http://localhost:5000/api/chat/${conversationId}`);
      const data = await res.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join_chat", conversationId);
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket, conversationId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msgData = { conversationId, sender: currentUser, text: input };
    const response = await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    if (response.ok) setInput("");
  };

  return (
    <div className="chat-app-container">
      <div className="messages-window">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`message-bubble ${m.sender === currentUser ? 'sent' : 'received'}`}
          >
            {/* This renders the name on top */}
            <span className="sender-name">{m.sender}</span>
            <p className="message-text">{m.text}</p>
          </div>
        ))}
      <div ref={messagesEndRef} style={{ float: "left", clear: "both" }} />
  </div>
      <div className="input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        
        {/* 2. Replace the button text with the icon */}
        <button onClick={sendMessage} className="send-btn">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;