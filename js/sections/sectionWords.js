import { gsap, Motion } from "../gsapSetup.js";
import { splitByWords } from "../utils/text.js";

// Word-level drift with slight rotation to emulate blur without costly filters.
function initSectionWords(section, isReduced) {
  const textEl = section.querySelector("[data-anim='words']");
  const controls = section.querySelectorAll(".controls button");
  if (!textEl) return () => {};

  const words = splitByWords(textEl);
  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(words, { yPercent: 60, rotate: -6, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.fromTo(words, {
    yPercent: 60,
    rotate: -6,
    autoAlpha: 0
  }, {
    yPercent: 0,
    rotate: 0,
    autoAlpha: 1,
    stagger: 0.08
  });

  const handlers = {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
    restart: () => tl.restart()
  };

  controls.forEach((btn) => {
    const fn = handlers[btn.dataset.action];
    if (fn) btn.addEventListener("click", fn);
  });

  if (isReduced) tl.progress(1).pause(0);

  return () => {
    controls.forEach((btn) => {
      const fn = handlers[btn.dataset.action];
      if (fn) btn.removeEventListener("click", fn);
    });
    tl.kill();
    gsap.set(words, { clearProps: "all" });
  };
}

export { initSectionWords };
