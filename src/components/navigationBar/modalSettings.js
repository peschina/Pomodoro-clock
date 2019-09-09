import React, { useContext, useState, useRef } from "react";
import { Modal, Form, Col, Row, Button } from "react-bootstrap";
import ReactNotification from "react-notifications-component";
import Joi from "joi-browser";
import { SettingContext } from "./../../settingsContext";
import schema from "./schema";
import themes from "../../themes";
import { addNotification, updateTheme } from "../../utils";
import "react-notifications-component/dist/theme.css";

function ModalSettings({ show, onClose, onSaveSetting }) {
  const { settings } = useContext(SettingContext);
  const [theme, setTheme] = useState("Violet");

  const { workTime, shortBreakTime, longBreakTime, lBDelay, sound } = settings;

  const notificationDOMRef = useRef();
  const workTimeRef = useRef(workTime);
  const shortBreakTimeRef = useRef(shortBreakTime);
  const longBreakTimeRef = useRef(longBreakTime);
  const lBDelayRef = useRef(lBDelay);
  const soundRef = useRef(sound);

  const renderInput = (label, name, value, min, ref) => (
    <>
      <Form.Label column sm="5">
        {label}
      </Form.Label>
      <Col sm="5" className="mb-2">
        <Form.Control
          type="number"
          min={min}
          defaultValue={value}
          {...{ name, ref }}
        />
      </Col>
    </>
  );

  const validateForm = schema => {
    const errors = validate(schema);
    if (errors) {
      const messages = Object.values(errors);
      messages.map(m => addNotification(m, "danger", notificationDOMRef));
    }
    return errors;
  };

  const validate = schema => {
    const work = workTimeRef.current.value;
    const shortBreak = shortBreakTimeRef.current.value;
    const longBreak = longBreakTimeRef.current.value;
    const delay = lBDelayRef.current.value;
    const { error } = Joi.validate(
      {
        work,
        shortBreak,
        longBreak,
        delay
      },
      schema,
      {
        abortEarly: false
      }
    );
    if (!error) return null;
    let errors = {};
    error.details.map(i => {
      errors[i.path[0]] = i.message;
    });
    return errors;
  };

  const updatePreviousSetting = (ref, previousSetting, name) => {
    const newSetting = ref.current.value;
    if (newSetting !== previousSetting)
      onSaveSetting({ name, value: newSetting });
  };

  const save = () => {
    if (validateForm(schema)) return;
    // update setting in state if needed
    updatePreviousSetting(workTimeRef, workTime, "workTime");
    updatePreviousSetting(shortBreakTimeRef, shortBreakTime, "shortBreakTime");
    updatePreviousSetting(longBreakTimeRef, longBreakTime, "longBreakTime");
    updatePreviousSetting(lBDelayRef, lBDelay, "lBDelay");
    const soundSetting = soundRef.current.checked ? "on" : "off";
    if (soundSetting !== sound)
      onSaveSetting({ name: "sound", value: soundSetting });
    updateTheme(theme);
  };

  return (
    <>
      <ReactNotification ref={notificationDOMRef} />
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
              {renderInput("Work", "workTime", workTime, 1, workTimeRef)}
              {renderInput(
                "Short Break",
                "shortBreakTime",
                shortBreakTime,
                1,
                shortBreakTimeRef
              )}
              {renderInput(
                "Long Break",
                "longBreakTime",
                longBreakTime,
                1,
                longBreakTimeRef
              )}
              {renderInput(
                "Long Break Delay",
                "lBDelay",
                lBDelay,
                0,
                lBDelayRef
              )}
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
                onChange={e => setTheme(e.target.value)}
              >
                {themes.map(({ color, name }) => (
                  <option key={color} value={name}>
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
                  key={value}
                  className="col-2"
                  type="radio"
                  label={value}
                  name="sound"
                  defaultChecked={sound === value}
                  ref={value === "on" ? soundRef : null}
                />
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rounded-pill custom-btn mr-3"
            variant="secondary"
            onClick={save}
          >
            Save
          </Button>
          <Button
            className="rounded-pill custom-btn"
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalSettings;
