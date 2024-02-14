import { get, writable } from "svelte/store";
import { CurrentTrack, SpotifyState } from "./SpotifyStateStore";

export interface TabData {
  chords: string;
  url: string;
}
export const Tab = writable<Promise<TabData[]>>();
export const TabCache = writable<Record<string, TabData[]>>({});
export const updateTabCache = async (nextSongs: Spotify.Track[]) => {
  nextSongs.map(async (song) => {
    await getTab(song.name, song.artists[0].name, song);

  })
};

// const API_ROUTE = "https://jr8ydenc5j.execute-api.us-east-1.amazonaws.com"
const API_ROUTE = "https://qn7mrh0vk1.execute-api.us-east-1.amazonaws.com"
/**
 * Gets the tab from the server or the cache
 */
export const getTab = async (
  name: string,
  artist: string,
  song: Spotify.Track | SpotifyApi.TrackObjectFull | SpotifyApi.RecommendationTrackObject,
): Promise<TabData[]> => {
  if (get(TabCache)[song.id]) {
    return (get(TabCache)[song.id]);
  }

  let formattedName = name.split(" - ")[0];
  formattedName = formattedName.split("(")[0];

  try {
    const res = await fetch(
      `${API_ROUTE}/api?song_name=${encodeURIComponent(formattedName)}&artist_name=${encodeURIComponent(
        artist,
      )
      }`,
    );

    const tab = await res.json();

    TabCache.update((cache) => {
      cache[song.id] = tab;

      return cache
    })

    return tab
  } catch {
  }
};
