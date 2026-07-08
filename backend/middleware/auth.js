const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
    
//     if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; 
//         next();
//     } catch (e) {
//         res.status(400).json({ message: 'Token is not valid' });
//     }
// };

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // <--- Does 'verified' contain the _id?
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};