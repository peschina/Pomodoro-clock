import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import "./styles.css";

function Navigationbar(props) {
  return (
    <div>
      <Navbar
        variant="dark"
        collapseOnSelect
        expand="lg"
        className="justify-content-between border-bottom"
      >
        <Navbar.Brand href="#home">Ticki</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          className="justify-content-end"
          style={{ color: "white" }}
        >
          <Nav>
            <Nav.Link href="#home">
              {"Home "}
              <i className="fas fa-home" />
            </Nav.Link>
            <Nav.Link onClick={props.handleShow}>
              {"Settings "}
              <i className="fas fa-cog" />
            </Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="d-flex flex-column flex-md-row flex-sm-row justify-content-center p-3 px-md-4 mb-3">
        <Nav
          variant="pills"
          key={props.activeKeyInNav}
          defaultActiveKey={props.activeKeyInNav}
          className="justify-content-center"
          onSelect={selectedKey => props.handleSelect(`${selectedKey}`)}
        >
          <Nav.Item>
            <Nav.Link className="rounded-pill" name="work" eventKey="work">
              Work
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="rounded-pill"
              name="shortBreak"
              eventKey="shortBreak"
            >
              Short break
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className="rounded-pill"
              name="longBreak"
              eventKey="longBreak"
            >
              Long break
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
}

export default Navigationbar;
