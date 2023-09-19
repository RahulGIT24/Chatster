const express = require('express')
const protect = require('../middleware/authMiddleWare');
const User = require('../models/UserModel');
const router = express.Router()

// Route 1: Fetching users to create chat
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

// Route 2: Route to change details
router.put("/changeDetail/:id", protect, async (req, res) => {
    try {
        const id = req.params.id;
        let user = await User.findById(id);
        const {name,pic} = req.body;

        if (!user) {
            return res.status(401).send("User not found");
        }

        if (!name && !pic) {
            return res.status(400).send("Please provide sufficient details")
        }

        if(name && pic){
            user.name = name;
            user.pic = pic;
            await User.findByIdAndUpdate(id, { $set: user }, { new: true });
            return res.status(200).send("Details updated successfully")
        }

        if (name) {
            user.name = name;
            user.pic = user.pic;
            await User.findByIdAndUpdate(id, { $set: user }, { new: true });
            return res.status(200).send("Name updated successfully")
        }

        if (pic) {
            user.name = user.name;
            user.pic = pic;
            await User.findByIdAndUpdate(id, { $set: user }, { new: true });
            return res.status(200).send("Profile Pic updated successfully")
        }

    } catch (e) {
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router;