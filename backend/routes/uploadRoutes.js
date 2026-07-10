const express = require('express');
const router = express.Router(); // <--- THIS WAS MISSING
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

module.exports = router;