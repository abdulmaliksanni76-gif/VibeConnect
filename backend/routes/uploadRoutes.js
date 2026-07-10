const express = require('express');
const router = express.Router(); // <--- THIS WAS MISSING
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// router.post('/upload', auth, upload.single('file'), (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });
//     res.json({ filePath: `/uploads/${req.file.filename}` });
// });

router.post('/upload', auth, upload.single('file'), (req, res) => {
    res.json({ 
        filePath: `/uploads/${req.file.filename}`,
        fileType: req.file.mimetype // e.g., 'video/mp4' or 'application/pdf'
    });
});

module.exports = router;