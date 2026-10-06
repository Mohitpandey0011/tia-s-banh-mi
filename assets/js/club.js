(function () {
  "use strict";

  var D = window.TIAS_DATA;
  var K = D.club;
  var TIAS = window.TIAS;

  var classic = K.rewards.filter(function (r) {
    return r.name === "Classic Pork Roll";
  })[0];

  /* ---------- rewards, tiers, top-ups ---------- */

  document.getElementById("club-rewards").innerHTML = K.rewards
    .map(function (r) {
      return (
        '<li class="reward"><span class="reward-points">' + TIAS.number(r.points) +
        ' <small>pts</small></span><span class="reward-name">' + TIAS.esc(r.name) + "</span></li>"
      );
    })
    .join("");

  document.getElementById("club-tiers").innerHTML = K.tiers
    .map(function (t, i) {
      var reach = t.threshold
        ? "Earn " + TIAS.number(t.threshold) + " points in 12 months"
        : "Where everyone starts";
      return (
        '<article class="tier tier-' + t.id + '">' +
        '<p class="tier-step">Level ' + (i + 1) + "</p>" +
        "<h3>" + TIAS.esc(t.name) + "</h3>" +
        '<p class="tier-reach">' + reach + "</p>" +
        '<ul class="ticks">' + t.perks.map(function (p) {
          return "<li>" + TIAS.esc(p) + "</li>";
        }).join("") + "</ul></article>"
      );
    })
    .join("");

  document.getElementById("club-topups").innerHTML = K.topUps
    .map(function (t) {
      return (
        '<div class="topup"><span class="topup-pay">Pay ' + TIAS.money(t.pay) + "</span>" +
        '<span class="topup-get">Get ' + TIAS.money(t.get) + "</span>" +
        '<span class="topup-bonus">+' + TIAS.money(t.get - t.pay) + " bonus</span></div>"
      );
    })
    .join("");

  /* ---------- example member progress ---------- */

  var examplePoints = 1020;
  var progress = document.getElementById("example-progress");
  progress.max = classic.points;
  progress.value = examplePoints;
  document.getElementById("example-points").textContent = TIAS.number(examplePoints);
  document.getElementById("example-to-go").textContent =
    TIAS.number(classic.points - examplePoints) + " points to a free Classic Pork Roll";

  /* ---------- calculator ---------- */

  var visits = document.getElementById("calc-visits");
  var visitsOut = document.getElementById("calc-visits-out");
  var spend = document.getElementById("calc-spend");
  var results = document.getElementById("calc-results");

  // Walk through a year of visits, moving up tiers as points build.
  function simulate(perWeek, amount) {
    var tiers = K.tiers;
    var points = 0;
    var tier = tiers[0];
    var reachedWeek = {};
    var total = perWeek * 52;
    for (var v = 1; v <= total; v++) {
      points += amount * tier.rate;
      for (var i = 1; i < tiers.length; i++) {
        if (points >= tiers[i].threshold && !reachedWeek[tiers[i].id]) {
          reachedWeek[tiers[i].id] = Math.ceil(v / perWeek);
        }
        if (points >= tiers[i].threshold) tier = tiers[i];
      }
    }
    return { points: points, tier: tier, reachedWeek: reachedWeek, yearSpend: amount * total };
  }

  function renderCalc() {
    var perWeek = parseInt(visits.value, 10);
    var amount = parseFloat(spend.value);
    visitsOut.textContent = perWeek + (perWeek === 1 ? " visit" : " visits") + " a week";
    if (isNaN(amount) || amount <= 0) {
      results.innerHTML = '<p class="muted">Enter how much you usually spend.</p>';
      return;
    }
    var r = simulate(perWeek, amount);
    var credit = r.points / K.pointsPerCreditDollar;
    var freeRolls = Math.floor(r.points / classic.points);
    var tierNote = K.tiers
      .slice(1)
      .filter(function (t) {
        return r.reachedWeek[t.id];
      })
      .map(function (t) {
        return t.name + " by week " + r.reachedWeek[t.id];
      });

    results.innerHTML =
      '<div class="stat"><span class="stat-value">' + TIAS.number(r.points) + '</span><span class="stat-label">points a year</span></div>' +
      '<div class="stat"><span class="stat-value">' + TIAS.money(Math.floor(credit)) + '</span><span class="stat-label">in free food</span></div>' +
      '<div class="stat"><span class="stat-value">' + freeRolls + '</span><span class="stat-label">free Classic Pork Rolls</span></div>' +
      '<p class="calc-note">Spending about ' + TIAS.money(Math.round(r.yearSpend)) + " a year. " +
      (tierNote.length ? "You'd reach " + tierNote.join(" and ") + ". " : "") +
      "Doesn't include Tuesday double points or welcome offers.</p>";
  }

  visits.addEventListener("input", renderCalc);
  spend.addEventListener("input", renderCalc);
  renderCalc();

  /* ---------- join form ---------- */

  var form = document.getElementById("join-form");
  var mobile = document.getElementById("join-mobile");
  mobile.addEventListener("input", function () {
    mobile.setCustomValidity("");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var digits = mobile.value.replace(/\D/g, "");
    mobile.setCustomValidity(digits.length >= 9 && digits.length <= 12 ? "" : "Please enter your mobile number.");
    if (!form.reportValidity()) return;

    var v = function (id) {
      return document.getElementById(id).value.trim();
    };
    var marketing = document.getElementById("join-marketing").checked;
    var lines = [
      "Crunch Club sign-up: Tia's Bánh Mì",
      "",
      "Name: " + v("join-name"),
      "Mobile: " + v("join-mobile"),
    ];
    if (v("join-email")) lines.push("Email: " + v("join-email"));
    if (v("join-birthday")) lines.push("Birthday month: " + v("join-birthday"));
    lines.push("Offers by SMS/email: " + (marketing ? "Yes" : "No"));

    TIAS.sendForm({
      statusEl: document.getElementById("join-status"),
      subject: "Crunch Club sign-up: " + v("join-name"),
      lines: lines,
      data: {
        name: v("join-name"),
        mobile: v("join-mobile"),
        email: v("join-email"),
        birthdayMonth: v("join-birthday"),
        marketing: marketing,
      },
      introHtml:
        "<h3>One more step</h3><p>Send these details to us and we'll set up your Crunch Club account. " +
        "Your free Vietnamese iced coffee will be waiting.</p>",
      successHtml:
        "<h3>Welcome to the Crunch Club!</h3><p>Give your mobile number when you pay to start earning. " +
        "Your free Vietnamese iced coffee is ready on your next visit.</p>",
      onSuccess: function () {
        form.reset();
      },
    });
  });
})();
