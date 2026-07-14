/* Groupy site — accessibility widget (text size, contrast, motion). No dependencies. */
(function () {
  "use strict";

  var STR = {
    he: {
      label: "אפשרויות נגישות", bigger: "הגדלת טקסט (A+)", smaller: "הקטנת טקסט (A-)",
      contrast: "ניגודיות גבוהה", motion: "עצירת אנימציות", reset: "איפוס", statement: "הצהרת נגישות"
    },
    en: {
      label: "Accessibility options", bigger: "Increase text (A+)", smaller: "Decrease text (A-)",
      contrast: "High contrast", motion: "Stop animations", reset: "Reset", statement: "Accessibility statement"
    }
  };

  var lang = (document.documentElement.lang || "en").toLowerCase().indexOf("he") === 0 ? "he" : "en";
  var t = STR[lang];
  var statementHref = lang === "he" ? "/accessibility.html" : "/en/accessibility.html";

  var STORE_KEY = "groupy-a11y";
  var MIN_SCALE = 0.85, MAX_SCALE = 1.4, STEP = 0.1;

  function loadState() {
    var s = { scale: 1, contrast: false, noMotion: false };
    try {
      var p = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (p) {
        var n = parseFloat(p.scale);
        if (isFinite(n)) s.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, n));
        s.contrast = !!p.contrast;
        s.noMotion = !!p.noMotion;
      }
    } catch (e) {}
    return s;
  }
  function saveState(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  var state = loadState();

  function apply() {
    document.documentElement.style.setProperty("--a11y-scale", state.scale);
    document.documentElement.classList.toggle("a11y-contrast", !!state.contrast);
    document.documentElement.classList.toggle("a11y-no-motion", !!state.noMotion);
    saveState(state);
    if (btnContrast) btnContrast.setAttribute("aria-pressed", String(!!state.contrast));
    if (btnMotion) btnMotion.setAttribute("aria-pressed", String(!!state.noMotion));
  }

  var widget = document.createElement("div");
  widget.className = "a11y-widget";
  widget.innerHTML =
    '<button type="button" class="a11y-toggle" aria-expanded="false" aria-controls="a11y-panel" aria-label="' + t.label + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M4 8.5l8 2 8-2M12 10.5v5m-4 6 4-6 4 6"/></svg>' +
    "</button>" +
    '<div class="a11y-panel" id="a11y-panel" role="group" aria-label="' + t.label + '">' +
    '<button type="button" data-action="bigger">' + t.bigger + "</button>" +
    '<button type="button" data-action="smaller">' + t.smaller + "</button>" +
    '<button type="button" data-action="contrast" aria-pressed="false">' + t.contrast + "</button>" +
    '<button type="button" data-action="motion" aria-pressed="false">' + t.motion + "</button>" +
    '<button type="button" data-action="reset">' + t.reset + "</button>" +
    '<a href="' + statementHref + '">' + t.statement + "</a>" +
    "</div>";
  document.body.appendChild(widget);

  var toggle = widget.querySelector(".a11y-toggle");
  var panel = widget.querySelector(".a11y-panel");
  var btnContrast = widget.querySelector('[data-action="contrast"]');
  var btnMotion = widget.querySelector('[data-action="motion"]');

  toggle.addEventListener("click", function () {
    var open = widget.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (ev) {
    if (!widget.contains(ev.target)) { widget.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && widget.classList.contains("open")) {
      widget.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus();
    }
  });

  panel.addEventListener("click", function (ev) {
    var btn = ev.target.closest("button[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    if (action === "bigger") state.scale = Math.min(MAX_SCALE, +(state.scale + STEP).toFixed(2));
    else if (action === "smaller") state.scale = Math.max(MIN_SCALE, +(state.scale - STEP).toFixed(2));
    else if (action === "contrast") state.contrast = !state.contrast;
    else if (action === "motion") state.noMotion = !state.noMotion;
    else if (action === "reset") state = { scale: 1, contrast: false, noMotion: false };
    apply();
  });

  apply();
})();
