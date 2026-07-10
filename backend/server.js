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
const uploadRoutes = require('./routes/uploadRoutes');

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

  socket.on("message_updated", (updatedMsg) => {
  // Broadcast to other users in the chat
  io.to(updatedMsg.conversationId).emit("message_updated", updatedMsg);
  // Emit a signal for the sidebar specifically if needed
  io.emit("refresh_sidebar"); 
});

socket.on("message_deleted", (data) => {
  // data should contain { messageId, conversationId }
  // Broadcast to the specific conversation so the Chat component updates
  io.to(data.conversationId).emit("message_deleted", data.messageId);
  
  // Refresh the sidebar for everyone involved
  io.emit("refresh_sidebar");
});

});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
// app.use('/api/upload', uploadRoutes);
app.use('/api/chat', uploadRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));