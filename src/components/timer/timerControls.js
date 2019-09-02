import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

function renderButton(func, name, action) {
  return (
    <Col xs="auto">
      <Button
        className="rounded-pill"
        style={{
          background: "white",
          color: "black",
          border: "white"
        }}
        onClick={func}
      >
        {name} <i className={`fas fa-${action}`} />
      </Button>
    </Col>
  );
}

const TimerControls = ({ onStart, onStop, onReset }) => {
  return (
    <Container className="pb-5">
      <Row className="justify-content-center ">
        {renderButton(onStart, "start", "play")}
        {renderButton(onStop, "pause", "pause")}
        {renderButton(onReset, "reset", "stop")}
      </Row>
    </Container>
  );
};

export default TimerControls;
