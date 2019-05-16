import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

function TimerControls(props) {
  return (
    <Container>
      <Row className="justify-content-center mb-4">
        <Col xs="auto">
          <Button onClick={props.handleStart}>
            {"Start "} <i className="fas fa-play" />
          </Button>
        </Col>
        <Col xs="auto">
          <Button onClick={props.handleStop}>
            {"Pause "} <i className="fas fa-pause" />
          </Button>
        </Col>
        <Col xs="auto">
          <Button onClick={props.handleReset}>
            {"Reset "} <i className="fas fa-stop" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default TimerControls;
