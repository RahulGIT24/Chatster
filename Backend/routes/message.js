const express = require('express');
const protect = require('../middleware/authMiddleWare');
const Message = require("../models/MessageModel");
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');

const router = express.Router();

// TODO: Working fine for groupchat but not for single chat
router.post('/', protect, async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    try {
      let message = await Message.create({ sender: req.user._id, content, chat: chatId });

      message = await (
        await message.populate("sender", "name pic email")
      ).populate({
        path: "chat",
        select: "chatName isGroupChat users",
        model: "Chat",
        populate: { path: "users", select: "name email pic", model: "User" },
      });    
  
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400).send(error.message);
    }
})

router.get('/:chatId', protect, async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).send("Error Occured");
    }
})

module.exports = router;