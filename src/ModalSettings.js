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
            <Col sm="5" className="mb-md-2 mb-sm-2">
              <Form.Control
                type="number"
                name="workTime"
                value={props.workTime.slice(0, -3)}
                onChange={props.handleChange}
              />
            </Col>
            <Form.Label column sm="5">
              Short break
            </Form.Label>
            <Col sm="5" className="mb-md-2 mb-sm-2">
              <Form.Control
                type="number"
                onChange={props.handleChange}
                name="shortBreakTime"
                value={props.shortBreakTime.slice(0, -3)}
              />
            </Col>
            <Form.Label column sm="5">
              Long break
            </Form.Label>
            <Col sm="5" className="mb-md-2 mb-sm-2">
              <Form.Control
                type="number"
                onChange={props.handleChange}
                name="longBreakTime"
                value={props.longBreakTime.slice(0, -3)}
              />
            </Col>
            <Form.Label column sm="5">
              Long break delay
            </Form.Label>
            <Col sm="5">
              <Form.Control
                type="number"
                onChange={props.handleChange}
                name="lBDelay"
                value={props.lBDelay}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="d-flex justify-content-center mt-4">
            <Form.Label
              className="d-flex justify-content-center col-5 mb-md-2 mb-sm-2 py-2"
              style={{ fontWeight: "500" }}
            >
              Choose theme
            </Form.Label>
            <Form.Control
              as="select"
              name="theme"
              className="col-5 mb-md-2 mb-sm-2"
              value={props.theme}
              onChange={props.handleChange}
            >
              <option value="violet" data-max="#6e00ff" data-min="#bb00ff">
                Violet
              </option>
              <option value="blue" data-max="#3030ff" data-min="#306eff">
                Blue
              </option>
              <option value="green" data-max={"#208537"} data-min={"#28a745"}>
                Green
              </option>
              <option value="orchid" data-max="#b241ce" data-min="#c269d8">
                Orchid
              </option>
              <option value="turquoise" data-max="#00b5b8" data-min="#00e7eb">
                Turquoise
              </option>
              <option value="dodgerBlue" data-max="#0483ff" data-min="#389dff">
                Dodger blue
              </option>
              <option value="purple" data-max="#6a6ae2" data-min="#9494ea">
                Purple
              </option>
              <option value="orange" data-max="#ff7f00" data-min="#ff9933">
                Orange
              </option>
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
            <Form.Check inline label="on" type="radio" name="sound" value="on" checked={props.sound === "on"} onChange={props.handleChange} className="col-2" />
            <Form.Check inline label="off" type="radio" name="sound" value="off" checked={props.sound === "off"} onChange={props.handleChange} className="col-2" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={props.handleClose}
          className="rounded-pill custom-btn"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalSettings;
