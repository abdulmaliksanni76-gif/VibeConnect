// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./config/db');
// const Message = require('./models/Message'); 
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const onlineUsers = new Map();

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: { 
//     origin: "http://localhost:5173", 
//     methods: ["GET", "POST"] 
//   }
// });

// app.set('io', io);
// app.use(cors());
// app.use(express.json());

// connectDB();

// io.on("connection", (socket) => {
//   socket.on("join_chat", (conversationId) => {
//     socket.join(conversationId);
//     console.log(`User ${socket.id} joined room: ${conversationId}`);
//   });

//   socket.on("send_message", async (data) => {
//     try {
//         const newMessage = new Message({ 
//             conversationId: data.conversationId,
//             sender: data.senderId, 
//             text: data.text 
//         });
//         await newMessage.save();
        
//         const populatedMessage = await Message.findById(newMessage._id)
//             .populate('sender', 'username'); 
        
//         io.to(data.conversationId).emit("receive_message", populatedMessage);
//     } catch (err) {
//         console.error("Socket send_message error:", err);
//     }
// });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });
// });

// io.on("connection", (socket) => {
//   // When a user connects, they send their ID
//   socket.on("user_connected", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     // Notify EVERYONE who is online
//     io.emit("get_online_users", Array.from(onlineUsers.keys()));
//   });

//   socket.on("join_chat", (conversationId) => {
//     socket.join(conversationId);
//   });

//   socket.on("mark_delivered", async ({ messageId, senderId }) => {
//     try {
//       // 1. Update status in MongoDB
//       const updatedMsg = await Message.findByIdAndUpdate(
//         messageId, 
//         { status: 'delivered' }, 
//         { new: true }
//       );
      
//       // 2. Identify the original sender's socket and notify them
//       const senderSocketId = onlineUsers.get(senderId);
//       if (senderSocketId) {
//         io.to(senderSocketId).emit("message_delivered", messageId);
//       }
//     } catch (err) { console.error("Delivery Error:", err); }
//   });

//   socket.on("check_undelivered", async (userId) => {
//     try {
//       // Find all messages sent to this user that are still 'sent' (not 'delivered')
//       const undelivered = await Message.find({ 
//         // This assumes you store 'recipient' field. 
//         // If not, you might need to find messages in the user's conversations
//         recipient: userId, 
//         status: 'sent' 
//       });

//       for (let msg of undelivered) {
//         // Update status
//         msg.status = 'delivered';
//         await msg.save();
        
//         // Notify the sender that this old message was finally delivered
//         const senderSocketId = onlineUsers.get(msg.sender.toString());
//         if (senderSocketId) {
//           io.to(senderSocketId).emit("message_delivered", msg._id);
//         }
//       }
//     } catch (err) { console.error(err); }
//   });

//   // ... (keep your send_message logic here)

//   socket.on("disconnect", () => {
//     // Cleanup
//     for (let [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         onlineUsers.delete(userId);
//         break;
//       }
//     }
//     io.emit("get_online_users", Array.from(onlineUsers.keys()));
//   });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chat', chatRoutes);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const onlineUsers = new Map();

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.set('io', io);
app.use(cors());
app.use(express.json());
connectDB();

io.on("connection", (socket) => {
  socket.on("user_connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("get_online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message({ 
          conversationId: data.conversationId,
          sender: data.senderId, 
          text: data.text,
          status: 'sent' 
      });
      await newMessage.save();
      
      const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'username'); 
      io.to(data.conversationId).emit("receive_message", populatedMessage);
    } catch (err) { console.error("Send Error:", err); }
  });

  socket.on("mark_delivered", async ({ messageId, senderId }) => {
  console.log("Server received mark_delivered for:", messageId);
  try {
    const updatedMsg = await Message.findByIdAndUpdate(messageId, { status: 'delivered' }, { new: true });
    console.log("Database update result:", updatedMsg); // Check if this is null
    
    const senderSocketId = onlineUsers.get(senderId);
    if (senderSocketId) {
      console.log("Emitting message_delivered to sender:", senderId);
      io.to(senderSocketId).emit("message_delivered", messageId);
    } else {
      console.log("Sender is offline, couldn't emit message_delivered");
    }
  } catch (err) { console.error("Delivery Error:", err); }
});

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit("get_online_users", Array.from(onlineUsers.keys()));
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));