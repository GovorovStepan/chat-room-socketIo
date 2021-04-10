import { Modal, Button, Form } from "react-bootstrap";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useState} from "react";

export function EnterNameModal({show}) {
    // eslint-disable-next-line no-unused-vars
    const [username, setUsername] = useLocalStorage("username");


    const [reason, setShow] = useState(show);

    const handleChangeName = () => {
        setUsername(document.querySelector('#getName').value);
        setShow(false);
      };

    return (
      <>
        <Modal
          show={reason}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Body>
            <Form
              style={{ maxWidth: "320px", margin: "0 auto" }} 
            >
              <Form.Group>
                <Form.Label>Please enter your name to start chatting:</Form.Label>
                <Form.Control id = "getName" />
              </Form.Group>
            </Form>
          </Modal.Body>
            <Button onClick={handleChangeName}>Submit</Button>
        </Modal>
      </>
    );
  }