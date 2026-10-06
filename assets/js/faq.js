/*
 * Renders FAQs into any element with data-faq="<group>" (or "all").
 * Each question is a <details> with its own id, so faq.html#allergies
 * opens that answer directly.
 */
(function () {
  "use strict";

  var D = window.TIAS_DATA;
  var TIAS = window.TIAS;

  function item(f) {
    return (
      '<details class="faq" id="' + f.id + '">' +
      "<summary>" + TIAS.esc(f.q) + "</summary>" +
      "<p>" + TIAS.esc(f.a) + "</p>" +
      "</details>"
    );
  }

  document.querySelectorAll("[data-faq]").forEach(function (el) {
    var group = el.getAttribute("data-faq");
    if (group === "all") {
      el.innerHTML = Object.keys(D.faqGroups)
        .map(function (g) {
          var items = D.faqs.filter(function (f) {
            return f.group === g;
          });
          return (
            '<section class="faq-group" aria-labelledby="faq-' + g + '">' +
            '<h2 id="faq-' + g + '">' + TIAS.esc(D.faqGroups[g]) + "</h2>" +
            items.map(item).join("") +
            "</section>"
          );
        })
        .join("");
    } else {
      el.innerHTML = D.faqs
        .filter(function (f) {
          return f.group === group;
        })
        .map(item)
        .join("");
    }
  });

  function openHash() {
    var id = location.hash.slice(1);
    var target = id && document.getElementById(id);
    if (target && target.tagName === "DETAILS") {
      target.open = true;
      target.scrollIntoView({ block: "center" });
    }
  }
  window.addEventListener("hashchange", openHash);
  openHash();
})();
