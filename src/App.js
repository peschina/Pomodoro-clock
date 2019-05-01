import React from "react";
import { Container, Row, Button, Col, ListGroup } from "react-bootstrap";
import Navigationbar from "./Navigationbar";
import TimerControls from "./TimerControls";
import ModalSettings from "./ModalSettings";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // prop used by SetInterval and ClearInterval
      timerId: 0,
      start: 0,
      // this property is used by tick method
      startTime: "00:25",
      // value displayed by timer
      currentTime: "",
      workTime: "00:25",
      shortBreakTime: "00:10",
      longBreakTime: "00:30",
      // how many pomodoros before long break
      lBDelay: 4,
      // session is Ready when startTime is updated
      sessionReady: "work",
      workRunning: false,
      shortBreakRunning: false,
      longBreakRunning: false,
      // displays modal when toggled
      showSettings: false
    };
  }

  updateCurrentTime = () => {
    if (this.state.shortBreakRunning === true) {
      this.setState({ currentTime: this.state.shortBreakTime });
    }
    if (this.state.longBreakRunning === true) {
      this.setState({ currentTime: this.state.longBreakTime });
    } else {
      this.setState({ currentTime: this.state.workTime });
    }
  };

  componentDidMount() {
    this.updateCurrentTime();
  }

  handleStart = () => {
    const session = this.state.sessionReady;
    const r = "Running";
    const sessionRunning = session + r;
    // also need to toggle the session that was previously running
    // check for the name of the other two sessions
    let otherSession;
    let remainingSesssion;
    if (this.state.sessionReady === "work") {
      otherSession = "shortBreak";
      remainingSesssion = "longBreak";
    }
    if (this.state.sessionReady === "shortBreak") {
      otherSession = "work";
      remainingSesssion = "longBreak";
    }
    if (this.state.sessionReady === "longBreak") {
      otherSession = "work";
      remainingSesssion = "shortBreak";
    }
    const otherSessionRunning = otherSession + r;
    const remainingSessionRunning = remainingSesssion + r;
    // check which of the two sessions was previously running and toggle it if needed
    if (this.state[otherSessionRunning]) {
      this.setState(prevState => ({ [otherSessionRunning]: !prevState }));
    }
    if (this.state[remainingSessionRunning]) {
      this.setState({ [remainingSessionRunning]: false });
    }
    // toggle session that is starting now
    this.setState({ [sessionRunning]: true, start: Date.now() });
    this.setState({ timerId: setInterval(this.setTimer, 1000) });
  };

  setTimer = () => {
    let time = this.state.startTime;
    // convert string to number and then to seconds
    let duration = toSeconds(time);
    let start = this.state.start;
    let display = tick(duration, start);
    console.log(display);
    this.setState({ currentTime: display });

    if (this.state.currentTime === "00:00") {
      clearInterval(this.state.timerId);
      this.updateCurrentTime();
      this.setState({ workRunning: false });
    }
  };

  handleStop = () => {
    clearInterval(this.state.timerId);
    this.setState({ workRunning: false });
    let current = this.state.currentTime;
    this.setState({ startTime: current });
  };

  handleReset = () => {
    clearInterval(this.state.timerId);
    const session = this.state.sessionReady;
    const r = "Running";
    const sessionRunning = session + r;
    this.setState({ [sessionRunning]: false });
    const t = "Time";
    const sessionTime = session + t;
    const time = this.state[sessionTime];
    this.setState({ currentTime: time });
    this.setState({ startTime: time });
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // closes the modal for settings
  handleClose = () => {
    this.setState({ showSettings: false });
    this.updateCurrentTime();
  };

  handleShow = () => {
    this.setState({ showSettings: true });
  };

  handleSession = e => {
    const name = e.target.name;
    this.setState({ sessionReady: name });
    const t = "Time";
    const n = name + t;
    // sessionTime is the time duration of the session (ex 25 min)
    const sessionTime = this.state[n];
    const r = "Running";
    // sessionRunning is the prop in state that is toggled when timer starts
    const sessionRunning = name + r;
    // check if session is already running. If yes display alert, if not update StartTime
    // so session is ready to start
    if (this.state[sessionRunning] === true) {
      alert("Session is already running");
    } else {
      clearInterval(this.state.timerId);
      this.setState({ startTime: sessionTime, currentTime: sessionTime });
    }
  };

  render() {
    return (
      <Container>
        <Navigationbar handleSession={this.handleSession} />
        <Row className="mt-5 mb-5">
          <Col md="1">
            <Button variant="secondary" onClick={this.handleShow}>
              Settings
            </Button>
            <ModalSettings
              show={this.state.showSettings}
              handleClose={this.handleClose}
              handleChange={this.handleChange}
              workTime={this.state.workTime}
              shortBreakTime={this.state.shortBreakTime}
              longBreakTime={this.state.longBreakTime}
              lBDelay={this.state.lBDelay}
            />
          </Col>
          <Col md={{ span: 1, offset: 4 }}>{this.state.currentTime}</Col>
          <Col md={{ span: 3, offset: 9 }}>Pomodoros completed:</Col>
        </Row>
        <TimerControls
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleReset={this.handleReset}
        />
        <Row className="justify-content-md-center">
          <Col>
            To do list
            <ListGroup>
              <ListGroup.Item>Fix bugs</ListGroup.Item>
              <ListGroup.Item>Make laundry</ListGroup.Item>
              <ListGroup.Item>Buy groceries</ListGroup.Item>
              <ListGroup.Item>Call doctor</ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

// logic for countdown
function tick(duration, start) {
  let diff = duration - (((Date.now() - start) / 1000) | 0);

  let minutes = (diff / 60) | 0;
  let seconds = diff % 60 | 0;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let display = minutes + ":" + seconds;

  if (diff <= 0) {
    start = Date.now() + 1000;
  }
  return display;
}

// convert string to number and then to seconds
function toSeconds(time) {
  const str = time.split(":");
  const m = parseInt(str[0], 10);
  const s = parseInt(str[1], 10);
  return m * 60 + s;
}

export default App;
