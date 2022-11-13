import { get, writable } from "svelte/store";
import { Progress } from "./ProgressStore";

const createInterval = () => {
  return setInterval(() => {
    const element = document.getElementById("tabContainer");
    // set interval to add pixels to scroll
    /*console.log(
          "rate: ",
          (element.scrollHeight / get(Progress).maxMS) * 200,
        );*/
    element.scrollBy({
      top: (element.scrollHeight / get(Progress).maxMS) * 200,
      behavior: "smooth",
    });
  }, 200);
};

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
        autoScroll.interval = createInterval();
        return autoScroll;
      });
    },
    pause: () => {
      update((autoScroll) => {
        autoScroll.interval ? clearInterval(autoScroll.interval) : null;
        return (autoScroll);
      });
    },
    play: () => {
      update((autoScroll) => {
        if (autoScroll.checked) {
            autoScroll.interval = createInterval();
            return autoScroll
        }

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
