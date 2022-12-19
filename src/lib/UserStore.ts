import { writable } from "svelte/store";

export const UserStore = createUserStore();

function createUserStore() {
  const { subscribe, set } = writable<{
    profile?: SpotifyApi.CurrentUsersProfileResponse
  }>({});

  return {
    subscribe,
    init: async (token: string) => {
      const myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${token}`,
      );
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      myHeaders.append("Content-Type", "application/json");
      const profile:SpotifyApi.CurrentUsersProfileResponse = await (await fetch("https://api.spotify.com/v1/me", requestOptions)).json();
      set({profile})
    },
  };
}
