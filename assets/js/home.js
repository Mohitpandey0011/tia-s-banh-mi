(function () {
  "use strict";

  var D = window.TIAS_DATA;
  var TIAS = window.TIAS;

  var featured = document.getElementById("featured-dishes");
  if (featured) {
    var dishes = [];
    D.menu.forEach(function (cat) {
      cat.items.forEach(function (item) {
        if (item.featured) dishes.push(item);
      });
    });
    featured.innerHTML = dishes.slice(0, 4).map(TIAS.dishCard).join("");
  }

  var cats = document.getElementById("home-categories");
  if (cats) {
    cats.innerHTML = D.menu
      .map(function (cat) {
        return (
          '<a class="cat-tile" href="menu.html#' + cat.id + '">' +
          '<span class="cat-name">' + TIAS.esc(cat.name) + "</span>" +
          '<span class="cat-blurb">' + TIAS.esc(cat.blurb) + "</span>" +
          '<span class="cat-count">' + cat.items.length + (cat.items.length === 1 ? " dish" : " dishes") + "</span>" +
          "</a>"
        );
      })
      .join("");
  }

  var promos = document.getElementById("home-promos");
  if (promos) {
    promos.innerHTML = D.promotions
      .slice(0, 3)
      .map(function (p) {
        return TIAS.promoCard(p, { compact: true });
      })
      .join("");
  }
})();
