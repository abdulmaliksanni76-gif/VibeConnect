// const mongoose = require('mongoose');

// const conversationSchema = new mongoose.Schema({
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     lastMessage: { type: String, default: "" }, // <--- THIS MUST EXIST
// }, { timestamps: true });

// // module.exports = mongoose.model('Conversation', conversationSchema);
// const Conversation = mongoose.model('Conversation', conversationSchema);
// export default Conversation;

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String, default: "" },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;