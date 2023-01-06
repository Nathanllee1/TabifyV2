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
});

Tab.subscribe((tab) => {
  selectedTab.set(0);
})