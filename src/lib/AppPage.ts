import { writable } from "svelte/store";

export const AppPage = writable<"main" | "profile" | "explore">("explore");