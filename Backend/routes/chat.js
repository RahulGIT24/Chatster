const express = require('express');
const mongoose = require('mongoose')
const protect = require('../middleware/authMiddleWare');
const Chat = require("../models/ChatModel")
const User = require('../models/UserModel');

const router = express.Router();

router.get("/", protect, async (req, res) => {

})

router.post("/", protect, async (req, res) => {
    try {
        const { userID } = req.body;

        if (!userID) {
            return res.status(400).send("Chat not exist")
        }

        let isChat = await Chat.find({
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
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userID]
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

router.post("/group", protect, async (req, res) => {
    try {
        if (!req.body.users || !req.body.name) {
            return res.status(400).send("Please fill all the fields")
        }

        let users = req.body.users;

        console.log(users)
        console.log(users.length)
        if (users.length < 2) {
            return res.status(400).send("At least two people are required in chat")
        }

        users.push(req.user)

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

router.put("/rename", protect, async (req, res) => {
    try {
        const { chatID, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatID, { chatName: chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
        res.status(200).send(updatedChat);
    } catch (e) {
        res.status(400).send("Couldn't Update")
    }

})

router.put("/groupRemove", protect, async (req, res) => {
    try{
        const {chatId, userId} = req.body;
        const removed = await Chat.findByIdAndUpdate(chatId,{
            $pull:{users:userId},
        },
        {
            new: true,
        }
        ).populate("users","-password").populate("groupAdmin","-password")

        res.status(200).send(removed)
    }catch(e){
        console.log(e)
        res.status(400).send("Error while removing user")
    }
})

router.put("/groupAdd", protect, async (req, res) => {
    try{
    const { chatId, userId } = req.body;
  
    const added = await Chat.findByIdAndUpdate(chatId,{$push: { users: userId },},{new: true,})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(added)
    }catch(e){
        res.status(400).send("Error while adding new user!")
    }
})

module.exports = router;