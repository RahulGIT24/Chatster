import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import ProfileModal from "../Misc/ProfileModal";
import UpdateGroupChatModal from "../Misc/UpdateGroupChatModal";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import sent from "../../Assets/Audio/Sent.mp3";
import recieve from "../../Assets/Audio/recieve.mp3";
import { IoSendSharp } from "react-icons/io5";

const ENDPOINT = "https://chatster.onrender.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const { user, SelectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const soundPlay = (s) => {
    if (s) {
      new Audio(sent).play();
    } else {
      new Audio(recieve).play();
    }
  };

  const fetchMessages = async () => {
    if (!SelectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${SelectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", SelectedChat._id);
    } catch (e) {
      toast({
        title: "Unable to fetch messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const sendMessage = async (e) => {
    if (!newMessage) {
      toast({
        title: "Enter a message",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    socket.emit("stop typing", SelectedChat._id);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };
      setNewMessage("");

      const { data } = await axios.post(
        `/api/message/`,
        {
          content: newMessage,
          chatId: SelectedChat._id,
        },
        config
      );

      soundPlay(true);
      socket.emit("new message", data);
      setMessages([...messages, data]);
      return;
    } catch (error) {
      toast({
        title: "Not able to send messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = SelectedChat;
  }, [SelectedChat]);

  useEffect(() => {
    setNewMessage("");
  }, [SelectedChat]);

  // TODO Fix notification bug
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        soundPlay(false);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", SelectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && !typing) {
        socket.emit("stop typing", SelectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {SelectedChat ? (
        <>
          <Box
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            maxHeight={"5rem"}
            minHeight={"5rem"}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
                setFetchAgain(!fetchAgain);
              }}
            />
            {SelectedChat.isGroupChat === false ? (
              <>
                <Box>
                  <p>{getSender(user, SelectedChat.users)}</p>
                  <p>
                    {istyping && (
                      <Text fontSize={"20px"} textAlign={"center"}>
                        Typing....
                      </Text>
                    )}
                  </p>
                </Box>
                <ProfileModal
                  user={
                    SelectedChat.users[0]._id === user.sendUser.id
                      ? SelectedChat.users[1]
                      : SelectedChat.users[0]
                  }
                />
              </>
            ) : (
              <>
                {SelectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Box>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            className="chatBox"
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <>
                <ScrollableChat messages={messages} />
              </>
            )}
            <FormControl isRequired mt={3} style={{ display: "flex" }}>
              <Input
                variant={"filled"}
                bg="#E0E0E0"
                placeholder="Type a message"
                onChange={typingHandler}
                value={newMessage}
              />
              <Button
                id="sendBTN"
                onClick={sendMessage}
                background={"purple"}
                color={"white"}
                border={"1px solid black"}
                borderRadius={"51px"}
                padding={"1rem 0"}
                margin={"0 2px"}
                _hover={{ background: "black", borderColor: "purple" }}
              >
                <IoSendSharp />
              </Button>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
