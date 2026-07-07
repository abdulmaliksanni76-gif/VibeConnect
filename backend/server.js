// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');
// const connectDB = require('./config/db');

// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');

// const app = express();
// const server = http.createServer(app);

// // Initialize Socket.io
// const io = new Server(server, {
//   cors: { 
//     origin: "http://localhost:5173", 
//     methods: ["GET", "POST"] 
//   }
// });

// // Middleware to make io available in routes
// app.set('io', io);

// app.use(cors());
// app.use(express.json());

// // Database Connection
// connectDB();

// // WebSocket logic
// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   // Handle joining specific rooms
//   socket.on("join_chat", (chatId) => {
//     socket.join(chatId);
//     console.log(`Socket ${socket.id} joined room: ${chatId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("Client disconnected:", socket.id);
//   });


// socket.on("send_message", async (data) => {
//     const newMessage = new Message({ ...data });
//     await newMessage.save();
    
//     // Populate the sender
//     const populatedMessage = await Message.findById(newMessage._id)
//         .populate('sender', 'username'); 
    
//     // Emit the populated object
//     io.to(data.conversationId).emit("receive_message", populatedMessage);
// }); // <--- Make sure this closing brace exists
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/chat', chatRoutes);

// app.get('/', (req, res) => {
//     res.send('VibeConnect API is running smoothly.');
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Message = require('./models/Message'); // <--- ADD THIS LINE

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

// io.on("connection", (socket) => {
//   console.log("New client connected:", socket.id);

//   socket.on("join_chat", (chatId) => {
//     socket.join(chatId);
//   });

io.on("connection", (socket) => {
  socket.on("join_chat", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined room: ${conversationId}`);
  });

  // socket.on("send_message", async (data) => {
  //   try {
  //     const newMessage = new Message({ 
  //       conversationId: data.conversationId,
  //       sender: data.sender, // Ensure this is the User ID
  //       text: data.text 
  //     });
  //     await newMessage.save();
      
  //     const populatedMessage = await Message.findById(newMessage._id)
  //         .populate('sender', 'username'); 
      
  //     io.to(data.conversationId).emit("receive_message", populatedMessage);
  //   } catch (err) {
  //     console.error("Socket send_message error:", err);
  //   }
  // });

  socket.on("send_message", async (data) => {
    try {
        const newMessage = new Message({ 
            conversationId: data.conversationId,
            sender: data.senderId, // Ensure you are passing the sender's ID
            text: data.text 
        });
        await newMessage.save();
        
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'username'); 
        
        // This broadcasts the message to everyone in the room (including the receiver)
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