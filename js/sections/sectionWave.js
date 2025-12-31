import { gsap, Motion } from "../gsapSetup.js";
import { splitByChars } from "../utils/text.js";

// Wave stagger uses function-based delays for organic ripple without layout touches.
function initSectionWave(section, isReduced) {
  const text = section.querySelector("[data-anim='wave']");
  const controls = section.querySelectorAll(".controls button");
  if (!text) return () => {};

  const chars = splitByChars(text);
  const duration = isReduced ? 0.01 : Motion.duration.sm;

  gsap.set(chars, { yPercent: 120, autoAlpha: 0, scale: 0.9 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration }
  });

  tl.fromTo(
    chars,
    { yPercent: 120, autoAlpha: 0, scale: 0.9 },
    {
      yPercent: 0,
      autoAlpha: 1,
      scale: 1,
      stagger: (index) => 0.06 + Math.abs(Math.sin(index * 0.5)) * 0.05
    }
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
    gsap.set(chars, { clearProps: "all" });
  };
}

export { initSectionWave };
