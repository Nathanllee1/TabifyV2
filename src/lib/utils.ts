import { get } from "svelte/store";
import { AppStore } from "./AppStore";

export const getTimestamp = (duration: number) => {
  let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60)

  let minute_string = (minutes < 10) ? "0" + minutes : minutes.toString();
  let seconds_string = (seconds < 10) ? "0" + seconds : seconds.toString();

  return minute_string + ":" + seconds_string;
};

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

  return await res.json();
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