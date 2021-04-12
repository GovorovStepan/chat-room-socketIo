import { useRef, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import { MessageListItem } from "./MessageListItem";

const listStyles = {
  height: "80vh",
  border: "1px solid rgba(0,0,0,.4)",
  borderRadius: "4px",
  overflow: "auto",
};

export const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);


  // прокручиваем контайнер сообщений  вниз при отправке сообщения
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <ListGroup variant="flush" style={listStyles}>
        {messages.map((msg) => (
          <MessageListItem key={msg.Id} msg={msg} />
        ))}
        <span ref={messagesEndRef}></span>
      </ListGroup>
    </>
  );
};
