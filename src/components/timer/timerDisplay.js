import React from "react";
import { Row, Col } from "react-bootstrap";

function TimerDisplay({ currentTime }) {
  return (
    <Row className="mt-3 mb-3">
      <Col />
      <Col>
        <svg viewBox="0 0 100 100">
          <circle r="40" cx="50" cy="50" />
          <text transform="rotate(90) scale(-1,1) translate(-70,-45)">
            {currentTime}
          </text>
        </svg>
      </Col>
      <Col />
    </Row>
  );
}

export default TimerDisplay;
