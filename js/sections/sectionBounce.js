import { gsap, Motion } from "../gsapSetup.js";
import { splitByChars } from "../utils/text.js";

// Bounce lift for characters with elastic ease.
function initSectionBounce(section, isReduced) {
  const text = section?.querySelector("[data-anim='bounce']");
  const controls = section?.querySelectorAll(".controls button");
  if (!text || !controls?.length) return () => {};

  const chars = splitByChars(text);
  const duration = isReduced ? 0.01 : Motion.duration.sm;

  gsap.set(chars, { yPercent: 120, scale: 0.82, autoAlpha: 0, transformOrigin: "50% 80%" });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: "back.out(1.8)", duration }
  });

  tl.to(chars, {
    yPercent: 0,
    scale: 1,
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

export { initSectionBounce };
