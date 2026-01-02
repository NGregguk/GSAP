import { gsap, Motion } from "../js/gsapSetup.js";

const navToggle = document.getElementById("navToggle");
const navClose = document.getElementById("navClose");
const panel = document.querySelector(".nav__panel");

if (navToggle && navClose && panel) {
  gsap.set(panel, { pointerEvents: "none", x: "105vw" });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration: Motion.duration.md }
  });

  tl.fromTo(panel, { x: "105vw", autoAlpha: 0 }, { x: 0, autoAlpha: 1, pointerEvents: "auto" });
  tl.eventCallback("onReverseComplete", () => gsap.set(panel, { pointerEvents: "none" }));

  const open = () => {
    tl.play();
    navToggle.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    tl.reverse();
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => (tl.reversed() || tl.progress() === 0 ? open() : close()));
  navClose.addEventListener("click", close);
}
