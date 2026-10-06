(function () {
  "use strict";

  var D = window.TIAS_DATA;
  var TIAS = window.TIAS;
  var list = document.getElementById("promo-list");

  list.innerHTML = D.promotions
    .map(function (p) {
      return TIAS.promoCard(p);
    })
    .join("");

  list.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy-link]");
    if (!btn) return;
    var url = location.href.split("#")[0] + "#" + btn.getAttribute("data-copy-link");
    TIAS.copy(url, btn);
  });

  // promotions.html#early-bird opens that offer's terms and focuses it.
  function showHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var card = document.getElementById(id);
    if (!card || !card.classList.contains("promo")) return;
    list.querySelectorAll(".promo").forEach(function (c) {
      c.classList.toggle("is-highlighted", c === card);
    });
    var terms = card.querySelector("details");
    if (terms) terms.open = true;
    card.scrollIntoView({ block: "start" });
    card.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", showHash);
  showHash();
})();
