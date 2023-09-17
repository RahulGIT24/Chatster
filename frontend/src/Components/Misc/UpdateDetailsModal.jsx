import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { FormControl, FormLabel, VStack } from "@chakra-ui/react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const UpdateDetailsModal = ({ children, user, off }) => {
  const { postDetails, picLoading, pic, setPic } = ChatState();
  const toast = useToast();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo")).sendUser.id;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onChange = (e) => {
    setName(e.target.value);
  };

  const handleClick = async () => {
    if (!name && !pic) {
      toast({
        title: "Please Upload Sufficient Details",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      await axios.put(
        `/api/user/changeName/${loggedUser}`,
        {
          name: name,
          pic: pic,
        },
        config
      );

      const info = JSON.parse(localStorage.getItem("userInfo"));
      let oldData = info.sendUser;
      if (name && pic) {
        oldData.name = name;
        oldData.pic = pic;
      } else if (name) {
        oldData.name = name;
      } else if (pic) {
        oldData.pic = pic;
      }
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ sendUser: oldData, success: info.success })
      );

      setLoading(false);
      onClose();
      off();
      setPic("");
      toast({
        title: "Details updated successfully!",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      return;
    } catch (error) {
      console.log(error);
      toast({
        title: "Internal Server Error",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            backgroundImage:
              "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)",
            color: "white",
          }}
        >
          <ModalHeader
            textAlign={"center"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            Update Your Details
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            pb={"2rem"}
          >
            <VStack spacing={"5px"}>
              <FormControl id="pic" margin={"12px 0"}>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter your name"
                  onChange={onChange}
                  borderColor={"purple"}
                />
              </FormControl>
              <FormControl id="pic" margin={"12px 0"}>
                <FormLabel>Profile Picture</FormLabel>
                <Input
                  type="file"
                  p={1.5}
                  accept="image/"
                  onChange={(e) => postDetails(e.target.files[0])}
                  bg={"black"}
                  color={"purple"}
                  borderColor={"purple"}
                />
              </FormControl>
            </VStack>
            <Button
              ml={3}
              color={"purple"}
              bg={"black"}
              isLoading={loading || picLoading}
              onClick={handleClick}
            >
              Update
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateDetailsModal;
