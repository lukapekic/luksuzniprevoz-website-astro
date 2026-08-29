(() => {
  const root = document.documentElement;

  function toPx(raw) {
    const value = String(raw || "").trim();
    if (!value) return NaN;
    if (value.endsWith("rem")) {
      const rem = Number.parseFloat(value);
      const rootSize = Number.parseFloat(getComputedStyle(root).fontSize) || 16;
      return rem * rootSize;
    }
    if (value.endsWith("px")) return Number.parseFloat(value);
    return Number.parseFloat(value);
  }

  function token(name) {
    return toPx(getComputedStyle(root).getPropertyValue(name));
  }

  function update() {
    const md = token("--breakpoint-md");
    const lg = token("--breakpoint-lg");
    const xl = token("--breakpoint-xl");
    const wide = token("--breakpoint-2xl");
    const width = window.innerWidth;

    let state = "mobile";
    if (Number.isFinite(md) && width >= md) state = "tablet-portrait";
    if (Number.isFinite(lg) && width >= lg) state = "tablet-landscape";
    if (Number.isFinite(xl) && width >= xl) state = "desktop";
    if (Number.isFinite(wide) && width >= wide) state = "wide";

    root.dataset.wfLayout = state;
  }

  update();
  window.addEventListener("resize", update, { passive: true });
})();
