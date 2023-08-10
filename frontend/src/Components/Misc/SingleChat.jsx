import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import ProfileModal from "./ProfileModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, SelectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {SelectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
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
              }}
            />
            {SelectedChat.isGroupChat === true? (
              <>
                {SelectedChat.chatName.toUpperCase()}
                {/* <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                /> */}
              </>
            ) : (
              <>
                {getSender(user, SelectedChat.users, setFetchAgain)}
                {/* // TODO */}
                <ProfileModal user={SelectedChat.users[1]}/>
              </>
            )}
          </Text>
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
