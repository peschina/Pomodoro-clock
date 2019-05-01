import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

function TimerControls(props) {
  return (
    <Container>
      <Row className="justify-content-center mb-4">
        <Col md="auto">
          <Button onClick={props.handleStart}>Start</Button>
        </Col>
        <Col md="auto">
          <Button onClick={props.handleStop}>Pause</Button>
        </Col>
        <Col md="auto">
          <Button onClick={props.handleReset}>Reset</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default TimerControls;
