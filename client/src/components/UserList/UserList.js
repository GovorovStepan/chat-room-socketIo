import { Accordion, Card, Button, Badge } from "react-bootstrap";
import { RiRadioButtonLine } from "react-icons/ri";

// компонент принимает объект с пользователями
export const UserList = ({ users }) => {
  // преобразуем структуру в массив
  const usersArr = Object.entries(users);

  // количество активных пользователей
  const activeUsers = Object.values(users).filter((u) => u.online).length;
  const usersInRoom = Object.values(users).filter((u) => "/"+ u.roomId === document.location.pathname ).length;

  return (
    <>
    <Accordion>
      <Card>
        <Card.Header bg="none">
          <Accordion.Toggle
            as={Button}
            variant="dark"
            eventKey="0"
            style={{ textDecoration: "none" }}
          >
            Active users <Badge variant="info">{activeUsers}</Badge>
          </Accordion.Toggle>
        </Card.Header>
        {usersArr.map(([userId, obj]) => (
          <Accordion.Collapse eventKey="0" key={userId}>
            <Card.Body>
              <RiRadioButtonLine
                className={` ${obj.online ? "text-success" : "text-secondary"}`}
                size="0.8em"
              />{" "}
              {obj.username} in room "{<a href={obj.roomId}> {obj.roomId} </a>}"
            </Card.Body>
          </Accordion.Collapse>
        ))}
      </Card>
    </Accordion>
    <Accordion>
      <Card>
        <Card.Header bg="none">
          <Accordion.Toggle
            as={Button}
            variant="dark"
            eventKey="0"
            style={{ textDecoration: "none" }}
          >
            Users in this room <Badge variant="info">{usersInRoom}</Badge>
          </Accordion.Toggle>
        </Card.Header>
        {usersArr.map(([userId, obj]) => (
          <Accordion.Collapse eventKey="0" key={userId}>
            <Card.Body>
            {/* проверяем комнату в которой пользователь и онлайн ли он */}
            { "/"+ obj.roomId === document.location.pathname && obj.online ?  obj.username : ''}
            </Card.Body>
          </Accordion.Collapse>
        ))}
      </Card>
    </Accordion>

    </>

  );
};
