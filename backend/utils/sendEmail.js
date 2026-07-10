// require('dotenv').config();
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587, 
//     secure: false, 
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// exports.sendOtpEmail = async (email, otp) => {
//     try {
//         await transporter.sendMail({
//             from: `"VibeConnect Team" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: 'Verify your VibeConnect account',
//             html: `
//                 <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
//                     <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
//                     <p>Your verification code is:</p>
//                     <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
//                 </div>
//             `
//         });
//     } catch (error) {
//         console.error("Email error:", error);
//         throw error; 
//     }
// };

import 'dotenv/config';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOtpEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"VibeConnect Team" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your VibeConnect account',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border-radius: 10px; background: #f9f9f9;">
                    <h2 style="color: #0d6efd;">Welcome to VibeConnect!</h2>
                    <p>Your verification code is:</p>
                    <h1 style="letter-spacing: 5px; color: #198754;">${otp}</h1>
                </div>
            `
        });
    } catch (error) {
        console.error("Email error:", error);
        throw error; 
    }
};