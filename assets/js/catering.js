(function () {
  "use strict";

  var C = window.TIAS_CONFIG;
  var D = window.TIAS_DATA;
  var K = D.catering;
  var TIAS = window.TIAS;

  var form = document.getElementById("catering-form");
  var boxesEl = document.getElementById("catering-boxes");
  var status = document.getElementById("catering-status");

  /* ---------- static content ---------- */

  document.getElementById("share-packs").innerHTML = K.sharePacks
    .map(function (p) {
      return (
        '<article class="card pack">' +
        TIAS.media({ id: p.id, name: p.name }, null, "pack-media") +
        '<div class="pack-top"><h3>' + TIAS.esc(p.name) + "</h3>" +
        '<span class="price">' + TIAS.money(p.price) + "</span></div>" +
        '<p class="serves">Serves ' + TIAS.esc(p.serves) + "</p>" +
        "<ul class=\"ticks\">" + p.includes.map(function (i) {
          return "<li>" + TIAS.esc(i) + "</li>";
        }).join("") + "</ul>" +
        '<div class="pack-actions">' +
        '<button type="button" class="btn btn-primary btn-sm" data-pack-add="' + TIAS.esc(p.id) + '">' +
        'Add to order<span class="sr-only"> ' + TIAS.esc(p.name) + "</span></button>" +
        '<span class="pack-status" data-pack-status="' + TIAS.esc(p.id) + '" aria-live="polite"></span>' +
        "</div></article>"
      );
    })
    .join("");

  // Share packs go straight into the pick-up order.
  function renderPackStatus() {
    document.querySelectorAll("[data-pack-status]").forEach(function (el) {
      var qty = TIAS.cart.qty(el.getAttribute("data-pack-status"));
      el.innerHTML = qty ? qty + ' in your order · <a href="order.html#cart-panel">View order</a>' : "";
    });
  }
  document.getElementById("share-packs").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-pack-add]");
    if (btn) TIAS.cart.add(btn.getAttribute("data-pack-add"), 1);
  });
  document.addEventListener("tias:cart", renderPackStatus);
  renderPackStatus();

  boxesEl.innerHTML = K.boxes
    .map(function (b) {
      var serves = b.perPerson ? "Per person · min " + b.min : "Serves " + b.serves[0] + "–" + b.serves[1];
      var price = TIAS.money(b.price) + (b.perPerson ? ' <small>each</small>' : "");
      return (
        '<article class="card box' + (b.popular ? " box-popular" : "") + '">' +
        (b.popular ? '<span class="badge">Most popular</span>' : "") +
        TIAS.media({ id: b.id, name: b.name }, null, "pack-media") +
        '<div class="pack-top"><h3 id="box-' + b.id + '">' + TIAS.esc(b.name) + "</h3>" +
        '<span class="price">' + price + "</span></div>" +
        '<p class="serves">' + serves + "</p>" +
        '<ul class="ticks">' + b.includes.map(function (i) {
          return "<li>" + TIAS.esc(i) + "</li>";
        }).join("") + "</ul>" +
        '<div class="stepper" role="group" aria-labelledby="box-' + b.id + '">' +
        '<button type="button" data-step="-1" data-box="' + b.id + '" aria-label="One fewer ' + TIAS.esc(b.name) + '">−</button>' +
        '<input type="number" inputmode="numeric" min="0" max="60" value="0" data-qty="' + b.id + '" aria-label="' + TIAS.esc(b.name) + ' quantity">' +
        '<button type="button" data-step="1" data-box="' + b.id + '" aria-label="One more ' + TIAS.esc(b.name) + '">+</button>' +
        "</div></article>"
      );
    })
    .join("");

  var rules = [
    "Order before " + TIAS.formatTime(K.cutoffHour + ":00") + " for next-day catering, or up to " + K.maxDaysAhead + " days ahead.",
    "Need it today? Grab share packs in store or online, no notice needed.",
    "Your order is booked once we call or text to confirm it.",
    "Delivery is " + TIAS.money(K.deliveryFee) + " within about " + K.deliveryRadiusKm + " km of Cavill Lane (" +
      K.deliveryAreas.join(", ") + "), with a " + TIAS.money(K.deliveryMinimum) + " minimum order.",
    "Pick-up from Cavill Lane is free.",
    "Tell us about vegetarian guests and allergies in the notes and we'll adjust the fillings.",
  ];
  document.getElementById("delivery-label").textContent =
    TIAS.money(K.deliveryFee) + " within " + K.deliveryRadiusKm + " km";

  document.getElementById("catering-rules").innerHTML = rules
    .map(function (r) {
      return "<li>" + TIAS.esc(r) + "</li>";
    })
    .join("");

  /* ---------- quantities & summary ---------- */

  function box(id) {
    for (var i = 0; i < K.boxes.length; i++) if (K.boxes[i].id === id) return K.boxes[i];
    return null;
  }

  function qtyInput(id) {
    return boxesEl.querySelector('[data-qty="' + id + '"]');
  }

  function getQty(id) {
    var n = parseInt(qtyInput(id).value, 10);
    return isNaN(n) || n < 0 ? 0 : Math.min(n, 60);
  }

  function setQty(id, n) {
    qtyInput(id).value = Math.max(0, Math.min(60, n));
  }

  function fulfilment() {
    var checked = form.querySelector('input[name="fulfilment"]:checked');
    return checked ? checked.value : "pickup";
  }

  function totals() {
    var lines = [];
    var subtotal = 0;
    var feedsMin = 0;
    var feedsMax = 0;
    K.boxes.forEach(function (b) {
      var q = getQty(b.id);
      if (!q) return;
      var cost = q * b.price;
      subtotal += cost;
      feedsMin += q * b.serves[0];
      feedsMax += q * b.serves[1];
      lines.push({ box: b, qty: q, cost: cost });
    });
    var delivery = fulfilment() === "delivery" && subtotal > 0 ? K.deliveryFee : 0;
    return {
      lines: lines,
      subtotal: subtotal,
      delivery: delivery,
      total: subtotal + delivery,
      feedsMin: feedsMin,
      feedsMax: feedsMax,
    };
  }

  function guests() {
    var n = parseInt(document.getElementById("guests").value, 10);
    return isNaN(n) || n < 1 ? 0 : n;
  }

  function warnings(t) {
    var list = [];
    var lunches = getQty("boxed-lunch");
    var lunchBox = box("boxed-lunch");
    if (lunchBox && lunches > 0 && lunches < lunchBox.min) {
      list.push("Boxed lunches have a minimum of " + lunchBox.min + ".");
    }
    if (fulfilment() === "delivery" && t.subtotal > 0 && t.subtotal < K.deliveryMinimum) {
      list.push(
        "Delivery needs a " + TIAS.money(K.deliveryMinimum) + " minimum order. Add " +
        TIAS.money(K.deliveryMinimum - t.subtotal) + " more or choose pick-up."
      );
    }
    var g = guests();
    if (g && t.subtotal > 0 && t.feedsMax < g) {
      list.push("This feeds about " + t.feedsMin + "–" + t.feedsMax + " people, but you've said " + g + " guests.");
    }
    return list;
  }

  function renderSummary() {
    var t = totals();
    var linesEl = document.getElementById("order-lines");
    if (!t.lines.length) {
      linesEl.innerHTML = '<li class="muted">No boxes yet. Add some, or tell us your guest numbers and tap Suggest.</li>';
    } else {
      linesEl.innerHTML = t.lines
        .map(function (l) {
          return (
            "<li><span>" + l.qty + " × " + TIAS.esc(l.box.name) + "</span><span>" + TIAS.money(l.cost) + "</span></li>"
          );
        })
        .join("");
    }
    document.getElementById("order-subtotal").textContent = TIAS.money(t.subtotal);
    document.getElementById("order-delivery").textContent =
      fulfilment() === "delivery" ? TIAS.money(t.delivery) : "Free pick-up";
    document.getElementById("order-total").textContent = TIAS.money(t.total);
    document.getElementById("order-feeds").textContent = t.subtotal
      ? "Feeds about " + t.feedsMin + "–" + t.feedsMax + " people"
      : "";
    var w = warnings(t);
    var wEl = document.getElementById("order-warnings");
    wEl.innerHTML = w
      .map(function (m) {
        return "<li>" + TIAS.esc(m) + "</li>";
      })
      .join("");
    wEl.hidden = !w.length;
    updateMobileBar(t);
    document.getElementById("address-field").hidden = fulfilment() !== "delivery";
    document.getElementById("address").required = fulfilment() === "delivery";
  }

  // Small-screen running total, hidden while the summary itself is on screen.
  var mobileBar = document.getElementById("mobile-total");
  var summaryEl = document.getElementById("order-summary");
  var summaryOnScreen = false;
  var lastTotals = null;

  function updateMobileBar(t) {
    lastTotals = t;
    var boxes = t.lines.reduce(function (n, l) {
      return n + l.qty;
    }, 0);
    document.getElementById("mobile-total-text").textContent =
      boxes + (boxes === 1 ? " item · " : " items · ") + TIAS.money(t.total);
    mobileBar.hidden = !boxes || summaryOnScreen;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      summaryOnScreen = entries[0].isIntersecting;
      if (lastTotals) updateMobileBar(lastTotals);
    }).observe(summaryEl);
  }

  mobileBar.addEventListener("click", function () {
    setTimeout(function () {
      summaryEl.focus({ preventScroll: true });
    }, 0);
  });

  boxesEl.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-step]");
    if (!btn) return;
    var id = btn.getAttribute("data-box");
    var b = box(id);
    var step = parseInt(btn.getAttribute("data-step"), 10);
    var q = getQty(id);
    var next = q + step;
    // Boxed lunches jump straight to (or from) the minimum.
    if (b.min) {
      if (step > 0 && q < b.min) next = b.min;
      if (step < 0 && q <= b.min) next = 0;
    }
    setQty(id, next);
    renderSummary();
  });

  boxesEl.addEventListener("input", renderSummary);
  boxesEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.matches("[data-qty]")) e.preventDefault();
  });
  form.addEventListener("change", renderSummary);
  document.getElementById("guests").addEventListener("input", renderSummary);

  // Fill boxes for a guest count: big boxes first, a smaller one to top up.
  document.getElementById("suggest").addEventListener("click", function () {
    var g = guests();
    var guestsInput = document.getElementById("guests");
    if (!g) {
      guestsInput.focus();
      guestsInput.reportValidity();
      return;
    }
    var snacks = document.getElementById("style").value === "snacks";
    var bigId = snacks ? "street-food" : "best-of";
    var smallId = snacks ? "rice-paper" : "mini-banh-mi";
    var big = box(bigId);
    var small = box(smallId);
    var q = {};
    K.boxes.forEach(function (b) {
      q[b.id] = 0;
    });
    var covered = 0;
    while (covered < g) {
      if (g - covered > small.serves[1]) {
        q[bigId]++;
        covered += big.serves[1];
      } else {
        q[smallId]++;
        covered += small.serves[1];
      }
    }
    Object.keys(q).forEach(function (id) {
      setQty(id, q[id]);
    });
    renderSummary();
    document.getElementById("order-summary").focus();
  });

  /* ---------- date & time ---------- */

  var dateInput = document.getElementById("date");
  var timeSelect = document.getElementById("time");

  function earliestOffset() {
    return TIAS.storeNow().minutes < K.cutoffHour * 60 ? 1 : 2;
  }

  dateInput.min = TIAS.storeDate(earliestOffset());
  dateInput.max = TIAS.storeDate(K.maxDaysAhead);

  function weekdayOf(dateStr) {
    return new Date(dateStr + "T12:00:00Z").getUTCDay();
  }

  function fillTimes() {
    var day = dateInput.value ? weekdayOf(dateInput.value) : 1;
    var hours = C.hours[day];
    var previous = timeSelect.value;
    timeSelect.innerHTML = '<option value="">Choose a time</option>';
    if (!hours) return;
    var p = function (s) {
      var parts = s.split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };
    // From 30 minutes after opening until 30 minutes before closing.
    for (var m = p(hours[0]) + 30; m <= p(hours[1]) - 30; m += 30) {
      var hhmm = String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
      var opt = document.createElement("option");
      opt.value = hhmm;
      opt.textContent = TIAS.formatTime(hhmm);
      if (hhmm === previous) opt.selected = true;
      timeSelect.appendChild(opt);
    }
  }

  dateInput.addEventListener("change", function () {
    dateInput.setCustomValidity("");
    if (dateInput.value && !C.hours[weekdayOf(dateInput.value)]) {
      dateInput.setCustomValidity("Sorry, we're closed that day. Please choose another date.");
    }
    fillTimes();
  });
  fillTimes();

  function prettyDate(dateStr) {
    return new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-AU", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  /* ---------- submit ---------- */

  var phone = document.getElementById("phone");
  phone.addEventListener("input", function () {
    phone.setCustomValidity("");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var t = totals();
    var digits = phone.value.replace(/\D/g, "");
    phone.setCustomValidity(digits.length >= 9 && digits.length <= 12 ? "" : "Please enter a phone number we can call or text.");

    if (!form.reportValidity()) return;

    var problems = warnings(t).filter(function (w) {
      return w.indexOf("but you've said") === -1; // guest mismatch is only a heads-up
    });
    if (!t.lines.length) problems.unshift("Add at least one catering box.");
    var errEl = document.getElementById("form-errors");
    if (problems.length) {
      errEl.innerHTML = "<p>Before you send:</p><ul>" + problems.map(function (p) {
        return "<li>" + TIAS.esc(p) + "</li>";
      }).join("") + "</ul>";
      errEl.hidden = false;
      errEl.focus();
      return;
    }
    errEl.hidden = true;

    var v = function (id) {
      return document.getElementById(id).value.trim();
    };
    var isDelivery = fulfilment() === "delivery";
    var lines = [
      "Catering request: Tia's Bánh Mì",
      "",
      "Name: " + v("name"),
      "Phone: " + v("phone"),
    ];
    if (v("email")) lines.push("Email: " + v("email"));
    if (v("company")) lines.push("Company: " + v("company"));
    lines.push("Date: " + prettyDate(v("date")) + ", " + TIAS.formatTime(v("time")));
    lines.push(isDelivery ? "Delivery to: " + v("address") : "Pick-up from Cavill Lane");
    if (guests()) lines.push("Guests: " + guests());
    lines.push("", "Order:");
    t.lines.forEach(function (l) {
      lines.push("  " + l.qty + " × " + l.box.name + "  " + TIAS.money(l.cost));
    });
    lines.push("Subtotal: " + TIAS.money(t.subtotal));
    if (isDelivery) lines.push("Delivery: " + TIAS.money(t.delivery));
    lines.push("Estimated total: " + TIAS.money(t.total));
    if (v("notes")) lines.push("", "Notes: " + v("notes"));

    TIAS.sendForm({
      statusEl: status,
      subject: "Catering request for " + prettyDate(v("date")),
      lines: lines,
      data: {
        name: v("name"),
        phone: v("phone"),
        email: v("email"),
        company: v("company"),
        date: v("date"),
        time: v("time"),
        fulfilment: fulfilment(),
        address: isDelivery ? v("address") : "",
        guests: guests(),
        total: t.total,
        notes: v("notes"),
      },
      introHtml:
        "<h3>Last step: send us your request</h3>" +
        "<p>Send these details to us and we'll call or text to confirm your order and take payment. " +
        "Your order isn't booked until we confirm it.</p>",
      successHtml:
        "<h3>Request sent</h3><p>Thanks, " + TIAS.esc(v("name").split(" ")[0]) +
        ". We'll call or text you on " + TIAS.esc(v("phone")) +
        " to confirm. Your order isn't booked until we do.</p>",
      onSuccess: function () {
        form.reset();
        renderSummary();
      },
    });
  });

  renderSummary();
})();
