// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Send, ArrowLeft } from 'lucide-react';
// import './Chat.css';

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);


//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/chat/${conversationId}`, {
//       headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
//     }).then(res => res.json()).then(setMessages);

//     if (socket) {
//       socket.emit("join_chat", conversationId);
//       const handler = (msg) => setMessages(prev => [...prev, msg]);
//       socket.on("receive_message", handler);
//       return () => socket.off("receive_message", handler);
//     }
//   }, [conversationId, socket]);

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

//   return (
//     <div className="chat-app-container">
//       <div className="chat-header">
//         <button onClick={() => navigate('/chat')}><ArrowLeft /></button>
//         <h3>Chat</h3>
//       </div>
//       <div className="messages-window">
//         {messages.map((m, i) => (
//           <div key={i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
//             <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
//               <p>{m.text}</p>
//             </div>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="input-area">
//         <input 
//           type="text" 
//           value={input} 
//           onChange={(e) => setInput(e.target.value)} 
//           placeholder="Type a message..."
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//         />
//         <button onClick={sendMessage} className="send-btn">
//           <Send size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };
// export default Chat;

import { useContext, useEffect, useState, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import './Chat.css';

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatData, setChatData] = useState(null); // New state for chat info
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    // 1. Fetch messages
    fetch(`http://localhost:5000/api/chat/messages/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()).then(setMessages);

    // fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    // }).then(res => res.json()).then(setChatData);
    fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
  })
  .then(res => res.json())
  .then(data => {
    console.log("Full Chat Data:", data); // Check this in the browser console
    setChatData(data);
  });

    if (socket) {
      socket.emit("join_chat", conversationId);
      const handler = (msg) => setMessages(prev => [...prev, msg]);
      socket.on("receive_message", handler);
      return () => socket.off("receive_message", handler);
    }
  }, [conversationId, socket]);

//   useEffect(() => {
  // fetch(`http://localhost:5000/api/chat/info/${conversationId}`, {
  //   headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
  // })
  // .then(res => res.json())
  // .then(data => {
  //   console.log("Full Chat Data:", data); // Check this in the browser console
  //   setChatData(data);
  // });
// }, [conversationId]);

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
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.sender.username === localStorage.getItem("username") ? 'sent-wrapper' : 'received-wrapper'}`}>
            <div className={`message-bubble ${m.sender.username === localStorage.getItem("username") ? 'sent' : 'received'}`}>
              <p>{m.text}</p>
            </div>
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