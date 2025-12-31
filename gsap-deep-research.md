# GSAP (GreenSock) Production Animation Handbook

## GSAP Core: Current Best Practices

**GSAP Architecture Overview:** GSAP’s core is built around **tweens** (single animations of properties over time) and **timelines** (containers that sequence tweens). Under the hood, GSAP uses a **global ticker** tied to `requestAnimationFrame` that advances an internal **playhead** each frame. Every tween and timeline has its own playhead/time that is synchronized with its parent timeline (ultimately the global timeline). This ensures nested timelines play in unison unless deliberately paused. GSAP’s engine optimizes performance by batching DOM reads/writes and leveraging CSS transforms for smooth updates.

**Including GSAP – Latest Version:** Use GSAP 3.x (e.g. v3.14) for modern features and best performance. For **vanilla JS** on a web page, you can load GSAP via a script tag using either UMD or ES modules:

- **UMD CDN (Global variable):**  
  ```html
  <!-- Load GSAP UMD bundle (gsap global) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.14.1/gsap.min.js"></script>
  ```
  This exposes a global `gsap` object once loaded.

- **ES Module CDN:** Use a module script so you can import GSAP. For example, via Skypack or JSDelivr CDN:  
  ```html
  <script type="module">
    import { gsap } from "https://cdn.skypack.dev/gsap@3.14.1";
    gsap.to(".box", { x: 100, duration: 1 });
  </script>
  ```  
  This ensures GSAP is loaded as an ES module and can be used inside the module script.

- **NPM (Modern Bundlers):** Install via `npm install gsap`. Then import in your JS/TS:  
  ```js
  import gsap from "gsap";
  import ScrollTrigger from "gsap/ScrollTrigger"; // example plugin
  gsap.registerPlugin(ScrollTrigger);
  ```  
  Modern bundlers (Webpack, Vite, esbuild) will tree-shake unused parts, so always register any plugins you use to avoid them being dropped.

**Best-Practice Imports:** For clean architecture, you can create a dedicated `animations.js` module to import and register GSAP and plugins, then export gsap for use in components. For example:  
```js
// animations.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```  
Then in other files: `import { gsap } from "./animations.js";`. This avoids registering plugins multiple times and keeps animation config in one place.

**gsap.to vs gsap.from vs gsap.fromTo:** Use these static methods to create tweens:
- `gsap.to(target, {vars})`: Animates from the element’s current state **to** the specified end state.
- `gsap.from(target, {vars})`: Animates **from** the given start values to the element’s current state.
- `gsap.fromTo(target, {fromVars}, {toVars})`: Explicitly defines both start and end values.

**When to use each:** Use `gsap.to()` for the majority of cases. Use `gsap.from()` for entrance animations on load or scroll (elements animate *into* place). Use `gsap.fromTo()` when reusing the same tween for multiple runs or when toggling (to ensure consistent start/end each time).

**Timelines vs Single Tweens:** A single tween is fine for one-off animations. A **timeline** is best for sequencing multiple tweens or creating more complex orchestrations. Timelines allow precise timing control (overlapping, delays, labels) and let you control the group as one unit (pause, reverse, etc.).

**Example – single tween vs timeline:** 
```js
// Single tween (simple use-case)
gsap.to(".indicator", { x: 100, duration: 0.5, ease: "power1.out" });

// Timeline (complex sequence)
const menuTl = gsap.timeline({ paused: true });
menuTl.from(".menuPanel", { yPercent: -100, duration: 0.5, ease: "power2.out" })
      .from(".menuItem", { opacity: 0, stagger: 0.1, duration: 0.3 }, "<0.1");
```

---

## Timeline Architecture & Reusability (High Priority)

Treat timelines as reusable **animation state machines** – they manage complex transitions and can be controlled like an object.

### Timeline as a State Machine

A timeline can represent a component’s visual states. Structure sequences to be **reversible** so `.reverse()` cleanly undoes the motion. Prefer `autoAlpha` over `display:none` for reversibility.

**Common pitfall:** `from()` tweens inside timelines can apply start values immediately. When needed, use `immediateRender:false` or prefer `fromTo()` for explicitness.

### Reusable Timeline Factories

Create timelines via factory functions for consistency and reuse:

```js
function createHoverTimeline(element) {
  const tl = gsap.timeline({ paused: true });
  tl.to(element, { scale: 1.1, duration: 0.2 })
    .to(element, { scale: 1, duration: 0.2 });
  return tl;
}

const btnAnim = createHoverTimeline(buttonElement);
buttonElement.addEventListener('mouseenter', () => btnAnim.play(0));
buttonElement.addEventListener('mouseleave', () => btnAnim.reverse());
```

### Nested Timelines & Composition

Compose complex sequences using small timelines:

- You can nest timelines with `.add()`.
- A given timeline instance can only be in one parent and only once. For reuse, create new instances or drive the playhead using `tweenFromTo()`.

### External UI / App State Control

Keep timeline references and drive them via UI or state changes:

- `tl.play()`, `tl.pause()`, `tl.reverse()`
- `tl.progress(v)` or `tl.time(t)` for scrubbing with external controls
- Use labels to expose semantic states (`open`, `closed`, `mid`)

ASCII sketch:

```
[closed] --(play)--> [opening] --> [open]
   ^                     |
   |------(reverse)------|
```

---

## ScrollTrigger: Production-Grade Usage

### Modern Setup

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

### Pinning vs Scrubbing

- **Pinning**: locks an element in place for a scroll range. Great for “chapters” / slides.
- **Scrubbing**: ties animation progress to scroll. Great for parallax and scroll-controlled timelines.

Example pin:

```js
ScrollTrigger.create({
  trigger: "#section1",
  pin: true,
  start: "top top",
  end: "+=1000"
});
```

Example scrub:

```js
gsap.to(".graphic", {
  xPercent: 100,
  scrollTrigger: {
    trigger: ".graphic",
    start: "top center",
    end: "bottom top",
    scrub: 1
  }
});
```

### Scroll-driven storytelling patterns

Pattern: split narrative into sections, each with its own trigger/timeline. Avoid monolithic mega-timelines unless strictly necessary.

### Performance implications

- `scrub`: updates continuously while scrolling → keep transforms simple.
- `pin`: can trigger layout work → pin sparingly, keep pinned DOM small.
- huge timelines: harder to debug and refresh → split into sections.

### Structuring logic cleanly

Centralise trigger creation:

```js
function initScroll() {
  // section triggers
}
window.addEventListener("load", () => {
  initScroll();
  ScrollTrigger.refresh();
});
```

### Debug patterns

- `markers: true`
- isolate animation first, then add ScrollTrigger

### Cleanup patterns

- Keep references and `.kill()` on teardown
- In SPAs/frameworks, use `gsap.context()` and `ctx.revert()`

### Responsive handling (matchMedia)

```js
const mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // desktop triggers
  return () => ScrollTrigger.getAll().forEach(st => st.kill());
});

mm.add("(max-width: 799px)", () => {
  // mobile triggers (simpler)
});
```

---

## Performance Engineering with GSAP

### Do / Don’t table

| Do (fast) | Don’t (slow) |
|---|---|
| Animate transforms (`x`, `y`, `scale`, `rotation`) | Animate layout (`top`, `left`, `width`, `height`) every frame |
| Animate opacity / `autoAlpha` | Toggle `display` during animation |
| Keep pinned/scrubbed work lightweight | Run heavy logic in `onUpdate` |
| Kill/revert on teardown | Leave ScrollTriggers/tweens alive in SPAs |

### Avoiding layout thrashing

- Measure once, animate many.
- Avoid repeated DOM reads in `onUpdate`.
- Prefer transforms over layout properties.

### GPU acceleration realities

- Transforms often composite on GPU; not everything does.
- Too many GPU layers can hurt performance; don’t sprinkle `force3D` everywhere.

### Memory management

- `gsap.killTweensOf(target)`
- `tl.kill()` / `tl.clear()`
- Remove event listeners you add
- Kill ScrollTrigger instances on teardown

### Chrome DevTools profiling workflow

- Performance panel: record, inspect long tasks and layouts
- Rendering panel: paint flashing to spot repaints
- Throttle CPU to simulate mobile

---

## GSAP in Component-Based Apps (React / Vue / Web Apps)

### Core patterns

- Treat GSAP as a side-effect: run after DOM is committed.
- Use refs instead of global selectors when possible.
- Keep animation logic separate from UI rendering logic.

### GSAP context pattern (framework-agnostic)

```js
const ctx = gsap.context(() => {
  gsap.from(".box", { y: 20, autoAlpha: 0, duration: 0.4 });
  ScrollTrigger.create({ trigger: ".box", start: "top 80%", onEnter: () => console.log("enter") });
}, scopeElement);

// later teardown:
ctx.revert();
```

### Avoiding re-render conflicts

- Don’t let the framework also write the same inline styles GSAP controls.
- For enter/exit animations, avoid unmounting before exit animation completes (delay removal).

---

## SVG Animation with GSAP

- **Stroke “draw”**: use DrawSVGPlugin or dasharray/dashoffset.
- **Transforms**: move/rotate/scale SVG groups when possible.
- **Morphing**: MorphSVGPlugin; keep shapes simple and morph durations short.
- Inline SVG performance: many nodes + filters can be slow → test on mobile.

---

## Motion Design System Concepts

### Motion tokens

```js
export const Motion = {
  duration: { fast: 0.18, medium: 0.32, slow: 0.6 },
  ease: { standard: "power2.out", pop: "back.out(1.7)" },
  distance: { lift: 6 }
};
```

### Consistency across microinteractions

- standardise hover, focus, open/close patterns
- use factories to enforce consistent motion

### Accessibility

- `prefers-reduced-motion`: disable or simplify non-essential motion
- avoid long, distracting motion by default

### “Premium” motion

- subtle overlap, micro-staggers
- ease-out dominant
- polish via smoothness (avoid jank > fancy effects)

---

## Procedural & Data-Driven Animation

### Staggers as systems

```js
gsap.from(".item", {
  y: 12,
  autoAlpha: 0,
  stagger: { each: 0.06, from: "start" }
});
```

### Controlled randomness

```js
gsap.to(".dot", {
  x: () => gsap.utils.random(-40, 40),
  y: () => gsap.utils.random(-20, 20),
  duration: 1.4
});
```

### Function-based dynamic values

```js
gsap.to(".bar", {
  height: (i, el) => Number(el.dataset.value) * 2,
  duration: 0.8
});
```

### Timelines driven from JSON / CMS

Create a schema (selector, type, props, position) and translate into timeline steps in code. Validate inputs and selectors to avoid runtime failures.

---

## GSAP vs Native Web Animations API (WAAPI)

| Topic | GSAP | WAAPI |
|---|---|---|
| Sequencing | Timelines, labels, nesting | Manual orchestration |
| Easing | Rich eases + custom | Basic timing functions |
| Scroll | ScrollTrigger | ScrollTimeline (limited support) / manual |
| Cross-browser quirks | Handles many | Depends on engine |
| Bundle size | Adds dependency | Native (0kb) |

**Use GSAP when:** you need complex timelines, scroll storytelling, rich easing, plugins, robust ergonomics.  
**Use WAAPI when:** minimal/simple animations, tight bundle constraints, modern-only, no advanced needs.  
**Mixing safely:** don’t animate the same element/property concurrently; cancel one before handing over to the other.

---

## Best-Practice Checklist

- [ ] Use GSAP 3.x only (avoid v2 patterns)
- [ ] Register plugins exactly once
- [ ] Prefer transforms + opacity (`autoAlpha`)
- [ ] Use timelines for any multi-step animation
- [ ] Design reversibility (use `reverse()` deliberately)
- [ ] Use matchMedia for responsive + reduced motion
- [ ] Avoid ScrollTrigger on every tiny element
- [ ] Keep scrub/pin lightweight, especially on mobile
- [ ] Clean up (kill/revert) in SPAs/components
- [ ] Profile on throttled CPU (mobile reality)

---

## Recommended Default Project Setup

- Install: `npm i gsap`
- Create `src/animations/gsap.ts` (or `.js`) that imports gsap + registers plugins once.
- Define motion tokens (durations/eases/distances) centrally.
- Use `gsap.matchMedia()` for:
  - mobile vs desktop differences
  - `prefers-reduced-motion`
- In apps/components: wrap animation creation in `gsap.context()` and `ctx.revert()` on teardown.
- For scroll pages: initialise ScrollTriggers after load and call `ScrollTrigger.refresh()` after images/data load.
