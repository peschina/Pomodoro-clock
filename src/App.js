import React from "react";
import { Container, Row, Button, Col, ListGroup } from "react-bootstrap";
import Navigationbar from "./Navigationbar";
import TimerControls from "./TimerControls";
import ModalSettings from "./ModalSettings";
import ToDoList from "./ToDoList";
import Timer from "./Timer";
import ModalAbout from "./ModalAbout";
import { tick, toSeconds, Audio } from "./Utils";
import "./styles.css";
import ReactNotification from "react-notifications-component";
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
      currentTime: "",
      workTime: "25:00",
      shortBreakTime: "10:00",
      longBreakTime: "30:00",
      // how many pomodoros before long break
      lBDelay: 4,
      // session is Ready when startTime is updated
      sessionReady: "work",
      workRunning: false,
      shortBreakRunning: false,
      longBreakRunning: false,
      // displays modal for settings when toggled
      showSettings: false,
      // displays modal for info when toggled
      showAbout: false,
      theme: "violet",
      sound: "on",
      pomodorosCompleted: 0,
      // to set the correct CSS variables for svg animation
      animationWasPaused: false,
      activeKey: "work",
      toAdd: "",
      toDoItems: [
        { id: 0, name: "Make laundry", completed: false },
        { id: 1, name: "Buy groceries", completed: false },
        { id: 2, name: "Call doctor", completed: false }
      ]
    };
    this.idCount = 2;
    this.notificationDOMRef = React.createRef();
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
    if (this.state.sessionReady === "shortBreak") {
      this.setState({ startTime: this.state.shortBreakTime });
    }
    if (this.state.sessionReady === "longBreak") {
      this.setState({ startTime: this.state.longBreakTime });
    }
    if (this.state.sessionReady === "work") {
      this.setState({ startTime: this.state.workTime });
    }
  };

  updateTheme = (theme, max, min) => {
    let root = document.documentElement;
    root.style.setProperty("--theme", theme);
    root.style.setProperty("--bgMax", max);
    root.style.setProperty("--bgMin", min);
  };

  componentDidMount() {
    this.updateCurrentTime();
    this.updateStartTime();
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
  }

  handleStart = () => {
    const session = this.state.sessionReady;
    const r = "Running";
    const sessionRunning = session + r;
    // disable button if session is already running
    if (this.state[sessionRunning] == true) {
      this.addNotification("session has already started", "warning");
      return;
    }
    this.setState({ startTime: this.state.currentTime });
    // toggle session that is starting now
    this.setState({ [sessionRunning]: true, start: Date.now() });
    this.setState({ timerId: setInterval(this.setTimer, 1000) });
    // start svg timer
    let circle = document.querySelector("circle");
    if (this.state.animationWasPaused === true) {
      circle.style.setProperty("--pauseHandler", "running");
      this.setState({ animationWasPaused: false });
    } else {
      const number = toSeconds(this.state.startTime);
      const seconds = number + "s";
      circle.style.setProperty("--time", seconds);
      circle.style.setProperty("--pauseHandler", "running");
    }
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
          let counter = this.state.pomodorosCompleted;
          const count = counter + 1;
          this.setState({ pomodorosCompleted: count });
          // check if we already have n pomodoros completed and need to switch to long break
          const delay = this.state.lBDelay;
          const remainder = this.state.pomodorosCompleted % delay;
          if (remainder === 0) {
            this.handleSelect("longBreak");
          } else {
            this.handleSelect("shortBreak");
          }
          break;
        case "shortBreak":
          this.handleSelect("work");
          break;
        case "longBreak":
          this.handleSelect("work");
          break;
      }
      // give time to update svg circle CSS var
      setTimeout(this.handleStart, 1);
    }
  };

  handleStop = () => {
    clearInterval(this.state.timerId);
    // pause svg timer
    const circle = document.querySelector("circle");
    circle.style.setProperty("--pauseHandler", "paused");
    let sessionName = this.state.sessionReady;
    let r = "Running";
    let sessionRunning = sessionName + r;
    if (this.state[sessionRunning] == false) {
      this.addNotification("session isn't running", "warning");
      return;
    }
    this.setState({ [sessionRunning]: false });
    let current = this.state.currentTime;
    this.setState({ startTime: current, animationWasPaused: true });
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
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  handleChange = e => {
    const { name } = e.target;
    let { value } = e.target;
    let bgMax;
    let bgMin;
    if (name === "theme") {
      // set values for background
      bgMax = e.target.options[e.target.selectedIndex].dataset.max;
      bgMin = e.target.options[e.target.selectedIndex].dataset.min;
      this.updateTheme(value, bgMax, bgMin);
      this.setState({ [name]: value });
      return;
    }
    if (name === "sound" || name === "lBDelay") {
    } else {
      value = value < 10 ? "0" + value + ":00" : value + ":00";
    }
    this.setState({ [name]: value });
  };

  // closes the modal for settings
  handleCloseSettings = () => {
    this.setState({ showSettings: false });
    this.updateCurrentTime();
    this.updateStartTime();
    // trigger notification
    this.addNotification("Changes have been saved!", "success");
  };

  handleShowSettings = () => {
    this.setState({ showSettings: true });
  };

  handleShowAbout = () => {
    this.setState({ showAbout: true });
  };

  handleCloseAbout = () => {
    this.setState({ showAbout: false });
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
    this.setState({ sessionReady: selected });
    const t = "Time";
    const n = selected + t;
    // sessionTime is the time duration of the session (ex 25 min)
    const sessionTime = this.state[n];
    const r = "Running";
    // sessionRunning is the prop in state that is toggled when timer starts
    const sessionRunning = selected + r;
    // check if session is already running. If yes display notification, if not update StartTime
    // so session is ready to start
    if (this.state[sessionRunning] === true) {
      this.addNotification("Session is already running", "warning");
    } else {
      clearInterval(this.state.timerId);
      this.setState({ startTime: sessionTime, currentTime: sessionTime });
      // Toggle all sessions to false
      this.setState({
        workRunning: false,
        shortBreakRunning: false,
        longBreakRunning: false
      });
      // update activeKey
      this.setState({ activeKey: selected });
      // reset svg timer
      let circle = document.querySelector("circle");
      circle.style.setProperty("--time", "initial");
      circle.style.setProperty("--pauseHandler", "paused");
    }
  };

  toggleCompleted = e => {
    const id = e.target.getAttribute("data-id");
    let list = this.state.toDoItems.map(item => {
      if (item.id == id) {
        if (item.completed === true) {
          this.addNotification("task has already been completed", "info");
          return item;
        } else {
          item.completed = true;
          return item;
        }
      } else {
        return item;
      }
    });
    // Push item to end of array
    for (let item of list) {
      if (item.id == id) {
        list.push(list.splice(list.indexOf(item), 1)[0]);
      }
    }
    this.setState({ toDoItems: list });
  };

  handleDeleteItem = e => {
    const id = e.target.getAttribute("data-id");
    const filtered = this.state.toDoItems.filter(item => item.id != id);
    this.setState({ toDoItems: filtered });
  };

  handleRedo = name => {
    // add item to ToDoItems eg. { id: 0, name: "Fix bugs", completed: false }
    const item = {
      id: this.idCount + 1,
      name: name,
      completed: false
    };
    this.idCount = this.idCount + 1;
    const list = [...this.state.toDoItems];
    list.unshift(item);
    this.setState({ toDoItems: list });
  };

  // for each ToDo Item return a li that displays the name of the item
  // and two inputs, one to mark the item as completed and one to delete the item
  createLi() {
    const list = this.state.toDoItems.map(item => {
      const name = item.name;
      let style = item.completed
        ? { textDecoration: "line-through", color: "#C8C8C8" }
        : { backgroundColor: "white" };
      let buttonValue = item.completed ? "Redo " : "Done ";
      let faClass = item.completed ? "fas fa-redo" : "fas fa-check";
      let onClickFunction = item.completed
        ? () => this.handleRedo(name)
        : this.toggleCompleted;
      return (
        <ListGroup.Item key={item.id} style={style}>
          <Row>
            <Col
              sm="6"
              className="d-flex align-items-center pb-2 pb-md-0 pb-sm-0"
            >
              {name}
            </Col>
            <Col sm="3" className="pb-2 pb-md-0 pb-sm-0">
              <Button
                data-id={item.id}
                type="button"
                variant="light"
                value="completed"
                onClick={onClickFunction}
                className="rounded-pill"
              >
                {buttonValue}
                <i className={faClass} />
              </Button>
            </Col>
            <Col sm="3">
              <Button
                data-id={item.id}
                type="button"
                variant="light"
                value="delete"
                onClick={this.handleDeleteItem}
                className="rounded-pill"
              >
                {"Delete "}
                <i className="fas fa-trash-alt" />
              </Button>
            </Col>
          </Row>
        </ListGroup.Item>
      );
    });
    return list;
  }

  handleClearList = () => {
    this.setState({ toDoItems: [] });
  };

  handleAdd = e => {
    const { value } = e.target;
    this.setState({ toAdd: value });
  };

  handleSubmit = e => {
    // check for form validation
    if (this.state.toAdd === "") {
      return;
    }
    e.preventDefault();
    // add item to ToDoItems eg. { id: 0, name: "Fix bugs", completed: false }
    const item = {
      id: this.idCount + 1,
      name: this.state.toAdd,
      completed: false
    };
    this.idCount = this.idCount + 1;
    const list = [...this.state.toDoItems];
    list.unshift(item);
    this.setState({ toDoItems: list });
    this.setState({ toAdd: "" });
  };

  playSound = () => {
    return <Audio />;
  };

  render() {
    return (
      <div>
        <div id="background">
          <Container>
            <div>
              <Navigationbar
                handleSelect={this.handleSelect}
                activeKeyInNav={this.state.activeKey}
                handleShow={this.handleShowSettings}
                showAbout={this.handleShowAbout}
              />
              <ReactNotification ref={this.notificationDOMRef} />
              <ModalSettings
                show={this.state.showSettings}
                handleClose={this.handleCloseSettings}
                handleChange={this.handleChange}
                workTime={this.state.workTime}
                shortBreakTime={this.state.shortBreakTime}
                longBreakTime={this.state.longBreakTime}
                lBDelay={this.state.lBDelay}
                theme={this.state.theme}
                sound={this.state.sound}
              />
              <ModalAbout
                show={this.state.showAbout}
                handleClose={this.handleCloseAbout}
              />
              <Timer
                currentTime={this.state.currentTime}
                pomodorosCompleted={this.state.pomodorosCompleted}
              />
              <TimerControls
                handleStart={this.handleStart}
                handleStop={this.handleStop}
                handleReset={this.handleReset}
              />
              <Button onClick={this.playSound}>Sound</Button>
            </div>
            <div id="backgroundLarge" />
          </Container>
        </div>
        <Container>
          <ToDoList
            pomodorosCompleted={this.state.pomodorosCompleted}
            createLi={this.createLi()}
            handleClearList={this.handleClearList}
            toAdd={this.state.toAdd}
            handleAdd={this.handleAdd}
            handleSubmit={this.handleSubmit}
          />
        </Container>
      </div>
    );
  }
}

export default App;
