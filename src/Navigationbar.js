import React from "react";
import { Nav } from "react-bootstrap";

function Navigationbar(props) {
  return (
    <Nav
      variant="tabs"
      defaultActiveKey={(props.activeKeyInNav, () => console.log("received"))}
      onSelect={k => props.handleSelect(k)}
    >
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Session
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link name="work" eventKey="work" onClick={props.handleSession}>
          Work
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          name="shortBreak"
          eventKey="shortBreak"
          onClick={props.handleSession}
        >
          Short break
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          name="longBreak"
          eventKey="longBreak"
          onClick={props.handleSession}
        >
          Long break
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navigationbar;
