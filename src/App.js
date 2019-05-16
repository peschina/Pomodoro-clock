import React from "react";
import { Container, Row, Button, Col, ListGroup } from "react-bootstrap";
import Navigationbar from "./Navigationbar";
import TimerControls from "./TimerControls";
import ModalSettings from "./ModalSettings";
import ToDoList from "./ToDoList";
import { tick, toSeconds } from "./Utils";
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
      toAdd: "",
      toDoItems: [
        { id: 0, name: "Fix bugs", completed: false },
        { id: 1, name: "Make laundry", completed: false },
        { id: 2, name: "Buy groceries", completed: false },
        { id: 3, name: "Call doctor", completed: false }
      ]
    };
    this.idCount = 3;
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
    const number = toSeconds(this.state.startTime);
    const seconds = number + "s";
    circle.style.setProperty("--time", seconds);
    circle.style.setProperty("--pauseHandler", "running");
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
      // give time to update svg circle css var
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
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // closes the modal for settings
  handleClose = () => {
    this.setState({ showSettings: false });
    this.updateCurrentTime();
    this.updateStartTime();
    // trigger notification
    this.addNotification("Changes have been saved!", "success");
  };

  handleShow = () => {
    this.setState({ showSettings: true });
  };

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
            <Col sm="6">{name}</Col>
            <Col sm="3">
              <Button
                data-id={item.id}
                type="button"
                variant="light"
                value="completed"
                onClick={onClickFunction}
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
              >
                {" "}
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

  render() {
    return (
      <Container>
        <Navigationbar
          handleSelect={this.handleSelect}
          activeKeyInNav={this.state.activeKey}
        />
        <ReactNotification ref={this.notificationDOMRef} />
        <Row className="mt-5 mb-5">
          <Col>
            <Row className="mb-3">
              <Button onClick={this.handleShow}>
                <i className="fas fa-cog fa-2x" />
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
            </Row>
            <Row>
              <span>Pomodoros completed: {this.state.pomodorosCompleted}</span>
            </Row>
          </Col>
          <Col>
            <svg viewBox="0 0 100 100">
              <circle r="40" cx="50" cy="50" />
              <text transform="rotate(90) scale(-1,1) translate(-70,-45)">
                {this.state.currentTime}
              </text>
            </svg>
          </Col>
          <Col />
        </Row>
        <TimerControls
          handleStart={this.handleStart}
          handleStop={this.handleStop}
          handleReset={this.handleReset}
        />
        <hr />
        <ToDoList
          createLi={this.createLi()}
          handleClearList={this.handleClearList}
          toAdd={this.state.toAdd}
          handleAdd={this.handleAdd}
          handleSubmit={this.handleSubmit}
        />
      </Container>
    );
  }
}

export default App;
