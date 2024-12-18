import { get, writable } from "svelte/store";
import { Progress } from "./ProgressStore";
import { SpotifyState } from "./SpotifyStateStore";
import { UserStore } from "./UserStore";
import { inject } from "@vercel/analytics";
import { spotifyRequest } from "./utils";
import { yourExploreStore } from "../App/Explore/Explore";
import { initializeSentry } from "./Sentry";

// analytics
inject();

export const AppStore = createAppStore();

function getToken() {
  let token = new URLSearchParams(window.location.search).get("token")

  if (token) {
    localStorage.setItem("token", token)
    localStorage.setItem("tokenExpiresIn", ((new Date()).getTime() + 1000 * 60 * 60).toString())
    window.location.assign("/")

  }

  token = localStorage.getItem("token")
  const expiresIn = parseInt(localStorage.getItem("tokenExpiresIn"))

  console.log(token)
  if (!token) {
    return undefined
  }

  setTimeout(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiresIn")
    window.location.assign("/api/login")
  }, expiresIn - new Date().getTime())

  return token
}

function createAppStore() {
  const token = getToken();

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

      initializeSentry()

      // get and set the user's profile
      UserStore.init(token);

      // timeout just in case none of the earlier errors throw :(
      const timeout = setTimeout(() => {
        console.log("Timed out")
        localStorage.removeItem("token")
        localStorage.removeItem("tokenExpiresIn")
        window.location.assign("/api/login")
        // window.location.href = "/";
        return;
      }, 10000);

      await waitForSpotifySDKReady();

      const player = new Spotify.Player({
        name: "Tabify",
        getOAuthToken: (callback) => {
          callback(store.token);
        },
      });

      yourExploreStore.getPlaylists()

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
    console.log("Account error")
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiresIn")
    window.location.href = `/?message=${encodeURIComponent("Make sure you have Spotify premium")}`;
  });

  player.on("initialization_error", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiresIn")
    window.location.href = `/?message=${encodeURIComponent("Token expired, sign in again")}`;
  });

  player.on("authentication_error", () => {
    localStorage.removeItem("token")
    localStorage.removeItem("tokenExpiresIn")
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
        // duration: state.context.metadata.current_item.estimated_duration,
      });


      AppStore.update((store) => {
        store.connected = true;
        return store;
      });

      resolve();
    });

    try {
      await switchDevice();

      AppStore.update((store) => {
        store.connected = true;
        return store;
      });
    } catch {
      resolve();
    }

    AppStore.update((store) => {
      store.connected = true;
      return store;
    });

    resolve();
  });
};
