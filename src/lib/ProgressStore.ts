import { get, writable } from "svelte/store";

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
    seek: (ms: number) => {
      update((progress) => {
        progress.songMS = ms;
        return progress;
      });
    },
    update,
  };
})();

export const AutoScroll = (() => {
  const { update } = writable<{
    interval?: NodeJS.Timeout;
    checked: boolean;
  }>({
    interval: null,
    checked: false,
  });

  return {
    update,
    start: () => {
      console.log("starting autoscroll");
      update((autoScroll) => {
        autoScroll.checked = true;
        // go to the estimated location
        // const percentageThrough = get(Progress).songMS / get(Progress).maxMS
        // console.log(percentageThrough, element.scrollHeight)
        // element.scroll({top: element.scrollHeight - ( element.scrollHeight * percentageThrough), behavior: 'smooth'})

        // console.log((element.scrollHeight / get(Progress).maxMS) * 1000);
        autoScroll.interval = setInterval(() => {
          const element = document.getElementById("tabContainer");
          // set interval to add pixels to scroll
          console.log(
            "rate: ",
            (element.scrollHeight / get(Progress).maxMS) * 1000,
          );
          element.scrollBy({
            top: (element.scrollHeight / get(Progress).maxMS) * 1000,
            behavior: "smooth",
          });
        }, 1000);
        return autoScroll;
      });
    },
    stop: () => {
      console.log("Stopping");
      update((autoScroll) => {
        autoScroll.checked = false;
        autoScroll.interval ? clearInterval(autoScroll.interval) : null;
        return (autoScroll);
      });
    },
    updateSize: () => {
      update((autoScroll) => {
        console.log(autoScroll);
        if (autoScroll.checked) {
          AutoScroll.start();
        }

        return autoScroll;
      });
    },
  };
})();
