import React from "react";
import { Nav } from "react-bootstrap";

function Navigationbar(props) {
  return (
    <Nav
      variant="tabs"
      key={props.activeKeyInNav}
      defaultActiveKey={props.activeKeyInNav}
      className="justify-content-center"
      onSelect={selectedKey => props.handleSelect(`${selectedKey}`)}
    >
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Session
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link name="work" eventKey="work">
          Work
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link name="shortBreak" eventKey="shortBreak">
          Short break
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link name="longBreak" eventKey="longBreak">
          Long break
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Navigationbar;
