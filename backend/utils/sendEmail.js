// require('dotenv').config(); // Load variables from .env
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     // service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // Use SSL
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });


// exports.sendOtpEmail = async (email, otp) => {
//     console.log(`Attempting to send email to: ${email}`); // DEBUG LINE
//     try {
//         const info = await transporter.sendMail({
//             from: `"VibeConnect Team" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: 'Verify your VibeConnect account',
//             html: `<h1>${otp}</h1>`
//         });
//         console.log("Email sent successfully:", info.response); // DEBUG LINE
//     } catch (error) {
//         console.error("FULL EMAIL ERROR:", error); // This will tell us if auth failed
//         throw new Error("Failed to send email");
//     }
// };

require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 587 for better compatibility
    secure: false, // Must be false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOtpEmail = async (email, otp) => {
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
        throw error; // Propagate error so controller knows it failed
    }
};