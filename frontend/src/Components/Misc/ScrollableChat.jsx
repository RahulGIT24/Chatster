import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { useEffect, useRef } from "react";

const ScrollableChat = ({ messages }) => {
  const time = (sendTime) => {
    const timestamp = sendTime;

    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const time = `${hours}:${minutes}`;

    return time;
  };

  const { user } = ChatState();
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom when component is mounted or messages are updated
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div ref={containerRef} style={{ overflowY: "scroll", height: "60vh" }}>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", color: "white" }} key={m._id}>
            {(isSameSender(messages, m, i, user.sendUser.id) ||
              isLastMessage(messages, i, user.sendUser.id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user.sendUser.id ? "purple" : "black"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  m,
                  i,
                  user.sendUser.id
                ),
                marginTop: isSameUser(messages, m, i, user.sendUser.id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
              <p style={{ fontSize: "0.7rem" }}>{time(m.createdAt)}</p>
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
