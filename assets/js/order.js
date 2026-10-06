/*
 * Pick-up ordering: menu with Add buttons, a basket that persists between
 * pages, pick-up times from the opening hours, and sending the order.
 */
(function () {
  "use strict";

  var C = window.TIAS_CONFIG;
  var D = window.TIAS_DATA;
  var TIAS = window.TIAS;
  var esc = TIAS.esc;

  var LEAD = C.pickupLeadMinutes || 15;
  var STEP = C.pickupStepMinutes || 15;
  var MAX_QTY = 50;
  var DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var TAG_LABELS = { popular: "Popular", v: "Vegetarian", spicy: "Spicy" };

  var catalog = TIAS.catalog();
  TIAS.cart.prune(catalog.byId);

  var chipsEl = document.getElementById("order-cats");
  var menuEl = document.getElementById("order-menu");
  var cartPanel = document.getElementById("cart-panel");
  var linesEl = document.getElementById("cart-lines");
  var form = document.getElementById("order-form");
  var timeSelect = document.getElementById("pickup-time");
  var errorsEl = document.getElementById("order-errors");
  var statusEl = document.getElementById("order-status");
  var clubBox = document.getElementById("order-club");
  var bar = document.getElementById("order-bar");

  /* ---------- menu ---------- */

  chipsEl.innerHTML = catalog.categories
    .map(function (cat) {
      return '<a class="chip" href="#' + cat.id + '">' + esc(cat.name) + "</a>";
    })
    .join("");

  function priceHtml(item) {
    return item.price != null
      ? '<span class="dish-price">' + TIAS.price(item.price) + "</span>"
      : '<span class="dish-price-tbc">Price TBC</span>';
  }

  function itemRow(item) {
    var tags = (item.tags || []).map(function (t) {
      return '<span class="tag tag-' + t + '">' + TAG_LABELS[t] + "</span>";
    });
    if (item.draft && C.showPreviewBanner) tags.push('<span class="tag tag-draft">To confirm</span>');
    return (
      '<article class="order-item">' +
      '<div class="order-item-info">' +
      '<h3 class="order-item-name">' + esc(item.name) + "</h3>" +
      (item.vn ? '<p class="dish-vn" lang="vi">' + esc(item.vn) + "</p>" : "") +
      '<p class="order-item-desc">' + esc(item.desc) + "</p>" +
      (tags.length ? '<div class="dish-tags">' + tags.join("") + "</div>" : "") +
      "</div>" +
      '<div class="order-item-side">' + priceHtml(item) +
      '<div class="order-item-action" data-action-for="' + esc(item.id) + '"></div>' +
      "</div></article>"
    );
  }

  menuEl.innerHTML = catalog.categories
    .map(function (cat) {
      return (
        '<section class="order-section" id="' + cat.id + '" aria-labelledby="oh-' + cat.id + '">' +
        '<h2 id="oh-' + cat.id + '">' + esc(cat.name) + "</h2>" +
        '<p class="order-section-blurb">' + esc(cat.blurb) + "</p>" +
        cat.items.map(itemRow).join("") +
        "</section>"
      );
    })
    .join("");

  function stepperHtml(id, qty, name) {
    var n = esc(name);
    return (
      '<div class="stepper stepper-sm" role="group" aria-label="' + n + ' quantity">' +
      '<button type="button" data-dec="' + esc(id) + '" aria-label="Remove one ' + n + '">−</button>' +
      '<span class="stepper-qty">' + qty + "</span>" +
      '<button type="button" data-inc="' + esc(id) + '" aria-label="Add one more ' + n + '"' +
      (qty >= MAX_QTY ? " disabled" : "") + ">+</button></div>"
    );
  }

  function renderActions() {
    menuEl.querySelectorAll("[data-action-for]").forEach(function (el) {
      var id = el.getAttribute("data-action-for");
      var item = catalog.byId[id];
      var qty = TIAS.cart.qty(id);
      el.innerHTML = qty
        ? stepperHtml(id, qty, item.name)
        : '<button type="button" class="btn btn-primary btn-sm" data-add="' + esc(id) + '">Add<span class="sr-only"> ' +
          esc(item.name) + "</span></button>";
    });
  }

  /* ---------- basket ---------- */

  function currentLines() {
    return TIAS.cart
      .lines()
      .filter(function (l) {
        return catalog.byId[l.id];
      })
      .map(function (l) {
        var item = catalog.byId[l.id];
        return {
          id: l.id,
          qty: l.qty,
          note: l.note || "",
          item: item,
          cost: item.price != null ? item.price * l.qty : null,
        };
      });
  }

  function totals(lines) {
    var t = { subtotal: 0, tbc: 0, count: 0 };
    lines.forEach(function (l) {
      t.count += l.qty;
      if (l.cost == null) t.tbc++;
      else t.subtotal += l.cost;
    });
    t.subtotal = Math.round(t.subtotal * 100) / 100;
    return t;
  }

  function lineHtml(l) {
    var n = esc(l.item.name);
    var noteId = "note-" + esc(l.id);
    return (
      '<li class="cart-line">' +
      '<div class="cart-line-top"><span class="cart-line-name">' + n + "</span>" +
      '<span class="cart-line-cost">' + (l.cost != null ? TIAS.price(l.cost) : "Price TBC") + "</span></div>" +
      '<div class="cart-line-controls">' + stepperHtml(l.id, l.qty, l.item.name) +
      '<button type="button" class="link-btn" data-remove="' + esc(l.id) + '">Remove<span class="sr-only"> ' + n + "</span></button>" +
      "</div>" +
      '<label class="sr-only" for="' + noteId + '">Note for ' + n + "</label>" +
      '<input class="cart-note" id="' + noteId + '" data-note="' + esc(l.id) + '" maxlength="140" ' +
      'placeholder="Add a note, e.g. no chilli" value="' + esc(l.note) + '">' +
      "</li>"
    );
  }

  function renderCart() {
    var lines = currentLines();
    var t = totals(lines);

    linesEl.innerHTML = lines.length
      ? lines.map(lineHtml).join("")
      : '<li class="cart-empty">Your order is empty. Tap Add next to anything on the menu.</li>';

    document.getElementById("cart-count-label").textContent = t.count ? "(" + t.count + ")" : "";
    document.getElementById("cart-subtotal").textContent = TIAS.price(t.subtotal);

    var tbc = document.getElementById("cart-tbc");
    tbc.hidden = !t.tbc;
    tbc.textContent = t.tbc
      ? (t.tbc === 1 ? "1 item is" : t.tbc + " items are") + " priced in store and not included above."
      : "";

    renderPoints(t);
    renderBar(t);
  }

  function renderPoints(t) {
    var el = document.getElementById("points-preview");
    var points = Math.floor(t.subtotal * ((D.club && D.club.pointsPerDollar) || 10));
    el.hidden = !(clubBox.checked && points > 0);
    el.textContent = "You'll earn about " + TIAS.number(points) + " Crunch Club points on this order.";
  }

  /* ---------- focus: keep keyboard users where they were ---------- */

  function captureFocus() {
    var a = document.activeElement;
    if (!a || !a.getAttribute) return null;
    var kinds = ["add", "inc", "dec", "remove"];
    for (var i = 0; i < kinds.length; i++) {
      var id = a.getAttribute("data-" + kinds[i]);
      if (id) return { kind: kinds[i], id: id, inCart: cartPanel.contains(a) };
    }
    return null;
  }

  function restoreFocus(f) {
    if (!f) return;
    var scope = f.inCart ? cartPanel : menuEl;
    var esId = f.id.replace(/"/g, "");
    var target =
      scope.querySelector('[data-' + (f.kind === "add" ? "inc" : f.kind) + '="' + esId + '"]:not([disabled])') ||
      scope.querySelector('[data-inc="' + esId + '"]:not([disabled])') ||
      scope.querySelector('[data-dec="' + esId + '"]') ||
      (f.inCart ? null : scope.querySelector('[data-add="' + esId + '"]')) ||
      document.getElementById("cart-heading");
    if (target) target.focus();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add], [data-inc], [data-dec], [data-remove]");
    if (!btn || !(menuEl.contains(btn) || cartPanel.contains(btn))) return;
    // Clicked buttons don't take focus in every browser; give it so focus
    // can follow the control after the basket re-renders.
    btn.focus();
    var id;
    if ((id = btn.getAttribute("data-add"))) TIAS.cart.add(id, 1);
    else if ((id = btn.getAttribute("data-inc"))) TIAS.cart.add(id, 1);
    else if ((id = btn.getAttribute("data-dec"))) TIAS.cart.add(id, -1);
    else if ((id = btn.getAttribute("data-remove"))) TIAS.cart.set(id, 0);
  });

  linesEl.addEventListener("input", function (e) {
    var id = e.target.getAttribute("data-note");
    if (id) TIAS.cart.note(id, e.target.value);
  });

  document.addEventListener("tias:cart", function (e) {
    if (e.detail && e.detail.noteOnly) return;
    var f = captureFocus();
    renderActions();
    renderCart();
    restoreFocus(f);
  });

  clubBox.addEventListener("change", function () {
    renderPoints(totals(currentLines()));
  });

  /* ---------- small-screen basket bar ---------- */

  var panelOnScreen = false;
  var lastTotals = null;

  function renderBar(t) {
    lastTotals = t;
    document.getElementById("order-bar-text").textContent =
      t.count + (t.count === 1 ? " item" : " items") + (t.subtotal ? " · " + TIAS.price(t.subtotal) : "");
    bar.hidden = !t.count || panelOnScreen;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      panelOnScreen = entries[0].isIntersecting;
      if (lastTotals) renderBar(lastTotals);
    }).observe(form);
  }

  bar.addEventListener("click", function (e) {
    e.preventDefault();
    cartPanel.scrollIntoView({ block: "start" });
    document.getElementById("cart-heading").focus({ preventScroll: true });
  });

  /* ---------- pick-up times ---------- */

  function toMinutes(hhmm) {
    var p = hhmm.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function hhmm(mins) {
    return String(Math.floor(mins / 60)).padStart(2, "0") + ":" + String(mins % 60).padStart(2, "0");
  }

  function dayLabel(offset, day) {
    if (offset === 0) return "Today";
    if (offset === 1) return "Tomorrow";
    return DAY_NAMES[day];
  }

  // ASAP while open, then every STEP minutes from LEAD after now until
  // STEP before closing. If today is done, the next open day instead.
  function buildSlots() {
    var now = TIAS.storeNow();
    var slots = [];
    var today = C.hours[now.day];
    if (TIAS.openStatus().open && today && now.minutes + LEAD <= toMinutes(today[1])) {
      slots.push({ value: "asap", label: "As soon as possible (about " + LEAD + " min)" });
    }
    for (var offset = 0; offset < 8; offset++) {
      var day = (now.day + offset) % 7;
      var hours = C.hours[day];
      if (!hours) continue;
      var first = toMinutes(hours[0]) + LEAD;
      if (offset === 0) first = Math.max(first, Math.ceil((now.minutes + LEAD) / STEP) * STEP);
      var last = toMinutes(hours[1]) - STEP;
      var added = false;
      for (var m = first; m <= last; m += STEP) {
        added = true;
        slots.push({
          value: TIAS.storeDate(offset) + "T" + hhmm(m),
          label: dayLabel(offset, day) + ", " + TIAS.formatTime(hhmm(m)),
        });
      }
      if (added) break;
    }
    return slots;
  }

  function renderTimes() {
    var previous = timeSelect.value;
    var slots = buildSlots();
    timeSelect.innerHTML =
      '<option value="">Choose a pick-up time</option>' +
      slots
        .map(function (s) {
          return '<option value="' + esc(s.value) + '">' + esc(s.label) + "</option>";
        })
        .join("");
    var stillThere = slots.some(function (s) {
      return s.value === previous;
    });
    if (stillThere) timeSelect.value = previous;
    else if (!previous && slots.length && slots[0].value === "asap") timeSelect.value = "asap";

    var note = document.getElementById("pickup-note");
    var firstTimed = slots.filter(function (s) {
      return s.value !== "asap";
    })[0];
    if (!TIAS.openStatus().open && firstTimed) {
      note.textContent = "We're closed right now. Order ahead for " + firstTimed.label.toLowerCase() + " or later.";
    } else {
      note.textContent = "Ready about " + LEAD + " minutes after we confirm.";
    }
  }

  renderTimes();
  setInterval(renderTimes, 60 * 1000);

  /* ---------- placing the order ---------- */

  function orderNumber() {
    var now = TIAS.storeNow();
    return "TIA-" + hhmm(now.minutes).replace(":", "") + "-" + String(10 + Math.floor(Math.random() * 90));
  }

  var mobile = document.getElementById("order-mobile");
  mobile.addEventListener("input", function () {
    mobile.setCustomValidity("");
  });

  function showErrors(list) {
    errorsEl.innerHTML =
      "<p>Before you place your order:</p><ul>" +
      list.map(function (m) {
        return "<li>" + esc(m) + "</li>";
      }).join("") + "</ul>";
    errorsEl.hidden = false;
    errorsEl.focus();
  }

  function startNewOrder() {
    TIAS.cart.clear();
    form.reset();
    statusEl.hidden = true;
    statusEl.innerHTML = "";
    renderTimes();
    renderCart();
    window.scrollTo(0, 0);
    document.getElementById("main").focus({ preventScroll: true });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var lines = currentLines();
    var problems = [];
    if (!lines.length) problems.push("Add at least one item to your order.");

    var chosen = timeSelect.value;
    if (
      chosen &&
      !buildSlots().some(function (s) {
        return s.value === chosen;
      })
    ) {
      renderTimes();
      problems.push("That pick-up time has passed. Please choose another.");
    }

    var digits = mobile.value.replace(/\D/g, "");
    mobile.setCustomValidity(
      digits.length >= 9 && digits.length <= 12 ? "" : "Please enter a mobile number we can text."
    );

    if (problems.length) {
      showErrors(problems);
      return;
    }
    if (!form.reportValidity()) return;
    errorsEl.hidden = true;

    var name = document.getElementById("order-name").value.trim();
    var phone = mobile.value.trim();
    var notes = document.getElementById("order-notes").value.trim();
    var club = clubBox.checked;
    var slot = timeSelect.options[timeSelect.selectedIndex].textContent;
    var number = orderNumber();
    var t = totals(lines);

    var out = [
      "Pick-up order " + number + ": Tia's Bánh Mì",
      "",
      "Pick-up: " + slot,
      "Name: " + name,
      "Mobile: " + phone,
    ];
    if (club) out.push("Crunch Club: add points to this mobile");
    out.push("");
    lines.forEach(function (l) {
      out.push(l.qty + " × " + l.item.name + "  " + (l.cost != null ? TIAS.price(l.cost) : "price TBC"));
      if (l.note.trim()) out.push("    Note: " + l.note.trim());
    });
    out.push("");
    out.push("Subtotal: " + TIAS.price(t.subtotal) + (t.tbc ? " + items priced in store" : ""));
    out.push("Payment: pay on pick-up");
    if (notes) out.push("", "Order notes: " + notes);

    TIAS.sendForm({
      statusEl: statusEl,
      subject: "Pick-up order " + number + " for " + slot,
      lines: out,
      data: {
        order: number,
        pickup: slot,
        pickupValue: timeSelect.value,
        name: name,
        mobile: phone,
        crunchClub: club,
        items: lines.map(function (l) {
          return { id: l.id, name: l.item.name, qty: l.qty, price: l.item.price, note: l.note.trim() };
        }),
        subtotal: t.subtotal,
        itemsPricedInStore: t.tbc,
        notes: notes,
      },
      smsLabel: "Text my order to Tia's",
      emailLabel: "Email my order to Tia's",
      introHtml:
        "<h3>Last step: send your order to Tia's</h3>" +
        "<p>Order <strong>" + esc(number) + "</strong> for <strong>" + esc(slot) + "</strong>. " +
        "Use a button below to send it. We'll reply to confirm, and you pay when you pick up.</p>",
      successHtml:
        "<h3>Order sent!</h3><p>Order <strong>" + esc(number) + "</strong> for <strong>" + esc(slot) +
        "</strong>. We'll text " + esc(phone) + " to confirm. Pay when you pick up.</p>" +
        '<p><button type="button" class="btn btn-secondary" data-new-order>Start a new order</button></p>',
      onSuccess: function () {
        TIAS.cart.clear();
      },
      onFallback: function () {
        statusEl.insertAdjacentHTML(
          "beforeend",
          '<p class="new-order"><button type="button" class="btn btn-ghost" data-new-order>Sent it? Start a new order</button></p>'
        );
      },
    });
  });

  statusEl.addEventListener("click", function (e) {
    if (e.target.closest("[data-new-order]")) startNewOrder();
  });

  /* ---------- layout: sticky offsets ---------- */

  function setOffsets() {
    var header = document.getElementById("site-header").offsetHeight;
    var toolbar = document.querySelector(".menu-toolbar").offsetHeight;
    var root = document.documentElement.style;
    root.setProperty("--scroll-pad", header + toolbar - 8 + "px");
    root.setProperty("--cart-top", header + toolbar + 16 + "px");
  }
  setOffsets();
  window.addEventListener("resize", setOffsets);

  renderActions();
  renderCart();

  if (location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    if (target) target.scrollIntoView();
  }
})();
