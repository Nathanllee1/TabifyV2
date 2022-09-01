export const getTimestamp = (duration: number) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60)

  let minute_string = (minutes < 10) ? "0" + minutes : minutes.toString();
  let seconds_string = (seconds < 10) ? "0" + seconds : seconds.toString();

  return minute_string + ":" + seconds_string;
};
