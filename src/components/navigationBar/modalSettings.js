import React, { useContext } from "react";
import { Modal, Form, Col, Row, Button } from "react-bootstrap";
import { SettingContext } from "./../../settingsContext";
import themes from "../../themes";

function ModalSettings({ show, onClose, onChange }) {
  const { settings } = useContext(SettingContext);
  const {
    workTime,
    shortBreakTime,
    longBreakTime,
    lBDelay,
    sound,
    theme
  } = settings;

  const renderInput = (label, name, value, min) => (
    <>
      <Form.Label column sm="5">
        {label}
      </Form.Label>
      <Col sm="5" className="mb-2">
        <Form.Control type="number" min={min} {...{ name, value, onChange }} />
      </Col>
    </>
  );

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
            {renderInput("Work", "workTime", workTime, 1)}
            {renderInput("Short Break", "shortBreakTime", shortBreakTime, 1)}
            {renderInput("Long Break", "longBreakTime", longBreakTime, 1)}
            {renderInput("Long Break Delay", "lBDelay", lBDelay, 0)}
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
              {themes.map(({ color, dataMax, dataMin, name }) => (
                <option
                  key={color}
                  value={color}
                  data-max={dataMax}
                  data-min={dataMin}
                >
                  {name}
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
            {["on", "off"].map(value => (
              <Form.Check
                inline
                className="col-2"
                type="radio"
                label={value}
                name="sound"
                checked={sound === value}
                {...{ value, onChange }}
              />
            ))}
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
