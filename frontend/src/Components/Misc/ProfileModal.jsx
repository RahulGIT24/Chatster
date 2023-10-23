import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon, EditIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";
import UpdateDetailsModal from "./UpdateDetailsModal";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import React, { useMemo, useState } from "react";

const ProfileModal = ({ user, children }) => {
  const [name, setName] = useState(user.name);
  const [pic, setPic] = useState(user.pic)
  const loggedUser = JSON.parse(localStorage.getItem("userInfo")).sendUser.id;

  useMemo(
    () => setName(JSON.parse(localStorage.getItem("userInfo")).sendUser.name),
    [localStorage.getItem("userInfo")]
  );
  useMemo(
    () => setPic(JSON.parse(localStorage.getItem("userInfo")).sendUser.pic),
    [localStorage.getItem("userInfo")]
  );

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
            {loggedUser === user.id ? `${name}` : `${user.name}`}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            marginBottom={'2rem'}
          >
            <Image
              borderRadius={"full"}
              boxSize={"150px"}
              src={loggedUser === user.id ? `${pic}`:`${user.pic}`}
              alt={user.name}
            />
            <Text fontSize={"2xl"}>
              <b>{user.email}</b>
            </Text>
            {/* <Text fontSize={"2xl"}>
              <i>Account Type - {user.actype?user.actype:"Public"}</i>
            </Text> */}
          </ModalBody>
          {/* <ModalFooter display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Button mr={3} onClick={onClose} color={"purple"} bg={"black"}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
