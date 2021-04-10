import { useParams } from "react-router-dom";
import { MessageForm } from "../MessageForm/MessageForm.js";
import { MessageList } from "../MessageList/MessageList.js";
import { UserList } from "../UserList/UserList.js";
import { EnterNameModal } from "./EnterNameModal";
import { Container } from "react-bootstrap";
import { useLocalStorage } from "./../../hooks/useLocalStorage";
import { useChat } from "./../../hooks/useChat";

export function ChatRoom() {
  const { roomId } = useParams();
  const [username] = useLocalStorage("username");
  const { users, messages, sendMessage } = useChat(roomId);
  let show = false;


  /* Отображение модального окна ввода имени, 
    если пользователь зашел в комнату по ссылке, но до этого не пользовался чатом*/
  if (username === undefined || username === "unknown") show = true;

  return (
    <Container>
      <h2 className="text-center">Room ID: {roomId}</h2>
      <UserList users={users} />
      <MessageList messages={messages} />
      <MessageForm username={username} sendMessage={sendMessage} />
      <EnterNameModal show={show}></EnterNameModal>
      <div id="video-grid">

        </div>
    </Container>
  );
}
