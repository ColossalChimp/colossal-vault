(function () {
  var header = document.getElementById("topbar");
  if (!header) return;

  var name = window.PRODUCT_NAME || "Colossal Vault";
  var screen = document.body.dataset.screen || "Collection";
  var home = document.body.dataset.home || "home.html";
  var nav = document.body.dataset.nav || "";

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function link(id, href, label) {
    var current = nav === id ? ' aria-current="page"' : "";
    return '<a href="' + href + '"' + current + ">" + label + "</a>";
  }

  header.innerHTML =
    '<a class="brand" href="' + esc(home) + '">' +
      '<svg class="mark" viewBox="0 0 36 36" aria-hidden="true">' +
        '<rect x="3" y="9" width="30" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        '<circle cx="7" cy="18" r="2.2" fill="var(--panel)"/>' +
        '<circle cx="29" cy="18" r="2.2" fill="var(--panel)"/>' +
        '<path d="M19.5 12.2 12.2 18l7.3 5.8V12.2zm7 0L19.2 18l7.3 5.8V12.2z" fill="currentColor"/>' +
      "</svg>" +
      '<span class="brand-lockup">' +
        '<span class="brand-name">Chimp.OS</span>' +
        '<span class="crumb">Collection <span aria-hidden="true">/</span> <b>' + esc(screen) + "</b></span>" +
      "</span>" +
    "</a>" +
    '<p class="tagline" data-brand>' + esc(name) + "</p>" +
    '<div class="top-actions">' +
      '<nav class="section-nav" aria-label="Collection">' +
        link("home", "home.html", "Home") +
        link("browse", "browse.html", "Wall") +
        link("queue", "queue.html", "Queue") +
        link("stats", "stats.html", "Close") +
      "</nav>" +
      '<div class="theme-switch" role="group" aria-label="Theme">' +
        '<button type="button" data-set-theme="classic" onclick="window.__setTheme(\'classic\')">Classic</button>' +
        '<button type="button" data-set-theme="chimp" onclick="window.__setTheme(\'chimp\')">Chimp.OS</button>' +
      "</div>" +
      '<div class="member-chip">' +
        "<span>Titles on the shelf</span>" +
        "<strong>35,153</strong>" +
      "</div>" +
    "</div>";

  document.querySelectorAll("[data-brand]").forEach(function (el) {
    el.textContent = name;
  });
  document.title = name + " — " + screen;

  if (window.__syncTheme) window.__syncTheme();

  fetch("/api/v1/stats")
    .then(function (response) { return response.ok ? response.json() : null; })
    .then(function (stats) {
      if (!stats) return;
      var strong = header.querySelector(".member-chip strong");
      if (strong) strong.textContent = stats.titlesLabel;
    })
    .catch(function () {});
})();
