import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";

function Navigationbar(props) {
  return (
    <Navbar className="justify-content-center" bg="light">
      <Navbar.Brand>Session</Navbar.Brand>
      <Nav.Item>
        <Button name="work" onClick={props.handleSession} variant="light">
          Work
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          name="shortBreak"
          onClick={props.handleSession}
          variant="light"
        >
          Short break
        </Button>
      </Nav.Item>
      <Nav.Item>
        <Button
          name="longBreak"
          onClick={props.handleSession}
          variant="light"
        >
          Long break
        </Button>
      </Nav.Item>
    </Navbar>
  );
}

export default Navigationbar;
