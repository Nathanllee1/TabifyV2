import { get } from "svelte/store";
import { AppStore } from "./AppStore";

export const getTimestamp = (duration: number) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60)

  let minute_string = (minutes < 10) ? "0" + minutes : minutes.toString();
  let seconds_string = (seconds < 10) ? "0" + seconds : seconds.toString();

  return minute_string + ":" + seconds_string;
};

export const spotifyRequest = async (url: string, body?: string) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${get(AppStore).token}`);
  const res = await fetch(url, {
    method: "GET",
    headers,
    body,
  });

  return await res.json();
};