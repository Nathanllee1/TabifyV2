import { get, writable } from "svelte/store";
import { CurrentTrack } from "./SpotifyStateStore";

type stats = {
  sessions: number;
  songs: string;
  topTen: { SONG_ID: string; TIMES_PLAYED: number }[];
};

export const profile = (() => {
  const { subscribe, set, update } = writable<stats>();

  return ({
    subscribe,
    set,
    update,
    init: async () => {
      if (!get(profile)) {
        set(await (await fetch("/api/stats")).json());
      }
    },
  });
})();
 