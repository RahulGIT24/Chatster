const express = require('express')
const protect = require('../middleware/authMiddleWare');
const User = require('../models/UserModel');
const router = express.Router()

router.get("/", protect, async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } }).select('-password');

    res.send(users);
})

module.exports = router;