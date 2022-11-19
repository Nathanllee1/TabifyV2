import { get, writable } from "svelte/store";
import { SpotifyState } from "./SpotifyStateStore";
import { Tab } from "./TabStore";
import { transposeStore } from "./TransposeStore";

export const selectedTab = writable(0);

selectedTab.subscribe(async (selected) => {
  const res = await (await fetch(
    `api/tabpreference/?tab_id=${(await get(Tab))[get(selectedTab)].url}`,
    { method: "GET" },
  )).json();

  transposeStore.set({
    semitones: Number(res.length === 0 ? 0 : res[0]["TRANSPOSE"]),
  });
  console.log(res);

  const prefRes = await (await fetch(
    `api/songpreference/?song_id=${
      get(SpotifyState).track_window.current_track.id
    }&song_id=${get(SpotifyState).track_window.current_track.id}&selected_tab=${
      (await get(Tab))[get(selectedTab)].url
    }`,
    {
      method: "POST",
    },
  )).json();

});

Tab.subscribe(async (tab) => {
  const res = await (await fetch(
      `api/songpreference/?song_id=${get(SpotifyState).track_window.current_track.id}`
  ))

  const tabURL = res[0]["SELECTED_TAB"]
  
  (await get(Tab)).filter((tab) => {
      tab.url === tabURL
  })

  selectedTab.set(0);
});
