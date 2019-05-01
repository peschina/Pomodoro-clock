import React from "react";
import { Container, Row, Button, Col } from "react-bootstrap";
import "./App.css";
import Navigationbar from "./Navigationbar";
//import TimerControls from "./TimerControls";
//import ModalSettings from "./ModalSettings";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      timerId: 0,
      start: 0,
      // this property is used by tick method
      startTime: "",
      currentTime: "",
      workTime: "00:25",
      shortBreakTime: "00:10",
      longBreakTime: "00:30",
      // how many pomodoros before long break
      lBDelay: 4,
      workRunning: false,
      shortBreakRunning: false,
      longBreakRunning: false,
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

  updateStartTime = () => {
    if (this.state.shortBreakRunning === true) {
      this.setState({ startTimer: this.state.shortBreakTime });
    }
    if (this.state.longBreakRunning === true) {
      this.setState({ startTimer: this.state.longBreakTime });
    } else {
      this.setState({ startTimer: this.state.workTime });
    }
  };

  handleStart = () => {
    this.setState({ workRunning: true, start: Date.now() }, () => {
      this.updateStartTime();
    });
    this.setState({ timerId: setInterval(this.setTimer, 1000) });
    console.log(this.state.workRunning);
  };

  setTimer = () => {
    console.log(this.state.workRunning);
    this.updateStartTime();
    {
      /*if (this.state.shortBreakRunning === true) {
      time = this.state.shortBreakTime;
    }
    if (this.state.longBreakRunning === true) {
      time = this.state.longBreakTime;
    } else {
      time = this.state.workTime;
    }*/
    }
    let time = this.state.startTime;
    console.log(time);
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
    console.log("reset");
    clearInterval(this.state.timerId);
    this.setState({ workRunning: false });
    // THIS WILL NEED TO CHANGE
    this.setState({ currentTime: "00:10" });
    this.setState({ startTime: "00:10" });
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
    const session = this.state[name];
    const sessionName = name.replace(/Time$/, "");
    const r = "Running";
    const sessionRunning = new RegExp(sessionName + r);
    // check if session is already running. If yes display alert, if not update StartTime
    // so session is ready to start
    this.state[sessionRunning] === true
      ? alert("Session is already running")
      : this.setState({ startTime: session });
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
            {/*<ModalSettings
              show={this.state.showSettings}
              handleClose={this.handleClose}
              handleChange={this.handleChange}
              workTime={this.state.workTime}
              shortBreakTime={this.state.shortBreakTime}
              longBreakTime={this.state.longBreakTime}
              lBDelay={this.state.lBDelay}
            />*/}
          </Col>
          <Col md={{ span: 1, offset: 4 }}>{this.state.currentTime}</Col>
          <Col md={{ span: 3, offset: 9 }}>Pomodoros completed:</Col>
        </Row>
        {/*<TimerControls
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleReset={this.handleReset}
        />*/}
        <Row className="justify-content-md-center"> 
        	<Col>To do list</Col>
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
