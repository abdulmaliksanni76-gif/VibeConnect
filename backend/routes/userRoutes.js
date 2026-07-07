// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); // Ensure this path is correct

// router.get('/search', async (req, res) => {
//   const { email } = req.query;
//   try {
//     // Find user by email, hide password
//     const user = await User.findOne({ email }).select('-password');
//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // router.get('/search', async (req, res) => {
// //   const { email } = req.query;
// //   try {
// //     // Use $regex with 'i' option for case-insensitive search
// //     const user = await User.findOne({ 
// //       email: { $regex: new RegExp(`^${email}$`, 'i') } 
// //     }).select('-password');
    
// //     if (!user) return res.status(404).json({ message: "User not found" });
// //     res.json(user);
// //   } catch (err) {
// //     res.status(500).json({ message: "Server error" });
// //   }
// // });

// // module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure this path is correct

router.get('/search', async (req, res) => {
  const { email } = req.query;
  try {
    // Find user by email, hide password
    const user = await User.findOne({ email }).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;