import { Button, IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon, EditIcon } from "@chakra-ui/icons";
import { Image } from "@chakra-ui/image";
import { Text } from "@chakra-ui/layout";
import UpdateNameModal from "./UpdateNameModal";
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
  const loggedUser = JSON.parse(localStorage.getItem("userInfo")).sendUser.id;
  const updateName = useMemo(
    () => setName(JSON.parse(localStorage.getItem("userInfo")).sendUser.name),
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
            {loggedUser === user.id && (
              <UpdateNameModal user={user} off={onClose}>
                <EditIcon marginLeft={"12px"} cursor={"pointer"} />
              </UpdateNameModal>
            )}
          </ModalHeader>

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
            <Text fontSize={"2xl"}>
              <b>{user.email}</b>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose} color={"purple"} bg={"black"}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
