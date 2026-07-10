const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//   conversationId: { type: String, required: true },
// sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
//   fileUrl: String,
//   fileType: String
// }, { timestamps: true });

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  fileUrl: String,   // New field
  fileType: String,  // e.g., 'image', 'pdf'
  status: { type: String, default: 'sent' }
}, { timestamps: true });

// const messageSchema = new mongoose.Schema({
//     conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     text: String,
//     status: { type: String, default: 'sent' },
//     fileUrl: String,   // Add this
//     fileType: String   // Add this
// }, { timestamps: true });


// module.exports = mongoose.model('Message', messageSchema);
const Message = mongoose.model('Message', messageSchema);
export default Message;

