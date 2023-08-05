import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Center, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import React from "react";
import { useNavigate } from "react-router";

const ProfileModal = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          onClick={onOpen}
          display={{ base: "flex" }}
          icon={<ViewIcon />}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={"center"}>{user.sendUser.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={user.sendUser.pic}
              alt={user.sendUser.name}
            />

            <Text fontSize={"2xl"}><b>{user.sendUser.email}</b></Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
