import { gsap, Motion } from "../gsapSetup.js";

// Rolling counter keeps text-accessible, using snap to avoid jittery decimals.
function initSectionCounter(section, isReduced) {
  const valueEl = section.querySelector("[data-anim='counter']");
  const controls = section.querySelectorAll(".controls button");
  if (!valueEl) return () => {};

  const endValue = 24580;
  const state = { value: 0 };
  const duration = isReduced ? 0.01 : Motion.duration.lg;

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out }
  });

  tl.to(state, {
    value: endValue,
    duration,
    snap: { value: 1 },
    onUpdate: () => {
      valueEl.textContent = Math.round(state.value).toLocaleString();
    },
    onComplete: () => {
      valueEl.textContent = endValue.toLocaleString();
    }
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

  if (isReduced) {
    state.value = endValue;
    valueEl.textContent = endValue.toLocaleString();
    tl.progress(1).pause(0);
  }

  return () => {
    controls.forEach((btn) => {
      const fn = handlers[btn.dataset.action];
      if (fn) btn.removeEventListener("click", fn);
    });
    tl.kill();
    valueEl.textContent = "0";
  };
}

export { initSectionCounter };
