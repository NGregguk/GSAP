import { mm } from "./js/gsapSetup.js";
import { initSectionChars } from "./js/sections/sectionChars.js";
import { initSectionWords } from "./js/sections/sectionWords.js";
import { initSectionMask } from "./js/sections/sectionMask.js";
import { initSectionScramble } from "./js/sections/sectionScramble.js";
import { initSectionHighlight } from "./js/sections/sectionHighlight.js";
import { initSectionPerspective } from "./js/sections/sectionPerspective.js";
import { initSectionWave } from "./js/sections/sectionWave.js";
import { initSectionCounter } from "./js/sections/sectionCounter.js";
import { initSectionFlip } from "./js/sections/sectionFlip.js";
import { initSectionDuotone } from "./js/sections/sectionDuotone.js";
import { initSectionBounce } from "./js/sections/sectionBounce.js";
import { initSectionShadow } from "./js/sections/sectionShadow.js";
import { initSectionGlowTrail } from "./js/sections/sectionGlowTrail.js";
import { initSectionSkewSlide } from "./js/sections/sectionSkewSlide.js";

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

function initPageTransitions() {
  document.body.classList.add("loaded");
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });
  return () => links.forEach((link) => link.replaceWith(link.cloneNode(true)));
}

function initCopyButtons() {
  const summaries = document.querySelectorAll("details.code-box summary");
  summaries.forEach((summary) => {
    const title = summary.textContent.trim().toLowerCase();
    if (!title.startsWith("view js")) return;
    const parent = summary.parentElement;
    if (!parent.querySelector("pre")) return;
    if (summary.querySelector(".copy-btn")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.textContent = "Copy";
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const target = parent.querySelector("pre");
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
  return () => summaries.forEach((summary) => summary.querySelector(".copy-btn")?.remove());
}
function runSections(isReduced) {
  const cleanups = [];
  cleanups.push(initSectionChars(document.querySelector("#chars"), isReduced));
  cleanups.push(initSectionWords(document.querySelector("#words"), isReduced));
  cleanups.push(initSectionMask(document.querySelector("#mask"), isReduced));
  cleanups.push(initSectionScramble(document.querySelector("#scramble"), isReduced));
  cleanups.push(initSectionHighlight(document.querySelector("#highlight"), isReduced));
  cleanups.push(initSectionPerspective(document.querySelector("#perspective"), isReduced));
  cleanups.push(initSectionWave(document.querySelector("#wave"), isReduced));
  cleanups.push(initSectionCounter(document.querySelector("#counter"), isReduced));
  cleanups.push(initSectionFlip(document.querySelector("#flip"), isReduced));
  cleanups.push(initSectionDuotone(document.querySelector("#duotone"), isReduced));
  cleanups.push(initSectionBounce(document.querySelector("#bounce"), isReduced));
  cleanups.push(initSectionShadow(document.querySelector("#shadow"), isReduced));
  cleanups.push(initSectionGlowTrail(document.querySelector("#glow"), isReduced));
  cleanups.push(initSectionSkewSlide(document.querySelector("#skew"), isReduced));
  cleanups.push(initCopyButtons());
  cleanups.push(initBackToTop());
  cleanups.push(initPageTransitions());
  return () => cleanups.forEach((fn) => fn && fn());
}

function init() {
  // Prefer matchMedia branches so reduced motion can short-circuit animations.
  mm.add("(prefers-reduced-motion: reduce)", () => {
    const cleanup = runSections(true);
    return () => cleanup();
  });

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanup = runSections(false);
    return () => cleanup();
  });

  window.addEventListener("beforeunload", () => {
    mm.revert();
  });
}

document.addEventListener("DOMContentLoaded", init);
