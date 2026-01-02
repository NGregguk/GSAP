import { gsap, Motion } from "../js/gsapSetup.js";

const openBtn = document.querySelector("[data-open='modal']");
const closeBtns = document.querySelectorAll("[data-close='modal']");
const overlay = document.querySelector(".modal__overlay");
const panel = document.querySelector(".modal__panel");

if (openBtn && overlay && panel && closeBtns.length) {
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration: Motion.duration.md }
  });

  tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, pointerEvents: "auto" })
    .fromTo(panel, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, pointerEvents: "auto" }, 0);

  const open = () => tl.play();
  const close = () => tl.reverse();

  openBtn.addEventListener("click", open);
  overlay.addEventListener("click", close);
  closeBtns.forEach((btn) => btn.addEventListener("click", close));
}
