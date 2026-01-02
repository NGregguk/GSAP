import { gsap, Motion } from "../js/gsapSetup.js";

const items = gsap.utils.toArray("[data-acc]");
const timelines = new Map();

items.forEach((item) => {
  const content = item.querySelector(".accordion__content");
  const chevron = item.querySelector(".accordion__chevron");
  const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out, duration: Motion.duration.sm } });
  tl.fromTo(content, { autoAlpha: 0, maxHeight: 0, y: -6 }, { autoAlpha: 1, maxHeight: 200, y: 0 })
    .fromTo(chevron, { rotate: 0 }, { rotate: 90 }, 0);
  timelines.set(item, tl);

  item.addEventListener("click", () => {
    const isOpen = tl.progress() > 0 && !tl.reversed();
    timelines.forEach((otherTl, otherItem) => {
      if (otherItem !== item) otherTl.reverse();
    });
    isOpen ? tl.reverse() : tl.play();
  });
});
