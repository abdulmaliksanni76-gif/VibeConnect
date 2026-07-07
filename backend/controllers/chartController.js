const Conversation = require('../models/Conversation');

exports.getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ 
            participants: req.user.id 
        })
        .populate('participants', 'username email') // Get details of the other user
        .sort({ updatedAt: -1 }); // Newest activity on top
        
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};