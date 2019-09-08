import themes from "./themes";

// logic for countdown
export function tick(duration, start) {
  let diff = duration - (((Date.now() - start) / 1000) | 0);
  let minutes = (diff / 60) | 0;
  let seconds = diff % 60 | 0;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let display = minutes + ":" + seconds;

  if (diff <= 0) start = Date.now() + 1000;
  return display;
}

// convert string to number and then to seconds
export function toSeconds(time) {
  const str = time.split(":");
  const m = parseInt(str[0], 10);
  const s = parseInt(str[1], 10);
  return m * 60 + s;
}

export function updateTheme(nameTheme) {
  const theme = themes.filter(t => t.name === nameTheme)[0];
  const { color, dataMax, dataMin } = theme;
  let root = document.documentElement;
  root.style.setProperty("--theme", color);
  root.style.setProperty("--bgMax", dataMax);
  root.style.setProperty("--bgMin", dataMin);
}

export const addNotification = (mess, typ, ref) => {
  ref.current.addNotification({
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
