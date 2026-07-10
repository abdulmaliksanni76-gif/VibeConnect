// const express = require('express');
// const router = express.Router(); // <--- THIS WAS MISSING
// const auth = require('../middleware/auth');
// const upload = require('../middleware/upload');

// router.post('/upload', auth, upload.single('file'), (req, res) => {
//     res.json({ 
//         filePath: `/uploads/${req.file.filename}`,
//         fileType: req.file.mimetype // e.g., 'video/mp4' or 'application/pdf'
//     });
// });

// // module.exports = router;
// export default router;

import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', auth, upload.single('file'), (req, res) => {
    res.json({ 
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype
    });
});

export default router;