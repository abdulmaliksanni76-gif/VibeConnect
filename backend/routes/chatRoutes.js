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

    const newMessage = new Message({ conversationId, sender: senderId, text });
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

module.exports = router;