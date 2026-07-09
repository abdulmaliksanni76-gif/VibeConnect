import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut } from 'lucide-react'; // Added LogOut
import './Sidebar.css';
import Vibeconnect from '../assets/Vibe Connect-3.png';
import { formatTimestamp } from '../components/dateUtils';
import { useParams } from 'react-router-dom';

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const fetchConversations = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setConversations(sorted);
    } catch (err) { 
      console.error("Fetch Conversations Error:", err.response?.data || err.message); 
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      try {
        const userRes = await axios.get(`http://localhost:5000/api/users/find?email=${e.target.value.trim()}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const chatRes = await axios.post('http://localhost:5000/api/chat/create', 
          { participantId: userRes.data._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        fetchConversations();
        navigate(`/chat/${chatRes.data._id}`);
      } catch (err) { alert("User not found"); }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchConversations();
    window.addEventListener('chat_updated', fetchConversations);
    return () => window.removeEventListener('chat_updated', fetchConversations);
  }, []);

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <div className="header-logo-group">
          <img src={Vibeconnect} alt="Logo" className="sidebar-logo" />
          <h2 className="sidebar-title">Vibe <br /> Connect</h2>
        </div>
        
        <button onClick={handleLogout} className="logout-icon-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
      
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          placeholder="Search or start a new chat" 
          onKeyDown={handleSearch} 
          className="search-input"
        />
      </div>

        <div className="chat-list">
          {conversations.map((chat) => {
            const currentUserId = localStorage.getItem("userId"); 
            const otherParticipant = chat.participants.find((p) => String(p._id) !== String(currentUserId));
            const isActive = chat._id === conversationId;

            return (
              <div key={chat._id} className={`chat-item ${isActive ? 'active-chat' : ''}`} onClick={() => navigate(`/chat/${chat._id}`)}>
                <div className="chat-info">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="m-0">{otherParticipant ? otherParticipant.username : "Chat"}</h4>
                    <span className="text-muted small">{formatTimestamp(chat.updatedAt)}</span>
                  </div>
                  <p className="last-message m-0">{chat.lastMessage || "No messages yet"}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
export default Sidebar;