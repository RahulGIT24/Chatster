import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leave, setLeave] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();

  const { user, SelectedChat, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRemove = async (user1) => {
    if (SelectedChat.groupAdmin._id === user1._id) {
      toast({
        title: "Admin can't remove himself from the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (user.sendUser.id !== SelectedChat.groupAdmin._id) {
      toast({
        title: "Only group admins can remove group members",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/groupRemove`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }

    setSearch(query);

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
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (SelectedChat.groupAdmin._id !== user.sendUser.id) {
      toast({
        title: "Only Admin can add user to group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (SelectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/groupAdd`,
        {
          chatId: SelectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      toast({
        title: "User Added Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleRename = async () => {
    if (SelectedChat.groupAdmin._id !== user.sendUser.id) {
      toast({
        title: "Only Admin can change group name",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };

      const { data } = axios.put(
        `/api/chat/rename`,
        {
          chatID: SelectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setFetchAgain(true);
      setSelectedChat(data);
      setRenameLoading(false);
      onClose();
      toast({
        title: "Group renamed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      setRenameLoading(false);
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const leaveGroup = async (user1) => {
    try {
      setLeave(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.sendUser.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupRemove`,
        {
          chatId: SelectedChat._id,
          userId: user1.id,
        },
        config
      );
      setLoading(false);
      setFetchAgain(!fetchAgain);
      setSelectedChat();
      toast({
        title: "You Left the group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } catch (error) {
      setLeave(false);
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };
  return (
    <>
      <IconButton display={"flex"} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {SelectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {SelectedChat.users.map((u) => {
                return (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                );
              })}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Rename Group"
                mb={3}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Rename
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {loading ? (
                <Spinner size="lg" />
              ) : (
                searchResults?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => leaveGroup(user.sendUser)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
