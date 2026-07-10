// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const { sendOtpEmail } = require('../utils/sendEmail');
// const jwt = require('jsonwebtoken');


// exports.register = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         const existingUser = await User.findOne({ email });
//         if (existingUser) return res.status(400).json({ message: 'User already exists' });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
//         const newUser = new User({ username, email, password: hashedPassword, otp: generatedOtp, otpExpires: Date.now() + 10 * 60 * 1000 });
//         await newUser.save();

//         try {
//             await sendOtpEmail(email, generatedOtp);
//         } catch (emailError) {
//             console.error("Registration completed, but email failed to send:", emailError);
//         }

//         return res.status(201).json({ message: 'Registration successful.' });
//     } catch (error) {
//         return res.status(500).json({ message: 'Registration failed, please try again.' });
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
        
//         if (!user || !user.isVerified) {
//             return res.status(401).json({ message: 'Email not verified or user not found' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
//         return res.json({ 
//             token, 
//             username: user.username, 
//             userId: user._id 
//         }); 
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// exports.verifyOtp = async (req, res) => {
//     try {
//         const { email, otp } = req.body;
//         const user = await User.findOne({ email });

//         if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
//             return res.status(400).json({ message: 'Invalid or expired OTP' });
//         }

//         user.isVerified = true;
//         user.otp = undefined;
//         await user.save();
//         return res.json({ message: 'Email verified successfully!' });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// exports.resendOtp = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: 'User not found' });

//         const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
//         user.otp = newOtp;
//         user.otpExpires = Date.now() + 10 * 60 * 1000;
//         await user.save();

//         await sendOtpEmail(email, newOtp);
//         return res.status(200).json({ message: 'OTP resent successfully' });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            otp: generatedOtp, 
            otpExpires: Date.now() + 10 * 60 * 1000 
        });
        await newUser.save();

        try {
            await sendOtpEmail(email, generatedOtp);
        } catch (emailError) {
            console.error("Registration completed, but email failed to send:", emailError);
        }

        return res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
        return res.status(500).json({ message: 'Registration failed, please try again.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !user.isVerified) {
            return res.status(401).json({ message: 'Email not verified or user not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        return res.json({ 
            token, 
            username: user.username, 
            userId: user._id 
        }); 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        await user.save();
        return res.json({ message: 'Email verified successfully!' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = newOtp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendOtpEmail(email, newOtp);
        return res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};