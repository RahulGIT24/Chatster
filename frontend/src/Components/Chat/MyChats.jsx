import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Stack, Text, Tooltip, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import ChatLoading from "../Misc/ChatLoading";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../Misc/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, setSelectedChat, chats, setChats, SelectedChat } = ChatState();

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = await axios.get("/api/chat/", config);
      setChats(data);
      setLoading(false);
      return;
    } catch (e) {
      return toast({
        title: "Error ocuured",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Function to accept a request
  const accceptChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };
      await axios.put(`/api/chat/accept-chat/`,{chatId}, config);
      fetchChats();
      toast({
        title: "Request Accepted",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    } catch (e) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(e.response)
      return;
    }
  };

  // Function to accept a request
  const rejectChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };
      await axios.delete(`/api/chat/reject-chat/${chatId}`, config);
      fetchChats();
      toast({
        title: "Request Rejected",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    } catch (e) {
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(e.response)
      return;
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const selectChat = (chat) => {
    if (chat.isRejected === "Pending") {
      return;
    }
    setSelectedChat(chat);
  };

  return (
    <Box
      display={{ base: SelectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      p={3}
      bg={"black"}
      color={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            bg={"purple"}
            color={"white"}
            _hover={{
              color: "black",
            }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        style={{
          backgroundImage:
            "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
          color: "white",
        }}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats && !loading ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => {
                    selectChat(chat);
                  }}
                  cursor={"pointer"}
                  color={"white"}
                  bg={SelectedChat === chat ? "purple" : "black"}
                  px={3}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Box>
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                    </Box>
                    {chat.isRejected === "Pending" &&
                    chat.creator !== user.sendUser.id ? (
                      <Box>
                        <Tooltip label="Reject" hasArrow placement="bottom-end">
                          <Button
                            border={"1px"}
                            borderColor={"purple"}
                            backgroundColor={"black"}
                            color={"white"}
                            _hover={{ background: "purple", color: "black" }}
                            cursor={"pointer"}
                            onClick={() => {
                              rejectChat(chat._id)
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </Tooltip>
                        <Tooltip label="Accept" hasArrow placement="bottom-end">
                          <Button
                            border={"1px"}
                            borderColor={"purple"}
                            backgroundColor={"black"}
                            color={"white"}
                            _hover={{ background: "purple", color: "black" }}
                            cursor={"pointer"}
                            onClick={() => {
                              accceptChat(chat._id);
                            }}
                          >
                            <CheckIcon />
                          </Button>
                        </Tooltip>
                      </Box>
                    ) : (
                      ""
                    )}
                  </Box>
                  <i>
                    {chat.isRejected === "Pending" &&
                      chat.creator === user.sendUser.id &&
                      `(Pending)`}
                  </i>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
            <ChatLoading />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
