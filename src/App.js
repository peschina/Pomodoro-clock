import React from "react";
import { Container } from "react-bootstrap";
import ReactNotification from "react-notifications-component";
import Joi from "joi-browser";
import UIfx from "uifx";
import Navigationbar from "./components/navigationBar/navigationbar";
import TimerControls from "./components/timer/timerControls";
import ToDoList from "./components/toDoList/toDoList";
import Timer from "./components/timer/timer";
import { tick, toSeconds, updateTheme } from "./utils";
import { SettingContext } from "./settingsContext";
import alarm from "./alarm.mp3";
import "./styles.css";
import "react-notifications-component/dist/theme.css";

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
      currentTime: "25:00",
      workTime: "25",
      shortBreakTime: "5",
      longBreakTime: "30",
      // how many pomodoros before long break
      lBDelay: 4,
      pomodorosCompleted: 0,
      // session is Ready when startTime is updated
      sessionReady: "work",
      sessionRunning: "",
      theme: "violet",
      sound: "on",
      // to set the correct CSS variables for svg animation
      animationWasPaused: false
    };
    this.notificationDOMRef = React.createRef();
  }

  componentDidMount() {
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
  }

  // handles notification component
  addNotification(mess, typ) {
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
  }

  prepareNewSession = () => {
    const val = this.state[`${this.state.sessionReady}Time`];
    const time = val < 10 ? `0${val}:00` : `${val}:00`;
    this.setState({
      sessionRunning: "",
      startTime: time,
      currentTime: time
    });
  };

  handleStart = () => {
    const {
      sessionRunning,
      sessionReady,
      startTime,
      animationWasPaused
    } = this.state;
    // disable button if session is already running
    if (sessionRunning) {
      this.addNotification("session has already started", "warning");
      return;
    }
    // toggle session that is starting now
    this.setState({
      sessionRunning: sessionReady,
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
    this.prepareNewSession();
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
    if (value === "0") {
      if (name === "lBDelay") return;
      this.addNotification("Session should last at least one minute", "danger");
      setTimeout(() => this.setState({ [name]: 1 }), 800);
      return;
    }
    if (name === "theme") {
      // set values for background
      bgMax = target.options[target.selectedIndex].dataset.max;
      bgMin = target.options[target.selectedIndex].dataset.min;
      updateTheme(value, bgMax, bgMin);
      return;
    }
  };

  // this method sets props in state so that the session is ready to start
  // the session doesn't start automatically, but only when Start button is clicked!
  handleSelect = selected => {
    const { sessionRunning, timerId } = this.state;
    // check if session is already running. If yes display notification, if not update state so session is ready to start
    if (sessionRunning === selected) {
      this.addNotification("Session is already running", "warning");
      return;
    }
    this.setState({ sessionReady: selected }, () => this.prepareNewSession());
    clearInterval(timerId);
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  validateForm = schema => {
    const errors = this.validate(schema);
    if (errors) {
      const messages = Object.values(errors);
      messages.map(m => this.addNotification(m, "danger"));
    }
    return errors;
  };

  validate = schema => {
    const { workTime, shortBreakTime, longBreakTime, lBDelay } = this.state;
    const { error } = Joi.validate(
      {
        workTime,
        shortBreakTime,
        longBreakTime,
        lBDelay
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

  saveChangesInSettings = () => {
    this.prepareNewSession();
    // trigger notification
    this.addNotification("Changes have been saved!", "success");
  };

  progressTracker = () => {
    const { pomodorosCompleted } = this.state;
    return (
      <span className="d-flex justify-content-center pb-5">
        {`You have completed ${pomodorosCompleted} ${
          pomodorosCompleted === 1 ? "pomodoro" : "pomodoros"
        }`}
      </span>
    );
  };

  alarm = new UIfx({
    asset: alarm
  });

  render() {
    const {
      workTime,
      shortBreakTime,
      longBreakTime,
      currentTime,
      sessionReady,
      lBDelay,
      theme,
      sound
    } = this.state;
    return (
      <React.Fragment>
        <div id="background">
          <Container>
            <div>
              <SettingContext.Provider
                value={{
                  settings: {
                    workTime,
                    shortBreakTime,
                    longBreakTime,
                    lBDelay,
                    sound,
                    theme
                  }
                }}
              >
                <Navigationbar
                  activeKeyInNav={sessionReady}
                  saveChanges={this.saveChangesInSettings}
                  validateForm={this.validateForm}
                  onChange={this.handleChange}
                  onSelect={this.handleSelect}
                />
              </SettingContext.Provider>
              <ReactNotification ref={this.notificationDOMRef} />
              <Timer currentTime={currentTime} />
              <TimerControls
                onStart={this.handleStart}
                onStop={this.handleStop}
                onReset={this.handleReset}
              />
            </div>
            <div id="backgroundLarge" />
          </Container>
        </div>
        <Container className="pt-4">
          <ToDoList />
          <hr />
          {this.progressTracker()}
        </Container>
      </React.Fragment>
    );
  }
}

export default App;
