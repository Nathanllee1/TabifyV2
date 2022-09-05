import { get, writable } from "svelte/store";
import { Progress } from "./ProgressStore";
import { getTab, Tab, updateTabCache } from "./TabStore";
export const CurrentTrack = writable<Spotify.Track>();

export const SpotifyState = writable<Spotify.PlaybackState>();

SpotifyState.subscribe(async (state) => {
  // console.log(state)
  const currentTrack = get(CurrentTrack);
  const eventTrack = state?.track_window?.current_track;
  if (state?.paused) {
    Progress.pause();
  } else {
    Progress.play();
  }

  // only request the song if it's new
  if (eventTrack?.id !== currentTrack?.id) {
    CurrentTrack.set(eventTrack);

    Tab.set(
      getTab(
        state.track_window.current_track.name,
        state.track_window.current_track.artists[0].name,
        eventTrack,
      ),
    );

    // reset timer
    Progress.reset();

    Progress.update((progress) => {
      progress.maxMS = state.track_window.current_track.duration_ms;
      return progress;
    });

    updateTabCache(state.track_window.next_tracks);
  }
});
