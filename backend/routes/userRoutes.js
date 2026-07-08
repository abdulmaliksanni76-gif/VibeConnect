const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth'); 

router.get('/search', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.get('/find', auth, async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;