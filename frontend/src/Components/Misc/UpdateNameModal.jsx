import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { VStack } from "@chakra-ui/react";
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
import { useNavigate } from "react-router-dom";

const UpdateNameModal = ({ children, user, off }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const loggedUser = JSON.parse(localStorage.getItem("userInfo")).sendUser.id;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const onChange = (e) => {
    setName(e.target.value);
  };

  const handleClick = async () => {
    if (!name) {
      toast({
        title: "Please enter a name",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.put(
        `/api/user/changeName/${loggedUser}`,
        {
          name: name,
        },
        config
      );

      const info = JSON.parse(localStorage.getItem("userInfo"));
      let oldData = info.sendUser;
      oldData.name = name;
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ sendUser: oldData, success: info.success })
      );

      setLoading(false);
      onClose();
      off();
      toast({
        title: "Name updated successfully!",
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
            Update Your Name
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            pb={"2rem"}
          >
            <VStack spacing={"5px"}>
              <Input
                placeholder="Enter your name"
                onChange={onChange}
                borderColor={"purple"}
              />
            </VStack>
            <Button
              ml={3}
              color={"purple"}
              bg={"black"}
              isLoading={loading}
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

export default UpdateNameModal;
