import { get, writable } from "svelte/store";
import { Progress } from "./ProgressStore";
import { SpotifyState } from "./SpotifyStateStore";
import { UserStore } from "./UserStore";
import { inject } from '@vercel/analytics';

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
  }>({
    token: token,
    authenticated: false,
    connected: false,
    state: null,
    player: null,
    canSwitch: true,
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
      UserStore.init(token)

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
      window.location.href = "/";
    });
  
    player.on("authentication_error", () => {
      window.location.href = "/";
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


const switchDevice = async (deviceId: string, token: string) => {
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
        await switchDevice(deviceId, appStore.token);
      } catch {
        resolve();
      }
  
      appStore.player.on("player_state_changed", (state) => {

        Progress.update((progress) => {
          progress.songMS = state.position
          return progress
        })
        
        SpotifyState.set({
          ...state,
          // get around dumb timing bug
          duration: state.context.metadata.current_item.estimated_duration
        });
        AppStore.update((store) => {
          store.connected = true;
          return store;
        });

  
        resolve();
      });
    });
  };