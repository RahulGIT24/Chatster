import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";
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

const ProfileModal = ({ user, children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          onClick={onOpen}
          display={{ base: "flex"}}
          icon={<ViewIcon />}
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent style={{backgroundImage: "linear-gradient(to right top, #051937, #171228, #190a1a, #12040d, #000000)", color:'white'}}>
          <ModalHeader textAlign={"center"}>{user.name}</ModalHeader>
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
              src={user.pic}
              alt={user.name}
            />

            <Text fontSize={"2xl"}><b>{user.email}</b></Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} color={'purple'} bg={"black"}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
