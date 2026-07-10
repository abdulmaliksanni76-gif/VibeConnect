// const Conversation = require('../models/Conversation');
// const mongoose = require('mongoose');


// exports.getUserConversations = async (req, res) => {
//     try {
//         const conversations = await Conversation.find({ 
//             participants: req.user.id 
//         })
//         .populate('participants', 'username email')
//         .sort({ updatedAt: -1 });
        
//         res.json(conversations);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


import Conversation from '../models/Conversation.js';

export const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ 
            participants: req.user.id 
        })
        .populate('participants', 'username email')
        .sort({ updatedAt: -1 });
        
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};