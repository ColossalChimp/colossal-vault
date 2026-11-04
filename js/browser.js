/* Sort and aisle filters for the browser drafts. Initial state is the designed one. */
(function () {
  var root = document.querySelector("[data-browser]");
  if (!root) return;

  var sortKey = root.dataset.sort || "recent";

  function lists() {
    return Array.prototype.slice.call(root.querySelectorAll("[data-sort-list]"));
  }

  function applySort() {
    lists().forEach(function (list) {
      var items = Array.prototype.slice.call(list.querySelectorAll("[data-item]"));
      items.sort(function (a, b) {
        if (sortKey === "title") return a.dataset.title.localeCompare(b.dataset.title);
        if (sortKey === "value") return Number(b.dataset.value) - Number(a.dataset.value);
        if (sortKey === "aisle") return a.dataset.cat.localeCompare(b.dataset.cat) || a.dataset.title.localeCompare(b.dataset.title);
        return Number(a.dataset.recent) - Number(b.dataset.recent);
      });
      items.forEach(function (el) {
        list.appendChild(el);
      });
    });
    root.querySelectorAll("[data-sort]").forEach(function (btn) {
      var on = btn.getAttribute("data-sort") === sortKey;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    root.querySelectorAll("[data-sort-col]").forEach(function (th) {
      var on = th.getAttribute("data-sort-col") === sortKey;
      th.setAttribute("aria-sort", on ? (sortKey === "title" || sortKey === "aisle" ? "ascending" : "descending") : "none");
    });
  }

  function applyFilter(cat) {
    root.querySelectorAll("[data-item]").forEach(function (el) {
      el.hidden = cat !== "all" && el.dataset.cat !== cat;
    });
    root.querySelectorAll(".shelf-block").forEach(function (block) {
      var visible = block.querySelector("[data-item]:not([hidden])");
      block.classList.toggle("is-empty", !visible);
    });
    root.querySelectorAll("[data-filter-cat]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-filter-cat") === cat ? "true" : "false");
    });
  }

  root.querySelectorAll("[data-sort]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      sortKey = btn.getAttribute("data-sort");
      applySort();
    });
  });

  root.querySelectorAll("[data-sort-col]").forEach(function (th) {
    th.addEventListener("click", function () {
      sortKey = th.getAttribute("data-sort-col");
      applySort();
    });
  });

  root.querySelectorAll("[data-filter-cat]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.getAttribute("data-filter-cat"));
    });
  });

  applySort();
})();
