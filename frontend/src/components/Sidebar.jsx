import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onSelectChat }) => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  // Ensure this is inside your Sidebar component
    const fetchConversations = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setConversations(res.data);
    } catch (err) {
        console.error("Error fetching conversations:", err);
    }
    };

    useEffect(() => {
    fetchConversations();
    }, []);

// const handleSearch = async (e) => {
//   if (e.key === 'Enter') {
//     const email = e.target.value;
//     try {
//       // 1. Find user
//       const userRes = await axios.get(`http://localhost:5000/api/users/find?email=${email}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
//       });
      
//       // 2. Create chat
//       const chatRes = await axios.post('http://localhost:5000/api/chat/create', 
//         { participantId: userRes.data._id },
//         { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
//       );

//       // 3. RE-FETCH LIST & NAVIGATE
//       await fetchConversations(); // Call the function that sets the state
//       navigate(`/chat/${chatRes.data._id}`);
//     } catch (err) {
//       alert("Error creating chat: " + (err.response?.data?.message || err.message));
//     }
//   }
// };

// Sidebar.jsx - Updated handleSearch
const handleSearch = async (e) => {
  if (e.key === 'Enter') {
    const email = e.target.value;
    try {
      const userRes = await axios.get(`http://localhost:5000/api/users/find?email=${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const chatRes = await axios.post('http://localhost:5000/api/chat/create', 
        { participantId: userRes.data._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Add to list immediately if not present
      setConversations(prev => {
        if (prev.find(c => c._id === chatRes.data._id)) return prev;
        return [chatRes.data, ...prev]; // Add to top
      });

      navigate(`/chat/${chatRes.data._id}`);
    } catch (err) {
      alert("Error creating chat");
    }
  }
};

  return (
    <div className="sidebar">
      {/* <div className="search-bar">
        <input type="text" placeholder="Search or start new chat" />
      </div> */}
      <input 
  type="text" 
  placeholder="Search or start new chat"
  onKeyDown={handleSearch} // This triggers the function when you press keys
/>
      <div className="chat-list">
        {conversations.map((chat) => (
          <div 
            key={chat._id} 
            className="chat-item" 
            onClick={() => {
              onSelectChat();
              navigate(`/chat/${chat._id}`);
            }}
          >
            {/* Displaying the other participant's name */}
            <div className="chat-info">
              <h4>{chat.participants.map(p => p.username).join(', ')}</h4>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;