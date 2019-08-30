import React, { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import SessionNav from "./sessionNav";
import ModalAbout from "./modalAbout";
import ModalSettings from "./modalSettings";
import schema from "./schema";

const Navigationbar = ({
  activeKeyInNav,
  onSelect,
  onChange,
  validateForm,
  saveChanges
}) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleToggleAbout = () => setShowAbout(!showAbout);

  const handleShowSettings = () => setShowSettings(!showSettings);

  // closes the modal for settings
  const handleCloseSettings = () => {
    if (validateForm(schema)) return;
    setShowSettings(false);
    saveChanges();
  };

  return (
    <>
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
              Settings <i className="fas fa-cog" />
            </Nav.Link>
            <Nav.Link onClick={handleToggleAbout}>
              About <i className="fas fa-question" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="d-flex flex-column flex-md-row flex-sm-row justify-content-center p-3 px-md-4 mb-3">
        <SessionNav {...{ activeKeyInNav, onSelect }} />
        <ModalAbout show={showAbout} onClose={handleToggleAbout} />
        <ModalSettings
          show={showSettings}
          onClose={handleCloseSettings}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Navigationbar;
