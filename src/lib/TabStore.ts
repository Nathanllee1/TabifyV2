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
    if (!get(TabCache)[song.id]) {
      const tab = await getTab(song.name, song.artists[0].name, song);
      TabCache.update((cache) => {
        cache[song.id] = tab;
        return cache;
      });
    }
  });
};

/**
 * Gets the tab from the server or the cache
 * @param name
 * @param artist
 * @param song
 * @returns
 */
export const getTab = async (
  name: string,
  artist: string,
  song: Spotify.Track,
): Promise<TabData[]> => {
  if (get(TabCache)[song.id]) {
    return (get(TabCache)[song.id]);
  }

  let formattedName = name.split(" - ")[0];
  formattedName = formattedName.split("(")[0];

  try {
    const res = await fetch(
      `/api?song_name=${encodeURIComponent(formattedName)}&artist_name=${
        encodeURIComponent(
          artist,
        )
      }`,
    );

    return await res.json();
  } catch {
  }
};

Tab.subscribe(async (tab) => {
  console.log(get(SpotifyState));
  await fetch(
    `/api/history?song_id=${
      get(SpotifyState).track_window.current_track.id
    }&tab_returned=${(await tab).length === 0 ? "f" : "t"}`,
  );
});
