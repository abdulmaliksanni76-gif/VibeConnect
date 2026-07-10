import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck, Edit, Trash2, Plus, Image, FileText, Package, Video, X, Download } from 'lucide-react';
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
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

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
  
    socket.emit("message_deleted", { messageId, conversationId }); 
    
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
    const updatedMsg = { ...messages.find(m => m._id === editingMessageId), text: input };
    setMessages(prev => prev.map(m => m._id === editingMessageId ? updatedMsg : m));
    
    socket.emit("message_updated", updatedMsg);
    setEditingMessageId(null);
    window.dispatchEvent(new Event('chat_updated'));
  }
  } else {
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


  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('http://localhost:5000/api/chat/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: formData
  });
  
  const data = await res.json();
  sendMessageWithFile(data.filePath, file.name);
};


const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('http://localhost:5000/api/chat/upload', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ 
          conversationId, 
          text: file.name, 
          fileUrl: data.filePath 
        })
      });
      window.dispatchEvent(new Event('chat_updated'));
      setShowFileMenu(false); 
    }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const downloadFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'downloaded-file'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFileMenu && !event.target.closest('.plus-btn') && !event.target.closest('.file-menu')) {
        setShowFileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFileMenu]);

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
                  
                  {m.fileUrl ? (
                    <div className="media-wrapper">
                      {m.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img 
                          src={`http://localhost:5000${m.fileUrl}`} 
                          className="chat-image" 
                          onClick={() => setSelectedImage(`http://localhost:5000${m.fileUrl}`)}
                          alt="media" 
                        />
                      ) : m.fileUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video 
                          src={`http://localhost:5000${m.fileUrl}`} 
                          controls 
                          className="chat-video" 
                        />
                      ) : (
                        <div className="file-doc" onClick={() => downloadFile(`http://localhost:5000${m.fileUrl}`)}>
                          <FileText size={40} />
                          <span className="file-name">{m.text}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="m-0">{m.text}</p>
                  )}
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
        <button 
          className="plus-btn" 
          onClick={(e) => { e.stopPropagation(); setShowFileMenu(!showFileMenu); }}
        >
          <Plus size={24} />
        </button>
        
        {showFileMenu && (
          <div className="file-menu" onClick={(e) => e.stopPropagation()}>
            <label><Image size={20}/> Photos & Videos <input type="file" accept="image/*,video/*" hidden onChange={handleFileSelect} /></label>
            <label><FileText size={20}/> Document <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileSelect} /></label>
            <label><Package size={20}/> APK / Other <input type="file" accept=".apk,.zip" hidden onChange={handleFileSelect} /></label>
          </div>
        )}

      {selectedImage && (
        <div className="lightbox">
          <div className="lightbox-controls">
            <button className="lightbox-btn" onClick={() => downloadFile(selectedImage)}>
              <Download size={24} />
            </button>
            <button className="lightbox-btn" onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </button>
          </div>

          {selectedImage.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={selectedImage} controls autoPlay className="lightbox-media" />
          ) : selectedImage.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <img src={selectedImage} alt="Full view" className="lightbox-media" />
          ) : (
            <div className="lightbox-file-placeholder">
              <FileText size={80} />
              <p>File ready for download</p>
            </div>
          )}
        </div>
      )}


      {uploading && (
        <div className="upload-loader">
          <span>Uploading...</span>
        </div>
      )}

        <input 
          ref={inputRef} 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..." 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
        />
        <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
      </div>
    </div>
  );
};
export default Chat;

