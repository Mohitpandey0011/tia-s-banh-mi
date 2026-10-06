/*
 * Shared behaviour for every page: header, footer, opening hours,
 * "open now" status, order links, map, and form sending.
 */
(function () {
  "use strict";

  var C = window.TIAS_CONFIG;
  var TIAS = (window.TIAS = window.TIAS || {});

  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var SHORT_DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  var NAV = [
    { href: "menu.html", label: "Menu" },
    { href: "promotions.html", label: "Promotions" },
    { href: "catering.html", label: "Catering" },
    { href: "club.html", label: "Crunch Club" },
    { href: "find-us.html", label: "Find Us" },
  ];

  var LOGO_MARK =
    '<svg class="logo-mark" viewBox="0 0 48 48" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="24" fill="#C2372B"/>' +
    '<g transform="rotate(-30 24 24)">' +
    '<rect x="7" y="17" width="34" height="14" rx="7" fill="#E9A445"/>' +
    '<path d="M15 20.5l3 7M22 20.5l3 7M29 20.5l3 7" stroke="#FBE3B8" stroke-width="2.4" stroke-linecap="round"/>' +
    "</g></svg>";

  /* ---------- small helpers ---------- */

  TIAS.esc = function (value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  TIAS.money = function (n) {
    if (n == null) return "";
    return Number.isInteger(n)
      ? "$" + n.toLocaleString("en-AU")
      : "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Always with cents, for order baskets: 27 -> "$27.00".
  TIAS.price = function (n) {
    if (n == null) return "";
    return "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  TIAS.number = function (n) {
    return Math.round(n).toLocaleString("en-AU");
  };

  TIAS.orderHref = function (href) {
    return href === "order" ? C.orderUrl : href;
  };

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  // "08:00" -> "8am", "21:30" -> "9:30pm"
  TIAS.formatTime = function (hhmm) {
    var mins = toMinutes(hhmm);
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var suffix = h >= 12 && h < 24 ? "pm" : "am";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + (m ? ":" + String(m).padStart(2, "0") : "") + suffix;
  };

  // Current day and minutes-since-midnight at the shop.
  TIAS.storeNow = function () {
    var parts = new Intl.DateTimeFormat("en-AU", {
      timeZone: C.timeZone,
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return "";
    };
    return {
      day: SHORT_DAYS[get("weekday").slice(0, 3)],
      minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10),
      year: parseInt(get("year"), 10),
      month: parseInt(get("month"), 10),
      date: parseInt(get("day"), 10),
    };
  };

  // The shop's local date plus `offset` days, as YYYY-MM-DD.
  TIAS.storeDate = function (offset) {
    var now = TIAS.storeNow();
    var d = new Date(Date.UTC(now.year, now.month - 1, now.date + (offset || 0)));
    return d.toISOString().slice(0, 10);
  };

  TIAS.openStatus = function () {
    var now = TIAS.storeNow();
    var today = C.hours[now.day];
    if (today) {
      var open = toMinutes(today[0]);
      var close = toMinutes(today[1]);
      if (now.minutes >= open && now.minutes < close) {
        var soon = close - now.minutes <= 30;
        return {
          open: true,
          soon: soon,
          text: (soon ? "Closing soon" : "Open now") + " · until " + TIAS.formatTime(today[1]),
        };
      }
      if (now.minutes < open) {
        return { open: false, text: "Closed · opens " + TIAS.formatTime(today[0]) + " today" };
      }
    }
    for (var i = 1; i <= 7; i++) {
      var day = (now.day + i) % 7;
      var hours = C.hours[day];
      if (hours) {
        return {
          open: false,
          text:
            "Closed · opens " +
            TIAS.formatTime(hours[0]) +
            " " +
            (i === 1 ? "tomorrow" : DAY_NAMES[day]),
        };
      }
    }
    return { open: false, text: "Closed" };
  };

  // "8am–9pm daily" when every day matches, otherwise null.
  TIAS.hoursSummary = function () {
    var first = C.hours[0];
    for (var d = 0; d < 7; d++) {
      var h = C.hours[d];
      if (!h || !first || h[0] !== first[0] || h[1] !== first[1]) return null;
    }
    return TIAS.formatTime(first[0]) + "–" + TIAS.formatTime(first[1]) + " daily";
  };

  TIAS.addressLines = function () {
    var a = C.address;
    return [a.street, a.street2, a.suburb + " " + a.state + " " + a.postcode];
  };

  TIAS.directionsUrl = function () {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(C.mapsQuery);
  };

  TIAS.googleMapsUrl = function () {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.mapsQuery);
  };

  TIAS.appleMapsUrl = function () {
    var a = C.address;
    return (
      "https://maps.apple.com/?q=" + encodeURIComponent(C.name) +
      "&address=" + encodeURIComponent(a.street2 + ", " + a.suburb + " " + a.state + " " + a.postcode)
    );
  };

  /*
   * A simple drawn map of the block (not to scale). It's inline SVG rather
   * than an embedded Google map, so it always shows, including in previews
   * that block third-party frames. The buttons open real maps.
   */
  var MAP_SVG =
    '<svg class="map-svg" viewBox="0 0 640 360" role="img" aria-labelledby="map-title map-desc">' +
    '<title id="map-title">Map: Tia\'s Bánh Mì in Cavill Lane, Surfers Paradise</title>' +
    '<desc id="map-desc">Cavill Lane sits between Surfers Paradise Boulevard and Orchid Avenue, next to Cavill Mall, ' +
    "opposite the Cavill Avenue G:link station and about 200 metres from Surfers Paradise Beach.</desc>" +
    '<rect width="640" height="360" fill="#EFE5D0"/>' +
    // blocks
    '<g fill="#E4D6BA">' +
    '<rect x="10" y="20" width="128" height="200" rx="6"/><rect x="10" y="262" width="128" height="88" rx="6"/>' +
    '<rect x="198" y="20" width="164" height="200" rx="6"/><rect x="198" y="262" width="164" height="88" rx="6"/>' +
    '<rect x="396" y="20" width="82" height="200" rx="6"/><rect x="396" y="262" width="82" height="88" rx="6"/>' +
    "</g>" +
    // beach and sea
    '<rect x="500" y="0" width="62" height="360" fill="#F3D9A4"/>' +
    '<rect x="562" y="0" width="78" height="360" fill="#BFDCE5"/>' +
    '<path d="M578 40 q8 -6 16 0 t16 0 t16 0 M584 120 q8 -6 16 0 t16 0 t16 0 M578 200 q8 -6 16 0 t16 0 t16 0 M584 280 q8 -6 16 0 t16 0 t16 0" ' +
    'stroke="#FFFFFF" stroke-width="3" fill="none" opacity="0.8"/>' +
    // roads
    '<g fill="#FFFDF8">' +
    '<rect x="148" y="0" width="40" height="360"/>' +
    '<rect x="370" y="0" width="18" height="360"/>' +
    '<rect x="484" y="0" width="16" height="360"/>' +
    '<rect x="0" y="232" width="148" height="20"/>' +
    "</g>" +
    // Cavill Mall (pedestrian)
    '<rect x="188" y="230" width="296" height="24" fill="#F8EBD3"/>' +
    '<path d="M188 230 H484 M188 254 H484" stroke="#D9C49C" stroke-width="2" stroke-dasharray="4 4"/>' +
    // light rail along Surfers Paradise Blvd
    '<path d="M168 0 V360" stroke="#2E6A3E" stroke-width="3" stroke-dasharray="10 6"/>' +
    // Cavill Lane block, highlighted
    '<rect x="204" y="118" width="152" height="100" rx="8" fill="#F6E3C3" stroke="#D08A2E" stroke-width="3" stroke-dasharray="7 5"/>' +
    '<text x="280" y="196" text-anchor="middle" font-size="15" font-weight="700" fill="#221B14">Cavill Lane</text>' +
    '<text x="280" y="212" text-anchor="middle" font-size="11" fill="#4A4036">under the Hilton</text>' +
    // pin
    '<g transform="translate(280 168)">' +
    '<path d="M0 0 C-14 -18 -20 -26 -20 -36 A20 20 0 1 1 20 -36 C20 -26 14 -18 0 0Z" fill="#C2372B"/>' +
    '<circle cx="0" cy="-36" r="8" fill="#FFFFFF"/>' +
    "</g>" +
    '<g transform="translate(280 96)">' +
    '<rect x="-62" y="-20" width="124" height="28" rx="14" fill="#221B14"/>' +
    '<text x="0" y="-1" text-anchor="middle" font-size="13" font-weight="700" fill="#FBF4E8">Tia\'s Bánh Mì</text>' +
    "</g>" +
    // G:link station
    '<g transform="translate(168 242)">' +
    '<rect x="-14" y="-14" width="28" height="28" rx="7" fill="#2E6A3E"/>' +
    '<text x="0" y="5" text-anchor="middle" font-size="14" font-weight="800" fill="#FFFFFF">G</text>' +
    "</g>" +
    '<text x="74" y="216" text-anchor="middle" font-size="11" font-weight="700" fill="#2E6A3E">G:link</text>' +
    '<text x="74" y="229" text-anchor="middle" font-size="11" fill="#2E6A3E">Cavill Ave station</text>' +
    // street labels
    '<g font-size="12" font-weight="600" fill="#6E6355">' +
    '<text transform="translate(142 120) rotate(-90)" text-anchor="middle">Surfers Paradise Blvd</text>' +
    '<text transform="translate(383 120) rotate(-90)" text-anchor="middle">Orchid Ave</text>' +
    '<text transform="translate(496 120) rotate(-90)" text-anchor="middle">The Esplanade</text>' +
    '<text x="74" y="278" text-anchor="middle">Cavill Ave</text>' +
    '<text x="436" y="246" text-anchor="middle">Cavill Mall</text>' +
    "</g>" +
    '<text transform="translate(533 180) rotate(-90)" text-anchor="middle" font-size="13" font-weight="700" fill="#8A6A2E">Surfers Paradise Beach</text>' +
    // north arrow + note
    '<g transform="translate(30 50)"><path d="M0 -16 L8 6 L0 1 L-8 6Z" fill="#221B14"/>' +
    '<text x="0" y="22" text-anchor="middle" font-size="12" font-weight="800" fill="#221B14">N</text></g>' +
    '<text x="14" y="350" font-size="10" fill="#6E6355">Not to scale</text>' +
    "</svg>";

  TIAS.mapCard = function () {
    return (
      '<figure class="map-card">' +
      MAP_SVG +
      "<figcaption>" +
      "<p><strong>Shop G29a, Cavill Lane</strong>, 3113 Surfers Paradise Blvd. Opposite the Cavill Avenue G:link station, " +
      "about 200 m from the beach.</p>" +
      '<div class="btn-row">' +
      '<a class="btn btn-primary btn-sm" href="' + TIAS.esc(TIAS.googleMapsUrl()) + '" target="_blank" rel="noopener">Open in Google Maps</a>' +
      '<a class="btn btn-secondary btn-sm" href="' + TIAS.esc(TIAS.appleMapsUrl()) + '" target="_blank" rel="noopener">Apple Maps</a>' +
      "</div></figcaption></figure>"
    );
  };

  /* ---------- header & footer ---------- */

  function currentPage() {
    var page = location.pathname.split("/").pop();
    return page || "index.html";
  }

  function renderHeader() {
    var el = document.getElementById("site-header");
    if (!el) return;
    var page = currentPage();
    var links = NAV.map(function (item) {
      var current = item.href === page ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + current + ">" + item.label + "</a>";
    }).join("");

    // The preview strip sits above the sticky header so it scrolls away.
    if (C.showPreviewBanner) {
      el.insertAdjacentHTML(
        "beforebegin",
        '<div class="preview-banner">Preview site: some prices, offers and Crunch Club details are still being finalised.</div>'
      );
    }

    el.innerHTML =
      '<div class="header-inner container">' +
      '<a class="logo" href="index.html">' +
      LOGO_MARK +
      '<span class="logo-text">Tia\'s <span>Bánh Mì</span></span></a>' +
      '<nav id="site-nav" class="site-nav" aria-label="Main">' +
      links +
      '<span class="status-pill nav-status" data-open-status></span>' +
      "</nav>" +
      '<div class="header-actions">' +
      '<span class="status-pill header-status" data-open-status></span>' +
      '<a class="btn btn-primary btn-sm order-btn" data-order-link href="' +
      TIAS.esc(C.orderUrl) +
      '">Order now<span class="cart-count" data-cart-count hidden></span></a>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">' +
      '<span class="sr-only">Open menu</span><span class="nav-toggle-bars" aria-hidden="true"></span>' +
      "</button></div></div>";

    var toggle = el.querySelector(".nav-toggle");
    var nav = el.querySelector(".site-nav");
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.querySelector(".sr-only").textContent = open ? "Open menu" : "Close menu";
      nav.classList.toggle("is-open", !open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.click();
        toggle.focus();
      }
    });
  }

  function socialLinks() {
    var labels = { instagram: "Instagram", facebook: "Facebook", tiktok: "TikTok" };
    return Object.keys(labels)
      .filter(function (k) {
        return C.social && C.social[k];
      })
      .map(function (k) {
        return '<a href="' + TIAS.esc(C.social[k]) + '" rel="noopener">' + labels[k] + "</a>";
      })
      .join("");
  }

  function renderFooter() {
    var el = document.getElementById("site-footer");
    if (!el) return;
    var summary = TIAS.hoursSummary();
    var social = socialLinks();
    el.innerHTML =
      '<div class="container footer-grid">' +
      '<div class="footer-brand">' +
      '<a class="logo logo-light" href="index.html">' +
      LOGO_MARK +
      '<span class="logo-text">Tia\'s <span>Bánh Mì</span></span></a>' +
      "<p>Bánh mì, phở and Vietnamese street food, made fresh on Cavill Lane.</p>" +
      '<span class="status-pill" data-open-status></span>' +
      "</div>" +
      '<div><h2 class="footer-h">Visit</h2><address>' +
      TIAS.addressLines().map(TIAS.esc).join("<br>") +
      "</address>" +
      (summary ? "<p>" + summary + "</p>" : "") +
      '<p><a href="tel:' +
      C.phoneIntl +
      '">' +
      C.phoneDisplay +
      "</a></p></div>" +
      '<div><h2 class="footer-h">Explore</h2><ul class="footer-links">' +
      '<li><a data-order-link href="' +
      TIAS.esc(C.orderUrl) +
      '">Order online</a></li>' +
      NAV.map(function (n) {
        return '<li><a href="' + n.href + '">' + n.label + "</a></li>";
      }).join("") +
      '<li><a href="faq.html">FAQs</a></li></ul></div>' +
      '<div><h2 class="footer-h">Crunch Club</h2>' +
      "<p>Earn 10 points for every $1. Every 10th Classic Pork Roll is on us.</p>" +
      '<a class="btn btn-crust btn-sm" href="club.html#join">Join free</a>' +
      (social ? '<div class="footer-social">' + social + "</div>" : "") +
      "</div></div>" +
      '<div class="container footer-base"><p>© ' +
      new Date().getFullYear() +
      " Tia's Bánh Mì, Surfers Paradise</p>" +
      '<p><a href="faq.html#allergies">Allergy information</a></p></div>';
  }

  /* ---------- live bits ---------- */

  function updateOpenStatus() {
    var status = TIAS.openStatus();
    document.querySelectorAll("[data-open-status]").forEach(function (el) {
      el.textContent = status.text;
      el.classList.toggle("is-open", status.open && !status.soon);
      el.classList.toggle("is-soon", !!status.soon);
      el.classList.toggle("is-closed", !status.open);
    });
  }

  function renderHoursTables() {
    var tables = document.querySelectorAll("[data-hours-table]");
    if (!tables.length) return;
    var today = TIAS.storeNow().day;
    // Monday first reads more naturally on a sign.
    var order = [1, 2, 3, 4, 5, 6, 0];
    var rows = order
      .map(function (d) {
        var h = C.hours[d];
        var text = h ? TIAS.formatTime(h[0]) + " – " + TIAS.formatTime(h[1]) : "Closed";
        var isToday = d === today;
        return (
          "<tr" +
          (isToday ? ' class="is-today"' : "") +
          '><th scope="row">' +
          DAY_NAMES[d] +
          (isToday ? ' <span class="today-tag">Today</span>' : "") +
          "</th><td>" +
          text +
          "</td></tr>"
        );
      })
      .join("");
    tables.forEach(function (t) {
      t.innerHTML = "<caption class=\"sr-only\">Opening hours</caption><tbody>" + rows + "</tbody>";
    });
  }

  function fillContactDetails() {
    document.querySelectorAll("[data-order-link]").forEach(function (a) {
      a.href = C.orderUrl;
    });
    document.querySelectorAll("[data-phone-link]").forEach(function (a) {
      a.href = "tel:" + C.phoneIntl;
      if (!a.textContent.trim()) a.textContent = C.phoneDisplay;
    });
    document.querySelectorAll("[data-address]").forEach(function (el) {
      el.innerHTML = TIAS.addressLines().map(TIAS.esc).join("<br>");
    });
    document.querySelectorAll("[data-directions-link]").forEach(function (a) {
      a.href = TIAS.directionsUrl();
    });
    document.querySelectorAll("[data-hours-summary]").forEach(function (el) {
      var s = TIAS.hoursSummary();
      if (s) el.textContent = s;
    });
    document.querySelectorAll("[data-map]").forEach(function (el) {
      el.innerHTML = TIAS.mapCard();
    });
  }

  /* ---------- shared card renderers ---------- */

  TIAS.promoCard = function (p, opts) {
    opts = opts || {};
    var where =
      '<ul class="promo-where">' +
      p.yes.map(function (w) {
        return '<li class="yes">' + TIAS.esc(w) + "</li>";
      }).join("") +
      p.no.map(function (w) {
        return '<li class="no">Not on ' + TIAS.esc(w) + "</li>";
      }).join("") +
      "</ul>";

    if (opts.compact) {
      return (
        '<article class="promo promo-' + p.tone + ' promo-compact">' +
        '<div class="promo-art" aria-hidden="true">' + TIAS.esc(p.art) + "</div>" +
        '<div class="promo-body">' +
        '<p class="promo-when">' + TIAS.esc(p.when) + "</p>" +
        "<h3>" + TIAS.esc(p.title) + "</h3>" +
        '<p class="promo-hook">' + TIAS.esc(p.hook) + "</p>" +
        where +
        '<a class="link-arrow" href="promotions.html#' + p.id + '">Offer details<span class="sr-only"> for ' + TIAS.esc(p.title) + "</span></a>" +
        "</div></article>"
      );
    }

    return (
      '<article class="promo promo-' + p.tone + '" id="' + p.id + '" tabindex="-1">' +
      '<div class="promo-art" aria-hidden="true">' + TIAS.esc(p.art) + "</div>" +
      '<div class="promo-body">' +
      '<p class="promo-when">' + TIAS.esc(p.when) + "</p>" +
      "<h2>" + TIAS.esc(p.title) + "</h2>" +
      '<p class="promo-hook">' + TIAS.esc(p.hook) + "</p>" +
      "<p>" + TIAS.esc(p.details) + "</p>" +
      where +
      '<details class="promo-terms"><summary>Terms</summary><ul>' +
      p.terms.map(function (t) {
        return "<li>" + TIAS.esc(t) + "</li>";
      }).join("") +
      "</ul></details>" +
      '<div class="btn-row">' +
      '<a class="btn btn-primary" href="' + TIAS.esc(TIAS.orderHref(p.cta.href)) + '">' + TIAS.esc(p.cta.label) + "</a>" +
      '<button class="btn btn-ghost" type="button" data-copy-link="' + p.id + '">Copy link</button>' +
      "</div></div></article>"
    );
  };

  var TAG_LABELS = { popular: "Popular", v: "Vegetarian", spicy: "Spicy" };

  // A dish picture: the real photo if data.js gives one (falling back to the
  // illustration if it fails to load), otherwise the illustration.
  TIAS.media = function (item, cat, cls) {
    var art = window.TIAS_ART ? window.TIAS_ART.forDish(item, cat) : "";
    var photo = item.image
      ? '<img src="' + TIAS.esc(item.image) + '" alt="" loading="lazy" decoding="async">'
      : "";
    return (
      '<span class="media ' + (cls || "") + (photo ? " has-photo" : "") + '" aria-hidden="true">' +
      photo + '<span class="media-art">' + art + "</span></span>"
    );
  };

  // Swap a broken photo for its illustration (no inline handlers needed).
  document.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (t && t.tagName === "IMG" && t.parentNode && t.parentNode.classList.contains("media")) {
        t.parentNode.classList.remove("has-photo");
        t.parentNode.removeChild(t);
      }
    },
    true
  );

  TIAS.dishCard = function (item, cat) {
    var tags = (item.tags || []).map(function (t) {
      return '<span class="tag tag-' + t + '">' + TAG_LABELS[t] + "</span>";
    });
    if (item.draft && C.showPreviewBanner) {
      tags.push('<span class="tag tag-draft">To confirm</span>');
    }
    var search = [item.name, item.vn, item.desc].join(" ").toLowerCase();
    return (
      '<article class="dish" data-tags="' + (item.tags || []).join(" ") + '" data-search="' + TIAS.esc(search) + '">' +
      TIAS.media(item, cat, "dish-media") +
      '<div class="dish-body">' +
      '<div class="dish-top"><h3 class="dish-name">' + TIAS.esc(item.name) + "</h3>" +
      (item.price != null
        ? '<span class="dish-price">' + TIAS.price(item.price) + "</span>"
        : '<span class="dish-price dish-price-tbc">Price TBC</span>') +
      "</div>" +
      (item.vn ? '<p class="dish-vn" lang="vi">' + TIAS.esc(item.vn) + "</p>" : "") +
      (item.desc ? '<p class="dish-desc">' + TIAS.esc(item.desc) + "</p>" : "") +
      (tags.length ? '<div class="dish-tags">' + tags.join("") + "</div>" : "") +
      "</div></article>"
    );
  };

  /* ---------- forms ---------- */

  /*
   * Sends a form to C.formEndpoint when one is set. Otherwise (or if
   * sending fails) shows the details with buttons to email, text or call
   * the shop, so a request is never lost.
   *
   * opts: { statusEl, subject, lines: [..], data: {..}, successHtml, introHtml,
   *         onSuccess, onFallback(failed), smsLabel, emailLabel }
   */
  TIAS.sendForm = function (opts) {
    var status = opts.statusEl;
    var body = opts.lines.join("\n");

    function show(html) {
      status.innerHTML = html;
      status.hidden = false;
      status.focus();
    }

    function fallback(failed) {
      var enc = encodeURIComponent;
      var buttons = [];
      if (C.email) {
        buttons.push(
          '<a class="btn btn-primary" href="mailto:' + TIAS.esc(C.email) +
          "?subject=" + enc(opts.subject) + "&body=" + enc(body) + '">' +
          TIAS.esc(opts.emailLabel || "Email it to us") + "</a>"
        );
      }
      buttons.push(
        '<a class="btn ' + (C.email ? "btn-secondary" : "btn-primary") +
        '" href="sms:' + C.phoneIntl + "?&body=" + enc(body) + '">' +
        TIAS.esc(opts.smsLabel || "Text it to us") + "</a>"
      );
      buttons.push('<a class="btn btn-secondary" href="tel:' + C.phoneIntl + '">Call ' + C.phoneDisplay + "</a>");
      buttons.push('<button class="btn btn-ghost" type="button" data-copy-summary>Copy details</button>');

      show(
        (failed
          ? "<h3>That didn't go through</h3><p>Sorry, something went wrong sending your details. Please send them to us another way:</p>"
          : opts.introHtml) +
        '<pre class="summary-box">' + TIAS.esc(body) + "</pre>" +
        '<div class="btn-row">' + buttons.join("") + "</div>"
      );
      var copy = status.querySelector("[data-copy-summary]");
      copy.addEventListener("click", function () {
        TIAS.copy(body, copy);
      });
      if (opts.onFallback) opts.onFallback(failed);
    }

    if (!C.formEndpoint) {
      fallback(false);
      return;
    }

    show("<p>Sending…</p>");
    var payload = Object.assign({ _subject: opts.subject, summary: body }, opts.data);
    fetch(C.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        show(opts.successHtml);
        if (opts.onSuccess) opts.onSuccess();
      })
      .catch(function () {
        fallback(true);
      });
  };

  TIAS.copy = function (text, button) {
    var done = function () {
      var label = button.textContent;
      button.textContent = "Copied";
      setTimeout(function () {
        button.textContent = label;
      }, 1800);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "absolute";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {
        /* ignore */
      }
      document.body.removeChild(area);
    }
  };

  /* ---------- order basket ---------- */

  /*
   * Everything a customer can order online: the menu plus share packs.
   * Returns { categories: [{id, name, blurb, items}], byId: {id: item} }.
   */
  TIAS.catalog = function () {
    var D = window.TIAS_DATA;
    var categories = D.menu.slice();
    var packs = (D.catering && D.catering.sharePacks) || [];
    if (packs.length) {
      categories.push({
        id: "share-packs",
        name: "Share Packs",
        blurb: "Feeds 4 to 6. Tell us your fillings in the note.",
        items: packs.map(function (p) {
          return {
            id: p.id,
            name: p.name,
            vn: "",
            desc: "Serves " + p.serves + ": " + p.includes.join(", ") + ".",
            price: p.price,
            tags: [],
          };
        }),
      });
    }
    var byId = {};
    categories.forEach(function (cat) {
      cat.items.forEach(function (item) {
        byId[item.id] = item;
      });
    });
    return { categories: categories, byId: byId };
  };

  var CART_KEY = "tias-order-v1";
  var MAX_QTY = 50;
  var memoryCart = [];
  var storageOk = true;

  // Storage can be blocked (private windows, embedded previews). If reading
  // or saving ever fails, the basket lives in memory for this page instead.
  function readCart() {
    if (!storageOk) return memoryCart.slice();
    var raw;
    try {
      raw = window.localStorage.getItem(CART_KEY);
    } catch (e) {
      storageOk = false;
      return memoryCart.slice();
    }
    if (raw === null) return [];
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(validLine) : [];
    } catch (e) {
      return [];
    }
  }

  function validLine(l) {
    return (
      l && typeof l.id === "string" && typeof l.qty === "number" &&
      l.qty > 0 && l.qty <= MAX_QTY && Math.round(l.qty) === l.qty
    );
  }

  function writeCart(lines, noteOnly) {
    memoryCart = lines.slice();
    if (storageOk) {
      try {
        window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
      } catch (e) {
        storageOk = false;
      }
    }
    document.dispatchEvent(new CustomEvent("tias:cart", { detail: { noteOnly: !!noteOnly } }));
  }

  TIAS.cart = {
    lines: function () {
      return readCart();
    },
    qty: function (id) {
      var line = readCart().filter(function (l) {
        return l.id === id;
      })[0];
      return line ? line.qty : 0;
    },
    set: function (id, qty) {
      qty = Math.max(0, Math.min(MAX_QTY, Math.round(qty) || 0));
      var lines = readCart();
      var found = false;
      lines = lines
        .map(function (l) {
          if (l.id !== id) return l;
          found = true;
          return { id: l.id, qty: qty, note: l.note || "" };
        })
        .filter(function (l) {
          return l.qty > 0;
        });
      if (!found && qty > 0) lines.push({ id: id, qty: qty, note: "" });
      writeCart(lines);
    },
    add: function (id, n) {
      TIAS.cart.set(id, TIAS.cart.qty(id) + n);
    },
    note: function (id, text) {
      var lines = readCart().map(function (l) {
        return l.id === id ? { id: l.id, qty: l.qty, note: String(text).slice(0, 140) } : l;
      });
      writeCart(lines, true);
    },
    // Drop anything no longer on the menu.
    prune: function (byId) {
      var lines = readCart();
      var kept = lines.filter(function (l) {
        return byId[l.id];
      });
      if (kept.length !== lines.length) writeCart(kept);
    },
    clear: function () {
      writeCart([]);
    },
    count: function () {
      return readCart().reduce(function (n, l) {
        return n + l.qty;
      }, 0);
    },
  };

  function updateCartCount() {
    var count = TIAS.cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(function (el) {
      el.textContent = count;
      el.hidden = count === 0;
      var link = el.closest("a");
      if (link) {
        link.setAttribute(
          "aria-label",
          count ? "Order now, " + count + (count === 1 ? " item" : " items") + " in your order" : "Order now"
        );
      }
    });
  }

  document.addEventListener("tias:cart", function (e) {
    if (!e.detail || !e.detail.noteOnly) updateCartCount();
  });
  // Keep other open tabs in step.
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) {
      document.dispatchEvent(new CustomEvent("tias:cart", { detail: { noteOnly: false } }));
    }
  });

  /* ---------- start ---------- */

  renderHeader();
  renderFooter();
  fillContactDetails();
  renderHoursTables();
  updateCartCount();
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
})();
