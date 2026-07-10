// const express = require('express');
// const router = express.Router();
// const { register, verifyOtp, resendOtp, login } = require('../controllers/authController');

// router.post('/register', register);
// router.post('/verify-otp', verifyOtp);
// router.post('/resend-otp', resendOtp);
// router.post('/login', login);

// // module.exports = router;
// export default router;

import express from 'express';
import { register, verifyOtp, resendOtp, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);

export default router;