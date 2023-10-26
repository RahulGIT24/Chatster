import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  const { loadingChat } = ChatState();
  return (
    <Box
      id={loadingChat ? "userItem" : ""}
      onClick={handleFunction}
      cursor="pointer"
      bg="black"
      _hover={{
        background: "purple",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="white"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
        <Text fontSize="xs">
          <b>Account Type: </b>
          {user.actype}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
