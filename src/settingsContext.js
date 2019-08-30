import React from "react";

export const SettingContext = React.createContext({
  settings: {
    workTime: "25",
    shortBreakTime: "5",
    longBreakTime: "30",
    lBDelay: 4,
    theme: "violet",
    sound: "on"
  }
});
