import { gsap, Motion } from "../gsapSetup.js";
import { splitByChars } from "../utils/text.js";

// Flip cascade for characters with staggered rotateY.
function initSectionFlip(section, isReduced) {
  const text = section?.querySelector("[data-anim='flip']");
  const controls = section?.querySelectorAll(".controls button");
  if (!text || !controls?.length) return () => {};

  const chars = splitByChars(text);
  const duration = isReduced ? 0.01 : Motion.duration.sm;

  gsap.set(chars, { rotateY: -90, yPercent: 40, autoAlpha: 0, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.to(chars, {
    rotateY: 0,
    yPercent: 0,
    autoAlpha: 1,
    stagger: 0.05
  });

  const handlers = { play: () => tl.play(), reverse: () => tl.reverse(), restart: () => tl.restart() };
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
    gsap.set(chars, { clearProps: "all" });
  };
}

export { initSectionFlip };
