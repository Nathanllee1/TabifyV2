import { derived, get, writable } from "svelte/store";
interface AppStore {
  token: string;
  authenticated: boolean;
  connected: boolean;
  state?: Spotify.PlaybackState;
}

const waitForSpotifySDKReady = () => {
  return new Promise<void>((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      return resolve();
    };
  });
};

const waitForSpotifyAuthenticated = (player:Spotify.Player) => {
  return new Promise<void>((resolve, reject) => {
    player.on("ready", (obj) => {
      console.log("The Web Playback SDK is ready to play music!");
      console.log("Device ID", obj);

      return resolve();
    })
  });
};

const assignErrors = (player:Spotify.Player) => {
  player.on("account_error", () => {
    window.location.href = "/";
  });

  player.on("initialization_error", () => {
    window.location.href = "/";
  });

  player.on("authentication_error", () => {
    window.location.href = "/";
  }); 
}

export const AppStore = createAppStore();
export const SpotifyState = writable<Spotify.PlaybackState>();
export const CurrentTrackId = writable<string>();


interface TabData {
  DATA: string
}
export const Tab = writable<Promise<TabData>>();

interface TabCacheShape {
  [id:string]: TabData
} 
export const TabCache = writable<Record<string, TabData>>({});

const updateTabCache = async(nextSongs:Spotify.Track[]) => {
  const requests = nextSongs.map(async(song) => {
    if (!get(TabCache)[song.id]) {
      const tab = await getTab(song.artists[0].name, song.name, song.id);
      TabCache.update((cache) => {
        cache[song.id] = tab
        return cache;
      })
      
    }
  });
}

const getTab = (name:string, artist:string, songId:string) => {
  return new Promise<TabData>(async (resolve, reject) => {
    if (get(TabCache)[songId]) {
      return resolve(get(TabCache)[songId]);

    }
    try {
      const res = await fetch(
        `/api/gettab?song_name=${
          encodeURIComponent(name)
        }&artist_name=${
          encodeURIComponent(
            artist,
          )
        }`,
      );

      resolve(await res.json());
    } catch {
      reject();
    }
  })
}

SpotifyState.subscribe(async state => {
  // console.log(state)
  const currentTrackId = get(CurrentTrackId);
  const eventTrackId = state?.track_window?.current_track?.id

  // only request the song if it's new
  if (eventTrackId !== currentTrackId) {
    CurrentTrackId.set(eventTrackId)
    console.log("Fetching from API")
    
    Tab.set(getTab(state.track_window.current_track.name, state.track_window.current_track.artists[0].name, eventTrackId));

    updateTabCache(state.track_window.next_tracks)
  }
})


function createAppStore() {
  const token = new URLSearchParams(window.location.search).get("token");

  const { subscribe, update, set } = writable<AppStore>({
    token: token,
    authenticated: false,
    connected: false,
    state: null,
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

      const timeout = setTimeout(() => {
        window.location.href = "/"
        return;
      }, 10000)

      await waitForSpotifySDKReady();

      const player = new Spotify.Player({
        name: "TabifyV2",
        getOAuthToken: (callback) => {
          callback(store.token);
        },
      }); 

      if (!await player.connect()) {
        throw ("Player initialization error");
      }

      assignErrors(player);

      await waitForSpotifyAuthenticated(player);

      update((store) => {
        store.authenticated = true;
        return store
      })

      clearTimeout(timeout)

      player.on("player_state_changed", (state) => {
        SpotifyState.set(state);

        update((store) => {
          store.connected = true;
          return store;
        });
      });
    },
  });
}
