import { gsap } from "https://cdn.skypack.dev/gsap@3.12.5";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap@3.12.5/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Shared motion tokens to keep durations/eases consistent across sections.
const Motion = {
  duration: { xs: 0.16, sm: 0.28, md: 0.45, lg: 0.9 },
  ease: { out: "power2.out", soft: "power1.out", back: "back.out(1.4)" },
  distance: { short: 8, mid: 18, far: 32 }
};

const mm = gsap.matchMedia();

export { gsap, ScrollTrigger, Motion, mm };
