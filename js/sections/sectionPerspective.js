import { gsap, Motion } from "../gsapSetup.js";

// Perspective entrance applies subtle rotateX/Y to avoid costly 3D layers.
function initSectionPerspective(section, isReduced) {
  const text = section.querySelector("[data-anim='perspective']");
  const controls = section.querySelectorAll(".controls button");
  if (!text) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(text, {
    autoAlpha: 0,
    rotateX: -40,
    rotateY: 14,
    yPercent: 30,
    transformOrigin: "50% 50%"
  });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.back, duration }
  });

  tl.to(text, {
    autoAlpha: 1,
    rotateX: 0,
    rotateY: 0,
    yPercent: 0
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
    gsap.set(text, { clearProps: "all" });
  };
}

export { initSectionPerspective };
