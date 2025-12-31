import { gsap, Motion } from "../gsapSetup.js";
import { splitByChars } from "../utils/text.js";

// Character stagger demonstrating reversible timeline-as-state-machine.
function initSectionChars(section, isReduced) {
  const textEl = section.querySelector("[data-anim='chars']");
  const controls = section.querySelectorAll(".controls button");
  if (!textEl) return () => {};

  const chars = splitByChars(textEl);
  const duration = isReduced ? 0.01 : Motion.duration.md;

  gsap.set(chars, { yPercent: 120, autoAlpha: 0 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.fromTo(
    chars,
    { yPercent: 120, autoAlpha: 0 },
    { yPercent: 0, autoAlpha: 1, stagger: 0.04 }
  );

  const handlers = {
    play: () => tl.play(),
    reverse: () => tl.reverse(),
    restart: () => tl.restart()
  };

  controls.forEach((btn) => {
    const action = btn.dataset.action;
    const fn = handlers[action];
    if (fn) btn.addEventListener("click", fn);
  });

  if (isReduced) {
    tl.progress(1).pause(0);
  }

  return () => {
    controls.forEach((btn) => {
      const action = btn.dataset.action;
      const fn = handlers[action];
      if (fn) btn.removeEventListener("click", fn);
    });
    tl.kill();
    gsap.set(chars, { clearProps: "all" });
  };
}

export { initSectionChars };
