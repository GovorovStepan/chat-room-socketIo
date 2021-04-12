import { useParams } from "react-router-dom";
import { MessageForm } from "../MessageForm/MessageForm.js";
import { MessageList } from "../MessageList/MessageList.js";
import { UserList } from "../UserList/UserList.js";
import { EnterNameModal } from "./EnterNameModal";
import { Container, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useLocalStorage } from "./../../hooks/useLocalStorage";
import { useChat } from "./../../hooks/useChat";

export function ChatRoom() {
  const gridStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    paddingTop: "20px",
    alignContent: "space-evenly",
    flexWrap: "wrap",
  };

  const { roomId } = useParams();
  let [username] = useLocalStorage("username");
  const { users, messages, sendMessage, videoShow, videoHide } = useChat(
    roomId
  );
  let show = false;

  /* Отображение модального окна ввода имени, 
    если пользователь зашел в комнату по ссылке, но до этого не пользовался чатом*/
  if (username === undefined || username === "unknown") {
    show = true;
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      If you are a host, then disconnect all users from yourself, you will
      remain a host until you refresh the page. Other users still can connect to
      you again
    </Tooltip>
  );

  return (
    <Container>
      <h2 className="text-center">Room ID: {roomId}</h2>
      {/* eslint-disable-next-line */}
      <h3 className="text-center" id="hostName"></h3>
      <Button variant="info" onClick={videoShow}>
        Start video chat
      </Button>{" "}
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <Button variant="info" onClick={videoHide}>
          Finish video chat
        </Button>
      </OverlayTrigger>
      <div id="video-grid" style={gridStyle}></div>
      <UserList users={users} />
      <MessageList messages={messages} />
      <MessageForm username={username} sendMessage={sendMessage} />
      <EnterNameModal show={show}></EnterNameModal>
    </Container>
  );
}
