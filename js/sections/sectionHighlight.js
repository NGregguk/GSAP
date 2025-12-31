import { gsap, Motion } from "../gsapSetup.js";

// Highlight sweep uses a separate bar element to keep text untouched and composited.
function initSectionHighlight(section, isReduced) {
  const bar = section.querySelector(".highlight__bar");
  const text = section.querySelector("[data-anim='highlight']");
  const controls = section.querySelectorAll(".controls button");
  if (!bar || !text) return () => {};

  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(bar, { scaleX: 0, autoAlpha: 0 });
  gsap.set(text, { yPercent: 20, autoAlpha: 0.7 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.fromTo(
    bar,
    { scaleX: 0, autoAlpha: 0 },
    { scaleX: 1, autoAlpha: 0.6 }
  ).fromTo(
    text,
    { yPercent: 20, autoAlpha: 0.7 },
    { yPercent: 0, autoAlpha: 1 },
    "<"
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
    gsap.set([bar, text], { clearProps: "all" });
  };
}

export { initSectionHighlight };
