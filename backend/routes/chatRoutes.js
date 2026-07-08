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
            .populate('sender', 'username') // This explicitly requests the 'username' field
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

    const populatedMessage = await Message.findById(newMessage._id)
        .populate('sender', 'username');

    // THIS IS THE LINE THAT PUSHES TO THE RECEIVER
    const io = req.app.get('io'); 
    io.to(conversationId).emit("receive_message", populatedMessage);

    res.status(200).json(populatedMessage);
});

router.post('/create', auth, async (req, res) => {
    const { participantId } = req.body;
    const currentUserId = req.user.id;

    // Check if chat already exists
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

module.exports = router;