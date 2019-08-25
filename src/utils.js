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

export function updateTheme(theme, max, min) {
  let root = document.documentElement;
  root.style.setProperty("--theme", theme);
  root.style.setProperty("--bgMax", max);
  root.style.setProperty("--bgMin", min);
}
