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
      '<a class="btn btn-primary btn-sm" data-order-link href="' +
      TIAS.esc(C.orderUrl) +
      '">Order now</a>' +
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
      el.innerHTML =
        '<a class="map-fallback" href="' + TIAS.directionsUrl() + '">Open in Google Maps</a>' +
        '<iframe title="Map showing Tia\'s Bánh Mì on Cavill Lane" loading="lazy" ' +
        'referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=' +
        encodeURIComponent(C.mapsQuery) +
        '&output=embed"></iframe>';
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

  TIAS.dishCard = function (item) {
    var tags = (item.tags || []).map(function (t) {
      return '<span class="tag tag-' + t + '">' + TAG_LABELS[t] + "</span>";
    });
    if (item.draft && C.showPreviewBanner) {
      tags.push('<span class="tag tag-draft">To confirm</span>');
    }
    var search = [item.name, item.vn, item.desc].join(" ").toLowerCase();
    return (
      '<article class="dish" data-tags="' + (item.tags || []).join(" ") + '" data-search="' + TIAS.esc(search) + '">' +
      '<div class="dish-top"><h3 class="dish-name">' + TIAS.esc(item.name) + "</h3>" +
      (item.price != null
        ? '<span class="dish-price">' + TIAS.money(item.price) + "</span>"
        : '<span class="dish-price dish-price-tbc">Price on order</span>') +
      "</div>" +
      (item.vn ? '<p class="dish-vn" lang="vi">' + TIAS.esc(item.vn) + "</p>" : "") +
      '<p class="dish-desc">' + TIAS.esc(item.desc) + "</p>" +
      (tags.length ? '<div class="dish-tags">' + tags.join("") + "</div>" : "") +
      "</article>"
    );
  };

  /* ---------- forms ---------- */

  /*
   * Sends a form to C.formEndpoint when one is set. Otherwise (or if
   * sending fails) shows the details with buttons to email, text or call
   * the shop, so a request is never lost.
   *
   * opts: { statusEl, subject, lines: [..], data: {..}, successHtml, introHtml, onSuccess }
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
          "?subject=" + enc(opts.subject) + "&body=" + enc(body) + '">Email it to us</a>'
        );
      }
      buttons.push(
        '<a class="btn ' + (C.email ? "btn-secondary" : "btn-primary") +
        '" href="sms:' + C.phoneIntl + "?&body=" + enc(body) + '">Text it to us</a>'
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

  /* ---------- start ---------- */

  renderHeader();
  renderFooter();
  fillContactDetails();
  renderHoursTables();
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);
})();
