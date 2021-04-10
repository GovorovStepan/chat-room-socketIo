import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Form, Button } from "react-bootstrap";

export function Home() {
  // создаем и записываем в локальное хранилище имя пользователя или извлекаем его из хранилища
  const [username, setUsername] = useLocalStorage("username", "Peter");
  // локальное состояние для комнаты
  const [roomId, setRoomId] = useState("meeting");
  const linkRef = useRef(null);

  // обрабатываем изменение имени пользователя
  const handleChangeName = (e) => {
    setUsername(e.target.value);
  };
  // обрабатываем изменение комнаты
  const handleChangeRoom = (e) => {
    setRoomId(e.target.value);
  };

  // имитируем отправку формы
  const handleSubmit = (e) => {
    e.preventDefault();
    linkRef.current.click();
  };
  console.log(document.location.pathname);

  const trimmed = username.trim();

  return (
    <Form
      style={{ maxWidth: "320px", margin: "0 auto" }}
      onSubmit={handleSubmit}
    >
      <Form.Group>
        <Form.Label>Name:</Form.Label>
        <Form.Control value={username} onChange={handleChangeName} />
      </Form.Group>
      <Form.Group>
        <Form.Label>Room:</Form.Label>
        <Form.Control as="select" value={roomId} onChange={handleChangeRoom}>
          <option value="meeting">Meeting room</option>
          <option value="disputes">Disputes</option>
          <option >Create your own</option>
        </Form.Control>
      </Form.Group>
      {trimmed && (
        <Button variant="success" as={Link} to={roomId === "Create your own"?  `${nanoid(8)}`: `${roomId}`} ref={linkRef}>
          Start
        </Button>
      )}
    </Form>
  );
}
