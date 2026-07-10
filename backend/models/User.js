// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String }, 
//   googleId: { type: String }, 
//   role: { 
//     type: String, 
//     enum: ['user', 'admin', 'super-admin'], 
//     default: 'user' 
//   },
//   isVerified: { type: Boolean, default: false },
//   otp: { type: String },
//   otpExpires: { type: Date }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String }, 
  role: { 
    type: String, 
    enum: ['user', 'admin', 'super-admin'], 
    default: 'user' 
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;