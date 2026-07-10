const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const auth = require('../middleware/auth');
const { getUserConversations } = require('../controllers/chatController');

router.get('/conversations', auth, getUserConversations);

router.get('/:conversationId', auth, async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId })
            .populate('sender', 'username') 
            .sort({ createdAt: 1 });
            
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch messages" });
    }
});

router.get('/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

router.post('/send', auth, async (req, res) => {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    // const newMessage = new Message({ conversationId, sender: senderId, text });
    // Inside your /send route in chatRoutes.js
      // const newMessage = new Message({ 
      //     conversationId, 
      //     sender: senderId, 
      //     text, 
      //     fileUrl: req.body.fileUrl, 
      //     fileType: req.body.fileType 
      // });
      // await newMessage.save();

      const newMessage = new Message({ 
        conversationId, 
        sender: senderId, 
        text: req.body.text, 
        fileUrl: req.body.fileUrl // <--- Make sure this is being saved!
    });
    await newMessage.save();

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        updatedAt: new Date() // Updates the timestamp for sorting
    });

const updatedChat = await Conversation.findByIdAndUpdate(
    conversationId, 
    { $set: { lastMessage: text, updatedAt: Date.now() } },
    { new: true } 
);
console.log("Conversation updated:", updatedChat);

    const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username');

    const io = req.app.get('io'); 
    io.to(conversationId).emit("receive_message", populatedMessage);

    res.status(200).json(populatedMessage);
});

router.post('/create', auth, async (req, res) => {
    const { participantId } = req.body;
    const currentUserId = req.user.id;

    let chat = await Conversation.findOne({
        participants: { $all: [currentUserId, participantId] }
    });

    if (!chat) {
        chat = await Conversation.create({
            participants: [currentUserId, participantId]
        });
    }
    res.json(chat);
});

router.get('/messages/:chatId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

router.get('/info/:conversationId', auth, async (req, res) => {
  try {
    const chat = await Conversation.findById(req.params.conversationId)
      .populate('participants', 'username');
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

router.put('/message/:messageId', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messageId, 
      { text }, 
      { new: true }
    ).populate('sender', 'username');

    const lastMsg = await Message.findOne({ conversationId: updatedMessage.conversationId })
      .sort({ createdAt: -1 });

    const updatedChat = await Conversation.findByIdAndUpdate(
      updatedMessage.conversationId,
      { lastMessage: lastMsg ? lastMsg.text : "No messages yet" },
      { new: true }
    );

    const io = req.app.get('io');
    io.to(updatedMessage.conversationId).emit("message_updated", updatedMessage);
    io.to(updatedMessage.conversationId).emit("refresh_sidebar"); // Signal sidebar to refresh
    
    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

router.delete('/message/:messageId', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.messageId);
    
    const lastMsg = await Message.findOne({ conversationId: message.conversationId })
      .sort({ createdAt: -1 });

    await Conversation.findByIdAndUpdate(message.conversationId, {
      lastMessage: lastMsg ? lastMsg.text : "No messages yet",
      updatedAt: lastMsg ? lastMsg.createdAt : new Date()
    });

    const io = req.app.get('io');
    io.to(message.conversationId).emit("message_deleted", req.params.messageId);
    io.to(message.conversationId).emit("refresh_sidebar"); // Signal sidebar to refresh
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;