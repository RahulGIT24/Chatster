import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import UpdateDetailsModal from "./UpdateDetailsModal";

const SideDrawer = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setSelectedChat, chats, setChats, setLoadingChat } =
    ChatState();
  const [pic, setPic] = useState(user.sendUser.pic);
  useMemo(
    () => setPic(JSON.parse(localStorage.getItem("userInfo")).sendUser.pic),
    [localStorage.getItem("userInfo")]
  );

  const toast = useToast();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      return toast({
        title: "Please enter a name or email",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      setLoading(false);
      return toast({
        title: "Error ocuured failed to load the search results",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const checkChat = (userID) => {
    const len = chats.length;
    // Logic to check whether chat is already created or not

    if (!len) {
      return false;
    }
    for (let index = 0; index < len; index++) {
      if (chats[index].isGroupChat === false) {
        if (
          userID === chats[index].users[1]._id ||
          userID === chats[index].users[0]._id
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const accessChat = async (userID) => {
    try {
      if (checkChat(userID)) {
        toast({
          title: "Chat is created already!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }

      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userID }, config);
      setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      return;
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        style={{
          backgroundImage:
            "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
          color: "white",
        }}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            bg={"purple"}
            color={"white"}
            _hover={{ color: "black" }}
          >
            <BiSearch />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat'Ster
        </Text>
        <div>
          {/* <Menu>
            <MenuButton paddingRight={2}>
              <NotificationBadge count={notification.length}>
                <BellIcon fontSize="2xl" m={1} />
              </NotificationBadge>
            </MenuButton>
            <MenuList pl={2} color={"black"}>
              {!notification.length && "No New Messages"}

              {notification.map((notif, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              style={{
                backgroundImage:
                  "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
                color: "white",
              }}
            >
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.sendUser.name}
                src={pic}
              />
            </MenuButton>
            <MenuList
              color={"black"}
              style={{
                backgroundImage:
                  "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
                color: "white",
              }}
            >
              <ProfileModal user={user.sendUser}>
                <MenuItem
                  style={{
                    backgroundImage:
                      "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
                    color: "white",
                  }}
                >
                  My Profile
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <UpdateDetailsModal
                user={user.sendUser}
                off={onClose}
                type={user.sendUser.actype}
              >
                <MenuItem
                  style={{
                    backgroundImage:
                      "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
                    color: "white",
                  }}
                >
                  Update Profile
                </MenuItem>
              </UpdateDetailsModal>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                style={{
                  backgroundImage:
                    "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
                  color: "white",
                }}
              >
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          style={{
            backgroundImage:
              "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
            color: "white",
          }}
        >
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search user here"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch} bg={"black"} color={"purple"}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                );
              })
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
