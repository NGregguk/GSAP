import { gsap, Motion } from "../gsapSetup.js";
import { splitByChars } from "../utils/text.js";

// Glow trail: characters rise while text-shadow intensity blooms.
function initSectionGlowTrail(section, isReduced) {
  const text = section?.querySelector("[data-anim='glow']");
  const controls = section?.querySelectorAll(".controls button");
  if (!text || !controls?.length) return () => {};

  const chars = splitByChars(text);
  const duration = isReduced ? 0.01 : Motion.duration.sm;

  gsap.set(chars, {
    yPercent: 140,
    autoAlpha: 0,
    textShadow: "0px 0px 0px rgba(122, 215, 255, 0)"
  });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.to(chars, {
    yPercent: 0,
    autoAlpha: 1,
    textShadow: "0px 8px 22px rgba(122, 215, 255, 0.65)",
    stagger: 0.04
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

export { initSectionGlowTrail };
