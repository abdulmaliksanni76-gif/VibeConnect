import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import './Chat.css';
import { formatTimestamp } from '../components/dateUtils';

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null); 
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    fetch(`http://localhost:5000/api/chat/messages/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()).then(setMessages);

    fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Full Chat Data:", data); 
    setChatData(data);
  });

    if (socket) {
      socket.emit("join_chat", conversationId);
      const handler = (msg) => setMessages(prev => [...prev, msg]);
      socket.on("receive_message", handler);
      return () => socket.off("receive_message", handler);
    }
  }, [conversationId, socket]);

  useEffect(scrollToBottom, [messages]);

  const otherParticipant = chatData?.participants?.find(
    (p) => p.username !== localStorage.getItem("username")
  );

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ conversationId, text: input })
    });
    setInput("");
    window.dispatchEvent(new Event('chat_updated'));
  };

  const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const date = new Date(message.createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="chat-app-container">
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
        <div className="user-info">
          <h3>{otherParticipant?.username || "Chat"}</h3>
          <span className="status">Online</span>
        </div>
      </div>
      
      <div className="messages-window">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="date-group">
            
            <div className="date-divider">
              <span>{date === new Date().toDateString() ? "Today" : date}</span>
            </div>

            {msgs.map((m, i) => (
              <div key={i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
                <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
                  <p className="m-0">{m.text}</p>
                  <span className="msg-time">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
      </div>
    </div>
  );
};
export default Chat;