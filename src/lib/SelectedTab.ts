import { writable } from "svelte/store";
import { Tab } from "./TabStore";

export const selectedTab = writable(0);

Tab.subscribe((tab) => {
    selectedTab.set(0)
})