import { gsap, ScrollTrigger, Motion, mm } from "./js/gsapSetup.js";

function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return () => {};
  const reveal = () => {
    const show = window.scrollY > 160;
    btn.classList.toggle("is-visible", show);
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  btn.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", reveal);
  reveal();

  return () => {
    btn.removeEventListener("click", scrollToTop);
    window.removeEventListener("scroll", reveal);
  };
}

function initToast() {
  const trigger = document.getElementById("toastTrigger");
  const stack = document.querySelector(".toast-stack");
  if (!trigger || !stack) return () => {};

  const timers = new WeakMap();

  const hideToast = (toast) => {
    if (!toast) return;
    const timer = timers.get(toast);
    if (timer) clearTimeout(timer);
    timers.delete(toast);
    gsap.to(toast, {
      y: -10,
      autoAlpha: 0,
      duration: Motion.duration.sm,
      ease: Motion.ease.out,
      onComplete: () => toast.remove()
    });
  };

  const addToast = () => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = "<span class='toast__title'>Saved</span><span class='toast__desc'>Your changes are live.</span>";
    stack.prepend(toast);

    if (stack.childElementCount > 3) {
      const last = stack.lastElementChild;
      if (last && last !== toast) hideToast(last);
    }

    gsap.fromTo(
      toast,
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: Motion.duration.sm, ease: Motion.ease.out }
    );

    const timer = setTimeout(() => hideToast(toast), 2600);
    timers.set(toast, timer);
    toast.addEventListener("click", () => hideToast(toast));
  };

  trigger.addEventListener("click", addToast);

  return () => {
    trigger.removeEventListener("click", addToast);
    stack.querySelectorAll(".toast").forEach((toast) => hideToast(toast));
  };
}

function initTabs() {
  const tabs = gsap.utils.toArray(".tabs__tab");
  const panels = gsap.utils.toArray(".tabs__panel");
  const underline = document.querySelector(".tabs__underline");
  if (!tabs.length || !panels.length || !underline) return () => {};

  const setUnderline = (tab) => {
    if (!tab) return;
    const { offsetLeft, offsetWidth } = tab;
    gsap.to(underline, {
      x: offsetLeft + 0,
      width: offsetWidth,
      duration: Motion.duration.sm,
      ease: Motion.ease.out
    });
  };

  const activate = (name) => {
    const tab = tabs.find((t) => t.dataset.tab === name);
    const panel = panels.find((p) => p.dataset.panel === name);
    if (!tab || !panel) return;

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("is-active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((p) => {
      const isActive = p === panel;
      p.classList.toggle("is-active", isActive);
      gsap.to(p, {
        autoAlpha: isActive ? 1 : 0,
        y: isActive ? 0 : 6,
        duration: Motion.duration.sm,
        ease: Motion.ease.out,
        overwrite: "auto"
      });
    });

    setUnderline(tab);
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activate(tab.dataset.tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(tab.dataset.tab);
      }
    });
  });

  activate(tabs[0]?.dataset.tab);

  return () => {
    tabs.forEach((tab) => tab.replaceWith(tab.cloneNode(true)));
  };
}

function initSwitch() {
  const switchEl = document.querySelector(".switch");
  if (!switchEl) return () => {};
  const thumb = switchEl.querySelector(".switch__thumb");
  const label = switchEl.querySelector(".switch__label");
  if (!thumb || !label) return () => {};

  const toggle = () => {
    const isOn = switchEl.classList.toggle("is-on");
    switchEl.setAttribute("aria-pressed", isOn ? "true" : "false");
    label.textContent = isOn ? "On" : "Off";
    gsap.to(thumb, {
      x: 0,
      scale: 1.05,
      duration: Motion.duration.sm,
      ease: "back.out(1.6)"
    });
  };

  switchEl.addEventListener("click", toggle);

  return () => {
    switchEl.removeEventListener("click", toggle);
  };
}

function initTooltips() {
  const targets = gsap.utils.toArray(".tooltip-target");
  if (!targets.length) return () => {};

  const cleanups = targets.map((target) => {
    const tip = target.querySelector(".tooltip");
    if (!tip) return () => {};
    const show = () => gsap.to(tip, { autoAlpha: 1, y: -6, duration: Motion.duration.sm, ease: Motion.ease.out });
    const hide = () => gsap.to(tip, { autoAlpha: 0, y: -2, duration: Motion.duration.sm, ease: Motion.ease.out });
    target.addEventListener("pointerenter", show);
    target.addEventListener("pointerleave", hide);
    target.addEventListener("focus", show);
    target.addEventListener("blur", hide);
    return () => {
      target.removeEventListener("pointerenter", show);
      target.removeEventListener("pointerleave", hide);
      target.removeEventListener("focus", show);
      target.removeEventListener("blur", hide);
    };
  });

  return () => cleanups.forEach((fn) => fn && fn());
}

function initFab() {
  const fab = document.querySelector(".fab");
  if (!fab) return () => {};
  const main = fab.querySelector(".fab__main");
  const actions = fab.querySelector(".fab__actions");
  const btns = gsap.utils.toArray(".fab__action");
  if (!main || !actions || !btns.length) return () => {};

  gsap.set(btns, { autoAlpha: 0, x: 0, y: 0, scale: 0.9 });
  gsap.set(actions, { autoAlpha: 0, pointerEvents: "none" });

  let baseAngle = -115;
  let step = -32;
  let radius = 128;

  const updateArc = () => {
    const rect = fab.getBoundingClientRect();
    const leftSpace = rect.left;
    const rightSpace = window.innerWidth - rect.right;
    radius = Math.min(128, Math.max(84, window.innerWidth * 0.18));
    if (leftSpace < 120 && rightSpace > leftSpace) {
      baseAngle = -60;
      step = 30;
      return;
    }
    if (rightSpace < 120 && leftSpace > rightSpace) {
      baseAngle = -120;
      step = -30;
      return;
    }
    baseAngle = -115;
    step = -32;
  };

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });

  tl.to(actions, { autoAlpha: 1, pointerEvents: "auto", duration: 0 })
    .to(btns, {
      autoAlpha: 1,
      scale: 1,
      x: (i) => Math.cos(((baseAngle + step * i) * Math.PI) / 180) * radius,
      y: (i) => Math.sin(((baseAngle + step * i) * Math.PI) / 180) * radius,
      duration: Motion.duration.sm,
      stagger: 0.05
    }, 0);

  tl.eventCallback("onReverseComplete", () => {
    gsap.set(actions, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(btns, { autoAlpha: 0, x: 0, y: 0, scale: 0.9 });
  });

  const toggle = () => {
    const isOpening = tl.reversed() || tl.progress() === 0;
    if (isOpening) updateArc();
    main.setAttribute("aria-expanded", isOpening ? "true" : "false");
    isOpening ? tl.play() : tl.reverse();
  };

  main.addEventListener("click", toggle);
  window.addEventListener("resize", updateArc);

  return () => {
    main.removeEventListener("click", toggle);
    window.removeEventListener("resize", updateArc);
    tl.kill();
    gsap.set(btns, { clearProps: "all" });
    gsap.set(actions, { clearProps: "all" });
  };
}

function initSearch() {
  const wrap = document.querySelector(".search");
  if (!wrap) return () => {};
  const input = wrap.querySelector(".search__input");
  const clear = wrap.querySelector(".search__clear");
  const underline = wrap.querySelector(".search__underline");
  if (!input || !clear || !underline) return () => {};

  const focus = () => {
    gsap.to(underline, { scaleX: 1, autoAlpha: 1, duration: Motion.duration.sm, ease: Motion.ease.out });
  };
  const blur = () => {
    gsap.to(underline, { scaleX: 0.4, autoAlpha: 0.6, duration: Motion.duration.sm, ease: Motion.ease.out });
  };
  const updateClear = () => {
    const show = input.value.trim().length > 0;
    gsap.to(clear, { autoAlpha: show ? 1 : 0, duration: Motion.duration.xs, ease: Motion.ease.out });
    clear.style.pointerEvents = show ? "auto" : "none";
  };
  const handleClear = () => {
    input.value = "";
    updateClear();
    input.focus();
  };

  input.addEventListener("focus", focus);
  input.addEventListener("blur", blur);
  input.addEventListener("input", updateClear);
  clear.addEventListener("click", handleClear);
  updateClear();

  return () => {
    input.removeEventListener("focus", focus);
    input.removeEventListener("blur", blur);
    input.removeEventListener("input", updateClear);
    clear.removeEventListener("click", handleClear);
  };
}

function initBell() {
  const bell = document.querySelector(".bell");
  if (!bell) return () => {};
  const badge = bell.querySelector(".bell__badge");
  const icon = bell.querySelector(".bell__icon");
  if (!badge || !icon) return () => {};

  const ping = () => {
    gsap.fromTo(
      icon,
      { rotate: -10 },
      { rotate: 0, duration: Motion.duration.sm, ease: "elastic.out(1, 0.4)" }
    );
    gsap.fromTo(
      badge,
      { scale: 1 },
      { scale: 1.25, yoyo: true, repeat: 1, duration: Motion.duration.xs, ease: Motion.ease.out }
    );
  };

  bell.addEventListener("click", ping);

  return () => {
    bell.removeEventListener("click", ping);
  };
}

function initStepper() {
  const stepper = document.querySelector(".stepper");
  if (!stepper) return () => {};
  const steps = gsap.utils.toArray(".stepper__step");
  const indicator = stepper.querySelector(".stepper__indicator");
  const label = stepper.querySelector(".stepper__label");
  const prev = stepper.querySelector("[data-stepper='prev']");
  const next = stepper.querySelector("[data-stepper='next']");
  if (!steps.length || !indicator || !label || !prev || !next) return () => {};

  const labels = [
    "Plan the motion flow.",
    "Build the UI states.",
    "Test with real content.",
    "Ship and monitor usage."
  ];
  let index = 0;

  const setStep = (nextIndex) => {
    index = Math.max(0, Math.min(steps.length - 1, nextIndex));
    steps.forEach((step, i) => {
      const isActive = i === index;
      step.classList.toggle("is-active", isActive);
      step.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    const active = steps[index];
    gsap.to(indicator, {
      x: active.offsetLeft,
      width: active.offsetWidth,
      duration: Motion.duration.sm,
      ease: Motion.ease.out
    });
    label.textContent = labels[index] || "";
    gsap.fromTo(label, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: Motion.duration.sm });
  };

  const handleStepClick = (e) => {
    const idx = steps.indexOf(e.currentTarget);
    setStep(idx);
  };

  steps.forEach((step) => step.addEventListener("click", handleStepClick));
  prev.addEventListener("click", () => setStep(index - 1));
  next.addEventListener("click", () => setStep(index + 1));
  window.addEventListener("resize", () => setStep(index));
  setStep(0);

  return () => {
    steps.forEach((step) => step.removeEventListener("click", handleStepClick));
    prev.replaceWith(prev.cloneNode(true));
    next.replaceWith(next.cloneNode(true));
  };
}

function initStats() {
  const card = document.querySelector(".stats-card");
  if (!card) return () => {};
  const btn = card.querySelector("[data-stats='toggle']");
  const items = gsap.utils.toArray(".stats-item");
  if (!btn || !items.length) return () => {};

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });
  tl.fromTo(items, { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06 });

  const toggle = () => (tl.reversed() || tl.progress() === 0 ? tl.play() : tl.reverse());
  btn.addEventListener("click", toggle);

  return () => {
    btn.removeEventListener("click", toggle);
    tl.kill();
    gsap.set(items, { clearProps: "all" });
  };
}

function initChips() {
  const group = document.querySelector(".chip-group");
  if (!group) return () => {};
  const chips = gsap.utils.toArray(".chip");
  const indicator = group.querySelector(".chip-indicator");
  const note = document.querySelector(".chip-note");
  if (!chips.length || !indicator || !note) return () => {};

  const setChip = (chip) => {
    chips.forEach((c) => {
      const isActive = c === chip;
      c.classList.toggle("is-active", isActive);
      c.setAttribute("aria-selected", isActive ? "true" : "false");
    });
    gsap.to(indicator, {
      x: chip.offsetLeft,
      width: chip.offsetWidth,
      duration: Motion.duration.sm,
      ease: Motion.ease.out
    });
    note.textContent = `Showing: ${chip.dataset.chip}`;
  };

  const handleClick = (e) => setChip(e.currentTarget);

  chips.forEach((chip) => chip.addEventListener("click", handleClick));
  window.addEventListener("resize", () => setChip(chips.find((c) => c.classList.contains("is-active")) || chips[0]));
  setChip(chips[0]);

  return () => {
    chips.forEach((chip) => chip.removeEventListener("click", handleClick));
  };
}

function initBanner() {
  const banner = document.querySelector(".banner");
  const showBtn = document.querySelector("[data-banner='show']");
  const closeBtn = document.querySelector("[data-banner='close']");
  if (!banner || !showBtn || !closeBtn) return () => {};

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });

  tl.fromTo(banner, { y: -8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, pointerEvents: "auto" });

  const show = () => tl.play();
  const hide = () => tl.reverse();

  showBtn.addEventListener("click", show);
  closeBtn.addEventListener("click", hide);

  return () => {
    showBtn.removeEventListener("click", show);
    closeBtn.removeEventListener("click", hide);
    tl.kill();
    gsap.set(banner, { clearProps: "all" });
  };
}

function initAvatarStack() {
  const stack = document.querySelector(".avatar-stack");
  if (!stack) return () => {};
  const avatars = gsap.utils.toArray(".avatar");
  if (!avatars.length) return () => {};

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });

  tl.to(avatars, {
    x: (i) => (i + 1) * 70,
    autoAlpha: 1,
    stagger: 0.05
  }, 0);

  const toggle = () => {
    const isOpening = tl.reversed() || tl.progress() === 0;
    stack.setAttribute("aria-expanded", isOpening ? "true" : "false");
    isOpening ? tl.play() : tl.reverse();
  };

  stack.addEventListener("click", toggle);

  return () => {
    stack.removeEventListener("click", toggle);
    tl.kill();
    gsap.set(avatars, { clearProps: "all" });
  };
}

function initPalette() {
  const palette = document.querySelector(".palette");
  if (!palette) return () => {};
  const panel = palette.querySelector(".palette__panel");
  const items = gsap.utils.toArray(".palette__list li");
  const openBtn = document.querySelector("[data-palette='open']");
  const closeBtn = document.querySelector("[data-palette='close']");
  if (!panel || !openBtn || !closeBtn) return () => {};

  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: Motion.duration.sm, ease: Motion.ease.out }
  });

  tl.fromTo(panel, { y: -20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, pointerEvents: "auto" })
    .fromTo(items, { y: 6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05 }, 0.05);

  const open = () => {
    palette.setAttribute("aria-hidden", "false");
    tl.play();
  };
  const close = () => {
    palette.setAttribute("aria-hidden", "true");
    tl.reverse();
  };

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);

  return () => {
    openBtn.removeEventListener("click", open);
    closeBtn.removeEventListener("click", close);
    tl.kill();
    gsap.set(panel, { clearProps: "all" });
    gsap.set(items, { clearProps: "all" });
  };
}

// Hero parallax
function initHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return () => {};
  const circle = hero.querySelector(".hero__circle");
  const content = hero.querySelector(".hero__content");
  const bg = hero.querySelector(".hero__bg");
  const resetBtn = document.getElementById("heroReset");
  const targets = [circle, content, bg];
  if (targets.some((t) => !t)) return () => {};

  const bounds = { x: 0, y: 0 };
  const handleMove = (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX || (e.touches?.[0]?.clientX ?? rect.width / 2)) - rect.left) / rect.width - 0.5;
    const y = ((e.clientY || (e.touches?.[0]?.clientY ?? rect.height / 2)) - rect.top) / rect.height - 0.5;
    bounds.x = x;
    bounds.y = y;
    gsap.to(circle, { x: x * 30, y: y * 30, duration: 0.3, ease: "power2.out" });
    gsap.to(content, { x: x * 12, y: y * 10, duration: 0.3, ease: "power2.out" });
    gsap.to(bg, { x: x * 8, y: y * 6, duration: 0.35, ease: "power2.out" });
  };

  const reset = () => {
    gsap.to([circle, content, bg], { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
  };

  hero.addEventListener("pointermove", handleMove);
  hero.addEventListener("pointerleave", reset);
  hero.addEventListener("touchmove", handleMove);
  resetBtn?.addEventListener("click", reset);

  return () => {
    hero.removeEventListener("pointermove", handleMove);
    hero.removeEventListener("pointerleave", reset);
    hero.removeEventListener("touchmove", handleMove);
    resetBtn?.removeEventListener("click", reset);
    reset();
  };
}

// Nav drawer
function initNav() {
  const navToggle = document.getElementById("navToggle");
  const navClose = document.getElementById("navClose");
  const panel = document.querySelector(".nav__panel");
  if (!navToggle || !navClose || !panel) return () => {};

  gsap.set(panel, { pointerEvents: "none", x: "105vw" });

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration: Motion.duration.md }
  });

  tl.fromTo(panel, { x: "105vw", autoAlpha: 0 }, { x: 0, autoAlpha: 1, pointerEvents: "auto" });
  tl.eventCallback("onReverseComplete", () => {
    gsap.set(panel, { pointerEvents: "none" });
  });

  const open = () => {
    tl.play();
    navToggle.setAttribute("aria-expanded", "true");
    panel.style.pointerEvents = "auto";
  };
  const close = () => {
    tl.reverse();
    navToggle.setAttribute("aria-expanded", "false");
  };

  const toggleHandler = () => (tl.reversed() || tl.progress() === 0 ? open() : close());

  navToggle.addEventListener("click", toggleHandler);
  navClose.addEventListener("click", close);

  return () => {
    navToggle.removeEventListener("click", toggleHandler);
    navClose.removeEventListener("click", close);
    tl.kill();
    gsap.set(panel, { clearProps: "all" });
  };
}

// Card hover
function initCards() {
  const cards = gsap.utils.toArray(".card");
  if (!cards.length) return () => {};

  const timelines = cards.map((card) => {
    const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out, duration: Motion.duration.sm } });
    tl.to(card, { y: -6, rotateX: 2, rotateY: -2, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" })
      .to(card, { "--overlay": 1, duration: Motion.duration.sm }, 0);
    return { card, tl };
  });

  cards.forEach((card, i) => {
    const tl = timelines[i].tl;
    const enter = () => tl.play();
    const leave = () => tl.reverse();
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focus", enter);
    card.addEventListener("blur", leave);
  });

  return () => {
    timelines.forEach(({ card, tl }) => {
      card.replaceWith(card.cloneNode(true)); // quick cleanup of listeners
      tl.kill();
    });
  };
}

// Accordion
function initAccordion() {
  const items = gsap.utils.toArray("[data-acc]");
  if (!items.length) return () => {};
  const timelines = new Map();

  items.forEach((item) => {
    const content = item.querySelector(".accordion__content");
    const chevron = item.querySelector(".accordion__chevron");
    const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out, duration: Motion.duration.sm } });
    tl.fromTo(content, { autoAlpha: 0, maxHeight: 0, y: -6 }, { autoAlpha: 1, maxHeight: 200, y: 0 })
      .fromTo(chevron, { rotate: 0 }, { rotate: 90 }, 0);
    timelines.set(item, tl);

    item.addEventListener("click", () => {
      const isOpen = tl.progress() > 0 && !tl.reversed();
      timelines.forEach((otherTl, otherItem) => {
        if (otherItem !== item) otherTl.reverse();
      });
      isOpen ? tl.reverse() : tl.play();
    });
  });

  return () => {
    timelines.forEach((tl, item) => {
      item.replaceWith(item.cloneNode(true));
      tl.kill();
    });
  };
}

// Modal
function initModal() {
  const modal = document.querySelector(".modal");
  const overlay = modal?.querySelector(".modal__overlay");
  const panel = modal?.querySelector(".modal__panel");
  const openBtn = document.getElementById("modalOpen");
  const closeBtn = document.getElementById("modalClose");
  if (!modal || !overlay || !panel || !openBtn || !closeBtn) return () => {};

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: Motion.ease.out, duration: Motion.duration.md }
  });

  tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, pointerEvents: "auto" })
    .fromTo(panel, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, pointerEvents: "auto" }, 0);

  const open = () => tl.play();
  const close = () => tl.reverse();

  openBtn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  return () => {
    openBtn.removeEventListener("click", open);
    closeBtn.removeEventListener("click", close);
    overlay.removeEventListener("click", close);
    tl.kill();
    gsap.set([overlay, panel], { clearProps: "all" });
  };
}

// Microinteraction button
function initMicro() {
  const btn = document.getElementById("microBtn");
  const ripple = btn?.querySelector(".button__ripple");
  if (!btn || !ripple) return () => {};

  const tl = gsap.timeline({ paused: true, defaults: { ease: Motion.ease.out } });
  tl.to(btn, { y: 1, scale: 0.97, duration: Motion.duration.xs })
    .to(ripple, { autoAlpha: 0.4, scale: 1.2, duration: Motion.duration.sm }, 0)
    .to(btn, { y: 0, scale: 1, duration: Motion.duration.xs })
    .to(ripple, { autoAlpha: 0, scale: 1.6, duration: Motion.duration.sm * 1.2 }, "<");

  const down = () => tl.restart();
  btn.addEventListener("pointerdown", down);

  return () => {
    btn.removeEventListener("pointerdown", down);
    tl.kill();
    gsap.set([btn, ripple], { clearProps: "all" });
  };
}

// Loader
function initLoader() {
  const bar = document.querySelector(".loader__bar");
  const label = document.querySelector(".loader__label");
  const playBtn = document.querySelector("[data-loader='play']");
  const completeBtn = document.querySelector("[data-loader='complete']");
  const resetBtn = document.querySelector("[data-loader='reset']");
  if (!bar || !label || !playBtn || !completeBtn || !resetBtn) return () => {};

  const loopTl = gsap.timeline({ repeat: -1, paused: true, defaults: { ease: "none" } });
  loopTl.fromTo(
    bar,
    { xPercent: -100, width: "35%" },
    { xPercent: 430, duration: 1.8 }
  );

  const complete = () => {
    loopTl.pause(0);
    gsap.to(bar, { xPercent: 0, width: "100%", duration: Motion.duration.md, ease: Motion.ease.out });
    label.textContent = "Complete";
  };
  const play = () => {
    label.textContent = "Loading";
    gsap.set(bar, { width: "35%", xPercent: -100 });
    loopTl.restart();
  };
  const reset = () => {
    loopTl.pause(0);
    gsap.set(bar, { xPercent: -100, width: "35%" });
    label.textContent = "Loading";
  };

  playBtn.addEventListener("click", play);
  completeBtn.addEventListener("click", complete);
  resetBtn.addEventListener("click", reset);

  return () => {
    playBtn.removeEventListener("click", play);
    completeBtn.removeEventListener("click", complete);
    resetBtn.removeEventListener("click", reset);
    loopTl.kill();
    gsap.set(bar, { clearProps: "all" });
  };
}

function initReducedMotionFallback(cleanups) {
  return mm.add("(prefers-reduced-motion: reduce)", () => {
    // disable parallax, hover lifts, looping loader
    cleanups.forEach((fn) => fn && fn());
    ScrollTrigger.getAll().forEach((st) => st.disable());
    return () => ScrollTrigger.getAll().forEach((st) => st.enable());
  });
}

function initCopyButtons() {
  const codeSummaries = document.querySelectorAll("details.code-box summary");
  codeSummaries.forEach((summary) => {
    const parentDetails = summary.parentElement;
    const title = summary.textContent.trim().toLowerCase();
    if (!title.startsWith("view js")) return; // only add to code sections
    if (!parentDetails.querySelector("pre")) return; // only when a code block exists
    if (summary.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const target = parentDetails.querySelector("pre");
      if (!target) return;
      const text = target.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = original), 1200);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        const original = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = original), 1200);
      }
    });
    summary.appendChild(btn);
  });

  return () => codeSummaries.forEach((summary) => summary.querySelector(".copy-btn")?.remove());
}

function init() {
  const cleanups = [];
  cleanups.push(initHero());
  cleanups.push(initNav());
  cleanups.push(initCards());
  cleanups.push(initAccordion());
  cleanups.push(initModal());
  cleanups.push(initMicro());
  cleanups.push(initLoader());
  cleanups.push(initToast());
  cleanups.push(initTabs());
  cleanups.push(initSwitch());
  cleanups.push(initTooltips());
  cleanups.push(initFab());
  cleanups.push(initSearch());
  cleanups.push(initBell());
  cleanups.push(initStepper());
  cleanups.push(initStats());
  cleanups.push(initChips());
  cleanups.push(initBanner());
  cleanups.push(initAvatarStack());
  cleanups.push(initPalette());
  cleanups.push(initCopyButtons());
  cleanups.push(initBackToTop());
  const rm = initReducedMotionFallback(cleanups);

  window.addEventListener("beforeunload", () => {
    cleanups.forEach((fn) => fn && fn());
    rm && rm.revert && rm.revert();
    mm.revert();
  });
}

document.addEventListener("DOMContentLoaded", init);
