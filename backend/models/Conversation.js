const mongoose = require('mongoose');

// const conversationSchema = new mongoose.Schema({
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     lastMessage: { type: String, default: '' },
//     updatedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Conversation', conversationSchema);

const conversationSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: { type: String, default: "" }, // <--- THIS MUST EXIST
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);