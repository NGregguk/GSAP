import { gsap } from "../js/gsapSetup.js";

const hero = document.querySelector(".hero");
const circle = hero?.querySelector(".hero__circle");
const content = hero?.querySelector(".hero__content");
const bg = hero?.querySelector(".hero__bg");
const resetBtn = document.getElementById("heroReset");

if (hero && circle && content && bg) {
  const handleMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX ?? rect.width / 2) - rect.left) / rect.width - 0.5;
    const y = ((e.clientY ?? rect.height / 2) - rect.top) / rect.height - 0.5;
    gsap.to(circle, { x: x * 30, y: y * 30, duration: 0.3, ease: "power2.out" });
    gsap.to(content, { x: x * 12, y: y * 10, duration: 0.3, ease: "power2.out" });
    gsap.to(bg, { x: x * 8, y: y * 6, duration: 0.35, ease: "power2.out" });
  };

  const reset = () => {
    gsap.to([circle, content, bg], { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
  };

  hero.addEventListener("pointermove", handleMove);
  hero.addEventListener("pointerleave", reset);
  resetBtn?.addEventListener("click", reset);
}
