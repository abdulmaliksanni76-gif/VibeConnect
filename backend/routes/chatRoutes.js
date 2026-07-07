const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a chat
router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.chatId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

// Send a message
router.post('/send', async (req, res) => {
  try {
    const { conversationId, sender, text } = req.body;
    const newMessage = new Message({ conversationId, sender, text });
    await newMessage.save();

    // Access io from express app and emit to the room
    const io = req.app.get('io');
    io.to(conversationId).emit("receive_message", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Error sending message" });
  }
});

module.exports = router;