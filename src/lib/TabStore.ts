import { get, writable } from "svelte/store";

interface TabData {
  DATA: string;
}
export const Tab = writable<Promise<TabData>>();
export const TabCache = writable<Record<string, TabData>>({});
export const updateTabCache = async (nextSongs: Spotify.Track[]) => {
  nextSongs.map(async (song) => {
    if (!get(TabCache)[song.id]) {
      const tab = await getTab(song.artists[0].name, song.name, song);
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
export const getTab = (name: string, artist: string, song: Spotify.Track) => {
  return new Promise<TabData>(async (resolve, reject) => {
    if (get(TabCache)[song.id]) {
      return resolve(get(TabCache)[song.id]);
    }
    try {
      const res = await fetch(
        `/api/gettab?song_name=${encodeURIComponent(name)}&artist_name=${
          encodeURIComponent(
            artist,
          )
        }`,
      );

      resolve(await res.json());
    } catch {
      reject();
    }
  });
};
