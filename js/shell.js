(function () {
  var header = document.getElementById("topbar");
  if (!header) return;

  var screen = document.body.dataset.screen || "Collection";
  var home = document.body.dataset.home || "../index.html";

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  header.innerHTML =
    '<a class="brand" href="' + esc(home) + '">' +
      '<svg class="mark" viewBox="0 0 36 36" aria-hidden="true">' +
        '<rect x="3" y="9" width="30" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/>' +
        '<circle cx="7" cy="18" r="2.3" fill="var(--panel)"/>' +
        '<circle cx="29" cy="18" r="2.3" fill="var(--panel)"/>' +
        '<path d="M19.5 12.2 12.2 18l7.3 5.8V12.2zm7 0L19.2 18l7.3 5.8V12.2z" fill="currentColor"/>' +
      "</svg>" +
      '<span class="brand-lockup">' +
        '<span class="brand-name">Chimp.OS</span>' +
        '<span class="crumb">Collection <span aria-hidden="true">/</span> <b>' + esc(screen) + "</b></span>" +
      "</span>" +
    "</a>" +
    '<p class="tagline">Be kind, rewind</p>' +
    '<div class="top-actions">' +
      '<div class="theme-switch" role="group" aria-label="Theme">' +
        '<button type="button" data-set-theme="classic" onclick="window.__setTheme(\'classic\')">Classic</button>' +
        '<button type="button" data-set-theme="cyber" onclick="window.__setTheme(\'cyber\')">Cyberpunk</button>' +
      "</div>" +
      '<div class="member-chip">' +
        "<span>Titles on the shelf</span>" +
        "<strong>33,003</strong>" +
      "</div>" +
    "</div>";

  if (window.__syncTheme) window.__syncTheme();
})();
