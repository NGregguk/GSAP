import { gsap, Motion } from "../gsapSetup.js";

// Skew slide: text shears in then settles to neutral.
function initSectionSkewSlide(section, isReduced) {
  const text = section?.querySelector("[data-anim='skew']");
  const controls = section?.querySelectorAll(".controls button");
  if (!text || !controls?.length) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(text, { xPercent: -18, skewX: -12, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.to(text, { xPercent: 0, skewX: 0, autoAlpha: 1 });

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
    gsap.set(text, { clearProps: "all" });
  };
}

export { initSectionSkewSlide };
