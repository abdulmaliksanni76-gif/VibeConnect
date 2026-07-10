import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2 } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const longPressTimer = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const showMenu = (e, messageId, senderId) => {
    if (senderId !== localStorage.getItem("userId")) return;
    e.preventDefault();
    setMenu({ visible: true, x: e.clientX, y: e.clientY, messageId });
  };

  const startEdit = (messageId) => {
    const msg = messages.find(m => m._id === messageId);
    if (msg) {
      setInput(msg.text);
      setEditingMessageId(messageId);
      setMenu({ visible: false, x: 0, y: 0, messageId: null });
      inputRef.current?.focus();
    }
  };

  const deleteMessage = async (messageId) => {
  const res = await fetch(`http://localhost:5000/api/chat/message/${messageId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  
  if (res.ok) {
    setMessages(prev => prev.filter(m => m._id !== messageId));
    setMenu({ visible: false, x: 0, y: 0, messageId: null });
    window.dispatchEvent(new Event('chat_updated'));
  }
};

  useEffect(() => {
    fetch(`http://localhost:5000/api/chat/messages/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()).then(setMessages);

    fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()).then(setChatData);

    if (socket) {
      socket.emit("join_chat", conversationId);
      socket.emit("user_connected", localStorage.getItem("userId"));

      const handleReceive = (msg) => {
        setMessages(prev => prev.find(m => m._id === msg._id) ? prev : [...prev, msg]);
        window.dispatchEvent(new Event('chat_updated'));
        if (msg.sender._id !== localStorage.getItem("userId")) {
          socket.emit("mark_delivered", { messageId: msg._id, senderId: msg.sender._id });
        }
      };

      const handleDelivered = (msgId) => setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));
      const handleUpdated = (updatedMsg) => setMessages(prev => prev.map(m => m._id === updatedMsg._id ? { ...m, ...updatedMsg } : m));
      const handleDeleted = (msgId) => setMessages(prev => prev.filter(m => m._id !== msgId));

      socket.on("receive_message", handleReceive);
      socket.on("message_delivered", handleDelivered);
      socket.on("message_updated", handleUpdated);
      socket.on("message_deleted", handleDeleted);
      socket.on("get_online_users", setOnlineUsers);
      
      return () => {
        socket.off("receive_message", handleReceive);
        socket.off("message_delivered", handleDelivered);
        socket.off("message_updated", handleUpdated);
        socket.off("message_deleted", handleDeleted);
        socket.off("get_online_users", setOnlineUsers);
      };
    }
  }, [conversationId, socket]);

  useEffect(scrollToBottom, [messages]);
  
  const sendMessage = async () => {
  if (!input.trim()) return;
  
  if (editingMessageId) {
    const res = await fetch(`http://localhost:5000/api/chat/message/${editingMessageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ text: input })
    });
    
    if (res.ok) {
      setMessages(prev => prev.map(m => m._id === editingMessageId ? { ...m, text: input } : m));
      setEditingMessageId(null);
      window.dispatchEvent(new Event('chat_updated'));
    }
  } else {
    // Normal send
    await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ conversationId, text: input })
    });
    window.dispatchEvent(new Event('chat_updated'));
  }
  setInput("");
};

  const otherParticipant = chatData?.participants?.find(p => String(p._id) !== String(localStorage.getItem("userId")));
  const isOnline = onlineUsers.includes(otherParticipant?._id);
  const groupedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="chat-app-container" onClick={() => setMenu({ ...menu, visible: false })}>
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
        <div className="user-info">
          <h3>{otherParticipant?.username || "Chat"}</h3>
          <span className="status">{isOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
      
      <div className="messages-window">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date} className="date-group">
            <div className="date-divider"><span>{date === new Date().toDateString() ? "Today" : date}</span></div>
            {msgs.map((m, i) => (
              <div 
                key={m._id || i}
                onContextMenu={(e) => showMenu(e, m._id, m.sender._id)}
                onTouchStart={() => longPressTimer.current = setTimeout(() => showMenu({ clientX: 0, clientY: 0 }, m._id, m.sender._id), 2000)}
                onTouchEnd={() => clearTimeout(longPressTimer.current)}
                className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}
              >
                <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
                  <p className="m-0">{m.text}</p>
                  <div className="msg-footer">
                    <span className="msg-time">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    {m.sender.username === localStorage.getItem("username") && (
                      <span className="status-icon">
                        {m.status === 'read' ? <CheckCheck size={14} color="#53bdeb" /> : m.status === 'delivered' ? <CheckCheck size={14} /> : <Check size={14} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {menu.visible && (
        <div className="context-menu" style={{ position: 'fixed', top: menu.y, left: menu.x }}>
          <button onClick={() => startEdit(menu.messageId)}><Edit size={16}/> Edit</button>
          <button onClick={() => deleteMessage(menu.messageId)}><Trash2 size={16}/> Delete</button>
        </div>
      )}

      <div className="input-area">
        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
      </div>
    </div>
  );
};
export default Chat;