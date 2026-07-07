// import { useContext, useEffect, useState, useRef } from 'react';
// import { SocketContext } from '../context/SocketContext';
// import { useParams, useOutletContext } from 'react-router-dom';
// import './Chat.css';
// import { Send, ArrowLeft } from 'lucide-react';

// const Chat = () => {
//   const socket = useContext(SocketContext);
//   const { conversationId } = useParams(); // Now dynamic
//   const context = useOutletContext();
//   const goBack = context?.goBack || (() => window.history.back());
//   // const senderName = typeof m.sender === 'object' ? m.sender.username : m.sender;

//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
  
//   const token = localStorage.getItem("token");

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

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

//   // useEffect(() => {
//   //   if (!socket || !conversationId) return;
    
//   //   socket.emit("join_chat", conversationId);
    
//   //   const handleReceiveMessage = (msg) => {
//   //     setMessages((prev) => [...prev, msg]);
//   //   };
    
//   //   socket.on("receive_message", handleReceiveMessage);
//   //   return () => socket.off("receive_message", handleReceiveMessage);
//   // }, [socket, conversationId]);

//   useEffect(() => {
//   if (!socket || !conversationId) return;
  
//   socket.emit("join_chat", conversationId);
  
//   const handleReceiveMessage = (msg) => {
//     // LOG THE MESSAGE HERE
//     console.log("Socket received message:", msg); 
    
//     setMessages((prev) => [...prev, msg]);
//   };
  
//   socket.on("receive_message", handleReceiveMessage);
//   return () => socket.off("receive_message", handleReceiveMessage);
// }, [socket, conversationId]);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
    
//     try {
//       const response = await fetch('http://localhost:5000/api/chat/send', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}` 
//         },
//         body: JSON.stringify({ conversationId, text: input })
//       });
      
//       if (response.ok) {
//         setInput("");
//       }
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

// //   return (
// //     <div className="chat-app-container">
// //       {/* Header with Back Button for mobile */}
// //       <div className="chat-header">
// //         <button className="back-btn" onClick={goBack}>
// //           <ArrowLeft size={24} />
// //         </button>
// //         <h3>Chat</h3>
// //       </div>

// //       <div className="messages-window">
// //         {messages.map((m, i) => {
// //           // Assuming m.sender is the user's ID or username
// //           // Replace 'currentUserId' with whatever key you used to store the user's ID in localStorage
// //           const senderName = typeof m.sender === 'object' ? m.sender.username : m.sender;
// //           const isSentByMe = m.sender === localStorage.getItem("username"); 

// //           return (
// //             <div key={i} className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}>
// //               <span className="sender-name">{senderName}</span>
// //               <p className="message-text">{m.text}</p>
// //             </div>
// //           );
// //         })}
// //         <div ref={messagesEndRef} />
// //       </div>
      
// //       <div className="input-area">
// //         <input 
// //           type="text" 
// //           value={input} 
// //           onChange={(e) => setInput(e.target.value)} 
// //           placeholder="Type a message..."
// //           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
// //         />
// //         <button onClick={sendMessage} className="send-btn">
// //           <Send size={20} />
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// return (
//     <div className="chat-app-container">
//       <div className="chat-header">
//         <button className="back-btn" onClick={goBack}>
//           <ArrowLeft size={24} />
//         </button>
//         <h3>Chat</h3>
//       </div>

//       <div className="messages-window">
//         {messages.map((m, i) => {
//           // Extract the sender's name correctly from the object or string
//           const senderName = typeof m.sender === 'object' ? m.sender.username : m.sender;
          
//           // Compare against username stored in localStorage
//           const isSentByMe = senderName === localStorage.getItem("username");

//           return (
//             <div key={i} className={`message-wrapper ${isSentByMe ? 'sent-wrapper' : 'received-wrapper'}`}>
//               <div className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}>
//                 <span className="sender-name">{senderName}</span>
//                 <p className="message-text">{m.text}</p>
//               </div>
//             </div>
//           );
//         })}
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
import { useParams, useOutletContext } from 'react-router-dom';
import './Chat.css';
import { Send, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const socket = useContext(SocketContext);
  const { conversationId } = useParams();
  const context = useOutletContext();
  const goBack = context?.goBack || (() => window.history.back());

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const currentUsername = localStorage.getItem("username");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/chat/${conversationId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [conversationId, token]);

  // useEffect(() => {
  //   if (!socket || !conversationId) return;
    
  //   socket.emit("join_chat", conversationId);
    
  //   const handleReceiveMessage = (msg) => {
  //     setMessages((prev) => [...prev, msg]);
  //   };
    
  //   socket.on("receive_message", handleReceiveMessage);
  //   return () => socket.off("receive_message", handleReceiveMessage);
  // }, [socket, conversationId]);

  // Find this existing block in your Chat.jsx and REPLACE it with the code below:

  // useEffect(() => {
  //   if (!socket || !conversationId) return;
    
  //   socket.emit("join_chat", conversationId);
  //   console.log("Joined room:", conversationId);
    
  //   const handleReceiveMessage = (msg) => {
  //     // THIS IS THE SECOND CODE BLOCK
  //     // Only add the message if it was sent by someone else
  //     // This prevents the duplicate message issue
  //     if (msg.sender?.username !== localStorage.getItem("username")) {
  //       setMessages((prev) => [...prev, msg]);
  //     }
  //   };
    
  //   socket.on("receive_message", handleReceiveMessage);
  //   return () => socket.off("receive_message", handleReceiveMessage);
  // }, [socket, conversationId]);

  // In Chat.jsx
useEffect(() => {
  if (!socket || !conversationId) return;
  
  const handleReceiveMessage = (msg) => {
    // Only add if the message is NOT already in the list
    setMessages((prev) => {
      if (prev.find(m => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };
  
  socket.on("receive_message", handleReceiveMessage);
  return () => socket.off("receive_message", handleReceiveMessage);
}, [socket, conversationId]);

// useEffect(() => {
//   if (!socket) return;
  
//   socket.on("connect", () => console.log("Socket Connected:", socket.id));
//   socket.on("receive_message", (msg) => {
//     console.log("SERVER EMITTED MESSAGE:", msg); // If you see this, the socket is working!
//     setMessages((prev) => [...prev, msg]);
//   });
// }, [socket]);

useEffect(() => {
  if (!socket || !conversationId) return;

  // This line is the most important part
  socket.emit("join_chat", conversationId);
  console.log("Joined room:", conversationId); 

  const handleReceiveMessage = (msg) => {
    setMessages((prev) => {
      // Prevent duplicates
      if (prev.find(m => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  };

  socket.on("receive_message", handleReceiveMessage);
  return () => socket.off("receive_message", handleReceiveMessage);
}, [socket, conversationId]);

//   const sendMessage = async () => {
//   if (!input.trim()) return;

//   // 1. Create a message object that matches the structure of your database messages
//   const newMessage = {
//     conversationId,
//     text: input,
//     sender: { username: localStorage.getItem("username") }, // The current user
//     createdAt: new Date().toISOString()
//   };

//   try {
//     // 2. Add to local state immediately so it appears on the screen
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");

//     // 3. Send to server
//     await fetch('http://localhost:5000/api/chat/send', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}` 
//       },
//       body: JSON.stringify({ conversationId, text: input })
//     });
//   } catch (err) {
//     console.error("Error sending message:", err);
//   }
// };

const sendMessage = async () => {
  if (!input.trim()) return;
  try {
    const response = await fetch('http://localhost:5000/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ conversationId, text: input })
    });
    
    if (response.ok) {
      const data = await response.json(); 
      // 'data' here is the populated object returned by your API
      setMessages((prev) => [...prev, data]); 
      setInput("");
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

//   const sendMessage = async () => {
//   if (!input.trim()) return;

//   const messageData = {
//     conversationId,
//     text: input,
//     sender: { username: localStorage.getItem("username") }, // Create a local object
//     createdAt: new Date().toISOString()
//   };

//   try {
//     // 1. Update UI IMMEDIATELY
//     setMessages((prev) => [...prev, messageData]);
//     setInput("");

//     // 2. Send to server
//     await fetch('http://localhost:5000/api/chat/send', {
//       method: 'POST',
//       headers: { 
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}` 
//       },
//       body: JSON.stringify({ conversationId, text: input })
//     });
//   } catch (err) {
//     console.error("Error sending message:", err);
//   }
// };

  return (
    <div className="chat-app-container">
      <div className="chat-header">
        <button className="back-btn" onClick={goBack}>
          <ArrowLeft size={24} />
        </button>
        <h3>Chat</h3>
      </div>

      <div className="messages-window">
        {messages.map((m, i) => {
          const senderName = typeof m.sender === 'object' && m.sender !== null ? m.sender.username : m.sender;
          const isSentByMe = senderName === currentUsername;

          return (
            <div key={i} className={`message-wrapper ${isSentByMe ? 'sent-wrapper' : 'received-wrapper'}`}>
              <div className={`message-bubble ${isSentByMe ? 'sent' : 'received'}`}>
                <span className="sender-name">{senderName}</span>
                <p className="message-text">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
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