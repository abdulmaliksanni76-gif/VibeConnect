const Conversation = require('../models/Conversation');
const mongoose = require('mongoose');

// exports.getUserConversations = async (req, res) => {
//     try {
//         const conversations = await Conversation.find({ 
//             participants: req.user.id 
//         })
//         .populate('participants', 'username email') // Get details of the other user
//         .sort({ updatedAt: -1 }); // Newest activity on top
        
//         res.json(conversations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

exports.getUserConversations = async (req, res) => {
    try {
        console.log("Searching for conversations for user ID:", req.user.id);

        // We use $in to explicitly match the user ID against the participants array
        const conversations = await Conversation.find({ 
            participants: { $in: [req.user.id] } 
        })
        .populate('participants', 'username email')
        .sort({ updatedAt: -1 });
        
        console.log("Found conversations count:", conversations.length);
        res.json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ message: error.message });
    }
};