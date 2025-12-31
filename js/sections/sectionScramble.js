import { gsap, Motion } from "../gsapSetup.js";

// Lightweight scramble using timeline-driven progress; no external plugins.
function initSectionScramble(section, isReduced) {
  const textEl = section.querySelector("[data-anim='scramble']");
  const controls = section.querySelectorAll(".controls button");
  if (!textEl) return () => {};

  const originalText = textEl.textContent || "";
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const finalChars = originalText.split("");
  const state = { progress: 0 };
  const duration = isReduced ? 0.01 : Motion.duration.lg;

  const render = () => {
    const total = finalChars.length;
    const revealCount = Math.floor(state.progress * total);
    const chars = finalChars.map((char, idx) => {
      if (char === " ") return " ";
      if (idx < revealCount) return char;
      const randomIndex = Math.floor(Math.random() * charset.length);
      return charset[randomIndex];
    });
    textEl.textContent = chars.join("");
  };

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration, ease: "none" },
    onReverseComplete: () => {
      textEl.textContent = originalText;
    }
  });

  tl.fromTo(
    state,
    { progress: 0 },
    {
      progress: 1,
      onUpdate: render,
      onComplete: () => {
        textEl.textContent = originalText;
      }
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

  if (isReduced) {
    textEl.textContent = originalText;
    tl.progress(1).pause(0);
  }

  return () => {
    controls.forEach((btn) => {
      const fn = handlers[btn.dataset.action];
      if (fn) btn.removeEventListener("click", fn);
    });
    tl.kill();
    textEl.textContent = originalText;
  };
}

export { initSectionScramble };
