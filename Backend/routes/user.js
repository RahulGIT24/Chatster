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

router.put("/changeName/:id", protect, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(401).send("User not found");
        }

        await User.findByIdAndUpdate(id, { name: req.body.name }, { new: true });
        return res.status(200).send("Name updated successfully")
    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;