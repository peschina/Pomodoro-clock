import React from "react";
import { Nav } from "react-bootstrap";

const renderNavItem = (name, label) => (
  <Nav.Item>
    <Nav.Link className="rounded-pill" name={name} eventKey={name}>
      {label}
    </Nav.Link>
  </Nav.Item>
);

const SessionNav = ({ activeKeyInNav, onSelect }) => (
  <Nav
    className="justify-content-center"
    variant="pills"
    key={activeKeyInNav}
    defaultActiveKey={activeKeyInNav}
    onSelect={onSelect}
  >
    {renderNavItem("work", "Work")}
    {renderNavItem("shortBreak", "Short break")}
    {renderNavItem("longBreak", "Long break")}
  </Nav>
);

export default SessionNav;
