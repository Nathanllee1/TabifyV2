import { get } from "svelte/store";
import { AppStore } from "./AppStore";

export const getTimestamp = (duration: number) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60)

  let minute_string = (minutes < 10) ? "0" + minutes : minutes.toString();
  let seconds_string = (seconds < 10) ? "0" + seconds : seconds.toString();

  return minute_string + ":" + seconds_string;
};

export const getArtistObjAsString = (artists: any[]) => {
  return artists.map((artist) => artist.name).join(", ")
}

export const buildURLWithParams = (url: string, params: Record<string, string>) => {
  const baseObj = new URL(url);

  Object.keys(params).forEach(key => {
    baseObj.searchParams.append(key, params[key])
  })

  return baseObj.toString()
}

export const getHeaders = () => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${get(AppStore).token}`);
  return headers
}

export const spotifyRequest = async (url: string, method = "GET", body?: string) => {
  const headers = getHeaders();
  const res = await fetch(url, {
    method,
    headers,
    body
  });
  try {
    return await res.json();

  } catch {

  }
};

export function clickOutside(node) {

  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        new CustomEvent('click_outside', node)
      )
    }
  }

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  }
}

export async function playSong(uri: string="", context_uri="", offset=undefined) {

  const body = {}

  if (uri) {
    body["uris"] = [uri]
  }

  if (context_uri) {
    body["context_uri"] = context_uri
  }

  if (offset) {
    body["offset"] = offset
  }

  await spotifyRequest(`https://api.spotify.com/v1/me/player/play`, "PUT", JSON.stringify(body))
}

export async function queueSong(uri: string) {
  const headers = getHeaders();

  await fetch(
    `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
    {
      headers,
      method: "POST",
    }
  );
}