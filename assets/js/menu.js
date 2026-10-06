(function () {
  "use strict";

  var D = window.TIAS_DATA;
  var TIAS = window.TIAS;

  var catNav = document.getElementById("menu-cats");
  var root = document.getElementById("menu-sections");
  var search = document.getElementById("menu-search");
  var empty = document.getElementById("menu-empty");
  var filterBoxes = document.querySelectorAll("[data-filter]");

  catNav.innerHTML = D.menu
    .map(function (cat) {
      return '<a class="chip" href="#' + cat.id + '" data-cat-link="' + cat.id + '">' + TIAS.esc(cat.name) + "</a>";
    })
    .join("");

  root.innerHTML = D.menu
    .map(function (cat) {
      return (
        '<section class="menu-section" id="' + cat.id + '" aria-labelledby="h-' + cat.id + '">' +
        '<div class="menu-section-head"><h2 id="h-' + cat.id + '">' + TIAS.esc(cat.name) + "</h2>" +
        "<p>" + TIAS.esc(cat.blurb) + "</p></div>" +
        '<div class="grid grid-dishes">' + cat.items.map(TIAS.dishCard).join("") + "</div>" +
        "</section>"
      );
    })
    .join("");

  function applyFilters() {
    var q = search.value.trim().toLowerCase();
    var needed = [];
    filterBoxes.forEach(function (box) {
      if (box.checked) needed.push(box.value);
    });

    var shown = 0;
    root.querySelectorAll(".menu-section").forEach(function (section) {
      var visibleInSection = 0;
      section.querySelectorAll(".dish").forEach(function (dish) {
        var tags = dish.getAttribute("data-tags").split(" ");
        var matchTags = needed.every(function (t) {
          return tags.indexOf(t) !== -1;
        });
        var matchText = !q || dish.getAttribute("data-search").indexOf(q) !== -1;
        var visible = matchTags && matchText;
        dish.hidden = !visible;
        if (visible) visibleInSection++;
      });
      section.hidden = visibleInSection === 0;
      var link = catNav.querySelector('[data-cat-link="' + section.id + '"]');
      if (link) link.hidden = visibleInSection === 0;
      shown += visibleInSection;
    });
    empty.hidden = shown !== 0;
    document.getElementById("menu-count").textContent =
      shown + (shown === 1 ? " dish" : " dishes") + (q || needed.length ? " match" : "");
  }

  search.addEventListener("input", applyFilters);
  filterBoxes.forEach(function (box) {
    box.addEventListener("change", applyFilters);
  });
  document.getElementById("menu-clear").addEventListener("click", function () {
    search.value = "";
    filterBoxes.forEach(function (box) {
      box.checked = false;
    });
    applyFilters();
    search.focus();
  });
  applyFilters();

  // Highlight the category currently on screen.
  if ("IntersectionObserver" in window) {
    var links = catNav.querySelectorAll("[data-cat-link]");
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) {
            var active = l.getAttribute("data-cat-link") === entry.target.id;
            l.classList.toggle("is-active", active);
            // Scroll the chip bar sideways only, never the page.
            if (active) catNav.scrollTo({ left: Math.max(0, l.offsetLeft - 16), behavior: "smooth" });
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    root.querySelectorAll(".menu-section").forEach(function (s) {
      observer.observe(s);
    });
  }

  // Keep category headings clear of the sticky header and filter bar.
  function setScrollOffset() {
    var header = document.getElementById("site-header").offsetHeight;
    var toolbar = document.querySelector(".menu-toolbar").offsetHeight;
    document.documentElement.style.setProperty("--scroll-pad", header + toolbar - 32 + "px");
  }
  setScrollOffset();
  window.addEventListener("resize", setScrollOffset);

  // Jump to a category from another page (menu.html#pho).
  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
