import { gsap, Motion } from "../js/gsapSetup.js";

const cards = gsap.utils.toArray(".card");

cards.forEach((card) => {
  const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out, duration: Motion.duration.sm } });
  tl.to(card, { y: -6, rotateX: 2, rotateY: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" })
    .to(card, { "--overlay": 1 }, 0);

  const enter = () => tl.play();
  const leave = () => tl.reverse();

  card.addEventListener("pointerenter", enter);
  card.addEventListener("pointerleave", leave);
  card.addEventListener("focus", enter);
  card.addEventListener("blur", leave);
});
