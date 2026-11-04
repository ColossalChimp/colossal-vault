/* Sample shelf used by the drafts. Counts at the top of the app are the
   full-vault figures; these records are the titles you can actually see. */
(function () {
  function item(partial) {
    return partial;
  }

  var ITEMS = [
    item({
      id: "lotus",
      title: "Black Lotus",
      spine: "Lotus",
      short: "LOTUS",
      category: "mtg",
      aisle: "Magic",
      series: "Unlimited",
      meta: "Unlimited · 232",
      mark: "232",
      year: "1993",
      condition: "Played",
      location: "Safe · Power",
      value: 12000,
      valueLabel: "$12,000",
      franchise: "Magic",
      tagsLabel: "Reserved · Power",
      note: "Unlimited. Kept in the safe, not the red binder.",
      finish: "Nonfoil",
      rarity: "Rare",
      confidence: "98%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 20
    }),
    item({
      id: "asm-300",
      title: "Amazing Spider-Man #300",
      spine: "ASM 300",
      short: "ASM",
      category: "comic",
      aisle: "Comics",
      series: "Amazing Spider-Man",
      meta: "Marvel · 300 · 1988",
      mark: "300",
      year: "1988",
      condition: "Very Fine",
      location: "Long box · Marvel",
      value: 850,
      valueLabel: "$850",
      franchise: "Spider-Man",
      tagsLabel: "Key · Venom",
      note: "First full Venom. Newsstand copy.",
      finish: "Newsstand",
      rarity: "Key",
      confidence: "91%",
      guide: "Shelf estimate",
      publisher: "Marvel",
      recent: 8
    }),
    item({
      id: "chrono",
      title: "Chrono Trigger",
      spine: "Chrono",
      short: "CHRONO",
      category: "game",
      aisle: "Games",
      series: "SNES",
      meta: "SNES · 1995",
      mark: "SNES",
      year: "1995",
      condition: "Complete",
      location: "Shelf · Games",
      value: 420,
      valueLabel: "$420",
      franchise: "Chrono",
      tagsLabel: "CIB · Square",
      note: "Box, tray, and manual. Map is a color copy.",
      finish: "CIB",
      rarity: "Complete",
      confidence: "88%",
      guide: "Shelf estimate",
      publisher: "Square",
      recent: 6
    }),
    item({
      id: "hot-toys",
      title: "Hot Toys Batman",
      spine: "Batman 1/6",
      short: "BATMAN",
      category: "figure",
      aisle: "Figures",
      series: "The Dark Knight",
      meta: "Hot Toys · 1/6",
      mark: "1/6",
      year: "2014",
      condition: "Mint",
      location: "Detolf 1",
      value: 310,
      valueLabel: "$310",
      franchise: "Batman",
      tagsLabel: "DX · Sealed shipper",
      note: "Still in the shipper. Cape is the second issue.",
      finish: "Sealed",
      rarity: "DX",
      confidence: "86%",
      guide: "Shelf estimate",
      publisher: "Hot Toys",
      recent: 11
    }),
    item({
      id: "zelda",
      title: "The Legend of Zelda",
      spine: "Zelda",
      short: "ZELDA",
      category: "game",
      aisle: "Games",
      series: "NES",
      meta: "NES · 1987",
      mark: "NES",
      year: "1987",
      condition: "Complete",
      location: "Shelf · Games",
      value: 280,
      valueLabel: "$280",
      franchise: "Zelda",
      tagsLabel: "CIB · Gold cart",
      note: "Gold cartridge. Label has a corner lift.",
      finish: "CIB",
      rarity: "Classic",
      confidence: "93%",
      guide: "Shelf estimate",
      publisher: "Nintendo",
      recent: 14
    }),
    item({
      id: "saga-1",
      title: "Saga #1",
      spine: "Saga 1",
      short: "SAGA",
      category: "comic",
      aisle: "Comics",
      series: "Saga",
      meta: "Image · 1 · 2012",
      mark: "1",
      year: "2012",
      condition: "Near Mint",
      location: "Long box · Image",
      value: 220,
      valueLabel: "$220",
      franchise: "Saga",
      tagsLabel: "First print",
      note: "First printing. No press crease.",
      finish: "Direct",
      rarity: "Key",
      confidence: "90%",
      guide: "Shelf estimate",
      publisher: "Image",
      recent: 3
    }),
    item({
      id: "blade",
      title: "Blade Runner poster",
      spine: "Blade Runner",
      short: "BLADE",
      category: "memo",
      aisle: "Memorabilia",
      series: "One sheet",
      meta: "One sheet · 1982",
      mark: "1982",
      year: "1982",
      condition: "Very Fine",
      location: "Flat file",
      value: 180,
      valueLabel: "$180",
      franchise: "Blade Runner",
      tagsLabel: "Style A",
      note: "Folded one sheet. Linen-backed.",
      finish: "Folded",
      rarity: "Style A",
      confidence: "84%",
      guide: "Shelf estimate",
      publisher: "Warner Bros.",
      recent: 15
    }),
    item({
      id: "joke",
      title: "Batman: The Killing Joke",
      spine: "Killing Joke",
      short: "JOKE",
      category: "comic",
      aisle: "Comics",
      series: "Batman",
      meta: "DC · 1988",
      mark: "1",
      year: "1988",
      condition: "Very Fine",
      location: "Long box · DC",
      value: 140,
      valueLabel: "$140",
      franchise: "Batman",
      tagsLabel: "First print",
      note: "First printing, green title.",
      finish: "Direct",
      rarity: "Key",
      confidence: "89%",
      guide: "Shelf estimate",
      publisher: "DC",
      recent: 12
    }),
    item({
      id: "sandman",
      title: "Sandman #1",
      spine: "Sandman 1",
      short: "SANDMAN",
      category: "comic",
      aisle: "Comics",
      series: "Sandman",
      meta: "DC · 1 · 1989",
      mark: "1",
      year: "1989",
      condition: "Near Mint",
      location: "Long box · DC",
      value: 120,
      valueLabel: "$120",
      franchise: "Sandman",
      tagsLabel: "First print",
      note: "Newsstand, white pages.",
      finish: "Newsstand",
      rarity: "Key",
      confidence: "87%",
      guide: "Shelf estimate",
      publisher: "DC",
      recent: 16
    }),
    item({
      id: "invincible",
      title: "Invincible #1",
      spine: "Invincible",
      short: "INVINCIBLE",
      category: "comic",
      aisle: "Comics",
      series: "Invincible",
      meta: "Image · 1 · 2003",
      mark: "1",
      year: "2003",
      condition: "Near Mint",
      location: "Long box · Image",
      value: 90,
      valueLabel: "$90",
      franchise: "Invincible",
      tagsLabel: "First print",
      note: "First printing, blue title.",
      finish: "Direct",
      rarity: "Key",
      confidence: "85%",
      guide: "Shelf estimate",
      publisher: "Image",
      recent: 17
    }),
    item({
      id: "one-ring",
      title: "The One Ring",
      spine: "One Ring",
      short: "ONE RING",
      category: "mtg",
      aisle: "Magic",
      series: "Tales of Middle-earth",
      meta: "LTR · 001",
      mark: "001",
      year: "2023",
      condition: "Near Mint",
      location: "Binder · Mythic",
      value: 89,
      valueLabel: "$89.00",
      franchise: "Middle-earth",
      tagsLabel: "Legendary · Mythic",
      note: "Showcase frame. Price guide matched the nonfoil printing.",
      finish: "Nonfoil",
      rarity: "Mythic",
      confidence: "94%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 2
    }),
    item({
      id: "pi-5",
      title: "Raspberry Pi 5 8GB",
      spine: "Pi 5",
      short: "PI 5",
      category: "pi",
      aisle: "Pi & gear",
      series: "Pi 5",
      meta: "8GB · board",
      mark: "8GB",
      year: "2023",
      condition: "Mint",
      location: "Pi rack",
      value: 80,
      valueLabel: "$80",
      franchise: "Raspberry Pi",
      tagsLabel: "Board · 8GB",
      note: "In the retail box with the cooler still sealed.",
      finish: "Boxed",
      rarity: "Current",
      confidence: "96%",
      guide: "Shelf estimate",
      publisher: "Raspberry Pi",
      recent: 4
    }),
    item({
      id: "vegeta",
      title: "Vegeta Metallic",
      spine: "Vegeta",
      short: "VEGETA",
      category: "funko",
      aisle: "Funko",
      series: "Dragon Ball Z",
      meta: "Pop · 10 · metallic",
      mark: "10",
      year: "2015",
      condition: "Mint",
      location: "POP wall B",
      value: 64,
      valueLabel: "$64",
      franchise: "Dragon Ball",
      tagsLabel: "Exclusive · Metallic",
      note: "Convention sticker is intact.",
      finish: "Exclusive",
      rarity: "Metallic",
      confidence: "92%",
      guide: "Shelf estimate",
      publisher: "Funko",
      recent: 5
    }),
    item({
      id: "berserk",
      title: "Berserk Vol. 1",
      spine: "Berserk 1",
      short: "BERSERK",
      category: "manga",
      aisle: "Manga",
      series: "Berserk",
      meta: "Dark Horse · Vol. 1",
      mark: "01",
      year: "2003",
      condition: "Near Mint",
      location: "Shelf · Manga",
      value: 55,
      valueLabel: "$55",
      franchise: "Berserk",
      tagsLabel: "First Dark Horse",
      note: "First Dark Horse edition.",
      finish: "Paperback",
      rarity: "Volume",
      confidence: "90%",
      guide: "Shelf estimate",
      publisher: "Dark Horse",
      recent: 9
    }),
    item({
      id: "akira",
      title: "Akira Vol. 1",
      spine: "Akira 1",
      short: "AKIRA",
      category: "manga",
      aisle: "Manga",
      series: "Akira",
      meta: "Kodansha · Vol. 1",
      mark: "01",
      year: "2000",
      condition: "Very Fine",
      location: "Shelf · Manga",
      value: 45,
      valueLabel: "$45",
      franchise: "Akira",
      tagsLabel: "English",
      note: "Paperback, small spine crease.",
      finish: "Paperback",
      rarity: "Volume",
      confidence: "89%",
      guide: "Shelf estimate",
      publisher: "Kodansha",
      recent: 18
    }),
    item({
      id: "funko-spidey",
      title: "Spider-Man",
      spine: "Spidey 01",
      short: "SPIDEY",
      category: "funko",
      aisle: "Funko",
      series: "Marvel",
      meta: "Pop · 01",
      mark: "01",
      year: "2011",
      condition: "Near Mint",
      location: "POP wall A",
      value: 45,
      valueLabel: "$45",
      franchise: "Spider-Man",
      tagsLabel: "Vaulted",
      note: "Window is clean. No exclusive sticker.",
      finish: "Common",
      rarity: "Vaulted",
      confidence: "95%",
      guide: "Shelf estimate",
      publisher: "Funko",
      recent: 7
    }),
    item({
      id: "ragavan",
      title: "Ragavan, Nimble Pilferer",
      spine: "Ragavan",
      short: "RAGAVAN",
      category: "mtg",
      aisle: "Magic",
      series: "Modern Horizons 2",
      meta: "MH2 · 138",
      mark: "138",
      year: "2021",
      condition: "Near Mint",
      location: "Binder · Red",
      value: 42,
      valueLabel: "$42.00",
      franchise: "Magic",
      tagsLabel: "Mythic · Monkey",
      note: "Borderless frame.",
      finish: "Nonfoil",
      rarity: "Mythic",
      confidence: "93%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 10
    }),
    item({
      id: "rhystic",
      title: "Rhystic Study",
      spine: "Rhystic",
      short: "RHYSTIC",
      category: "mtg",
      aisle: "Magic",
      series: "Wilds of Eldraine",
      meta: "WOT · 221",
      mark: "221",
      year: "2023",
      condition: "Near Mint",
      location: "Binder · Commander",
      value: 40,
      valueLabel: "$40.00",
      franchise: "Magic",
      tagsLabel: "Enchantment",
      note: "Enchantment frame, nonfoil.",
      finish: "Nonfoil",
      rarity: "Rare",
      confidence: "90%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 13
    }),
    item({
      id: "grogu",
      title: "Grogu",
      spine: "Grogu",
      short: "GROGU",
      category: "funko",
      aisle: "Funko",
      series: "The Mandalorian",
      meta: "Pop · 465",
      mark: "465",
      year: "2021",
      condition: "Mint",
      location: "POP wall A",
      value: 18,
      valueLabel: "$18",
      franchise: "Star Wars",
      tagsLabel: "Commons",
      note: "In the protector.",
      finish: "Common",
      rarity: "Common",
      confidence: "97%",
      guide: "Shelf estimate",
      publisher: "Funko",
      recent: 1
    }),
    item({
      id: "xmen",
      title: "X-Men #1",
      spine: "X-Men 1",
      short: "X-MEN",
      category: "comic",
      aisle: "Comics",
      series: "X-Men",
      meta: "Marvel · 1 · 1991",
      mark: "1",
      year: "1991",
      condition: "Near Mint",
      location: "Long box · Marvel",
      value: 8,
      valueLabel: "$8",
      franchise: "X-Men",
      tagsLabel: "Jim Lee · Gatefold",
      note: "Gatefold cover, still folded.",
      finish: "Direct",
      rarity: "Common key",
      confidence: "96%",
      guide: "Shelf estimate",
      publisher: "Marvel",
      recent: 19
    }),
    item({
      id: "sol-ring",
      title: "Sol Ring",
      spine: "Sol Ring",
      short: "SOL RING",
      category: "mtg",
      aisle: "Magic",
      series: "Commander Masters",
      meta: "CMM · 410 · foil",
      mark: "410",
      year: "2023",
      condition: "Near Mint",
      location: "Binder · Commander",
      value: 7.5,
      valueLabel: "$7.50",
      franchise: "Magic",
      tagsLabel: "Foil · Rocks",
      note: "Foil etching. Price guide used the foil column.",
      finish: "Foil",
      rarity: "Uncommon",
      confidence: "95%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 4
    }),
    item({
      id: "bolt",
      title: "Lightning Bolt",
      spine: "Bolt",
      short: "BOLT",
      category: "mtg",
      aisle: "Magic",
      series: "Double Masters 2022",
      meta: "2X2 · 117",
      mark: "117",
      year: "2022",
      condition: "Near Mint",
      location: "Binder · Red",
      value: 1.8,
      valueLabel: "$1.80",
      franchise: "Magic",
      tagsLabel: "Reprint",
      note: "Borderless reprint.",
      finish: "Nonfoil",
      rarity: "Common",
      confidence: "99%",
      guide: "Price guide · Scryfall",
      publisher: "Wizards of the Coast",
      recent: 21
    })
  ];

  var MAP = {};
  ITEMS.forEach(function (entry) {
    MAP[entry.id] = entry;
  });

  var MAGIC_SPINES = [
    "Black Lotus", "Mox Pearl", "Mox Sapphire", "Mox Jet", "Mox Ruby", "Mox Emerald",
    "Time Walk", "Ancestral Recall", "Timetwister", "Sol Ring", "Mana Crypt", "Jeweled Lotus",
    "The One Ring", "Ragavan", "Fable of the Mirror-Breaker", "Sheoldred", "Orcish Bowmasters",
    "Delighted Halfling", "Force of Will", "Force of Negation", "Mana Drain", "Rhystic Study",
    "Smothering Tithe", "Cyclonic Rift", "Dockside Extortionist", "Deflecting Swat",
    "Fierce Guardianship", "Deadly Rollick", "Flusterstorm", "Pact of Negation", "Grim Monolith",
    "Mox Diamond", "Chrome Mox", "Lion's Eye Diamond", "Gaea's Cradle", "Ancient Tomb",
    "City of Traitors", "Wasteland", "Mishra's Workshop", "Bazaar of Baghdad", "Underground Sea",
    "Volcanic Island", "Tropical Island", "Tundra", "Badlands", "Bayou", "Scrubland", "Plateau",
    "Savannah", "Lightning Bolt", "Counterspell", "Swords to Plowshares", "Thoughtseize", "Fatal Push", "Birds of Paradise", "Esper Sentinel"
  ];

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function svgWrap(inner) {
    return (
      '<svg viewBox="0 0 160 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">' +
      inner +
      "</svg>"
    );
  }

  function plate(line, y, size) {
    return (
      '<text x="12" y="' + y + '" fill="var(--ink)" font-family="Bebas Neue, Impact, sans-serif" font-size="' +
      size +
      '">' +
      esc(line) +
      "</text>"
    );
  }

  function coverArt(entry) {
    var mark = esc(entry.mark || "");
    var short = esc(entry.short || entry.title);
    var cat = entry.category;
    var inner = "";

    if (cat === "comic") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<polygon points="80,8 96,58 150,58 106,90 124,146 80,112 36,146 54,90 10,58 64,58" fill="var(--cat)" opacity="0.9"/>' +
        '<text x="80" y="168" text-anchor="middle" fill="var(--ink)" font-family="Bebas Neue, Impact, sans-serif" font-size="54">' +
        mark +
        "</text>" +
        plate(short, 198, 18);
    } else if (cat === "mtg") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<rect x="10" y="10" width="140" height="190" rx="8" fill="none" stroke="var(--cat)" stroke-width="3"/>' +
        '<rect x="18" y="18" width="124" height="96" rx="4" fill="var(--panel)"/>' +
        '<circle cx="80" cy="66" r="28" fill="var(--gold)"/>' +
        '<circle cx="80" cy="66" r="14" fill="var(--accent)"/>' +
        '<rect x="18" y="122" width="124" height="28" fill="var(--cat)"/>' +
        '<text x="80" y="142" text-anchor="middle" fill="var(--on-accent)" font-family="Bebas Neue, Impact, sans-serif" font-size="16">' +
        short +
        "</text>" +
        '<text x="80" y="184" text-anchor="middle" fill="var(--ink)" font-family="IBM Plex Mono, monospace" font-size="16">' +
        mark +
        "</text>";
    } else if (cat === "funko") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<rect x="28" y="16" width="104" height="150" rx="6" fill="var(--panel)" stroke="var(--cat)" stroke-width="3"/>' +
        '<rect x="40" y="28" width="80" height="78" rx="4" fill="var(--soft)"/>' +
        '<circle cx="80" cy="64" r="24" fill="var(--cat)"/>' +
        '<circle cx="71" cy="60" r="3" fill="var(--bg)"/><circle cx="89" cy="60" r="3" fill="var(--bg)"/>' +
        '<rect x="96" y="122" width="42" height="26" rx="3" transform="rotate(-8 117 135)" fill="var(--gold)"/>' +
        '<text x="112" y="142" text-anchor="middle" fill="var(--on-gold)" font-family="Bebas Neue, Impact, sans-serif" font-size="14">' +
        mark +
        "</text>" +
        plate(short, 196, 20);
    } else if (cat === "game") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<rect x="38" y="18" width="84" height="150" rx="10" fill="var(--panel)" stroke="var(--cat)" stroke-width="3"/>' +
        '<rect x="48" y="32" width="64" height="46" rx="4" fill="var(--gold)"/>' +
        '<text x="80" y="62" text-anchor="middle" fill="var(--on-gold)" font-family="Bebas Neue, Impact, sans-serif" font-size="18">' +
        mark +
        "</text>" +
        '<rect x="58" y="132" width="44" height="10" rx="2" fill="var(--cat)"/>' +
        plate(short, 198, 18);
    } else if (cat === "manga") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<rect x="18" y="0" width="36" height="210" fill="var(--cat)"/>' +
        '<text x="36" y="110" text-anchor="middle" fill="var(--on-accent)" font-family="Bebas Neue, Impact, sans-serif" font-size="22" transform="rotate(-90 36 110)">VOL ' +
        mark +
        "</text>" +
        plate(short, 80, 32) +
        '<rect x="70" y="100" width="70" height="6" fill="var(--gold)"/>' +
        '<rect x="70" y="116" width="50" height="6" fill="var(--neon)"/>';
    } else if (cat === "figure") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<polygon points="80,8 150,150 10,150" fill="var(--gold)" opacity="0.35"/>' +
        '<circle cx="80" cy="78" r="18" fill="var(--ink)"/>' +
        '<path d="M80 98 L108 150 H52 Z" fill="var(--cat)"/>' +
        '<ellipse cx="80" cy="168" rx="46" ry="10" fill="var(--panel)" stroke="var(--line)"/>' +
        plate(short, 200, 18);
    } else if (cat === "memo") {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<polygon points="0,0 160,0 160,70 0,120" fill="var(--accent)" opacity="0.85"/>' +
        '<polygon points="0,90 160,40 160,210 0,210" fill="var(--panel)"/>' +
        '<text x="16" y="150" fill="var(--gold)" font-family="Bebas Neue, Impact, sans-serif" font-size="28">' +
        short +
        "</text>" +
        '<text x="16" y="178" fill="var(--ink)" font-family="Oswald, sans-serif" font-size="14">' +
        mark +
        "</text>";
    } else {
      inner =
        '<rect width="160" height="210" fill="var(--bg)"/>' +
        '<rect x="22" y="28" width="116" height="78" rx="8" fill="var(--panel)" stroke="var(--neon)" stroke-width="3"/>' +
        '<g fill="var(--gold)">' +
        '<circle cx="40" cy="48" r="3"/><circle cx="56" cy="48" r="3"/><circle cx="72" cy="48" r="3"/><circle cx="88" cy="48" r="3"/>' +
        '<circle cx="40" cy="64" r="3"/><circle cx="56" cy="64" r="3"/><circle cx="72" cy="64" r="3"/><circle cx="88" cy="64" r="3"/>' +
        "</g>" +
        '<rect x="96" y="70" width="28" height="22" rx="2" fill="var(--cat)"/>' +
        plate(short, 150, 28) +
        '<text x="22" y="182" fill="var(--muted)" font-family="IBM Plex Mono, monospace" font-size="14">' +
        mark +
        "</text>";
    }

    return svgWrap(inner);
  }

  function fillCovers(root) {
    (root || document).querySelectorAll("[data-cover]").forEach(function (el) {
      var entry = MAP[el.dataset.cover];
      if (entry) el.innerHTML = coverArt(entry);
    });
  }

  function mountDetail() {
    var root = document.querySelector("[data-detail]");
    if (!root) return;
    var requested = new URLSearchParams(location.search).get("id");
    var entry = MAP[requested] || MAP[root.dataset.detail];
    if (!entry) return;
    root.dataset.detail = entry.id;
    root.querySelectorAll("[data-bind]").forEach(function (el) {
      var key = el.dataset.bind;
      if (entry[key] != null) el.textContent = entry[key];
    });
    root.querySelectorAll("[data-cover]").forEach(function (el) {
      el.dataset.cover = entry.id;
    });
    root.querySelectorAll("[data-cat-bind]").forEach(function (el) {
      el.setAttribute("data-cat", entry.category);
    });
  }

  mountDetail();
  fillCovers(document);

  window.REWIND = {
    items: ITEMS,
    byId: MAP,
    spines: MAGIC_SPINES,
    coverArt: coverArt,
    fillCovers: fillCovers
  };
})();
