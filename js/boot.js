/* Apply the saved theme before paint. ?theme=classic|chimp wins and is remembered.
   ?theme=cyber is the old name for the Chimp.OS palette. */
(function () {
  function normalize(theme) {
    if (theme === "cyber") return "chimp";
    if (theme === "classic" || theme === "chimp") return theme;
    return "";
  }

  function readSaved() {
    try {
      return normalize(localStorage.getItem("vault-theme") || localStorage.getItem("rewind-theme"));
    } catch (err) {
      return "";
    }
  }

  function paint(theme, persist) {
    theme = normalize(theme) || "chimp";
    document.documentElement.setAttribute("data-theme", theme);
    if (persist) {
      try {
        localStorage.setItem("vault-theme", theme);
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
  var fromQuery = normalize(params.get("theme"));
  var saved = readSaved();
  var initial = fromQuery || saved || "chimp";
  paint(initial, Boolean(fromQuery));

  window.__setTheme = function (theme) {
    paint(theme, true);
  };

  window.__syncTheme = function () {
    paint(document.documentElement.getAttribute("data-theme") || "chimp", false);
  };
})();
