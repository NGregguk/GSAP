import { gsap, Motion } from "../gsapSetup.js";

// Duotone slide with ghost layer offset.
function initSectionDuotone(section, isReduced) {
  const main = section?.querySelector("[data-anim='duotone']");
  const ghost = section?.querySelector(".duotone__ghost");
  const controls = section?.querySelectorAll(".controls button");
  if (!main || !ghost || !controls?.length) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(main, { yPercent: 18, autoAlpha: 0.9 });
  gsap.set(ghost, { xPercent: -20, yPercent: 30, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.to(ghost, { xPercent: 0, yPercent: 0, autoAlpha: 0.5 })
    .to(main, { yPercent: 0, autoAlpha: 1 }, 0);

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
    gsap.set([main, ghost], { clearProps: "all" });
  };
}

export { initSectionDuotone };
