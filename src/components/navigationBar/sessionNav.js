import React from "react";
import { Nav } from "react-bootstrap";

const SessionNav = ({ activeKeyInNav, onSelect }) => {
  const renderNavItem = (name, label) => {
    return (
      <Nav.Item>
        <Nav.Link className="rounded-pill" name={name} eventKey={name}>
          {label}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <Nav
      className="justify-content-center"
      variant="pills"
      key={activeKeyInNav}
      defaultActiveKey={activeKeyInNav}
      onSelect={selectedKey => onSelect(`${selectedKey}`)}
    >
      {renderNavItem("work", "Work")}
      {renderNavItem("shortBreak", "Short break")}
      {renderNavItem("longBreak", "Long break")}
    </Nav>
  );
};

export default SessionNav;
