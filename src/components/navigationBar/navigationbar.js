import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import Joi from "joi-browser";
import ModalAbout from "./modalAbout";
import ModalSettings from "./modalSettings";

const Navigationbar = props => {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    activeKeyInNav,
    workTime,
    shortBreakTime,
    longBreakTime,
    lBDelay,
    theme,
    sound,
    onSelect,
    onChange,
    validateForm,
    saveChanges
  } = props;

  const handleToggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
  };

  const schema = {
    workTime: Joi.number()
      .required()
      .min(1)
      .label("Time for work"),
    shortBreakTime: Joi.number()
      .required()
      .min(1)
      .label("Time for short break"),
    longBreakTime: Joi.number()
      .required()
      .min(1)
      .label("Time for long break"),
    lBDelay: Joi.number()
      .required()
      .label("Long break delay")
  };

  // closes the modal for settings
  const handleCloseSettings = () => {
    const errors = validateForm(schema);
    if (errors) return;
    setShowSettings(false);
    saveChanges();
  };

  const renderNavItem = (name, label) => {
    return (
      <Nav.Item>
        <Nav.Link className="rounded-pill" name eventKey={name}>
          {label}
        </Nav.Link>
      </Nav.Item>
    );
  };

  return (
    <div>
      <Navbar
        className="justify-content-between border-bottom"
        variant="dark"
        collapseOnSelect
        expand="lg"
      >
        <Navbar.Brand disabled>Ticki</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          style={{ color: "white" }}
        >
          <Nav>
            <Nav.Link onClick={handleShowSettings}>
              {"Settings "}
              <i className="fas fa-cog" />
            </Nav.Link>
            <Nav.Link onClick={handleToggleAbout}>
              {"About "}
              <i className="fas fa-question" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="d-flex flex-column flex-md-row flex-sm-row justify-content-center p-3 px-md-4 mb-3">
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
        <ModalAbout show={showAbout} onClose={handleToggleAbout} />
        <ModalSettings
          show={showSettings}
          workTime={workTime}
          shortBreakTime={shortBreakTime}
          longBreakTime={longBreakTime}
          lBDelay={lBDelay}
          theme={theme}
          sound={sound}
          onClose={handleCloseSettings}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Navigationbar;
