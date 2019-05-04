import React from "react";
import { Container, Row, Button, Col, ListGroup, Form } from "react-bootstrap";
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
      showSettings: false,
      pomodorosCompleted: 0,
      activeKey: "work",
      toDoItems: [
        { id: 0, name: "Fix bugs", completed: false },
        { id: 1, name: "Make laundry", completed: false },
        { id: 2, name: "Buy groceries", completed: false },
        { id: 3, name: "Call doctor", completed: false }
      ]
    };
  }

  updateCurrentTime = () => {
    if (this.state.sessionReady === "shortBreak") {
      this.setState({ currentTime: this.state.shortBreakTime });
    }
    if (this.state.sessionReady === "longBreak") {
      this.setState({ currentTime: this.state.longBreakTime });
    }
    if (this.state.sessionReady === "work") {
      this.setState({ currentTime: this.state.workTime });
    }
  };

  updateStartTime = () => {
    if (this.state.shortBreakRunning === true) {
      this.setState({ startTime: this.state.shortBreakTime });
    }
    if (this.state.longBreakRunning === true) {
      this.setState({ startTime: this.state.longBreakTime });
    } else {
      this.setState({ startTime: this.state.workTime });
    }
  };

  componentDidMount() {
    this.updateCurrentTime();
    this.updateStartTime();
  }

  handleStart = () => {
    const session = this.state.sessionReady;
    const r = "Running";
    const sessionRunning = session + r;
    this.setState({ startTime: this.state.currentTime });
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
      // according to session that just finished update props in state and start new session
      switch (this.state.sessionReady) {
        case "work":
          console.log("session finished is work");
          let counter = this.state.pomodorosCompleted;
          const count = counter + 1;
          this.setState({ pomodorosCompleted: count });
          // check if we already have n pomodoros completed and need to switch to long break
          const delay = this.state.lBDelay;
          const remainder = this.state.pomodorosCompleted % delay;
          if (remainder == 0) {
            this.setState({
              sessionReady: "longBreak",
              workRunning: false,
              longBreakRunning: true
            });
          } else {
            this.setState({
              sessionReady: "shortBreak",
              workRunning: false,
              shortBreakRunning: true
            });
          }
          break;
        case "shortBreak":
          console.log("session finished is shortbreak");
          this.setState({
            sessionReady: "work",
            shortBreakRunning: false,
            workRunning: true
          });
          break;
        case "longBreak":
          console.log("session finished is longBreak");
          this.setState({
            sessionReady: "work",
            longBreakRunning: false,
            workRunning: true
          });
          break;
      }
      this.updateStartTime();
      this.updateCurrentTime();
      // when switching session need to set active class to the nav link
      this.setState({ activeKey: this.state.sessionReady }, () =>
        console.log("active key is" + this.state.activeKey)
      );
      this.handleStart();
    }
  };

  handleStop = () => {
    clearInterval(this.state.timerId);
    let sessionName = this.state.sessionReady;
    let r = "Running";
    let sessionRunning = sessionName + r;
    this.setState({ [sessionRunning]: false });
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
    this.setState({ showSettings: false }, () => this.updateCurrentTime());
  };

  handleShow = () => {
    this.setState({ showSettings: true });
  };

  // this method sets props in state so that the session is ready to start
  // the session doesn't start automatically, but only when Start button is clicked!
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
      // Toggle all sessions to false
      this.setState({
        workRunning: false,
        shortBreakRunning: false,
        longBreakRunning: false
      });
    }
  };

  toggleCompleted = () => {
    console.log("completed");
  };

  handleDeleteItem = () => {
    console.log("delete item");
  };

  handleSelect(eventKey) {
    console.log(`selected ${eventKey}`);
  }

  // for each ToDo Item return a li that displays the name of the item
  // and two inputs, one to mark the item as completed and one to delete the item
  createLi() {
    const list = this.state.toDoItems.map(item => {
      const name = item.name;
      return (
        <ListGroup.Item key={item.id}>
          <Row>
            <Col>{name}</Col>
            <Col xs={{ span: 2, offset: 7 }}>
              <Form.Control
                type="button"
                variant="light"
                value="completed"
                onClick={this.toggleCompleted}
              />
            </Col>
            <Col>
              <Form.Control
                type="button"
                variant="light"
                value="delete"
                onClick={this.handleDeleteItem}
              />
            </Col>
          </Row>
        </ListGroup.Item>
      );
    });
    return list;
  }

  handleClearList = () => {
    console.log("clear all");
  };

  render() {
    return (
      <Container>
        <Navigationbar
          handleSession={this.handleSession}
          handleSelect={this.handleSelect}
          activeKeyInNav={this.state.activeKey}
        />
        <Row className="mt-5 mb-5">
          <Col xs="1">
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
          <Col md={{ span: 3, offset: 9 }}>
            Pomodoros completed: {this.state.pomodorosCompleted}
          </Col>
        </Row>
        <TimerControls
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleReset={this.handleReset}
        />
        <Row className="justify-content-center">
          <Col>
            To do list
            <Form>
              <ListGroup>{this.createLi()}</ListGroup>
              <Button value="clear" onClick={this.handleClearList}>
                Clear
              </Button>
            </Form>
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
