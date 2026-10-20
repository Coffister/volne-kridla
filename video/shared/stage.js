// Shared timeline helpers for the Voľné krídla micro-demos.
// Coordinates are site CSS px (1440×810 capture viewport); #cam scales them
// onto the 1920×1080 canvas. Layers stack in DOM order, so "show" only fades
// a later layer in over the earlier ones.
(function () {
  const W = 1440;
  const H = 810;
  const S = 1920 / W;

  // camera framing so that (x, y) sits at the canvas center at zoom z,
  // clamped so the capture never reveals its edges
  function frame({ x = W / 2, y = H / 2, z = 1 } = {}) {
    const s = S * z;
    const tx = Math.min(0, Math.max(1920 - W * s, 960 - x * s));
    const ty = Math.min(0, Math.max(1080 - H * s, 540 - y * s));
    return { x: tx, y: ty, scale: s };
  }

  const center = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

  // `opening` is the camera framing of frame 0 (default: the full capture)
  window.Stage = function (opening) {
    const tl = gsap.timeline({ paused: true });
    tl.set("#cam", frame(opening), 0);

    return {
      tl,
      center,
      cam(t, dur, focus, ease = "power2.inOut") {
        tl.to("#cam", { ...frame(focus), duration: dur, ease }, t);
      },
      // fade a layer in over everything before it in the DOM
      show(t, sel, dur = 0.25) {
        tl.fromTo(sel, { opacity: 0 }, { opacity: 1, duration: dur, ease: "power1.inOut", immediateRender: false }, t);
      },
      // fade layers out again, revealing whatever is below (used to loop back)
      hide(t, sel, dur = 0.25) {
        tl.to(sel, { opacity: 0, duration: dur, ease: "power1.inOut" }, t);
      },
      // instant switch (typing, end-of-video still)
      cut(t, sel) {
        tl.set(sel, { opacity: 1 }, t);
      },
      cursorAt(p) {
        tl.set("#cursor", { x: p.x, y: p.y }, 0);
      },
      move(t, dur, p, ease = "power2.inOut") {
        tl.to("#cursor", { x: p.x, y: p.y, duration: dur, ease }, t);
      },
      // soft press: the cursor squishes and springs back
      click(t) {
        tl.to("#cursor .shape", { scale: 0.82, duration: 0.08, ease: "power2.in" }, t);
        tl.to("#cursor .shape", { scale: 1, duration: 0.4, ease: "back.out(3)" }, t + 0.08);
      },
      // swap the site's arrow / hand cursor art (public site only)
      pointer(t, on) {
        tl.set("#cursor .default", { opacity: on ? 0 : 1 }, t);
        tl.set("#cursor .pointer", { opacity: on ? 1 : 0 }, t);
      },
    };
  };
})();
