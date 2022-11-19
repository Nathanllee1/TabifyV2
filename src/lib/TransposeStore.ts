import { get, writable } from "svelte/store";
import { Tab } from "./TabStore";
import { transpose } from "chord-transposer";
import { selectedTab } from "./SelectedTab";
import { SpotifyState } from "./SpotifyStateStore";

export let transposeStore = createTranspose();

function transposeTab(steps: number) {
  const chords = document.getElementsByClassName("_3PpPJ OrSDI");

  for (const chord of chords) {
    try {
      chord.textContent = transpose(chord.textContent).up(steps);
    } catch {
    }
  }
}

function createTranspose() {
  const { subscribe, set, update } = writable({
    semitones: 0,
  });

  return {
    subscribe,
    set,
    increase: () => {
      update((transp) => {
        transp.semitones += 1;
        transposeTab(1);
        return transp;
      });
    },
    decrease: () => {
      update((transp) => {
        transp.semitones -= 1;
        transposeTab(-1);
        return transp;
      });
    },
  };
}

/**
 * Reset transposition on each tab
 */
Tab.subscribe(async (tab) => {

  transposeStore.set({
    semitones: 0,
  });
});

transposeStore.subscribe(async (transp) => {
  if (transp.semitones !== 0) {
    await fetch(
      `/api/tabpreference?tab_id=${
        (await get(Tab))[get(selectedTab)].url
      }&song_id=${
        get(SpotifyState).track_window.current_track.id
      }&transpose=${transp.semitones}`,
      {
        method: "POST"
      }
    );
  }
  
});
