import { derived, get, writable } from "svelte/store";
import { FastAverageColor } from "fast-average-color";

interface AppStore {
  token: string;
  authenticated: boolean;
  connected: boolean;
  state?: Spotify.PlaybackState;
  player?: Spotify.Player
}

const waitForSpotifySDKReady = () => {
  return new Promise<void>((resolve, reject) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      return resolve();
    };
  });
};

const waitForSpotifyAuthenticated = (player: Spotify.Player) => {
  return new Promise<void>((resolve, reject) => {
    player.on("ready", (obj) => {
      console.log("The Web Playback SDK is ready to play music!");
      console.log("Device ID", obj);

      return resolve();
    });
  });
};

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

export const AppStore = createAppStore();
export const SpotifyState = writable<Spotify.PlaybackState>();
export const CurrentTrack = writable<Spotify.Track>();

interface TabData {
  DATA: string;
}
export const Tab = writable<Promise<TabData>>();
export const TabCache = writable<Record<string, TabData>>({});
const updateTabCache = async (nextSongs: Spotify.Track[]) => {
  nextSongs.map(async (song) => {
    if (!get(TabCache)[song.id]) {
      const tab = await getTab(song.artists[0].name, song.name, song);
      TabCache.update((cache) => {
        cache[song.id] = tab;
        return cache;
      });
    }
  });
};

export const ThemeColors = writable<{ albumColor: string; textColor: string }>({
  albumColor: "#0000",
  textColor: "#fff",
});
CurrentTrack.subscribe(async (track) => {
  if (track) {
    const res = await (new FastAverageColor()).getColorAsync(
      track.album.images[1].url,
    );

    ThemeColors.set({
      albumColor: res.hex,
      textColor: res.isDark ? "#fff" : "#000",
    });
  }
});

/**
 * Keeps track of how far along in the song the user is.
 */
export const Progress = (() => {
  const { subscribe, set, update } = writable<{
    interval?: NodeJS.Timeout;
    songMS?: number;
    maxMS?: number;
    paused: boolean;
  }>({ interval: null, songMS: null, maxMS: null, paused: true });

  return {
    subscribe,
    pause: () => {
      update((progress) => {
        clearInterval(progress.interval);
        progress.interval = null;
        progress.paused = true;
        return progress;
      });
    },
    play: () => {
      update((progress) => {
        if (progress.paused) {
          progress.interval = setInterval(() => {
            update((progress) => {
              progress.songMS += 500;
              return progress;
            });
          }, 500);

          progress.paused = false;
        }

        return progress;
      });
    },
    reset: () => {
      update((progress) => {
        progress.songMS = 0;
        return progress;
      });
    },
    update
  };
})();

/**
 * Gets the tab from the server or the cache
 * @param name
 * @param artist
 * @param song
 * @returns
 */
const getTab = (name: string, artist: string, song: Spotify.Track) => {
  return new Promise<TabData>(async (resolve, reject) => {
    if (get(TabCache)[song.id]) {
      return resolve(get(TabCache)[song.id]);
    }
    try {
      const res = await fetch(
        `/api/gettab?song_name=${encodeURIComponent(name)}&artist_name=${
          encodeURIComponent(
            artist,
          )
        }`,
      );

      resolve(await res.json());
    } catch {
      reject();
    }
  });
};

SpotifyState.subscribe(async (state) => {
  // console.log(state)
  const currentTrack = get(CurrentTrack);
  const eventTrack = state?.track_window?.current_track;
  if (state?.paused) {
    Progress.pause();
  } else {
    Progress.play();
  }
  // only request the song if it's new
  if (eventTrack?.id !== currentTrack?.id) {
    CurrentTrack.set(eventTrack);
    console.log("Fetching from API");

    Tab.set(
      getTab(
        state.track_window.current_track.name,
        state.track_window.current_track.artists[0].name,
        eventTrack,
      ),
    );

    // reset timer
    Progress.reset();
    
    Progress.update((progress) => {
      progress.maxMS = state.track_window.current_track.duration_ms
      return progress;
    })
    
    updateTabCache(state.track_window.next_tracks);
  }
});

function createAppStore() {
  const token = new URLSearchParams(window.location.search).get("token");

  const { subscribe, update, set } = writable<AppStore>({
    token: token,
    authenticated: false,
    connected: false,
    state: null,
    player: null
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

      await waitForSpotifyAuthenticated(player);

      update((store) => {
        store.authenticated = true;
        store.player = player;
        return store;
      });

      // everything's good :)
      clearTimeout(timeout);

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
