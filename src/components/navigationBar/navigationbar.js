import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import SessionNav from "./sessionNav";
import ModalAbout from "./modalAbout";
import ModalSettings from "./modalSettings";
import schema from "./schema";

const Navigationbar = ({
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
}) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const handleShowSettings = () => {
    setShowSettings(!showSettings);
  };

  // closes the modal for settings
  const handleCloseSettings = () => {
    const errors = validateForm(schema);
    if (errors) return;
    setShowSettings(false);
    saveChanges();
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
        <SessionNav activeKeyInNav={activeKeyInNav} onSelect={onSelect} />
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
