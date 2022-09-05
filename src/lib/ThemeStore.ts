import { get, writable } from "svelte/store";
import { FastAverageColor } from "fast-average-color";
import { CurrentTrack } from "./SpotifyStateStore";

export const ThemeColors = writable<{ albumColor: string; textColor: string }>({
    albumColor: "#0000",
    textColor: "#fff",
  });
  CurrentTrack.subscribe(async (track) => {
    if (track) {
      const res = await (new FastAverageColor()).getColorAsync(
        track.album.images[1].url,
      );
  
      ThemeColors.set({
        albumColor: res.hex,
        textColor: res.isDark ? "#fff" : "#000",
      });
    }
  });
  
  