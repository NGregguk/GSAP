import { gsap, Motion } from "../js/gsapSetup.js";

const stack = document.querySelector(".avatar-stack");
const avatars = gsap.utils.toArray(".avatar");
const names = gsap.utils.toArray(".name-pill");
const label = stack?.querySelector(".avatar-label");

if (stack && avatars.length && names.length && label) {
  gsap.set(names, { autoAlpha: 0, y: 6 });

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });

  tl.to(avatars, {
    x: (i) => (i + 1) * 32,
    autoAlpha: 1,
    stagger: 0.04
  }, 0)
    .to(names, { autoAlpha: 1, y: 0, stagger: 0.04 }, 0.05);

  const toggle = () => {
    const opening = tl.reversed() || tl.progress() === 0;
    stack.setAttribute("aria-expanded", opening ? "true" : "false");
    label.textContent = opening ? "4 online" : "Team";
    opening ? tl.play() : tl.reverse();
  };

  stack.addEventListener("click", toggle);
}
