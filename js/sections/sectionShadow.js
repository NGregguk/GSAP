import { gsap, Motion } from "../gsapSetup.js";

// Shadow slide uses a clone layer offset behind the main text.
function initSectionShadow(section, isReduced) {
  const main = section?.querySelector("[data-anim='shadow']");
  const clone = section?.querySelector(".shadow__clone");
  const controls = section?.querySelectorAll(".controls button");
  if (!main || !clone || !controls?.length) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(main, { yPercent: 30, scale: 0.96, autoAlpha: 0.85, transformOrigin: "50% 50%" });
  gsap.set(clone, { xPercent: -28, yPercent: 34, scale: 0.9, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.to(clone, { xPercent: 0, yPercent: 0, scale: 1, autoAlpha: 0.65 })
    .to(main, { yPercent: 0, scale: 1, autoAlpha: 1 }, 0);

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
    gsap.set([main, clone], { clearProps: "all" });
  };
}

export { initSectionShadow };
