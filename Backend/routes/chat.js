// Imports
const express = require('express');
const protect = require('../middleware/authMiddleWare');
const Chat = require("../models/ChatModel")
const User = require('../models/UserModel');

const router = express.Router();

// Route 1:- Fetches logged in user chats
router.get("/", protect, async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (e) {
        return res.status(400).send("Error Ocuured")
    }
})

// Route 2: Access Single Chat
router.post("/", protect, async (req, res) => {
    try {
        const { userID, isRejected } = req.body;

        if (!userID) {
            return res.status(400).send("Chat not exist")
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: req.userID } } }
            ]
        }).populate("users", "-password").populate("latestMessage")
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        })

        if (isChat.length > 0) {
            return res.status(200).send(isChat[0])
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userID],
                isRejected,
                creator: req.user._id
            }

            try {
                const createdChat = await Chat.create(chatData);

                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")

                res.status(200).send(fullChat)
            } catch (error) {
                res.status(400).send("Chat not created")
            }
        }
    } catch (error) {
        return res.status(400).send("Error occured")
    }
})

// Route 3: Creating a group chat
router.post("/group", protect, async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send("Please fill all the fields")
        }

        var users = JSON.parse(req.body.users);

        if (users.length < 2) {
            return res
                .status(400)
                .send("More than 2 users are required to form a group chat");
        }

        users.push(req.user);
        try {
            const groupChat = await Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user
            })

            const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

            res.status(200).send(fullGroupChat)
        } catch (error) {
            console.log(error)
            return res.status(400).send("Error occured")
        }
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error occured")
    }
})

// Route 4: Rename group
router.put("/rename", protect, async (req, res) => {
    try {
        const { chatID, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatID, { chatName: chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).send(updatedChat);
    } catch (e) {
        res.status(400).send("Couldn't Update")
    }

})

// Route 4: Change Admin
router.put("/changeAdmin", protect, async (req, res) => {
    try {
        const { chatID, adminID } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatID, { groupAdmin: adminID }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).send(updatedChat);
    } catch (error) {
        res.status(400).send("Couldn't update group admin")
    }
})

// Route 5: Removing users from group
router.put("/groupRemove", protect, async (req, res) => {
    try {
        const { chatId, userId } = req.body;
        const removed = await Chat.findByIdAndUpdate(chatId, {
            $pull: { users: userId },
        },
            {
                new: true,
            }
        ).populate("users", "-password").populate("groupAdmin", "-password")

        res.status(200).send(removed)
    } catch (e) {
        console.log(e)
        res.status(400).send("Error while removing user")
    }
})

// Route 6: Adding users to group
router.put("/groupAdd", protect, async (req, res) => {
    try {
        const { chatId, userId } = req.body;

        const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId }, }, { new: true, })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(added)
    } catch (e) {
        res.status(400).send("Error while adding new user!")
    }
})


// Route 7: If chat is accepted
router.put("/accept-chat", protect, async (req, res) => {
    try {
        const { chatId } = req.body;
        const findChat = await Chat.findById(chatId);
        if (!findChat) {
            res.status(400).send("Can't find Chat!");
            return;
        }
        findChat.isRejected = "Accepted";
        await Chat.findByIdAndUpdate(chatId, { $set: findChat }, { new: true });
        return res.status(200).send("Chat Accepted!")
    } catch (e) {
        res.status(400).send("Error while aceepting!")
    }
})

// Route 8: Reject chat
router.delete("/reject-chat", protect, async (req, res) => {
    try {
        const { chatId } = req.body;
        const findChat = await Chat.findById(chatId);
        if (!findChat) {
            res.status(400).send("Can't find Chat!");
            return;
        }
        await Chat.findByIdAndDelete(chatId);
        return res.status(200).send("Chat Rejected!")
    } catch (e) {
        res.status(400).send("Error while Rejecting!")
    }
})

module.exports = router;