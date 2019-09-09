import React, { useState, useEffect, useRef } from "react";
import ReactNotification from "react-notifications-component";
import UIfx from "uifx";
import TimerDisplay from "./timerDisplay";
import TimerControls from "./timerControls";
import { tick, toSeconds, addNotification } from "../../utils";
import sound from "../../alarm.mp3";
import "react-notifications-component/dist/theme.css";

const alarm = new UIfx({
  asset: sound
});

const useLatestState = (prop, ref) => {
  useEffect(() => {
    ref.current = prop;
  }, [prop, ref]);
};

const Timer = ({
  lBDelay,
  sessionReady: sessionSelected,
  onSelect,
  onSessionCompleted,
  sessionSetting,
  sound
}) => {
  // prop used by SetInterval and ClearInterval
  const [timerId, setTimerId] = useState(0);
  const [start, setStart] = useState();
  // this property is used by tick method
  const [startTime, setStartTime] = useState("25:00");
  // value displayed by timer
  const [currentTime, setCurrentTime] = useState("25:00");
  const [sessionReady, setSessionReady] = useState(sessionSelected);
  const [sessionRunning, setSessionRunning] = useState();
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  // to set the correct CSS variables for svg animation
  const [animationWasPaused, setAnimationWasPaused] = useState(false);

  function useDidUpdateEffect(start) {
    const didMountRef = useRef(false);

    useEffect(() => {
      if (didMountRef.current) setTimerId(setInterval(setTimer, 1000));
      else didMountRef.current = true;
    }, [start]);
  }

  useDidUpdateEffect(start);

  useEffect(() => {
    handleReset();
  }, [sessionSetting()]);

  useEffect(() => {
    setStartTime(sessionSetting);
    setCurrentTime(sessionSetting);
    setSessionRunning(false);
  }, [sessionReady, sessionSetting]);

  useEffect(() => {
    setSessionReady(sessionSelected);
    setStartTime(sessionSetting);
    setCurrentTime(sessionSetting);
    setSessionRunning(false);
    clearInterval(refTimerId.current);
  }, [sessionSelected, sessionSetting]);

  const notificationDOMRef = useRef();

  let refCurrentTime = useRef(currentTime);
  let refSessionReady = useRef(sessionReady);
  let refStartTime = useRef(startTime);
  let refSessionRunning = useRef(sessionRunning);
  let refTimerId = useRef(timerId);

  useLatestState(currentTime, refCurrentTime);
  useLatestState(sessionReady, refSessionReady);
  useLatestState(startTime, refStartTime);
  useLatestState(sessionRunning, refSessionRunning);
  useLatestState(timerId, refTimerId);

  const handleStart = () => {
    // disable button if session is already running
    if (refSessionRunning.current) {
      addNotification(
        "session has already started",
        "warning",
        notificationDOMRef
      );
      return;
    }
    // toggle session that is starting now
    setSessionRunning(true);
    setStart(Date.now());
    // start svg timer
    let circle = document.querySelector("circle");
    if (animationWasPaused) {
      circle.style.setProperty("--pauseHandler", "running");
      setAnimationWasPaused(false);
      return;
    }
    const seconds = `${toSeconds(startTime)}s`;
    circle.style.setProperty("--time", seconds);
    circle.style.setProperty("--pauseHandler", "running");
  };

  const setTimer = () => {
    // convert string to number and then to seconds
    let duration = toSeconds(startTime);
    let display = tick(duration, start);
    setCurrentTime(display);

    if (refCurrentTime.current === "00:00") {
      clearInterval(refTimerId.current);
      if (sound === "on") alarm.play();
      if (refSessionReady.current === "work") {
        // check if we already have n pomodoros completed and need to switch to long break
        setPomodorosCompleted(pomodorosCompleted + 1);
        const remainder = (pomodorosCompleted + 1) % lBDelay;
        const nextSession = remainder === 0 ? "longBreak" : "shortBreak";
        onSessionCompleted(pomodorosCompleted + 1);
        setSessionReady(nextSession);
        onSelect(nextSession);
      } else {
        onSelect("work");
        setSessionReady("work");
      }
      // give time to update svg circle CSS var
      setTimeout(handleStart, 1);
    }
  };

  const handleStop = () => {
    if (!refSessionRunning.current) {
      addNotification("session isn't running", "warning", notificationDOMRef);
      return;
    }
    clearInterval(timerId);
    // pause svg timer
    const circle = document.querySelector("circle");
    circle.style.setProperty("--pauseHandler", "paused");
    setSessionRunning(false);
    setStartTime(currentTime);
    setAnimationWasPaused(true);
  };

  const handleReset = () => {
    clearInterval(timerId);
    setSessionRunning(false);
    setStartTime(sessionSetting);
    setCurrentTime(sessionSetting);
    // reset svg timer
    let circle = document.querySelector("circle");
    circle.style.setProperty("--time", "initial");
    circle.style.setProperty("--pauseHandler", "paused");
  };

  return (
    <>
      <ReactNotification ref={notificationDOMRef} />
      <TimerDisplay currentTime={currentTime} />
      <TimerControls
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
      />
    </>
  );
};

export default Timer;
