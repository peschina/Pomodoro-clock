import React from "react";
import { Container } from "react-bootstrap";
import Navigationbar from "./components/navigationBar/navigationbar";
import ToDoList from "./components/toDoList/toDoList";
import Timer from "./components/timer/timer";
import { SettingContext } from "./settingsContext";
import "./styles.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      workTime: "25",
      shortBreakTime: "5",
      longBreakTime: "30",
      // how many pomodoros before long break
      lBDelay: "4",
      pomodorosCompleted: 0,
      sessionReady: "work",
      theme: "Violet",
      sound: "on"
    };
  }

  componentDidMount() {
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
  }

  getSessionSetting = () => {
    const val = this.state[`${this.state.sessionReady}Time`];
    return val < 10 ? `0${val}:00` : `${val}:00`;
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value });
  };

  // this method updates state so that the session is ready to start
  // the session doesn't start automatically, but only when Start button is clicked!
  handleSelect = selected => {
    const { sessionReady } = this.state;
    // check if session is already running
    if (sessionReady === selected) return;
    this.setState({ sessionReady: selected });
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  handleSaveSetting = ({ name, value }) => {
    this.setState({ [name]: value });
    // update session running if its setting has changed
    const session = name.slice(0, -4);
    if (session === this.state.sessionReady)
      console.log("need to reset session");
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

  render() {
    const {
      workTime,
      shortBreakTime,
      longBreakTime,
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
                  validateForm={this.validateForm}
                  onChange={this.handleChange}
                  onSelect={this.handleSelect}
                  onSaveSetting={this.handleSaveSetting}
                />
              </SettingContext.Provider>
              <Timer
                lBDelay={lBDelay}
                sessionReady={sessionReady}
                onSelect={this.handleSelect}
                sessionSetting={this.getSessionSetting}
                sound={sound}
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
