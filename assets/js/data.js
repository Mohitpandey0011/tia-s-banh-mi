/*
 * Site content: menu, promotions, catering, Crunch Club and FAQs.
 *
 * Menu prices: a number shows that price, null shows "Price on order".
 * draft: true marks dishes guessed from the category names on the online
 * store. They're flagged on the site while showPreviewBanner is on, so they
 * can be checked against the real menu.
 *
 * Tags: "popular", "v" (vegetarian), "spicy".
 */
window.TIAS_DATA = {
  menu: [
    {
      id: "banh-mi",
      name: "Bánh Mì",
      blurb: "Crusty Vietnamese rolls, baked crunchy and filled fresh to order.",
      items: [
        {
          id: "classic-pork-roll",
          name: "Classic Pork Roll",
          vn: "Bánh Mì Thịt",
          desc: "Seasoned pork, crispy crackling, pickled vegetables, fresh herbs and chilli in a crusty roll.",
          price: 13.5,
          tags: ["popular"],
          featured: true,
        },
        {
          id: "bbq-pork",
          name: "BBQ Pork",
          vn: "Bánh Mì Xá Xíu",
          desc: "Smoky marinated BBQ pork with pickled vegetables, fresh herbs and chilli in a crispy Vietnamese roll.",
          price: 14.5,
          tags: ["popular"],
          featured: true,
        },
        {
          id: "lemongrass-chicken",
          name: "Lemongrass Chicken",
          vn: "Bánh Mì Gà Sả",
          desc: "Lemongrass-marinated chicken with pickled vegetables, fresh herbs and chilli.",
          price: 14.5,
          tags: [],
          featured: true,
        },
        {
          id: "lemongrass-beef",
          name: "Lemongrass Beef",
          vn: "Bánh Mì Bò Sả",
          desc: "Lemongrass-marinated beef with pickled vegetables, fresh herbs and chilli.",
          price: 14.5, // inferred from the other fillings; confirm
          tags: [],
        },
        {
          id: "crispy-pork",
          name: "Crispy Pork",
          vn: "Bánh Mì Heo Quay",
          desc: "Crispy roast pork belly with crackling, pickled vegetables, fresh herbs and chilli.",
          price: 14.5, // inferred; confirm
          tags: [],
          featured: true,
        },
        {
          id: "pork-meatballs",
          name: "Pork Meatballs",
          vn: "Bánh Mì Xíu Mại",
          desc: "Juicy pork meatballs with pickled vegetables, fresh herbs and chilli in a crispy Vietnamese roll.",
          price: 14.5, // inferred; confirm
          tags: [],
        },
        {
          id: "bbq-prawn",
          name: "BBQ Prawn",
          vn: "Bánh Mì Tôm Nướng",
          desc: "Grilled prawns with pickled vegetables, fresh herbs and chilli.",
          price: 14.5, // inferred; confirm
          tags: [],
        },
        {
          id: "tuna",
          name: "Tuna",
          vn: "Bánh Mì Cá Ngừ",
          desc: "Tuna with pickled vegetables, fresh herbs and chilli.",
          price: 14.5,
          tags: [],
        },
        {
          id: "avocado-salad",
          name: "Avocado & Salad",
          vn: "Bánh Mì Bơ",
          desc: "Fresh avocado with pickled vegetables, cucumber, herbs and chilli.",
          price: null,
          tags: ["v"],
        },
        {
          id: "tofu-salad",
          name: "Tofu & Salad",
          vn: "Bánh Mì Đậu Hũ",
          desc: "Golden tofu with pickled vegetables, cucumber, herbs and chilli.",
          price: null,
          tags: ["v"],
        },
      ],
    },
    {
      id: "street-food",
      name: "Street Food",
      blurb: "Small bites to share, or keep to yourself.",
      items: [
        {
          id: "chicken-soup",
          name: "Chicken Soup",
          vn: "Súp Gà",
          desc: "A light, comforting Vietnamese-style chicken soup.",
          price: null,
          tags: [],
        },
        {
          id: "pork-dim-sum",
          name: "Steamed Pork Dim Sum (5 pcs)",
          vn: "",
          desc: "Five steamed pork dumplings.",
          price: null,
          tags: [],
        },
        {
          id: "spring-rolls",
          name: "Fried Spring Rolls (4 pcs)",
          vn: "Chả Giò",
          desc: "Golden, crackly spring rolls with dipping sauce.",
          price: null,
          tags: ["popular"],
        },
        {
          id: "rice-paper-roll",
          name: "Rice Paper Roll",
          vn: "Gỏi Cuốn",
          desc: "Cold rice paper roll with lettuce, bean sprouts, carrot, mint and vermicelli noodles.",
          price: null,
          tags: [],
        },
        {
          id: "chicken-wings",
          name: "Vietnamese-Style Chicken Wings",
          vn: "Cánh Gà Chiên",
          desc: "Crispy fried wings with a sticky Vietnamese glaze.",
          price: null,
          tags: [],
        },
        {
          id: "crispy-tofu",
          name: "Crispy Tofu with Sweet Chilli (6 pcs)",
          vn: "Đậu Hũ Chiên",
          desc: "Six pieces of crispy fried tofu with sweet chilli sauce.",
          price: null,
          tags: ["v"],
        },
      ],
    },
    {
      id: "pho",
      name: "Phở",
      blurb: "Slow-simmered broth, silky rice noodles and a pile of fresh herbs.",
      items: [
        {
          id: "beef-pho",
          name: "Beef Phở",
          vn: "Phở Bò",
          desc: "Beef broth with rice noodles and sliced beef. Bean sprouts, herbs, lime and chilli on the side.",
          price: null,
          tags: ["popular"],
          draft: true,
        },
        {
          id: "chicken-pho",
          name: "Chicken Phở",
          vn: "Phở Gà",
          desc: "Clear chicken broth with rice noodles and shredded chicken. Herbs, lime and chilli on the side.",
          price: null,
          tags: [],
          draft: true,
        },
      ],
    },
    {
      id: "noodle-soup",
      name: "Noodle Soup",
      blurb: "Big-flavour noodle bowls beyond phở.",
      items: [
        {
          id: "bun-bo-hue",
          name: "Spicy Beef Noodle Soup",
          vn: "Bún Bò Huế",
          desc: "Lemongrass and chilli beef broth with thick rice noodles and sliced beef.",
          price: null,
          tags: ["spicy"],
          draft: true,
        },
      ],
    },
    {
      id: "vermicelli",
      name: "Vermicelli & Salad",
      blurb: "Bún: cool rice noodles, grilled meats, herbs and nước chấm.",
      items: [
        {
          id: "lemongrass-chicken-vermicelli",
          name: "Lemongrass Chicken Vermicelli",
          vn: "Bún Gà Sả",
          desc: "Lemongrass chicken over vermicelli with salad, herbs, pickles and fish sauce dressing.",
          price: null,
          tags: [],
          draft: true,
        },
        {
          id: "bbq-pork-vermicelli",
          name: "BBQ Pork Vermicelli",
          vn: "Bún Thịt Nướng",
          desc: "BBQ pork over vermicelli with salad, herbs, pickles and fish sauce dressing.",
          price: null,
          tags: [],
          draft: true,
        },
      ],
    },
    {
      id: "curry",
      name: "Vietnamese Curry",
      blurb: "Cà ri: fragrant, coconut-rich and made for dunking bread.",
      items: [
        {
          id: "chicken-curry",
          name: "Vietnamese Chicken Curry",
          vn: "Cà Ri Gà",
          desc: "Lemongrass and coconut curry with chicken and potato, served with a crusty roll or rice.",
          price: null,
          tags: [],
          draft: true,
        },
      ],
    },
    {
      id: "rice",
      name: "Rice Dishes",
      blurb: "Cơm: marinated meats on steamed rice with fresh salad.",
      items: [
        {
          id: "lemongrass-beef-rice",
          name: "Lemongrass Beef & Rice",
          vn: "Cơm Bò Sả",
          desc: "Lemongrass beef with steamed rice and salad.",
          price: null,
          tags: [],
        },
        {
          id: "lemongrass-chicken-rice",
          name: "Lemongrass Chicken & Rice",
          vn: "Cơm Gà Sả",
          desc: "Lemongrass chicken with steamed rice and salad.",
          price: null,
          tags: ["popular"],
        },
        {
          id: "bbq-pork-rice",
          name: "BBQ Pork & Rice",
          vn: "Cơm Xá Xíu",
          desc: "BBQ pork with steamed rice and salad.",
          price: null,
          tags: [],
        },
        {
          id: "crispy-pork-belly-rice",
          name: "Crispy Pork Belly & Rice",
          vn: "Cơm Heo Quay",
          desc: "Crispy pork belly with crackling, steamed rice and salad.",
          price: null,
          tags: [],
        },
      ],
    },
    {
      id: "sides",
      name: "Sides & Extras",
      blurb: "Add a little more.",
      items: [
        {
          id: "steamed-rice",
          name: "Steamed Rice",
          vn: "Cơm Trắng",
          desc: "A side of steamed jasmine rice.",
          price: null,
          tags: ["v"],
          draft: true,
        },
        {
          id: "extra-meat",
          name: "Extra Meat",
          vn: "",
          desc: "Double up the filling in any bánh mì or bowl.",
          price: null,
          tags: [],
          draft: true,
        },
      ],
    },
    {
      id: "drinks",
      name: "Drinks",
      blurb: "Vietnamese coffee, fresh-pressed juice and blends.",
      items: [
        {
          id: "vn-iced-coffee",
          name: "Vietnamese Iced Coffee",
          vn: "Cà Phê Sữa Đá",
          desc: "Strong drip coffee over sweet condensed milk and ice.",
          price: null,
          tags: ["popular"],
          draft: true,
        },
        {
          id: "vn-hot-coffee",
          name: "Vietnamese Hot Coffee",
          vn: "Cà Phê Sữa Nóng",
          desc: "Strong drip coffee with sweet condensed milk.",
          price: null,
          tags: [],
          draft: true,
        },
        {
          id: "fresh-juice",
          name: "Cold Fresh-Pressed Juice",
          vn: "",
          desc: "Pressed to order. Ask for today's flavours.",
          price: null,
          tags: ["v"],
          draft: true,
        },
        {
          id: "fruit-blend",
          name: "Fruit Blend",
          vn: "Sinh Tố",
          desc: "Fresh fruit blended with ice.",
          price: null,
          tags: ["v"],
          draft: true,
        },
      ],
    },
  ],

  /*
   * Promotions. Each one gets its own linkable card on promotions.html
   * (promotions.html#<id>). The first three also show on the home page.
   * cta.href: "order" means the online store.
   */
  promotions: [
    {
      id: "crunch-combo",
      title: "Crunch Combo",
      hook: "Make any bánh mì a meal for $7",
      art: "+$7",
      tone: "chilli",
      details:
        "Add 2 fried spring rolls and a Vietnamese iced coffee or soft drink to any bánh mì for $7.",
      when: "Every day",
      yes: ["In store", "Order online"],
      no: ["Uber Eats and other delivery apps"],
      terms: [
        "One combo per bánh mì.",
        "Swap the coffee for any can of soft drink at no extra cost.",
        "Can't be combined with other offers.",
      ],
      cta: { label: "Order now", href: "order" },
    },
    {
      id: "early-bird",
      title: "Early Bird Coffee",
      hook: "$3 Vietnamese coffee with any bánh mì before 10am",
      art: "$3",
      tone: "crust",
      details:
        "Order a bánh mì between 8am and 10am and add a hot or iced Vietnamese coffee for $3.",
      when: "Daily, 8am to 10am",
      yes: ["In store", "Order online"],
      no: ["Delivery apps"],
      terms: [
        "Based on the time your order is placed.",
        "One coffee per bánh mì.",
      ],
      cta: { label: "Order now", href: "order" },
    },
    {
      id: "catering-bonus",
      title: "Catering Bonus",
      hook: "Spend $300 on catering, get $30 to spend on yourself",
      art: "$30",
      tone: "herb",
      details:
        "Place a catering order of $300 or more and we'll add $30 of Crunch Club credit to your account for next time.",
      when: "Ongoing",
      yes: ["Catering orders"],
      no: [],
      terms: [
        "You need to be a Crunch Club member. Joining is free.",
        "Credit is added once your order has been collected or delivered.",
        "Credit expires 3 months after it's added.",
      ],
      cta: { label: "Plan your catering", href: "catering.html" },
    },
    {
      id: "club-welcome",
      title: "Free Coffee When You Join",
      hook: "Your first Vietnamese iced coffee is on us",
      art: "Free",
      tone: "ink",
      details:
        "Join the Crunch Club for free and get a Vietnamese iced coffee on your next visit.",
      when: "Ongoing",
      yes: ["In store"],
      no: [],
      terms: ["One per member.", "Use it within 30 days of joining."],
      cta: { label: "Join the Crunch Club", href: "club.html#join" },
    },
  ],

  /*
   * Catering. Share packs need no notice; catering boxes are next-day.
   * Box prices are suggestions for the owner to set.
   */
  catering: {
    cutoffHour: 14, // order before 2pm for next-day
    maxDaysAhead: 30,
    deliveryFee: 10,
    deliveryMinimum: 120,
    deliveryRadiusKm: 5,
    deliveryAreas: ["Surfers Paradise", "Main Beach", "Broadbeach", "Bundall", "Southport"],
    sharePacks: [
      {
        id: "banh-mi-share",
        name: "Bánh Mì Share Pack",
        serves: "4",
        price: 68,
        includes: ["4 bánh mì of your choice", "8 fried spring rolls"],
      },
      {
        id: "street-food-share",
        name: "Street Food Share Pack",
        serves: "4–6",
        price: 65,
        includes: [
          "8 fried spring rolls",
          "10 steamed pork dim sum",
          "8 Vietnamese-style chicken wings",
          "12 pieces crispy tofu",
        ],
      },
      {
        id: "family-rice",
        name: "Family Rice Pack",
        serves: "4",
        price: 99,
        includes: ["4 rice dishes of your choice", "8 fried spring rolls", "4 drinks"],
      },
    ],
    boxes: [
      {
        id: "best-of",
        name: "Tia's Best Of Box",
        serves: [10, 12],
        price: 165,
        popular: true,
        includes: [
          "12 mini bánh mì (half rolls)",
          "10 rice paper rolls",
          "12 fried spring rolls",
          "12 chicken wings",
        ],
      },
      {
        id: "mini-banh-mi",
        name: "Mini Bánh Mì Box",
        serves: [8, 10],
        price: 120,
        includes: [
          "20 mini bánh mì (half rolls)",
          "Mix of Classic Pork, BBQ Pork, Lemongrass Chicken and Tofu",
        ],
      },
      {
        id: "rice-paper",
        name: "Rice Paper Roll Box",
        serves: [8, 10],
        price: 110,
        includes: ["20 rice paper rolls", "Dipping sauces"],
      },
      {
        id: "street-food",
        name: "Street Food Box",
        serves: [10, 12],
        price: 130,
        includes: [
          "16 fried spring rolls",
          "15 steamed pork dim sum",
          "16 chicken wings",
          "18 pieces crispy tofu",
        ],
      },
      {
        id: "boxed-lunch",
        name: "Boxed Lunches",
        serves: [1, 1],
        price: 20,
        perPerson: true,
        min: 8,
        includes: [
          "One rice dish per person, boxed and labelled",
          "Choose fillings for each box in the notes",
          "Minimum 8 boxes",
        ],
      },
    ],
  },

  /*
   * Crunch Club. 10 points per $1, 100 points = $1 of credit.
   * Tier status is based on points earned in the last 12 months.
   */
  club: {
    name: "Crunch Club",
    pointsPerDollar: 10,
    pointsPerCreditDollar: 100,
    expiryMonths: 12,
    tiers: [
      {
        id: "fresh",
        name: "Fresh",
        threshold: 0,
        rate: 10,
        perks: [
          "10 points for every $1",
          "Free Vietnamese iced coffee when you join",
          "Member-only offers",
        ],
      },
      {
        id: "crispy",
        name: "Crispy",
        threshold: 1500,
        rate: 10,
        perks: [
          "Everything in Fresh",
          "Double points on Tuesdays",
          "A free bánh mì in your birthday month",
        ],
      },
      {
        id: "golden",
        name: "Golden",
        threshold: 4000,
        rate: 12,
        perks: [
          "Everything in Crispy",
          "12 points for every $1",
          "Free drink upgrade on every visit",
          "First taste of new specials",
        ],
      },
    ],
    rewards: [
      { name: "Vietnamese Iced Coffee", points: 600 },
      { name: "Fried Spring Rolls (4 pcs)", points: 800 },
      { name: "Classic Pork Roll", points: 1350 },
      { name: "Any Bánh Mì", points: 1450 },
      { name: "Any Rice Dish", points: 2200 },
    ],
    topUps: [
      { pay: 50, get: 55 },
      { pay: 100, get: 115 },
    ],
  },

  /*
   * FAQs. Each question gets its own link: faq.html#<id>.
   * group: ordering | catering | club | food
   */
  faqs: [
    {
      id: "how-to-order-online",
      group: "ordering",
      q: "How do I order online?",
      a: "Tap Order now on any page to open our online store. Choose your food, pay, and we'll have it ready for you on Cavill Lane.",
    },
    {
      id: "online-vs-delivery-prices",
      group: "ordering",
      q: "Why are prices higher on delivery apps?",
      a: "Delivery apps set their own prices and fees. Ordering direct, in store or through our online store, is always the best price.",
    },
    {
      id: "where-to-pick-up",
      group: "ordering",
      q: "Where do I pick up my order?",
      a: "Shop G29a, Cavill Lane, 3113 Surfers Paradise Blvd. We're a short walk from the Cavill Avenue G:link station.",
    },
    {
      id: "catering-notice",
      group: "catering",
      q: "How much notice do you need for catering?",
      a: "Share packs need no notice. Order them online or in store. For catering boxes, order before 2pm for the next day, or up to 30 days ahead.",
    },
    {
      id: "catering-delivery",
      group: "catering",
      q: "Do you deliver catering?",
      a: "Yes, within about 5 km of Cavill Lane, including Surfers Paradise, Main Beach, Broadbeach, Bundall and Southport. Delivery is $10 with a $120 minimum order. Pick-up is free.",
    },
    {
      id: "catering-confirmed",
      group: "catering",
      q: "When is my catering order confirmed?",
      a: "Your request isn't booked until we call or text to confirm it. If you haven't heard from us by the end of the day, please give us a call.",
    },
    {
      id: "catering-dietary",
      group: "catering",
      q: "Can you cater for vegetarians and allergies?",
      a: "Yes. Tell us how many vegetarian guests you have and about any allergies in the notes, and we'll adjust the fillings.",
    },
    {
      id: "club-how-to-earn",
      group: "club",
      q: "How do I earn Crunch Club points?",
      a: "Join for free, then give your mobile number when you pay. You earn 10 points for every $1, and 100 points is worth $1 off.",
    },
    {
      id: "club-points-expiry",
      group: "club",
      q: "Do my points expire?",
      a: "Your points stay as long as you visit at least once every 12 months. If your account has no purchases for 12 months, the points expire.",
    },
    {
      id: "club-tiers",
      group: "club",
      q: "How do Crispy and Golden tiers work?",
      a: "Earn 1,500 points in 12 months to reach Crispy, or 4,000 points to reach Golden. Your tier is checked each month against the last 12 months.",
    },
    {
      id: "club-top-up",
      group: "club",
      q: "What is a top-up?",
      a: "Pay ahead and we add bonus credit: pay $50 and get $55 to spend, or pay $100 and get $115. Top-up credit doesn't expire while your account is active.",
    },
    {
      id: "vegetarian-options",
      group: "food",
      q: "Do you have vegetarian options?",
      a: "Yes: the Avocado & Salad and Tofu & Salad bánh mì, crispy tofu, and more. Look for the Vegetarian tag on the menu.",
    },
    {
      id: "allergies",
      group: "food",
      q: "I have an allergy. What should I do?",
      a: "Please tell us before you order. Our kitchen handles many common allergens, so we can't guarantee any dish is allergen-free, but we'll talk you through the options.",
    },
  ],

  faqGroups: {
    ordering: "Ordering",
    catering: "Catering",
    club: "Crunch Club",
    food: "Food & allergies",
  },
};
