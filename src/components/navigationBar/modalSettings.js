import React from "react";
import { Modal, Form, Col, Row, Button } from "react-bootstrap";
import themes from "../../themes";

function ModalSettings({
  show,
  workTime,
  shortBreakTime,
  longBreakTime,
  lBDelay,
  theme,
  sound,
  onClose,
  onChange
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label
            className="d-flex justify-content-center py-2"
            style={{ fontWeight: "500" }}
          >
            Select the amount of time:
          </Form.Label>
          <Form.Group as={Row} className="justify-content-center">
            <Form.Label column sm="5">
              Work
            </Form.Label>
            <Col sm="5" className="mb-2">
              <Form.Control
                type="number"
                min="1"
                name="workTime"
                value={workTime}
                onChange={onChange}
              />
            </Col>
            <Form.Label column sm="5">
              Short break
            </Form.Label>
            <Col sm="5" className="mb-2">
              <Form.Control
                type="number"
                min="1"
                name="shortBreakTime"
                value={shortBreakTime}
                onChange={onChange}
              />
            </Col>
            <Form.Label column sm="5">
              Long break
            </Form.Label>
            <Col sm="5" className="mb-2">
              <Form.Control
                type="number"
                min="1"
                name="longBreakTime"
                value={longBreakTime}
                onChange={onChange}
              />
            </Col>
            <Form.Label column sm="5">
              Long break delay
            </Form.Label>
            <Col sm="5">
              <Form.Control
                type="number"
                min="0"
                name="lBDelay"
                value={lBDelay}
                onChange={onChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="d-flex justify-content-center mt-4">
            <Form.Label
              className="d-flex justify-content-center col-5 py-2"
              style={{ fontWeight: "500" }}
            >
              Choose theme
            </Form.Label>
            <Form.Control
              as="select"
              className="col-5 mb-2"
              name="theme"
              value={theme}
              onChange={onChange}
            >
              {themes.map(theme => (
                <option
                  key={theme.color}
                  value={theme.color}
                  data-max={theme.dataMax}
                  data-min={theme.dataMin}
                >
                  {theme.name}
                </option>
              ))}
            </Form.Control>
            <Col sm="1" />
          </Form.Group>
          <Form.Group as={Row}>
            <Form.Label
              className="d-flex justify-content-center col-6 py-2"
              style={{ fontWeight: "500" }}
            >
              Sound
            </Form.Label>
            <Form.Check
              inline
              className="col-2"
              type="radio"
              label="on"
              name="sound"
              value="on"
              checked={sound === "on"}
              onChange={onChange}
            />
            <Form.Check
              inline
              className="col-2"
              type="radio"
              label="off"
              name="sound"
              value="off"
              checked={sound === "off"}
              onChange={onChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-pill custom-btn"
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSettings;
