// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useOutletContext } from 'react-router-dom';
// import './Chat.css';
// import { Send, ArrowLeft } from 'lucide-react';

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams();
//   const context = useOutletContext();
//   const goBack = context?.goBack || (() => window.history.back());

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
  
//   const token = localStorage.getItem("token");
//   const currentUsername = localStorage.getItem("username");

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await fetch(`http://localhost:5000/api/chat/${conversationId}`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         const data = await res.json();
//         setMessages(data);
//       } catch (err) {
//         console.error("Error fetching messages:", err);
//       }
//     };
//     fetchMessages();
//   }, [conversationId, token]);

// useEffect(() => {
//   if (!socket || !conversationId) return;
  
//   const handleReceiveMessage = (msg) => {
//     // Only add if the message is NOT already in the list
//     setMessages((prev) => {
//       if (prev.find(m => m._id === msg._id)) return prev;
//       return [...prev, msg];
//     });
//   };
  
//   socket.on("receive_message", handleReceiveMessage);
//   return () => socket.off("receive_message", handleReceiveMessage);
// }, [socket, conversationId]);


// useEffect(() => {
//   if (!socket || !conversationId) return;

//   // This line is the most important part
//   socket.emit("join_chat", conversationId);
//   console.log("Joined room:", conversationId); 

//   const handleReceiveMessage = (msg) => {
//     setMessages((prev) => {
//       // Prevent duplicates
//       if (prev.find(m => m._id === msg._id)) return prev;
//       return [...prev, msg];
//     });
//   };

//   socket.on("receive_message", handleReceiveMessage);
//   return () => socket.off("receive_message", handleReceiveMessage);
// }, [socket, conversationId]);


// const sendMessage = async () => {
//   if (!input.trim()) return;
//   try {
//     // Just send the API request. Do not call setMessages here!
//     await fetch('http://localhost:5000/api/chat/send', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json', 
//         'Authorization': `Bearer ${localStorage.getItem('token')}` 
//       },
//       body: JSON.stringify({ conversationId, text: input })
//     });
//     setInput(""); // Just clear the input
//   } catch (err) {
//     console.error("Error sending message:", err);
//   }
// };

//   return (
//     <div className="chat-app-container">
//       <div className="chat-header">
//         <button className="back-btn" onClick={goBack}>
//           <ArrowLeft size={24} />
//         </button>
//         <h3>Chat</h3>
//       </div>

      // <div className="messages-window">
      //   {messages.map((m, i) => {
      //     const senderName = typeof m.sender === 'object' && m.sender !== null ? m.sender.username : m.sender;
      //     const isSentByMe = senderName === currentUsername;

      //     return (
      //       <div key={i} className={`message-wrapper ${isSentByMe ? 'sent-wrapper' : 'received-wrapper'}`}>
      //         <div className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}>
      //           <span className="sender-name">{senderName}</span>
      //           <p className="message-text">{m.text}</p>
      //         </div>
      //       </div>
      //     );
      //   })}
      //   <div ref={messagesEndRef} />
      // </div>
      
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
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/chat/${conversationId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    }).then(res => res.json()).then(setMessages);

    if (socket) {
      socket.emit("join_chat", conversationId);
      const handler = (msg) => setMessages(prev => [...prev, msg]);
      socket.on("receive_message", handler);
      return () => socket.off("receive_message", handler);
    }
  }, [conversationId, socket]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ conversationId, text: input })
    });
    setInput("");
  };

  return (
    <div className="chat-app-container">
      <div className="chat-header">
        <button onClick={() => navigate('/chat')}><ArrowLeft /></button>
        <h3>Chat</h3>
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
      {/* <div className="input-area">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} />
        <button className='send-btn' onClick={sendMessage}><Send /></button>
      </div> */}

      <div className="input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type a message..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="send-btn">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};
export default Chat;