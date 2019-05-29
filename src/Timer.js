import React from "react";
import { Row, Col } from "react-bootstrap";

function Timer(props) {
  return (
    <Row className="mt-3 mb-3">
      <Col />
      <Col>
        <svg viewBox="0 0 100 100">
          <circle r="40" cx="50" cy="50" />
          <text transform="rotate(90) scale(-1,1) translate(-70,-45)">
            {props.currentTime}
          </text>
        </svg>
      </Col>
      <Col>
        <span
          style={{ color: "white" }}
          className="d-flex justify-content-center"
        >
          Pomodoros completed: {props.pomodorosCompleted}
        </span>
      </Col>
    </Row>
  );
}

export default Timer;
