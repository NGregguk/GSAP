import { gsap, ScrollTrigger, Motion, mm } from "./js/gsapSetup.js";
import { splitByWords } from "./js/utils/text.js";

window.__sectionCompositionsInit = true;

function buildTimeline(section, build, isReduced) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out, duration: Motion.duration.md } });
  build(tl);
  if (isReduced) {
    tl.progress(1).pause(0);
    return () => tl.kill();
  }
  const trigger = ScrollTrigger.create({
    trigger: section,
    start: "top 70%",
    animation: tl,
    toggleActions: "play none none reverse"
  });
  return () => {
    trigger.kill();
    tl.kill();
  };
}

function initTeam(section, isReduced) {
  const title = section.querySelector("[data-anim='team-title']");
  const list = section.querySelector("[data-anim='team-list']");
  const spotlight = section.querySelector("[data-anim='team-spotlight']");
  if (!title || !list || !spotlight) return () => {};

  const words = splitByWords(title);
  return buildTimeline(section, (tl) => {
    tl.from(words, { yPercent: 80, autoAlpha: 0, stagger: 0.06 })
      .from(list, { y: 12, autoAlpha: 0 }, "-=0.1")
      .from(spotlight, { y: 12, autoAlpha: 0 }, "-=0.1");
  }, isReduced);
}

function initTeamInteraction(section) {
  const cards = gsap.utils.toArray(".team-card", section);
  const spotlight = section.querySelector(".team-spotlight");
  const nameEl = spotlight?.querySelector(".team-spotlight__name");
  const roleEl = spotlight?.querySelector(".team-spotlight__role");
  const bioEl = spotlight?.querySelector(".team-spotlight__bio");
  if (!cards.length || !spotlight || !nameEl || !roleEl || !bioEl) return () => {};

  const switchTo = (card) => {
    cards.forEach((btn) => btn.classList.toggle("is-active", btn === card));
    const tl = gsap.timeline({ defaults: { duration: Motion.duration.sm, ease: Motion.ease.out } });
    tl.to(spotlight, { autoAlpha: 0, y: 8 })
      .add(() => {
        nameEl.textContent = card.dataset.name || "";
        roleEl.textContent = card.dataset.role || "";
        bioEl.textContent = card.dataset.bio || "";
      })
      .to(spotlight, { autoAlpha: 1, y: 0 });
  };

  const handlers = cards.map((card) => {
    const fn = () => switchTo(card);
    card.addEventListener("click", fn);
    return { card, fn };
  });

  return () => handlers.forEach(({ card, fn }) => card.removeEventListener("click", fn));
}

function initServices(section, isReduced) {
  const title = section.querySelector("[data-anim='services-title']");
  const rail = section.querySelector("[data-anim='services-rail']");
  const cards = rail ? gsap.utils.toArray(".service-card", rail) : [];
  if (!title || !rail || !cards.length) return () => {};

  return buildTimeline(section, (tl) => {
    tl.from(title, { yPercent: 100, autoAlpha: 0 })
      .from(cards, { y: 12, autoAlpha: 0, stagger: 0.08 }, "-=0.1");
  }, isReduced);
}

function initServicesInteraction(section) {
  const rail = section.querySelector(".services-rail");
  const prev = section.querySelector("[data-services='prev']");
  const next = section.querySelector("[data-services='next']");
  const cards = rail ? gsap.utils.toArray(".service-card", rail) : [];
  if (!rail || !prev || !next || !cards.length) return () => {};

  let index = 0;

  const update = () => {
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(rail).columnGap || "14");
    const width = card.getBoundingClientRect().width + gap;
    gsap.to(rail, { x: -(width * index), duration: Motion.duration.sm, ease: Motion.ease.out });
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  };

  const onPrev = () => {
    index = Math.max(0, index - 1);
    update();
  };

  const onNext = () => {
    index = Math.min(cards.length - 1, index + 1);
    update();
  };

  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);
  window.addEventListener("resize", update);
  update();

  return () => {
    prev.removeEventListener("click", onPrev);
    next.removeEventListener("click", onNext);
    window.removeEventListener("resize", update);
  };
}

function initContact(section, isReduced) {
  const title = section.querySelector("[data-anim='contact-title']");
  const form = section.querySelector("[data-anim='contact-form']");
  if (!title || !form) return () => {};

  const words = splitByWords(title);
  return buildTimeline(section, (tl) => {
    tl.from(words, { yPercent: 80, autoAlpha: 0, stagger: 0.05 })
      .from(form, { y: 12, autoAlpha: 0 }, "-=0.1");
  }, isReduced);
}

function initContactInteraction(section) {
  const form = section.querySelector(".contact-form");
  const status = section.querySelector(".contact-status");
  const button = form?.querySelector("button[type='submit']");
  if (!form || !status || !button) return () => {};

  const tl = gsap.timeline({ paused: true, defaults: { duration: Motion.duration.sm, ease: Motion.ease.out } });
  tl.to(button, { scale: 0.98, duration: Motion.duration.xs })
    .to(status, { autoAlpha: 1 }, "-=0.1");

  const submit = (e) => {
    e.preventDefault();
    tl.restart();
    setTimeout(() => tl.reverse(), 2000);
  };

  form.addEventListener("submit", submit);

  return () => form.removeEventListener("submit", submit);
}

function init() {
  const team = document.querySelector("[data-comp='team']");
  const services = document.querySelector("[data-comp='services']");
  const contact = document.querySelector("[data-comp='contact']");

  const cleanupInteractions = [];
  if (team) cleanupInteractions.push(initTeamInteraction(team));
  if (services) cleanupInteractions.push(initServicesInteraction(services));
  if (contact) cleanupInteractions.push(initContactInteraction(contact));

  mm.add("(prefers-reduced-motion: reduce)", () => {
    const cleanups = [];
    if (team) cleanups.push(initTeam(team, true));
    if (services) cleanups.push(initServices(services, true));
    if (contact) cleanups.push(initContact(contact, true));
    return () => cleanups.forEach((fn) => fn && fn());
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanups = [];
    if (team) cleanups.push(initTeam(team, false));
    if (services) cleanups.push(initServices(services, false));
    if (contact) cleanups.push(initContact(contact, false));
    return () => cleanups.forEach((fn) => fn && fn());
  });

  window.addEventListener("beforeunload", () => {
    cleanupInteractions.forEach((fn) => fn && fn());
    mm.revert();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  });
}

document.addEventListener("DOMContentLoaded", init);
