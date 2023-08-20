import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import SignUp from "../Components/Authentication/SignUp";
import { useNavigate } from "react-router";

const Home = () => {
  const [user, setUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chats");
    }
    setUser(userInfo);
  }, [navigate]);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        display={"flex"}
        justifyContent={"center"}
        p={3}
        bg={"black"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"3xl"}
        borderWidth={"1px"}
        borderColor={"purple"}
      >
        <Text fontSize={"2xl"} fontFamily={"Work sans"} color={"white"}>
          Chat'Ster
        </Text>
      </Box>
      <Box
        bg={"black"}
        p={4}
        borderColor={"purple"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        w="100%"
        color={"white"}
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
