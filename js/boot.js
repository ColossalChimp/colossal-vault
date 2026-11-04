/* Apply the saved theme before paint. Query ?theme=classic|cyber wins and is remembered. */
(function () {
  var THEMES = { classic: 1, cyber: 1 };

  function readSaved() {
    try {
      return localStorage.getItem("rewind-theme");
    } catch (err) {
      return null;
    }
  }

  function paint(theme, persist) {
    if (!THEMES[theme]) theme = "classic";
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("rewind-theme", theme);
      } catch (err) {
        /* private mode */
      }
    }
    document.querySelectorAll("[data-set-theme]").forEach(function (btn) {
      var on = btn.getAttribute("data-set-theme") === theme;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  var params = new URLSearchParams(location.search);
  var fromQuery = params.get("theme");
  var saved = readSaved();
  var initial = THEMES[fromQuery] ? fromQuery : THEMES[saved] ? saved : "classic";
  paint(initial, Boolean(THEMES[fromQuery]));

  window.__setTheme = function (theme) {
    paint(theme, true);
  };

  window.__syncTheme = function () {
    paint(document.documentElement.getAttribute("data-theme") || "classic", false);
  };
})();
