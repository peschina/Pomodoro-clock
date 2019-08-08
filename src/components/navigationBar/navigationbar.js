import React, { Component } from "react";
import { Nav, Navbar } from "react-bootstrap";
import ModalAbout from "./modalAbout";
import ModalSettings from "./modalSettings";

class Navigationbar extends Component {
  state = {
    showAbout: false,
    showSettings: false
  };

  handleShowAbout = () => {
    this.setState({ showAbout: true });
  };

  handleCloseAbout = () => {
    this.setState({ showAbout: false });
  };

  handleShowSettings = () => {
    this.setState({ showSettings: true });
  };

  // closes the modal for settings
  handleCloseSettings = () => {
    const { validateForm, saveChanges } = this.props;
    const errors = validateForm();
    if (errors) return;
    this.setState({ showSettings: false });
    saveChanges();
  };

  renderNavItem = (name, label) => {
    return (
      <Nav.Item>
        <Nav.Link className="rounded-pill" name={name} eventKey={name}>
          {label}
        </Nav.Link>
      </Nav.Item>
    );
  };

  render() {
    const {
      activeKeyInNav,
      workTime,
      shortBreakTime,
      longBreakTime,
      lBDelay,
      theme,
      sound,
      onSelect,
      onChange
    } = this.props;
    const { showAbout, showSettings } = this.state;
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
              <Nav.Link onClick={this.handleShowSettings}>
                {"Settings "}
                <i className="fas fa-cog" />
              </Nav.Link>
              <Nav.Link onClick={this.handleShowAbout}>
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
            {this.renderNavItem("work", "Work")}
            {this.renderNavItem("shortBreak", "Short break")}
            {this.renderNavItem("longBreak", "Long break")}
          </Nav>
          <ModalAbout show={showAbout} onClose={this.handleCloseAbout} />
          <ModalSettings
            show={showSettings}
            workTime={workTime}
            shortBreakTime={shortBreakTime}
            longBreakTime={longBreakTime}
            lBDelay={lBDelay}
            theme={theme}
            sound={sound}
            onClose={this.handleCloseSettings}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }
}

export default Navigationbar;
