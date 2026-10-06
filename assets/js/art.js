/*
 * Food illustrations, drawn as inline SVG so they always display (no image
 * files to load). TIAS_ART.for(key, name) picks one by category or dish id,
 * falling back on words in the name.
 *
 * To use real photos instead, add image: "assets/img/your-photo.jpg" to a
 * dish in data.js. The illustration is shown if the photo can't load.
 */
(function () {
  "use strict";

  var BG = '<circle cx="60" cy="60" r="56" fill="#F6E3C3"/>';

  function svg(inner) {
    return (
      '<svg class="art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + BG + inner + "</svg>"
    );
  }

  var bowl =
    '<path d="M16 60 H104 C104 86 86 100 60 100 C34 100 16 86 16 60Z" fill="#FFFDF8" stroke="#E8DCC8" stroke-width="2"/>' +
    '<path d="M22 72 H98" stroke="#C2372B" stroke-width="3"/>' +
    '<path d="M48 100 h24 l-3 6 h-18z" fill="#E8DCC8"/>';

  var chopsticks =
    '<path d="M72 14 L98 54" stroke="#8A5A2B" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M82 12 L102 52" stroke="#A9733B" stroke-width="4" stroke-linecap="round"/>';

  var herbs =
    '<circle cx="36" cy="56" r="4" fill="#4F9A3F"/><circle cx="42" cy="53" r="3" fill="#3E8B3A"/>' +
    '<circle cx="80" cy="55" r="4" fill="#4F9A3F"/><circle cx="74" cy="52" r="3" fill="#3E8B3A"/>';

  var ART = {
    "banh-mi": svg(
      '<g transform="rotate(-16 60 66)">' +
        '<rect x="12" y="62" width="96" height="20" rx="10" fill="#C47A27"/>' +
        '<rect x="14" y="56" width="92" height="10" rx="5" fill="#4F9A3F"/>' +
        '<rect x="20" y="60" width="30" height="6" rx="3" fill="#F28C28"/>' +
        '<rect x="62" y="59" width="28" height="6" rx="3" fill="#F28C28"/>' +
        '<rect x="30" y="64" width="60" height="5" rx="2.5" fill="#B4573E"/>' +
        '<circle cx="56" cy="60" r="4" fill="#D8352A"/><circle cx="56" cy="60" r="1.8" fill="#F7E3C0"/>' +
        '<path d="M12 58 C12 38 34 32 60 32 C86 32 108 38 108 58 Z" fill="#E6A24A"/>' +
        '<path d="M32 46 l11 -6 M53 42 l11 -6 M74 44 l11 -6" stroke="#FADFA6" stroke-width="4.5" stroke-linecap="round"/>' +
        "</g>"
    ),

    "street-food": svg(
      '<g transform="rotate(-24 50 58)">' +
        '<rect x="18" y="40" width="64" height="17" rx="8.5" fill="#D98E35"/>' +
        '<path d="M30 42v13M42 42v13M54 42v13M66 42v13" stroke="#B9701F" stroke-width="2"/>' +
        "</g>" +
        '<g transform="rotate(-8 52 72)">' +
        '<rect x="20" y="62" width="64" height="17" rx="8.5" fill="#E3A048"/>' +
        '<path d="M32 64v13M44 64v13M56 64v13M68 64v13" stroke="#C47A27" stroke-width="2"/>' +
        "</g>" +
        '<ellipse cx="88" cy="88" rx="18" ry="8" fill="#C2372B"/>' +
        '<ellipse cx="88" cy="86" rx="14" ry="5" fill="#F28C28"/>' +
        '<circle cx="84" cy="85" r="1.5" fill="#D8352A"/><circle cx="92" cy="86" r="1.5" fill="#D8352A"/>'
    ),

    "rice-paper": svg(
      '<g transform="rotate(-20 60 60)">' +
        '<rect x="20" y="44" width="80" height="30" rx="15" fill="#FFF8EC" stroke="#E8DCC8" stroke-width="2"/>' +
        '<ellipse cx="44" cy="58" rx="9" ry="5" fill="#F0907A"/>' +
        '<ellipse cx="64" cy="57" rx="9" ry="5" fill="#F0907A"/>' +
        '<path d="M30 54 q8 -6 16 0 t16 0 t16 0 t14 0" stroke="#6FAE4F" stroke-width="4" fill="none" opacity="0.8"/>' +
        '<path d="M28 64 H92" stroke="#F4F1E8" stroke-width="5" opacity="0.9"/>' +
        "</g>" +
        '<ellipse cx="88" cy="92" rx="16" ry="7" fill="#C2372B"/>' +
        '<ellipse cx="88" cy="90" rx="12" ry="4.5" fill="#8A4A2B"/>'
    ),

    pho: svg(
      chopsticks +
        bowl +
        '<ellipse cx="60" cy="60" rx="44" ry="11" fill="#E9B562"/>' +
        '<path d="M28 60 q8 -6 16 0 t16 0 t16 0 t16 0" stroke="#FFF6E0" stroke-width="3" fill="none"/>' +
        '<ellipse cx="50" cy="57" rx="9" ry="3.5" fill="#9E4B35"/>' +
        '<ellipse cx="70" cy="58" rx="9" ry="3.5" fill="#8C3F2C"/>' +
        herbs +
        '<circle cx="60" cy="54" r="3" fill="#D8352A"/>'
    ),

    "noodle-soup": svg(
      chopsticks +
        bowl +
        '<ellipse cx="60" cy="60" rx="44" ry="11" fill="#D8552F"/>' +
        '<path d="M28 60 q8 -6 16 0 t16 0 t16 0 t16 0" stroke="#FFF1DE" stroke-width="3.5" fill="none"/>' +
        '<ellipse cx="48" cy="57" rx="8" ry="3.5" fill="#8C3F2C"/>' +
        '<circle cx="70" cy="56" r="4" fill="#F2C14E"/><circle cx="76" cy="60" r="2" fill="#F7D774"/>' +
        '<circle cx="38" cy="62" r="2" fill="#F7D774"/>' +
        herbs
    ),

    vermicelli: svg(
      bowl +
        '<ellipse cx="60" cy="60" rx="44" ry="11" fill="#FFFDF8"/>' +
        '<path d="M26 58 q6 -10 12 0 t12 0 t12 0 t12 0 t12 0 t12 0" stroke="#EDE6D6" stroke-width="4" fill="none"/>' +
        '<path d="M30 52 q8 -8 18 -2" stroke="#4F9A3F" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<rect x="52" y="44" width="16" height="9" rx="3" fill="#B4573E" transform="rotate(-10 60 48)"/>' +
        '<rect x="66" y="47" width="16" height="9" rx="3" fill="#9E4B35" transform="rotate(8 74 51)"/>' +
        '<rect x="80" y="52" width="10" height="4" rx="2" fill="#F28C28"/>' +
        '<circle cx="44" cy="58" r="2.5" fill="#D8352A"/>'
    ),

    curry: svg(
      '<g transform="rotate(30 92 40)"><rect x="70" y="30" width="44" height="16" rx="8" fill="#E6A24A"/>' +
        '<path d="M80 34 l6 6 M92 34 l6 6" stroke="#FADFA6" stroke-width="3" stroke-linecap="round"/></g>' +
        bowl +
        '<ellipse cx="60" cy="60" rx="44" ry="11" fill="#E39B2D"/>' +
        '<rect x="40" y="53" width="10" height="9" rx="2" fill="#F6D58E"/>' +
        '<rect x="62" y="55" width="11" height="9" rx="2" fill="#F6D58E"/>' +
        '<ellipse cx="54" cy="61" rx="7" ry="3" fill="#B4573E"/>' +
        '<circle cx="78" cy="58" r="3" fill="#4F9A3F"/><circle cx="34" cy="60" r="2.5" fill="#4F9A3F"/>'
    ),

    rice: svg(
      '<ellipse cx="60" cy="78" rx="48" ry="18" fill="#FFFDF8" stroke="#E8DCC8" stroke-width="2"/>' +
        '<path d="M26 74 C26 54 50 46 62 46 C74 46 82 56 82 74 Z" fill="#FFFFFF" stroke="#EDE6D6" stroke-width="2"/>' +
        '<path d="M38 62h4M48 56h4M58 60h4M46 68h4M66 66h4M56 52h4" stroke="#E8E0CF" stroke-width="2" stroke-linecap="round"/>' +
        '<rect x="70" y="62" width="26" height="10" rx="4" fill="#B4573E" transform="rotate(-12 83 67)"/>' +
        '<rect x="74" y="72" width="24" height="9" rx="4" fill="#9E4B35" transform="rotate(6 86 76)"/>' +
        '<circle cx="34" cy="82" r="5" fill="#6FAE4F"/><circle cx="34" cy="82" r="2.5" fill="#CFE8B0"/>' +
        '<circle cx="46" cy="86" r="5" fill="#D8352A"/>'
    ),

    sides: svg(
      '<path d="M30 62 H90 C90 82 78 92 60 92 C42 92 30 82 30 62Z" fill="#FFFDF8" stroke="#E8DCC8" stroke-width="2"/>' +
        '<path d="M32 62 C32 48 46 40 60 40 C74 40 88 48 88 62 Z" fill="#FFFFFF" stroke="#EDE6D6" stroke-width="2"/>' +
        '<path d="M46 52h4M56 47h4M66 52h4M52 57h4M62 58h4" stroke="#E8E0CF" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M36 70 H84" stroke="#C2372B" stroke-width="3"/>'
    ),

    drinks: svg(
      '<path d="M40 26 H80 L74 98 C74 102 70 104 60 104 C50 104 46 102 46 98 Z" fill="#FFFFFF" stroke="#E8DCC8" stroke-width="2"/>' +
        '<path d="M43 52 H77 L74 98 C74 102 70 104 60 104 C50 104 46 102 46 98 Z" fill="#7A4A2A"/>' +
        '<path d="M46 86 H74 L74 98 C74 102 70 104 60 104 C50 104 46 102 46 98 Z" fill="#F4E3C1"/>' +
        '<rect x="48" y="56" width="11" height="11" rx="2" fill="#FFFFFF" opacity="0.55" transform="rotate(12 53 61)"/>' +
        '<rect x="62" y="64" width="10" height="10" rx="2" fill="#FFFFFF" opacity="0.5" transform="rotate(-10 67 69)"/>' +
        '<path d="M66 12 L62 40" stroke="#C2372B" stroke-width="5" stroke-linecap="round"/>'
    ),

    juice: svg(
      '<path d="M40 30 H80 L74 98 C74 102 70 104 60 104 C50 104 46 102 46 98 Z" fill="#FFFFFF" stroke="#E8DCC8" stroke-width="2"/>' +
        '<path d="M42 46 H78 L74 98 C74 102 70 104 60 104 C50 104 46 102 46 98 Z" fill="#F5A23A"/>' +
        '<circle cx="80" cy="34" r="12" fill="#6FAE4F"/><circle cx="80" cy="34" r="9" fill="#CFE8B0"/>' +
        '<path d="M80 25v18M71 34h18" stroke="#6FAE4F" stroke-width="1.5"/>' +
        '<path d="M56 14 L58 44" stroke="#2E6A3E" stroke-width="5" stroke-linecap="round"/>'
    ),

    blend: svg(
      '<path d="M38 40 H82 L76 98 C76 102 72 104 60 104 C48 104 44 102 44 98 Z" fill="#E86A8A"/>' +
        '<path d="M34 40 C34 28 46 22 60 22 C74 22 86 28 86 40 Z" fill="#FFF3F5" stroke="#F3C6D0" stroke-width="2"/>' +
        '<rect x="32" y="38" width="56" height="6" rx="3" fill="#FFFDF8" stroke="#E8DCC8" stroke-width="1.5"/>' +
        '<path d="M66 8 L62 30" stroke="#C2372B" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="52" cy="66" r="3" fill="#FFFFFF" opacity="0.5"/><circle cx="66" cy="78" r="2.5" fill="#FFFFFF" opacity="0.5"/>'
    ),

    "share-packs": svg(
      '<path d="M24 52 H96 L90 98 H30 Z" fill="#D9B07A"/>' +
        '<path d="M24 52 H96 L92 62 H28 Z" fill="#C79A60"/>' +
        '<path d="M44 52 C44 36 76 36 76 52" stroke="#8A5A2B" stroke-width="4" fill="none"/>' +
        '<g transform="rotate(-20 60 46)"><rect x="34" y="40" width="54" height="13" rx="6.5" fill="#E6A24A"/>' +
        '<rect x="36" y="49" width="50" height="5" rx="2.5" fill="#4F9A3F"/></g>' +
        '<circle cx="60" cy="78" r="9" fill="#C2372B"/>' +
        '<g transform="rotate(-30 60 78)"><rect x="53" y="75" width="14" height="6" rx="3" fill="#E9A445"/></g>'
    ),
  };

  // Which illustration suits each catering box / share pack.
  var ALIASES = {
    "mini-banh-mi": "banh-mi",
    "banh-mi-share": "banh-mi",
    "street-food-share": "street-food",
    "family-rice": "rice",
    "boxed-lunch": "rice",
    "best-of": "share-packs",
    "rice-paper-roll": "rice-paper",
    "spring-rolls": "street-food",
  };

  var KEYWORDS = [
    [/blend|smoothie|sinh t/i, "blend"],
    [/juice|press|sugar ?cane/i, "juice"],
    [/coffee|drink|beverage|tea\b|cà phê|ca phe|soda|milk/i, "drinks"],
    [/rice paper|gỏi cuốn|goi cuon|summer roll|fresh roll/i, "rice-paper"],
    [/spring roll|chả giò|cha gio|dim sum|wing/i, "street-food"],
    [/banh mi|bánh mì|roll|baguette/i, "banh-mi"],
    [/phở|pho\b/i, "pho"],
    [/curry|cà ri|ca ri/i, "curry"],
    [/vermicelli|bún|bun\b|salad/i, "vermicelli"],
    [/soup|súp|hu tieu|hủ tiếu|mì|bun bo/i, "noodle-soup"],
    [/rice|cơm|com\b/i, "rice"],
    [/tofu|street|snack/i, "street-food"],
    [/pack|share|box|platter/i, "share-packs"],
    [/side|extra/i, "sides"],
  ];

  window.TIAS_ART = {
    for: function (key, name) {
      if (key && ART[key]) return ART[key];
      if (key && ALIASES[key]) return ART[ALIASES[key]];
      var text = (name || "") + " " + (key || "");
      for (var i = 0; i < KEYWORDS.length; i++) {
        if (KEYWORDS[i][0].test(text)) return ART[KEYWORDS[i][1]];
      }
      return ART.pho;
    },
    // A dish uses its category's picture unless the dish clearly needs its
    // own (rice paper rolls, spring rolls, juice vs coffee...).
    forDish: function (item, cat) {
      if (ART[item.id]) return ART[item.id];
      if (ALIASES[item.id]) return ART[ALIASES[item.id]];
      var n = item.name || "";
      if (/rice paper|gỏi cuốn|goi cuon/i.test(n)) return ART["rice-paper"];
      if (/spring roll|chả giò|cha gio/i.test(n)) return ART["street-food"];
      if (cat && /drink|beverage|coffee|juice|blend/i.test(cat.id + " " + cat.name)) {
        if (/blend|smoothie|sinh tố/i.test(n)) return ART.blend;
        if (/juice|press|sugar ?cane|nước mía/i.test(n)) return ART.juice;
        return ART.drinks;
      }
      return cat ? this.for(cat.id, cat.name) : this.for(null, n);
    },
    keys: Object.keys(ART),
  };
})();
