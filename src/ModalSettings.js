import React from "react";
import { Modal, Form, Col, Row, Button } from "react-bootstrap";

function ModalSettings(props) {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>Select the amount of time:</Form.Label>
          <Form.Group as={Row}>
            <Form.Label column sm="3">
              Work
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                name="workTime"
                value={props.workTime}
                onChange={props.handleChange}
              />
            </Col>
            <Form.Label column sm="3">
              Short break
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                onChange={props.handleChange}
                name="shortBreakTime"
                value={props.shortBreakTime}
              />
            </Col>
            <Form.Label column sm="3">
              Long break
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="text"
                onChange={props.handleChange}
                name="longBreakTime"
                value={props.longBreakTime}
              />
            </Col>
            <Form.Label column sm="3">
              Long break delay (in pomodoros)
            </Form.Label>
            <Col sm="9">
              <Form.Control
                type="number"
                onChange={props.handleChange}
                name="lBDelay"
                value={props.lBDelay}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSettings;
