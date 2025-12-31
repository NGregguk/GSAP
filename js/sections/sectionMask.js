import { gsap, Motion } from "../gsapSetup.js";

// Masked reveal using overflow hidden to avoid layout thrash while moving text.
function initSectionMask(section, isReduced) {
  const textEl = section.querySelector("[data-anim='mask']");
  const controls = section.querySelectorAll(".controls button");
  if (!textEl) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(textEl, { yPercent: 100, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.fromTo(
    textEl,
    { yPercent: 100, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1 }
  );

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
    gsap.set(textEl, { clearProps: "all" });
  };
}

export { initSectionMask };
