import React from "react";
import { Container } from "react-bootstrap";
import ReactNotification from "react-notifications-component";
import UIfx from "uifx";
import Navigationbar from "./components/navigationBar/navigationbar";
import TimerControls from "./components/timer/timerControls";
import ToDoListForm from "./components/toDoList/toDoList";
import Timer from "./components/timer/timer";
import { tick, toSeconds, updateTheme } from "./utils";
import "./styles.css";
import "react-notifications-component/dist/theme.css";
import alarm from "./alarm.mp3";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // prop used by SetInterval and ClearInterval
      timerId: 0,
      start: 0,
      // this property is used by tick method
      startTime: "25:00",
      // value displayed by timer
      currentTime: "",
      workTime: "25:00",
      shortBreakTime: "05:00",
      longBreakTime: "30:00",
      // how many pomodoros before long break
      lBDelay: 4,
      pomodorosCompleted: 0,
      // session is Ready when startTime is updated
      sessionReady: "work",
      sessionRunning: "",
      activeKey: "work",
      // displays modal for settings when toggled
      theme: "violet",
      sound: "on",
      // to set the correct CSS variables for svg animation
      animationWasPaused: false
    };
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount() {
    this.updateCurrentTime();
    this.updateStartTime();
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
  }

  updateCurrentTime = () => {
    this.setState({
      currentTime: this.state[`${this.state.sessionReady}Time`]
    });
  };

  updateStartTime = () => {
    this.setState({ startTime: this.state.sessionReady });
  };

  handleStart = () => {
    const {
      sessionRunning,
      sessionReady,
      currentTime,
      startTime,
      animationWasPaused
    } = this.state;
    // disable button if session is already running
    if (sessionRunning) {
      this.addNotification("session has already started", "warning");
      return;
    }
    this.setState({ sessionRunning: sessionReady, startTime: currentTime });
    // toggle session that is starting now
    this.setState({
      start: Date.now(),
      timerId: setInterval(this.setTimer, 1000)
    });
    // start svg timer
    let circle = document.querySelector("circle");
    if (animationWasPaused) {
      circle.style.setProperty("--pauseHandler", "running");
      this.setState({ animationWasPaused: false });
      return;
    }
    const seconds = `${toSeconds(startTime)}s`;
    circle.style.setProperty("--time", seconds);
    circle.style.setProperty("--pauseHandler", "running");
  };

  setTimer = () => {
    const {
      startTime,
      start,
      currentTime,
      timerId,
      sessionReady,
      pomodorosCompleted,
      lBDelay
    } = this.state;
    // convert string to number and then to seconds
    let duration = toSeconds(startTime);
    let display = tick(duration, start);
    this.setState({ currentTime: display });

    if (currentTime === "00:00") {
      clearInterval(timerId);
      this.alarm.play();
      this.setState({ sessionRunning: "" });
      // according to session that just finished update props in state and start new session
      if (sessionReady === "work") {
        // check if we already have n pomodoros completed and need to switch to long break
        this.setState({ pomodorosCompleted: pomodorosCompleted + 1 });
        const remainder = (pomodorosCompleted + 1) % lBDelay;
        remainder === 0
          ? this.handleSelect("longBreak")
          : this.handleSelect("shortBreak");
      } else {
        this.handleSelect("work");
      }
      // give time to update svg circle CSS var
      setTimeout(this.handleStart, 1);
    }
  };

  handleStop = () => {
    let { sessionRunning, timerId, currentTime } = this.state;
    if (!sessionRunning) {
      this.addNotification("session isn't running", "warning");
      return;
    }
    clearInterval(timerId);
    // pause svg timer
    const circle = document.querySelector("circle");
    circle.style.setProperty("--pauseHandler", "paused");
    this.setState({
      sessionRunning: "",
      startTime: currentTime,
      animationWasPaused: true
    });
  };

  handleReset = () => {
    const { sessionRunning, timerId } = this.state;
    if (!sessionRunning) {
      this.addNotification("session isn't running", "warning");
      return;
    }
    clearInterval(timerId);
    const sessionTime = this.state[`${sessionRunning}Time`];
    this.setState({
      sessionRunning: "",
      currentTime: sessionTime,
      startTime: sessionTime
    });
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  handleChange = ({ target }) => {
    const { name } = target;
    let { value } = target;
    let bgMax;
    let bgMin;
    this.setState({ [name]: value });
    if (name === "theme") {
      // set values for background
      bgMax = target.options[target.selectedIndex].dataset.max;
      bgMin = target.options[target.selectedIndex].dataset.min;
      updateTheme(value, bgMax, bgMin);
      return;
    }
    if (name === "sound" || name === "lBDelay") return;
    value = value < 10 ? "0" + value + ":00" : value + ":00";
    this.setState({ [name]: value });
  };

  // handles notification component
  addNotification = (mess, typ) => {
    this.notificationDOMRef.current.addNotification({
      message: mess,
      type: typ,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  };

  // this method sets props in state so that the session is ready to start
  // the session doesn't start automatically, but only when Start button is clicked!
  handleSelect = selected => {
    const { sessionRunning, timerId } = this.state;
    this.setState({ sessionReady: selected });
    // sessionTime is the time duration of the session (ex 25 min)
    const sessionTime = this.state[`${selected}Time`];
    // sessionRunning is the prop in state that is toggled when timer starts
    // check if session is already running. If yes display notification, if not update StartTime so session is ready to start
    if (sessionRunning === selected) {
      this.addNotification("Session is already running", "warning");
      return;
    }
    clearInterval(timerId);
    // update state so new session is ready to start
    this.setState({
      sessionRunning: "",
      startTime: sessionTime,
      currentTime: sessionTime
    });
    // update activeKey
    this.setState({ activeKey: selected });
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  saveChangesInSettings = () => {
    this.updateCurrentTime();
    this.updateStartTime();
    // trigger notification
    this.addNotification("Changes have been saved!", "success");
  };

  progressTracker = () => {
    return (
      <span className="d-flex justify-content-center pb-5">
        {`You have completed ${this.state.pomodorosCompleted} pomodoros`}
      </span>
    );
  };

  alarm = new UIfx({
    asset: alarm,
    volume: 0.4
  });

  render() {
    const {
      workTime,
      shortBreakTime,
      longBreakTime,
      currentTime,
      activeKey,
      lBDelay,
      pomodorosCompleted,
      theme,
      sound
    } = this.state;
    return (
      <React.Fragment>
        <div id="background">
          <Container>
            <div>
              <Navigationbar
                activeKeyInNav={activeKey}
                workTime={workTime}
                shortBreakTime={shortBreakTime}
                longBreakTime={longBreakTime}
                lBDelay={lBDelay}
                theme={theme}
                sound={sound}
                saveChanges={this.saveChangesInSettings}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
              />
              <ReactNotification ref={this.notificationDOMRef} />
              <Timer
                currentTime={currentTime}
                pomodorosCompleted={pomodorosCompleted}
              />
              <TimerControls
                onStart={this.handleStart}
                onStop={this.handleStop}
                onReset={this.handleReset}
              />
            </div>
            <div id="backgroundLarge" />
          </Container>
        </div>
        <Container>
          <ToDoListForm />
          <hr />
          {this.progressTracker()}
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
