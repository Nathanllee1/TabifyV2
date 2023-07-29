import { get, writable } from "svelte/store";
import { Progress } from "./ProgressStore";
import { SpotifyState } from "./SpotifyStateStore";
import { UserStore } from "./UserStore";
import { inject } from "@vercel/analytics";
import { spotifyRequest } from "./utils";
import { yourExploreStore } from "../App/Explore/Explore";

// analytics
inject();

export const AppStore = createAppStore();

function createAppStore() {
  const token = new URLSearchParams(window.location.search).get("token");

  const { subscribe, update, set } = writable<{
    token: string;
    authenticated: boolean;
    connected: boolean;
    state?: Spotify.PlaybackState;
    player?: Spotify.Player;
    canSwitch: boolean;
    deviceId: string;
  }>({
    token: token,
    authenticated: false,
    connected: false,
    state: null,
    player: null,
    canSwitch: true,
    deviceId: undefined
  });

  return ({
    subscribe,
    update,
    set,
    init: async () => {
      const store = get(AppStore);

      if (!store.token) {
        return;
      }

      // get and set the user's profile
      UserStore.init(token);

      yourExploreStore.getPlaylists()

      // timeout just in case none of the earlier errors throw :(
      const timeout = setTimeout(() => {
        window.location.href = "/";
        return;
      }, 10000);

      await waitForSpotifySDKReady();

      const player = new Spotify.Player({
        name: "Tabify",
        getOAuthToken: (callback) => {
          callback(store.token);
        },
      });

      if (!await player.connect()) {
        throw ("Player initialization error");
      }

      assignErrors(player);

      const deviceId = await waitForSpotifyAuthenticated(player);

      update((store) => {
        store.authenticated = true;
        store.player = player;
        store.deviceId = deviceId;
        return store;
      });

      // everything's good :)
      clearTimeout(timeout);

      await waitForPlayerSwitch(deviceId);
    },
  });
}

const assignErrors = (player: Spotify.Player) => {
  player.on("account_error", () => {
    window.location.href = "/";
  });

  player.on("initialization_error", () => {
    window.location.href = `/?message=${encodeURIComponent("Token expired")}`;
  });

  player.on("authentication_error", () => {
    window.location.href = `/?message=${encodeURIComponent("Make sure you have Spotify premium")}`;

  });
};

const waitForSpotifySDKReady = () => {

  return new Promise<void>((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      return resolve();
    };
  });
};

const waitForSpotifyAuthenticated = (player: Spotify.Player) => {
  return new Promise<string>((resolve, reject) => {
    player.on("ready", (obj) => {
      return resolve(obj.device_id);
    });
  });
};



const forceSwitch = async (deviceId: string, token: string) => {
  await spotifyRequest(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`)
};

export const switchDevice = async () => {
  const token = get(AppStore).token;
  const deviceId = get(AppStore).deviceId;
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`,
  );
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "device_ids": [
      deviceId,
    ],
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
  };

  const res = await fetch(
    `https://api.spotify.com/v1/me/player?device_id=${deviceId}`,
    requestOptions,
  );

  if (!res.ok) {
    await forceSwitch(deviceId, token);
    AppStore.update((store) => {
      store.canSwitch = false;
      return store;
    });

    throw ("Can't switch devices");
  }
};

const waitForPlayerSwitch = async (deviceId: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const appStore = get(AppStore);

    try {
      await switchDevice();

      AppStore.update((store) => {
        store.connected = true;
        return store;
      });
    } catch {
      resolve();
    }

    appStore.player.on("player_state_changed", (state) => {
      // error state, probably device switching
      if (state === null || state.context.uri === null) {
        console.log("Tabify disconnected")
        AppStore.update((store) => {
          store.connected = false;
          return store
        })

        Progress.pause();
        return
      }

      Progress.update((progress) => {
        progress.songMS = state.position;
        return progress;
      });

      SpotifyState.set({
        ...state,
        // get around dumb timing bug
        duration: state.context.metadata.current_item.estimated_duration,
      });

      
      AppStore.update((store) => {
        store.connected = true;
        return store;
      });
    

      resolve();
    });
  });
};
