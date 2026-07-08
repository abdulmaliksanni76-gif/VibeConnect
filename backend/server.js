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

const io = new Server(server, {
  cors: { 
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"] 
  }
});

app.set('io', io);
app.use(cors());
app.use(express.json());

connectDB();

io.on("connection", (socket) => {
  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room: ${conversationId}`);
  });

  socket.on("send_message", async (data) => {
    try {
        const newMessage = new Message({ 
            conversationId: data.conversationId,
            sender: data.senderId, 
            text: data.text 
        });
        await newMessage.save();
        
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'username'); 
        
        io.to(data.conversationId).emit("receive_message", populatedMessage);
    } catch (err) {
        console.error("Socket send_message error:", err);
    }
});

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));