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

    if (AutoScroll.check && !get(Progress).paused) {
      element.scrollBy({
        top: (element.scrollHeight / get(Progress).maxMS) * 200,
        behavior: "smooth",
      });
    }
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

    check: () => {
      update((autoScroll) => {
        autoScroll.checked = true;
        autoScroll.interval = createInterval();

        return autoScroll;
      });
    },
    uncheck: () => {
      update((autoScroll) => {
        autoScroll.checked = false;
        autoScroll.interval ? clearInterval(autoScroll.interval) : null;
        return autoScroll;
      });
    },
  };
})();
