/*
 * Business details used on every page.
 * Change contact details, opening hours or links here and the whole site
 * updates.
 */
window.TIAS_CONFIG = {
  name: "Tia's Bánh Mì",

  // Every "Order now" button opens the ordering page on this site.
  orderUrl: "order.html",

  // Pick-up ordering: earliest pick-up is this many minutes from now, and
  // pick-up times are offered in steps of this many minutes.
  pickupLeadMinutes: 15,
  pickupStepMinutes: 15,

  phoneDisplay: "0449 797 339",
  phoneIntl: "+61449797339",

  // Add an email address to let the catering and Crunch Club forms open the
  // customer's email app with their details filled in. Leave empty to offer
  // "text it to us" and "call us" instead.
  email: "",

  address: {
    street: "Shop G29a, Cavill Lane",
    street2: "3113 Surfers Paradise Blvd",
    suburb: "Surfers Paradise",
    state: "QLD",
    postcode: "4217",
  },
  mapsQuery:
    "Tia's Banh Mi, Cavill Lane, 3113 Surfers Paradise Blvd, Surfers Paradise QLD 4217",

  // Queensland has no daylight saving, so this never shifts.
  timeZone: "Australia/Brisbane",

  // Opening hours in 24-hour time. 0 = Sunday, 6 = Saturday.
  // Use null for a day you're closed.
  hours: {
    0: ["08:00", "21:00"],
    1: ["08:00", "21:00"],
    2: ["08:00", "21:00"],
    3: ["08:00", "21:00"],
    4: ["08:00", "21:00"],
    5: ["08:00", "21:00"],
    6: ["08:00", "21:00"],
  },

  // Paste full profile URLs to show social icons in the footer.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
  },

  // Optional: a form service URL that accepts JSON POSTs (Formspree, Basin,
  // Getform...). When set, pick-up orders, catering requests and Crunch Club
  // sign-ups are sent there instead of using the email/text fallback.
  formEndpoint: "",

  // Shows a thin "preview" strip at the top and marks dishes that still
  // need checking. Set to false before going live.
  showPreviewBanner: true,
};
