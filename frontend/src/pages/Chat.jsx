// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, ArrowLeft } from 'lucide-react';
// import './Chat.css';
// import { formatTimestamp } from '../components/dateUtils';
// import { Check, CheckCheck } from 'lucide-react';

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatData, setChatData] = useState(null); 
//   const messagesEndRef = useRef(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/chat/messages/${conversationId}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
//     }).then(res => res.json()).then(setMessages);

//     fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
//     headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
//   })
//   .then(res => res.json())
//   .then(data => {
//     console.log("Full Chat Data:", data); 
//     setChatData(data);
//   });

//     if (socket) {
//       socket.emit("join_chat", conversationId);
//       const handler = (msg) => setMessages(prev => [...prev, msg]);
//       socket.on("receive_message", handler);
//       return () => socket.off("receive_message", handler);
//     }
//   }, [conversationId, socket]);

//   useEffect(scrollToBottom, [messages]);

//   const otherParticipant = chatData?.participants?.find(
//     (p) => p.username !== localStorage.getItem("username")
//   );

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     await fetch('http://localhost:5000/api/chat/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
//       body: JSON.stringify({ conversationId, text: input })
//     });
//     setInput("");
//     window.dispatchEvent(new Event('chat_updated'));
//   };

//   const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//   const groupMessagesByDate = (messages) => {
//     return messages.reduce((groups, message) => {
//       const date = new Date(message.createdAt).toDateString();
//       if (!groups[date]) {
//         groups[date] = [];
//       }
//       groups[date].push(message);
//       return groups;
//     }, {});
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   useEffect(() => {
//     socket.emit("user_connected", localStorage.getItem("userId"));
    
//     socket.on("get_online_users", (users) => {
//       setOnlineUsers(users);
//     });
//   }, [socket]);

//   // Use this to show status
//   const isOnline = onlineUsers.includes(otherParticipant?._id);

//   return (
//     <div className="chat-app-container">
//       <div className="chat-header">
//         <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
//         <div className="user-info">
//           <h3>{otherParticipant?.username || "Chat"}</h3>
//           <span className="status">Online</span>
//         </div>
//       </div>
      
//       <div className="messages-window">
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date} className="date-group">
            
//             <div className="date-divider">
//               <span>{date === new Date().toDateString() ? "Today" : date}</span>
//             </div>

//             {msgs.map((m, i) => (
//               <div key={i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
//                 <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
//                   <p className="m-0">{m.text}</p>
//                   <span className="msg-time">
//                     {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="input-area">
//         <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
//         <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
//       </div>
//     </div>
//   );
// };
// export default Chat;

// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react'; // Added icons
// import './Chat.css';

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [chatData, setChatData] = useState(null);
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

//   useEffect(() => {
//     // Fetch Messages
//     fetch(`http://localhost:5000/api/chat/messages/${conversationId}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
//     }).then(res => res.json()).then(setMessages);

//     // Fetch Chat Info
//     fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
//     })
//       .then(res => res.json())
//       .then(setChatData);

//     if (socket) {
//       socket.emit("join_chat", conversationId);
//       socket.emit("user_connected", localStorage.getItem("userId"));

//       const handler = (msg) => setMessages(prev => [...prev, msg]);
//       socket.on("receive_message", handler);
//       socket.on("get_online_users", setOnlineUsers);
      
//       return () => {
//         socket.off("receive_message", handler);
//         socket.off("get_online_users", setOnlineUsers);
//       };
//     }
//   }, [conversationId, socket]);

//   useEffect(scrollToBottom, [messages]);

//   const otherParticipant = chatData?.participants?.find(
//     (p) => String(p._id) !== String(localStorage.getItem("userId"))
//   );

//   const isOnline = onlineUsers.includes(otherParticipant?._id);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     await fetch('http://localhost:5000/api/chat/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
//       body: JSON.stringify({ conversationId, text: input })
//     });
//     setInput("");
//     window.dispatchEvent(new Event('chat_updated'));
//   };

//   const sortedMessages = [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//   const groupedMessages = sortedMessages.reduce((groups, message) => {
//     const date = new Date(message.createdAt).toDateString();
//     if (!groups[date]) groups[date] = [];
//     groups[date].push(message);
//     return groups;
//   }, {});

//   return (
//     <div className="chat-app-container">
//       <div className="chat-header">
//         <button className="back-btn" onClick={() => navigate('/chat')}><ArrowLeft size={24} /></button>
//         <div className="user-info">
//           <h3>{otherParticipant?.username || "Chat"}</h3>
//           <span className="status">{isOnline ? "Online" : "Offline"}</span>
//         </div>
//       </div>
      
//       <div className="messages-window">
//         {Object.entries(groupedMessages).map(([date, msgs]) => (
//           <div key={date} className="date-group">
//             <div className="date-divider">
//               <span>{date === new Date().toDateString() ? "Today" : date}</span>
//             </div>

//             {msgs.map((m, i) => (
//               <div key={i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
//                 <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
//                   <p className="m-0">{m.text}</p>
//                   <div className="msg-footer">
//                     <span className="msg-time">
//                       {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                     {/* Status Icons for Sent Messages */}
//                     {m.sender.username === localStorage.getItem("username") && (
//                       <span className="status-icon">
//                         {m.status === 'read' ? <CheckCheck size={14} color="#53bdeb" /> : <Check size={14} />}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="input-area">
//         <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
//         <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
//       </div>
//     </div>
//   );
// };
// export default Chat;

import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

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
        console.log("Message received, attempting to mark delivered...", msg);
        setMessages(prev => {
          if (prev.find(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        if (msg.sender._id !== localStorage.getItem("userId")) {
          socket.emit("mark_delivered", { 
            messageId: msg._id, 
            senderId: msg.sender._id 
          });
        }
      };

      const handleDelivered = (msgId) => {
        setMessages(prev => prev.map(m => m._id === msgId ? { ...m, status: 'delivered' } : m));
      };

      socket.on("receive_message", handleReceive);
      socket.on("message_delivered", handleDelivered);
      socket.on("get_online_users", setOnlineUsers);
      
      
      return () => {
        socket.off("receive_message", handleReceive);
        socket.off("message_delivered", handleDelivered);
        socket.off("get_online_users", setOnlineUsers);
      };
    }
  }, [conversationId, socket]);

  useEffect(scrollToBottom, [messages]);

  const otherParticipant = chatData?.participants?.find(
    (p) => String(p._id) !== String(localStorage.getItem("userId"))
  );

  const isOnline = onlineUsers.includes(otherParticipant?._id);

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
  const groupedMessages = sortedMessages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {});

  useEffect(() => {
    if (socket) {
      socket.emit("user_connected", localStorage.getItem("userId"));
      
      socket.emit("check_undelivered", localStorage.getItem("userId"));
      
    }
  }, [socket]);

  return (
    <div className="chat-app-container">
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
              <div key={m._id || i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
                <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
                  <p className="m-0">{m.text}</p>
                  <div className="msg-footer">
                    <span className="msg-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {m.sender.username === localStorage.getItem("username") && (
                      <span className="status-icon">
                        {m.status === 'read' ? <CheckCheck size={14} color="#53bdeb" /> : 
                         m.status === 'delivered' ? <CheckCheck size={14} /> : <Check size={14} />}
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

      <div className="input-area">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} className="send-btn"><Send size={20} /></button>
      </div>
    </div>
  );
};
export default Chat;