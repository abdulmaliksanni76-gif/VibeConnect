// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './Sidebar.css';

// const Sidebar = () => {
//   const [conversations, setConversations] = useState([]);
//   const navigate = useNavigate();

//   const fetchConversations = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     const res = await axios.get('http://localhost:5000/api/chat/conversations', {
//       headers: { Authorization: `Bearer ${token}` }
//     });
    
//     console.log("API Response Data:", res.data);
    
//     const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//     setConversations(sorted);
//   } catch (err) { 
//     console.error("Fetch Conversations Error:", err.response?.data || err.message); 
//   }
// };

//   const handleSearch = async (e) => {
//     if (e.key === 'Enter') {
//       try {
//         const userRes = await axios.get(`http://localhost:5000/api/users/find?email=${e.target.value.trim()}`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//         });
//         const chatRes = await axios.post('http://localhost:5000/api/chat/create', 
//           { participantId: userRes.data._id },
//           { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//         );
//         fetchConversations();
//         navigate(`/chat/${chatRes.data._id}`);
//       } catch (err) { alert("User not found"); }
//     }
//   };

//   useEffect(() => {
//     fetchConversations();
    
//     window.addEventListener('chat_updated', fetchConversations);
    
//     // Cleanup
//     return () => window.removeEventListener('chat_updated', fetchConversations);
// }, []);
//   console.log("Conversations Data:", conversations);

//   return (
//     <div className="sidebar-content">
//       <div className="sidebar-header">
//         <input type="text" placeholder="Search email..." onKeyDown={handleSearch} />
//       </div>

//     <div className="chat-list">
//   {conversations.map((chat) => {
//     // 1. Get the current logged-in user's ID
//     const currentUserId = localStorage.getItem("userId"); 
    
//     // 2. Find the other participant (the one whose ID is NOT the current user's ID)
//     const otherParticipant = chat.participants.find(
//       (p) => p._id !== currentUserId
//     );

//     return (
//       <div 
//         key={chat._id} 
//         className="chat-item" 
//         onClick={() => navigate(`/chat/${chat._id}`)}
//       >
//         <div className="chat-info">
//           {/* Fallback to 'Unknown' if participant object is missing */}
//           <h4>{otherParticipant ? otherParticipant.username : "Unknown User"}</h4>
//           <p className="last-message">
//             {chat.lastMessage || "No messages yet"}
//           </p>
//         </div>
//       </div>
//     );
//   })}
// </div>
//     </div>
//   );
// };
// export default Sidebar;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Added Search icon
import './Sidebar.css';
import Vibeconnect from '../assets/Vibe Connect-3.png';

const Sidebar = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchConversations();
    window.addEventListener('chat_updated', fetchConversations);
    return () => window.removeEventListener('chat_updated', fetchConversations);
  }, []);

  return (
    <div className="sidebar-content">
      <div className="sidebar-header">
        <img src={Vibeconnect} alt="Logo" className="sidebar-logo" />
        <h2 className="sidebar-title">Vibe <br /> Connect</h2>
        {/* <h2 className="sidebar-title">Chats</h2> */}
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
          const otherParticipant = chat.participants.find((p) => p._id !== currentUserId);

          return (
            <div key={chat._id} className="chat-item" onClick={() => navigate(`/chat/${chat._id}`)}>
              <div className="chat-info">
                <h4>{otherParticipant ? otherParticipant.username : "Unknown User"}</h4>
                <p className="last-message">{chat.lastMessage || "No messages yet"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;