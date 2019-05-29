import React from "react";
import { Row, Col, Button, Container } from "react-bootstrap";

function TimerControls(props) {
  return (
    <Container className="pb-5">
      <Row className="justify-content-center ">
        <Col xs="auto">
          <Button
            onClick={props.handleStart}
            className="rounded-pill"
            style={{
              background: "white",
              color: "black",
              border: "white"
            }}
          >
            {"Start "} <i className="fas fa-play" />
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            onClick={props.handleStop}
            className="rounded-pill"
            style={{
              background: "white",
              color: "black",
              border: "white"
            }}
          >
            {"Pause "} <i className="fas fa-pause" />
          </Button>
        </Col>
        <Col xs="auto">
          <Button
            onClick={props.handleReset}
            className="rounded-pill"
            style={{
              background: "white",
              color: "black",
              border: "white"
            }}
          >
            {"Reset "} <i className="fas fa-stop" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default TimerControls;
