/* Live collection client. The screens keep their markup and fill it from /api/v1. */
(function () {
  function money(value) {
    if (value == null || value === "") return "—";
    var number = Number(value);
    if (Math.abs(number - Math.round(number)) < 0.001) {
      return "$" + Math.round(number).toLocaleString("en-US");
    }
    return "$" + number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  async function request(path, options) {
    var response = await fetch(path, options);
    if (!response.ok) {
      var message = "Request failed";
      try {
        message = (await response.json()).error || message;
      } catch (err) {
        /* ignore */
      }
      throw new Error(message);
    }
    var type = response.headers.get("content-type") || "";
    if (type.indexOf("application/json") === -1) return response;
    return response.json();
  }

  function vhs(item) {
    var href = "item.html?id=" + encodeURIComponent(item.id);
    return (
      '<a class="vhs" data-cat="' + item.category + '" data-item data-title="' +
      escapeAttr(item.title.toLowerCase()) + '" data-value="' + (item.value || 0) +
      '" data-recent="' + (item.recent || 0) + '" href="' + href + '">' +
      '<div class="vhs-spine"><span>' + escapeHtml(item.spine || item.title) + "</span></div>" +
      '<div class="vhs-face"><div class="vhs-window"><div class="art" data-cover="' + item.id + '"></div></div>' +
      '<div class="vhs-label"><strong>' + escapeHtml(item.title) + "</strong><span>" +
      escapeHtml(item.valueLabel || "") + "</span></div></div></a>"
    );
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/"/g, "&quot;");
  }

  function paintItem(item) {
    if (!window.REWIND) return;
    window.REWIND.byId[item.id] = item;
    var root = document.querySelector("[data-detail]");
    if (!root) return;
    root.dataset.detail = item.id;
    root.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.dataset.bind;
      if (item[key] == null) return;
      if (el.tagName === "INPUT") el.value = item[key];
      else el.textContent = item[key];
    });
    root.querySelectorAll("[data-cover]").forEach(function (el) {
      el.dataset.cover = item.id;
    });
    root.querySelectorAll("[data-cat-bind]").forEach(function (el) {
      el.setAttribute("data-cat", item.category);
    });
    if (window.REWIND.fillCovers) window.REWIND.fillCovers(root);
  }

  window.Vault = {
    request: request,
    money: money,
    vhs: vhs,
    paintItem: paintItem,
    stats: function () { return request("/api/v1/stats"); },
    items: function (query) { return request("/api/v1/items" + (query || "")); },
    jobs: function () { return request("/api/v1/jobs"); }
  };
})();
