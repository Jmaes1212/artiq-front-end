const siteConfig = {
  bannerMessages: [
    "Free UK delivery on orders over £75",
    "New: Spring colour stories just dropped",
    "Save 10% when you join the Artiq Insider"
  ],
  navigation: {
    category: {
      label: "Category",
      links: [
        "Abstract",
        "Architecture",
        "Botanical",
        "Cityscapes",
        "Coastal",
        "Figurative",
        "Landscapes",
        "Minimalist",
        "Photography",
        "Pop Art",
        "Typography",
        "Vintage"
      ]
    },
    style: {
      label: "Style",
      links: [
        "Contemporary",
        "Eclectic",
        "Mid-century",
        "Modern Farmhouse",
        "Scandinavian",
        "Traditional"
      ]
    },
    room: {
      label: "Room",
      links: [
        "Living Room",
        "Bedroom",
        "Kitchen",
        "Office",
        "Hallway",
        "Kids"
      ]
    },
    price: {
      label: "Price",
      links: [
        "Under £25",
        "£25 - £50",
        "£50 - £100",
        "£100 - £150",
        "£150 - £200",
        "Over £200"
      ]
    }
  },
  categories: {
    main: [
      { key: "abstract", title: "Abstract", description: "Soft gradients and bold shapes", image: "abstract" },
      { key: "landscapes", title: "Landscapes", description: "Scenes from around the world", image: "landscapes" },
      { key: "photography", title: "Photography", description: "Captured moments", image: "photography" },
      { key: "botanical", title: "Botanical", description: "Flourishing flora", image: "botanical" },
      { key: "architecture", title: "Architecture", description: "Structural marvels", image: "architecture" },
      { key: "coastal", title: "Coastal", description: "Ocean inspired", image: "coastal" },
      { key: "figurative", title: "Figurative", description: "Human form", image: "figurative" },
      { key: "pop-art", title: "Pop Art", description: "Vibrant nostalgia", image: "pop" }
    ],
    niche: [
      { key: "minimalist", title: "Minimalist", description: "Clean lines", image: "minimalist" },
      { key: "typography", title: "Typography", description: "Statement words", image: "type" },
      { key: "vintage", title: "Vintage", description: "Retro charm", image: "vintage" },
      { key: "kids", title: "Kids", description: "Playful prints", image: "kids" }
    ]
  },
  products: [
    {
      id: "aurora-haze",
      title: "Aurora Haze",
      price: 45,
      category: "abstract",
      imageKey: "abstract",
      frameImages: {
        natural: "abstract-natural",
        black: "abstract-black",
        white: "abstract-white"
      }
    },
    {
      id: "dune-silhouettes",
      title: "Dune Silhouettes",
      price: 55,
      category: "landscapes",
      imageKey: "landscapes"
    },
    {
      id: "botanical-study",
      title: "Botanical Study",
      price: 35,
      category: "botanical",
      imageKey: "botanical"
    },
    {
      id: "city-dusk",
      title: "City Dusk",
      price: 65,
      category: "cityscapes",
      imageKey: "city"
    },
    {
      id: "cobalt-tide",
      title: "Cobalt Tide",
      price: 48,
      category: "coastal",
      imageKey: "coastal"
    },
    {
      id: "midnight-forms",
      title: "Midnight Forms",
      price: 52,
      category: "minimalist",
      imageKey: "minimalist"
    },
    {
      id: "sunrise-portrait",
      title: "Sunrise Portrait",
      price: 60,
      category: "figurative",
      imageKey: "figurative"
    },
    {
      id: "retro-pulse",
      title: "Retro Pulse",
      price: 40,
      category: "pop-art",
      imageKey: "pop"
    },
    {
      id: "copper-arch",
      title: "Copper Arch",
      price: 38,
      category: "architecture",
      imageKey: "architecture"
    },
    {
      id: "riverbend",
      title: "Riverbend",
      price: 44,
      category: "landscapes",
      imageKey: "landscapes"
    },
    {
      id: "linen-lines",
      title: "Linen Lines",
      price: 32,
      category: "minimalist",
      imageKey: "minimalist"
    },
    {
      id: "studio-light",
      title: "Studio Light",
      price: 58,
      category: "photography",
      imageKey: "photography"
    }
  ],
  productDetail: {
    id: "aurora-haze",
    title: "Aurora Haze",
    priceRange: "£23.95 - £200.00",
    description: [
      "Feature a…. Premium archival giclée print",
      "Feature b…. Sustainably sourced frames",
      "Feature c…. Hand finished in the UK",
      "Feature d…. 12 colour pigment inks",
      "Feature e…. Certified carbon neutral fulfilment",
      "Feature f…. Protected by UV acrylic glazing"
    ],
    frames: [
      { value: "natural", label: "Natural Oak" },
      { value: "black", label: "Matte Black" },
      { value: "white", label: "Gallery White" },
      { value: "walnut", label: "Rich Walnut" },
      { value: "gold", label: "Brushed Gold" },
      { value: "silver", label: "Polished Silver" }
    ],
    sizes: [
      "A4 (21 x 29.7 cm)",
      "A3 (29.7 x 42 cm)",
      "A2 (42 x 59.4 cm)",
      "A1 (59.4 x 84.1 cm)",
      "40 x 40 cm",
      "60 x 60 cm"
    ],
    gallery: [
      { src: "abstract", alt: "Aurora Haze print" },
      { src: "abstract-natural", alt: "Aurora Haze with natural oak frame" },
      { src: "abstract-black", alt: "Aurora Haze with black frame" },
      { src: "abstract-white", alt: "Aurora Haze with white frame" }
    ]
  },
  testimonials: [
    {
      quote: "Absolutely beautiful print and the framing quality is superb. Delivery was faster than expected!",
      name: "Sophie L.",
      location: "London, UK"
    },
    {
      quote: "The perfect statement piece for our living room. Love the sustainable packaging.",
      name: "Gareth P.",
      location: "Manchester, UK"
    },
    {
      quote: "Artiq's curation is spot on. The Printify integration made fulfilment seamless for my studio portfolio.",
      name: "Maya R.",
      location: "Bristol, UK"
    }
  ]
};

const placeholderImages = {
  abstract: "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  "abstract-natural": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  "abstract-black": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  "abstract-white": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  landscapes: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  photography: "linear-gradient(135deg, #d4fc79, #96e6a1)",
  botanical: "linear-gradient(135deg, #84fab0, #8fd3f4)",
  architecture: "linear-gradient(135deg, #ffd3a5, #fd6585)",
  coastal: "linear-gradient(135deg, #89f7fe, #66a6ff)",
  figurative: "linear-gradient(135deg, #f6d365, #fda085)",
  pop: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  minimalist: "linear-gradient(135deg, #fdcbf1, #e6dee9)",
  vintage: "linear-gradient(135deg, #fddb92, #d1fdff)",
  kids: "linear-gradient(135deg, #f093fb, #f5576c)",
  city: "linear-gradient(135deg, #cfd9df, #e2ebf0)",
  type: "linear-gradient(135deg, #ffecd2, #fcb69f)",
  "abstract-natural-frame": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  "abstract-black-frame": "linear-gradient(135deg, #ffafbd, #ffc3a0)",
  "abstract-white-frame": "linear-gradient(135deg, #ffafbd, #ffc3a0)"
};
