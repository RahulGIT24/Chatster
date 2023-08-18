// Imports
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/Misc/SideDrawer";
import MyChats from "../Components/Misc/MyChats";
import ChatBox from "../Components/Misc/ChatBox";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  return (
    <div style={{ width: "100vw", backgroundImage: "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)", color:'white' }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  );
};

export default Chat;
