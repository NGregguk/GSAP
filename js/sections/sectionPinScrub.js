import { gsap, Motion, ScrollTrigger } from "../gsapSetup.js";

// Pin + scrub story uses a single ScrollTrigger controlling one timeline.
function initSectionPinScrub(section, isReduced) {
  if (!section) return () => {};
  const headline = section.querySelector("[data-anim='pin']");
  const chapters = gsap.utils.toArray(section.querySelectorAll(".pin__chapter"));

  if (isReduced) {
    gsap.set([headline, chapters], { autoAlpha: 1, clearProps: "all" });
    return () => {};
  }

  gsap.set(headline, { autoAlpha: 0, yPercent: 20 });
  gsap.set(chapters, { autoAlpha: 0.25, yPercent: 20 });

  const tl = gsap.timeline({
    defaults: { ease: Motion.ease.soft },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "+=160%",
      pin: section.querySelector(".pin"),
      scrub: true,
      anticipatePin: 1
    }
  });

  tl.from(chapters, {
    autoAlpha: 0.25,
    yPercent: 20,
    stagger: 0.2,
    duration: Motion.duration.sm
  }).to(
    headline,
    { autoAlpha: 1, yPercent: 0, duration: Motion.duration.md },
    0
  );

  tl.call(() => {
    headline.textContent = "Define the motion surface";
  }, null, 0)
    .call(
      () => {
        headline.textContent = "Design the system states";
      },
      null,
      ">40%"
    )
    .call(
      () => {
        headline.textContent = "Deliver repeatable motion";
      },
      null,
      ">40%"
    );

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set([headline, chapters], { clearProps: "all" });
  };
}

export { initSectionPinScrub };
