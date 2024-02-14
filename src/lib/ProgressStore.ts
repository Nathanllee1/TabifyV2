import { get, writable } from "svelte/store";
import { AutoScroll } from "./Autoscroll";
import { AppStore } from "./AppStore";
import { recommendationOpen } from "../App/Recommender/RecommendationOpen";



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

        recommendationOpen.set(true)

        return progress;
      });
    },
    play: () => {
      update((progress) => {

        recommendationOpen.set(false)

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
    seek: (ms: number) => {
      update((progress) => {
        progress.songMS = ms;
        return progress;
      });
    },
    update,
  };
})();
