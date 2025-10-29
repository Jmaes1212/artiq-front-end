function createFramedArtwork({
  background = '#f6f6f6',
  frame = '#2f2f2f',
  mat = '#ffffff',
  artwork = '#dcdcdc',
  detail = ''
} = {}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="${background}" />
      <rect x="86" y="86" width="428" height="628" rx="28" fill="${frame}" />
      <rect x="116" y="116" width="368" height="568" rx="22" fill="${mat}" />
      <rect x="156" y="166" width="288" height="468" rx="16" fill="${artwork}" />
      ${detail}
    </svg>
  `;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PRODIGI_FRAMES = [
  { key: "black", label: "Matte Black", priceMultiplier: 1 },
  { key: "white", label: "Gallery White", priceMultiplier: 1 },
  { key: "natural", label: "Natural Wood", priceMultiplier: 1 }
];

function createWallMockup({
  idSuffix = "default",
  wallTop = "#f3f0ec",
  wallBottom = "#e6dbcf",
  floor = "#d1c0af",
  baseboard = "#efe6dc",
  rug = "#ded3c4",
  frameLight = "#c7a26d",
  frameDark = "#7b5b33",
  frameAccent = "#e2bf85",
  mat = "#fbf7f1",
  artBackground = "#ffffff",
  detail = ""
} = {}) {
  const wallGradientId = `wallGradient-${idSuffix}`;
  const rugGradientId = `rugGradient-${idSuffix}`;
  const frameGradientId = `frameGradient-${idSuffix}`;
  const frameStrokeId = `frameStroke-${idSuffix}`;
  const shadowId = `frameShadow-${idSuffix}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
      <defs>
        <linearGradient id="${wallGradientId}" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="${wallTop}" />
          <stop offset="1" stop-color="${wallBottom}" />
        </linearGradient>
        <linearGradient id="${rugGradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${rug}" stop-opacity="0.75" />
          <stop offset="1" stop-color="${floor}" stop-opacity="0.95" />
        </linearGradient>
        <linearGradient id="${frameGradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${frameLight}" />
          <stop offset="0.5" stop-color="${frameAccent}" />
          <stop offset="1" stop-color="${frameDark}" />
        </linearGradient>
        <linearGradient id="${frameStrokeId}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${frameDark}" stop-opacity="0.9" />
          <stop offset="0.45" stop-color="${frameAccent}" stop-opacity="0.45" />
          <stop offset="1" stop-color="${frameLight}" stop-opacity="0.9" />
        </linearGradient>
        <filter id="${shadowId}" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="rgba(0,0,0,0.28)" />
        </filter>
      </defs>

      <rect width="600" height="520" fill="url(#${wallGradientId})" />
      <rect y="520" width="600" height="280" fill="${floor}" />
      <rect y="500" width="600" height="20" fill="${baseboard}" />
      <ellipse cx="300" cy="640" rx="220" ry="70" fill="url(#${rugGradientId})" opacity="0.55" />

      <g filter="url(#${shadowId})">
        <rect x="96" y="118" width="408" height="564" rx="32" fill="url(#${frameGradientId})" />
        <rect x="108" y="130" width="384" height="540" rx="26" fill="none" stroke="url(#${frameStrokeId})" stroke-width="6" />
        <rect x="126" y="148" width="348" height="504" rx="22" fill="${mat}" />
        <rect x="156" y="178" width="288" height="444" rx="16" fill="${artBackground}" />
        <g transform="translate(0,0)">
          ${detail}
        </g>
      </g>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function createPerspectiveMockup({
  idSuffix = "perspective",
  backgroundTop = "#f6f2ea",
  backgroundBottom = "#e7ded2",
  surface = "#bfa68f",
  surfaceShadow = "#9f876f",
  printHighlight = "#ffffff",
  printShadow = "#d3c5b3",
  accent = "#f8efe2",
  detail = ""
} = {}) {
  const backgroundGradientId = `perspBackground-${idSuffix}`;
  const surfaceGradientId = `perspSurface-${idSuffix}`;
  const printGradientId = `perspPrint-${idSuffix}`;
  const glossGradientId = `perspGloss-${idSuffix}`;
  const printClipId = `perspClip-${idSuffix}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200">
      <defs>
        <linearGradient id="${backgroundGradientId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${backgroundTop}" />
          <stop offset="1" stop-color="${backgroundBottom}" />
        </linearGradient>
        <linearGradient id="${surfaceGradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${surface}" />
          <stop offset="1" stop-color="${surfaceShadow}" />
        </linearGradient>
        <linearGradient id="${printGradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${printHighlight}" />
          <stop offset="1" stop-color="${printShadow}" />
        </linearGradient>
        <linearGradient id="${glossGradientId}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="rgba(255,255,255,0.45)" />
          <stop offset="0.6" stop-color="rgba(255,255,255,0.05)" />
          <stop offset="1" stop-color="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="${printClipId}">
          <polygon points="360 260 1180 160 1280 580 470 720" />
        </clipPath>
      </defs>

      <rect width="1600" height="1200" fill="url(#${backgroundGradientId})" />

      <path d="M0 640 Q800 700 1600 520 L1600 1200 H0 Z" fill="url(#${surfaceGradientId})" />
      <path d="M220 880 C520 940 1120 910 1400 780 L1420 840 C1130 980 490 1010 200 920 Z" fill="rgba(0,0,0,0.18)" opacity="0.25" />

      <g>
        <polygon points="360 260 1180 160 1280 580 470 720" fill="url(#${printGradientId})" />
        <polygon points="360 260 1180 160 1280 580 470 720" fill="url(#${glossGradientId})" opacity="0.45" />
        <polygon points="360 260 1180 160 1280 580 470 720" fill="url(#${glossGradientId})" opacity="0.2" transform="translate(40, -20)" />
        <polygon points="360 260 1180 160 1280 580 470 720" fill="rgba(0,0,0,0.18)" opacity="0.12" transform="translate(24, 90)" />
        <polygon points="360 260 1180 160 1188 194 368 294" fill="rgba(0,0,0,0.18)" opacity="0.2" />
        <polygon points="470 720 1280 580 1272 544 462 684" fill="rgba(0,0,0,0.12)" />
      </g>

      <g clip-path="url(#${printClipId})">
        <rect x="320" y="180" width="960" height="740" fill="${accent}" />
        <g transform="translate(470,260) scale(1.1)">
          ${detail}
        </g>
      </g>

      <g opacity="0.55">
        <path d="M300 260 L380 262 L420 470 L340 466 Z" fill="rgba(0,0,0,0.12)" />
        <path d="M1180 160 L1220 162 L1308 568 L1266 566 Z" fill="rgba(0,0,0,0.12)" />
      </g>

      <path d="M720 880 Q960 820 1260 760" stroke="rgba(0,0,0,0.08)" stroke-width="32" stroke-linecap="round" />
      <path d="M300 940 Q820 1000 1400 860" stroke="rgba(0,0,0,0.08)" stroke-width="54" stroke-linecap="round" />
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const PRODIGI_FRAME_PRICE_MAP = PRODIGI_FRAMES.reduce((map, frame) => {
  map[frame.key] = frame.priceMultiplier;
  return map;
}, {});

const PRODIGI_VARIANTS = [
  { size: "A4 (21 x 29.7 cm)", sku: "GLOBAL-BFP-12X16", frames: ["natural", "white"], basePrice: 35 },
  { size: "A3 (29.7 x 42 cm)", sku: "GLOBAL-BFP-16X20", frames: ["natural", "white"], basePrice: 45 },
  { size: "A2 (42 x 59.4 cm)", sku: "GLOBAL-BFP-20X28", frames: ["natural", "white"], basePrice: 55 },
  { size: "A1 (59.4 x 84.1 cm)", sku: "GLOBAL-BFP-24X32", frames: ["natural", "white"], basePrice: 65 }
];

const PRODIGI_SIZE_OPTIONS = PRODIGI_VARIANTS.map((variant) => variant.size);

const PRODIGI_SKU_MATRIX = PRODIGI_VARIANTS.reduce((matrix, variant) => {
  matrix[variant.size] = variant.frames.reduce((frameMap, frameKey) => {
    frameMap[frameKey] = variant.sku;
    return frameMap;
  }, {});
  return matrix;
}, {});

const PRODIGI_VARIANT_PRICE_MAP = PRODIGI_VARIANTS.reduce((priceMap, variant) => {
  priceMap[variant.size] = variant.basePrice;
  return priceMap;
}, {});

const PRODIGI_MIN_VARIANT_PRICE = Math.min(...PRODIGI_VARIANTS.map((variant) => variant.basePrice));

const siteConfig = {
  bannerMessages: [
    "Free UK delivery on orders over Â£75",
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
        "Coastal",
        "Film",
        "Figurative",
        "Kids",
        "Kitchen",
        "Landscapes",
        "Minimalist",
        "Nature",
        "Photography",
        "Pop Art",
        "Sports",
        "Travel",
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
        "Under Â£25",
        "Â£25 - Â£50",
        "Â£50 - Â£100",
        "Â£100 - Â£150",
        "Â£150 - Â£200",
        "Over Â£200"
      ]
    }
  },
  categories: {
    main: [
      { key: "abstract", title: "Abstract", description: "Soft gradients and bold shapes", image: "assets/images/categories/abstract.webp" },
      { key: "film", title: "Film", description: "Cinematic favourites", image: "assets/images/categories/film.webp" },
      { key: "kitchen", title: "Kitchen", description: "Culinary warmth for home", image: "assets/images/categories/kitchen.webp" },
      { key: "minimalist", title: "Minimalist", description: "Clean lines for calm spaces", image: "assets/images/categories/minimalist.webp" },
      { key: "nature", title: "Nature", description: "Calming organic scenery", image: "assets/images/categories/nature.webp" },
      { key: "pop-art", title: "Pop Art", description: "Vibrant nostalgia", image: "assets/images/categories/pop-art.webp" },
      { key: "sports", title: "Sports", description: "Dynamic sporting icons", image: "assets/images/categories/sports.webp" },
      { key: "travel", title: "Travel", description: "Discover global landmarks", image: "assets/images/categories/travel.webp" }
    ],
    niche: [
      { key: "architecture", title: "Architecture", description: "Structural marvels", image: "architecture" },
      { key: "botanical", title: "Botanical", description: "Flourishing flora", image: "botanical" },
      { key: "coastal", title: "Coastal", description: "Ocean inspired", image: "coastal" },
      { key: "figurative", title: "Figurative", description: "Human form", image: "figurative" },
      { key: "kids", title: "Kids", description: "Playful prints", image: "kids" },
      { key: "landscapes", title: "Landscapes", description: "Scenes from around the world", image: "landscapes" },
      { key: "photography", title: "Photography", description: "Captured moments", image: "photography" },
      { key: "typography", title: "Typography", description: "Statement words", image: "type" },
      { key: "vintage", title: "Vintage", description: "Retro charm", image: "vintage" }
    ]
  },
  products: [
    {
      id: "women-in-black",
      title: "Women in Black",
      artworkUrl: "assets/images/women-in-black.jpg",
      basePrice: 25,
      category: "film",
      imageKey: "assets/images/women-in-black-decoration-wall-art.png",
      frameImages: {
        default: "assets/images/women-in-black-decoration-wall-art.png",
        black: "assets/images/women-in-black-decoration-wall-art.png",
        white: "assets/images/women-in-black-luxury-frame.png",
        natural: "assets/images/women-in-black-cream-brown.png"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "assets/images/women-in-black.jpg",
      lifestyleGallery: [
      {
        src: "women-in-black-desk-angle",
        title: "Studio desk view",
        caption: "Displayed across a flat-lay desk with soft stationery shadows."
      },
      {
        src: "women-in-black-close-detail",
        title: "Foil detail",
        caption: "Highlighting the fine line work and satin finish up close."
      },
      {
        src: "women-in-black-roll",
        title: "Ready to gift",
        caption: "Rolled with artisan kraft paper wrap and foil accented seal."
      }
    ],
      description: [
        "Hand-inked illustration capturing a cinematic beauty ritual",
        "Printed on archival cotton paper with deep matte blacks",
        "Choose from matte black, gallery white, or natural oak frames",
        "UV-protective acrylic preserves color and line work",
        "Finished with artisan corners and hanging hardware included",
        "Carbon-neutral production and plastic-free packaging"
      ]
    },
    {
      id: "dune-silhouettes",
      title: "Symmetrical Architecture",
      artworkUrl: "assets/images/dune-symmetrical-black.png",
      basePrice: 30,
      category: "travel",
      imageKey: "assets/images/dune-symmetrical-black.png",
      frameImages: {
        default: "assets/images/dune-symmetrical-black.png",
        black: "assets/images/dune-symmetrical-black.png",
        white: "assets/images/dune-symmetrical-white.png",
        natural: "assets/images/dune-symmetrical-natural.png"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "server/public/images/prints/Symmetrical Architecture/symmetrical architecture base file.jpg",
      description: [
        "Captured during golden hour in the Sahara Desert",
        "High-resolution digital print on premium matte paper",
        "Natural oak frame with protective UV acrylic glazing",
        "Fade-resistant inks with 100+ year color stability",
        "Eco-friendly packaging made from recycled materials",
        "Express shipping available worldwide"
      ]
    },
    {
      id: "athletic-moments",
      title: "French Beach",
      artworkUrl: "assets/images/french-beach-black.png",
      basePrice: 28,
      category: "coastal",
      imageKey: "assets/images/french-beach-black.png",
      frameImages: {
        default: "assets/images/french-beach-black.png",
        black: "assets/images/french-beach-black.png",
        white: "assets/images/french-beach-white.png",
        natural: "assets/images/french-beach-natural.png"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "server/public/images/prints/French Beach/French Beach - Black.png",
      description: [
        "Serene shoreline photography captured along France's Atlantic coast",
        "Soft pastel palette pairs beautifully with coastal interiors",
        "Available framed in matte black, gallery white or natural oak",
        "Printed on archival cotton paper for museum-quality longevity",
        "Mounted with acid-free mats and UV-protective glazing",
        "Produced on demand with carbon neutral delivery"
      ]
    },
    {
      id: "japanese-wave-art",
      title: "Japanese Wave Art",
      artworkUrl: "assets/images/japanese-wave-black.png",
      basePrice: 30,
      category: "abstract",
      imageKey: "assets/images/japanese-wave-black.png",
      frameImages: {
        default: "assets/images/japanese-wave-black.png",
        black: "assets/images/japanese-wave-black.png",
        white: "assets/images/japanese-wave-white.png",
        natural: "assets/images/japanese-wave-natural.png"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "server/public/images/prints/Japanese Wave Art/Japanese Wave Art - Black.png",
      description: [
        "Modern reinterpretation of Hokusai-inspired waves with teal gradients",
        "Balancing movement and negative space for minimalist interiors",
        "Framing options in matte black, gallery white, or natural oak",
        "Printed on archival fine art paper with pigment-rich inks",
        "UV-protected glazing keeps colours vivid in bright rooms",
        "Produced on demand with carbon-neutral global fulfillment"
      ]
    },
    {
      id: "man-of-colour",
      title: "Man of Colour",
      artworkUrl: "assets/images/man-of-colour-black.png",
      basePrice: 35,
      priceOverrides: {
        "A2 (42 x 59.4 cm)": 1.99,
        "A4 (21 x 29.7 cm)": 1.99
      },
      category: "figurative",
      imageKey: "assets/images/man-of-colour-black.png",
      frameImages: {
        default: "assets/images/man-of-colour-natural.png",
        white: "assets/images/man-of-colour-white.png",
        natural: "assets/images/man-of-colour-natural.png"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "assets/images/prints/man-of-colour.png",
      description: [
        "Bold figurative portrait celebrating vibrant colour blocking",
        "Richly saturated pigments printed on archival cotton rag",
        "Available framed in matte black, gallery white or natural oak",
        "Framed with UV-protective acrylic to preserve tonal depth",
        "Includes hanging hardware and artist provenance card",
        "Hand finished to order with carbon neutral delivery"
      ]
    },
    {
      id: "cobalt-tide",
      title: "Cobalt Tide",
      basePrice: 28,
      category: "nature",
      imageKey: "coastal",
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=1600&fit=crop&crop=center",
      description: [
        "Dramatic seascape from the Cornish coastline",
        "Vibrant cobalt blues printed on metallic paper",
        "Natural driftwood frame with sea glass accents",
        "Water-resistant finish for bathroom or kitchen display",
        "Artist's signature and edition number included",
        "Packaged in eco-friendly materials"
      ]
    },
    {
      id: "culinary-still",
      title: "Culinary Still Life",
      artworkUrl: "assets/images/categories/kitchen.webp",
      basePrice: 24,
      category: "kitchen",
      imageKey: "assets/images/categories/kitchen.webp",
      frameImages: {
        default: "assets/images/categories/kitchen.webp",
        black: "assets/images/categories/kitchen.webp",
        white: "assets/images/categories/kitchen.webp",
        natural: "assets/images/categories/kitchen.webp"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "assets/images/categories/kitchen.webp",
      description: [
        "Warm farmhouse palette featuring seasonal produce and botanicals",
        "Adds texture to kitchens, dining rooms and pantry corners",
        "Printed using food-safe, low VOC inks for culinary spaces",
        "Choice of matte white, oak or black frame finishes",
        "Includes recipe card pairing and styling tips",
        "Shipped in protective, plastic-free packaging"
      ]
    },
    {
      id: "pop-legends",
      title: "Pop Legends Gallery",
      artworkUrl: "assets/images/categories/pop-art.webp",
      basePrice: 29,
      category: "pop-art",
      imageKey: "assets/images/categories/pop-art.webp",
      frameImages: {
        default: "assets/images/categories/pop-art.webp",
        black: "assets/images/categories/pop-art.webp",
        white: "assets/images/categories/pop-art.webp",
        natural: "assets/images/categories/pop-art.webp"
      },
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "assets/images/categories/pop-art.webp",
      description: [
        "Bold comic-inspired art featuring cult movie and gaming icons",
        "High-impact hues printed with ultra-vibrant pigment inks",
        "Available framed in matte black, crisp white or natural oak",
        "Ideal for media rooms, teenage bedrooms and creative studios",
        "Each print produced on demand to reduce waste",
        "Delivered ready to hang with wall-friendly fittings"
      ]
    },
    {
      id: "midnight-forms",
      title: "Midnight Forms",
      basePrice: 26,
      category: "minimalist",
      imageKey: "minimalist",
      prodigiSkus: PRODIGI_SKU_MATRIX,
      assetUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&h=1600&fit=crop&crop=center",
      description: [
        "Abstract geometric composition in midnight tones",
        "Minimalist design perfect for modern interiors",
        "Floating frame with gallery-quality mounting",
        "Printed on heavyweight fine art paper",
        "Limited edition of 100 prints worldwide",
        "Comes with artist's certificate of authenticity"
      ]
    }
  ],
  productDetail: {
    id: "women-in-black",
    title: "Women in Black",
    artworkUrl: "assets/images/women-in-black.jpg",
    priceRange: "\u00a335.00 - \u00a365.00",
    description: [
      "Feature aâ€¦. Premium archival giclÃ©e print",
      "Feature bâ€¦. Sustainably sourced frames",
      "Feature câ€¦. Hand finished in the UK",
      "Feature dâ€¦. 12 colour pigment inks",
      "Feature eâ€¦. Certified carbon neutral fulfilment",
      "Feature fâ€¦. Protected by UV acrylic glazing"
    ],
    frames: PRODIGI_FRAMES.map(({ key, label }) => ({ value: key, label })),
    sizes: PRODIGI_SIZE_OPTIONS,
    lifestyleGallery: [
      {
        src: "women-in-black-desk-angle",
        title: "Studio desk view",
        caption: "Displayed across a flat-lay desk with soft stationery shadows."
      },
      {
        src: "women-in-black-close-detail",
        title: "Foil detail",
        caption: "Highlighting the fine line work and satin finish up close."
      },
      {
        src: "women-in-black-roll",
        title: "Ready to gift",
        caption: "Rolled with artisan kraft paper wrap and foil accented seal."
      }
    ],
    gallery: [
      { src: "assets/images/women-in-black.jpg", alt: "Women in Black illustration" },
      { src: "women-in-black-natural", alt: "Women in Black in natural oak frame" },
      { src: "women-in-black-black", alt: "Women in Black in matte black frame" },
      { src: "women-in-black-white", alt: "Women in Black in gallery white frame" }
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

const WOMEN_IN_BLACK_DETAIL = `
      <path d="M288 238c36-36 108-54 156 4-6 60-48 84-78 90 18 10 42 12 54 10-16 30-56 38-94 22-26-12-38-36-42-58-24 10-46 16-62 16 6-38 14-64 66-84z" fill="#161518" />
      <path d="M330 250c30 0 54 28 54 84s-40 92-76 92c-26 0-62-20-70-68 28-6 50-26 62-52-16 10-32 16-46 18 2-34 34-74 76-74z" fill="#f7ece5" />
      <path d="M356 318c14-6 34-6 42 8-16 12-34 10-48 2 2-4 4-8 6-10z" fill="#161518" />
      <path d="M360 360c12 0 22 6 26 12-8 12-24 18-42 18-12 0-22-4-30-10 8-10 26-20 46-20z" fill="#d82232" />
      <circle cx="414" cy="380" r="18" fill="#d82232" />
      <circle cx="414" cy="412" r="12" fill="#c41728" />
      <path d="M292 432c22 6 38 18 46 32 12 26 6 46-16 62-26 18-66 18-90-12 16-4 34-16 48-32-18 12-36 18-50 18 10-30 26-62 62-68z" fill="#1c1b1e" />
      <path d="M238 426c18-10 44-18 70-14 6 16 10 34 8 46-22 10-44 8-60 4 12 6 26 8 38 6-12 22-40 36-74 32-18-2-38-12-56-22 24-20 56-38 74-52z" fill="#1b191c" />
      <path d="M208 434c8-6 18-10 26-12-2 10-2 22 2 34-10 0-20-4-28-10z" fill="#f2e3db" />
      <path d="M200 430c18-14 40-22 60-26 4 4 6 10 6 16-20 6-40 12-56 18-4-2-8-4-10-8z" fill="#f2e3db" />
      <path d="M204 430c-8-8-10-16-2-24 18-4 36-8 52-12 4 4 8 8 10 12-18 6-38 16-60 24z" fill="#d82232" />
      <path d="M268 404c10-8 22-12 32-12 18 0 40 16 54 44 20 40 22 96-4 138-46 20-92 12-132-16-22-16-36-38-42-58 26-12 62-36 80-72-14 16-32 28-48 34-2-30 10-58 60-58z" fill="#141217" />
      <path d="M270 480c48-18 128-54 182-18 14 56-4 104-48 138-46 36-110 42-156 12-36-22-56-58-56-102 0-14 2-26 4-36 22 14 46 14 74 6z" fill="#0f0e11" />
      <path d="M190 424c-10 10-10 22 2 32 12 10 30 12 44 8" fill="none" stroke="#111015" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M298 340c-10 18-28 32-52 38" fill="none" stroke="#111015" stroke-width="6" stroke-linecap="round" />
      <path d="M206 428c22-12 46-20 68-24" fill="none" stroke="#1a1a1d" stroke-width="4" stroke-linecap="round" />
      <path d="M366 362c10 4 26 4 40 0" fill="none" stroke="#861020" stroke-width="4" stroke-linecap="round" />
      <path d="M366 326c10 2 22 0 32-2" fill="none" stroke="#09080a" stroke-width="6" stroke-linecap="round" />
`;
const placeholderImages = {

  abstract: createFramedArtwork({
    background: '#f6f1f0',
    frame: '#1f1f1f',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'abstract-natural': createFramedArtwork({
    background: '#f7f3ec',
    frame: '#b28b5d',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'abstract-black': createFramedArtwork({
    background: '#f0f0f0',
    frame: '#111111',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'abstract-white': createFramedArtwork({
    background: '#f9f9f9',
    frame: '#ffffff',
    mat: '#f0f0f0',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'women-in-black-decoration-wall-art': createWallMockup({
    idSuffix: 'wib-decoration',
    detail: WOMEN_IN_BLACK_DETAIL,
    wallTop: '#f5f2ef',
    wallBottom: '#e6dbd2',
    floor: '#d3c1b4',
    frameLight: '#5a4638',
    frameAccent: '#3a2a21',
    frameDark: '#241712',
    mat: '#ffffff',
    artBackground: '#ffffff'
  }),
  'women-in-black-luxury-frame': createWallMockup({
    idSuffix: 'wib-luxury',
    detail: WOMEN_IN_BLACK_DETAIL,
    wallTop: '#fbfbfb',
    wallBottom: '#ede9e4',
    floor: '#d9d5ce',
    frameLight: '#f8f8f5',
    frameAccent: '#e3e1dd',
    frameDark: '#cbc8c3',
    mat: '#ffffff',
    artBackground: '#ffffff'
  }),
  'women-in-black-cream-brown': createWallMockup({
    idSuffix: 'wib-cream-brown',
    detail: WOMEN_IN_BLACK_DETAIL,
    wallTop: '#f4ede5',
    wallBottom: '#e2d0c0',
    floor: '#cdb49f',
    frameLight: '#d7b890',
    frameAccent: '#bb915f',
    frameDark: '#8a623a',
    mat: '#ffffff',
    artBackground: '#ffffff'
  }),
  'women-in-black': createWallMockup({
    idSuffix: 'wib-room',
    detail: WOMEN_IN_BLACK_DETAIL,
    frameLight: '#ceb07d',
    frameAccent: '#b68a4d',
    frameDark: '#947149'
  }),
  'women-in-black-natural': createWallMockup({
    idSuffix: 'wib-natural',
    detail: WOMEN_IN_BLACK_DETAIL,
    frameLight: '#d6b789',
    frameAccent: '#bf9558',
    frameDark: '#8b6535'
  }),
  'women-in-black-black': createWallMockup({
    idSuffix: 'wib-black',
    detail: WOMEN_IN_BLACK_DETAIL,
    frameLight: '#4b4b4f',
    frameAccent: '#2d2d31',
    frameDark: '#0e0e10',
    mat: '#f6f4f2',
    artBackground: '#ffffff',
    wallTop: '#f1efec',
    wallBottom: '#e2d8cf'
  }),
  'women-in-black-white': createWallMockup({
    idSuffix: 'wib-white',
    detail: WOMEN_IN_BLACK_DETAIL,
    frameLight: '#f9f6f2',
    frameAccent: '#ebe3da',
    frameDark: '#cfc6bb',
    mat: '#ffffff',
    artBackground: '#ffffff',
    wallTop: '#f4f1ee',
    wallBottom: '#e8ddd4'
  }),
  'women-in-black-desk-angle': createPerspectiveMockup({
    idSuffix: 'wib-desk',
    backgroundTop: '#f5f0ea',
    backgroundBottom: '#e3d8cb',
    surface: '#bfa68f',
    surfaceShadow: '#957f6a',
    printHighlight: '#fdf7ef',
    printShadow: '#d4c2aa',
    accent: '#fefaf6',
    detail: WOMEN_IN_BLACK_DETAIL
  }),
  'women-in-black-close-detail': createPerspectiveMockup({
    idSuffix: 'wib-detail',
    backgroundTop: '#f6f2eb',
    backgroundBottom: '#ece1d7',
    surface: '#d8c4b2',
    surfaceShadow: '#b59d86',
    printHighlight: '#ffffff',
    printShadow: '#d3c7ba',
    accent: '#fbf4ea',
    detail: WOMEN_IN_BLACK_DETAIL
  }),
  'women-in-black-roll': createPerspectiveMockup({
    idSuffix: 'wib-roll',
    backgroundTop: '#f4eee7',
    backgroundBottom: '#e1d5c8',
    surface: '#c6ad96',
    surfaceShadow: '#a48970',
    printHighlight: '#fffdf7',
    printShadow: '#d9c8b6',
    accent: '#fefaf4',
    detail: WOMEN_IN_BLACK_DETAIL
  }),
  landscapes: createFramedArtwork({
    background: '#eef3f7',
    frame: '#4b3f2f',
    artwork: '#b3d4f5',
    detail: `
      <path d="M150 560 L240 420 L320 520 L370 450 L450 560 Z" fill="#2f855a" opacity="0.85" />
      <path d="M150 560 H450 V610 H150 Z" fill="#81e6d9" />
      <circle cx="330" cy="260" r="40" fill="#f6e05e" opacity="0.9" />
      <path d="M180 360 H420" stroke="#edf2f7" stroke-width="12" stroke-linecap="round" opacity="0.45" />
    `
  }),
  photography: createFramedArtwork({
    background: '#f4f1ec',
    frame: '#2d3748',
    artwork: '#e2e8f0',
    detail: `
      <rect x="190" y="240" width="90" height="110" rx="10" fill="#1a202c" opacity="0.12" transform="rotate(-8 235 295)" />
      <rect x="260" y="270" width="120" height="140" rx="12" fill="#2d3748" opacity="0.12" transform="rotate(6 320 340)" />
      <rect x="210" y="360" width="180" height="160" rx="14" fill="#718096" opacity="0.18" />
      <circle cx="300" cy="440" r="46" fill="#2d3748" opacity="0.22" />
    `
  }),
  botanical: createFramedArtwork({
    background: '#f2f7f2',
    frame: '#3a5a40',
    artwork: '#d1f0d4',
    detail: `
      <path d="M300 260 C320 220 360 220 370 260 C380 300 340 340 320 360 C300 380 270 410 260 450 C250 490 270 520 300 520" stroke="#2f855a" stroke-width="18" stroke-linecap="round" fill="none" />
      <path d="M300 340 C260 300 220 320 210 360 C200 400 240 420 260 430" stroke="#68d391" stroke-width="14" stroke-linecap="round" fill="none" />
      <path d="M320 420 C360 380 400 390 410 420 C420 450 390 470 370 472" stroke="#48bb78" stroke-width="12" stroke-linecap="round" fill="none" />
    `
  }),
  architecture: createFramedArtwork({
    background: '#f7f3f0',
    frame: '#2c3e50',
    artwork: '#ebe6df',
    detail: `
      <rect x="210" y="280" width="180" height="260" fill="#d9d2c5" />
      <rect x="240" y="310" width="120" height="200" fill="none" stroke="#2c3e50" stroke-width="10" />
      <path d="M210 280 L300 220 L390 280 Z" fill="#c4b7a6" />
      <path d="M300 220 V540" stroke="#2c3e50" stroke-width="10" />
      <path d="M240 420 H360" stroke="#2c3e50" stroke-width="8" />
    `
  }),
  coastal: createFramedArtwork({
    background: '#eef8fb',
    frame: '#1a759f',
    artwork: '#a9d6e5',
    detail: `
      <path d="M150 500 C210 470 250 520 300 500 C350 480 390 520 450 500 V560 H150 Z" fill="#2c7da0" opacity="0.85" />
      <path d="M150 460 C210 430 250 470 300 450 C350 430 390 470 450 440" stroke="#468faf" stroke-width="14" fill="none" opacity="0.7" />
      <circle cx="360" cy="260" r="42" fill="#ffd166" />
      <path d="M200 320 H420" stroke="#f1faee" stroke-width="12" stroke-linecap="round" opacity="0.5" />
    `
  }),
  figurative: createFramedArtwork({
    background: '#f7f2f6',
    frame: '#5c3d5b',
    artwork: '#f3d4e7',
    detail: `
      <path d="M300 260 C340 260 360 300 360 340 C360 380 330 410 300 410 C270 410 240 380 240 340 C240 300 260 260 300 260 Z" fill="#9d4edd" opacity="0.35" />
      <path d="M230 450 C250 420 280 400 300 400 C320 400 350 420 370 450 C390 480 400 520 390 560 H210 C200 520 210 480 230 450 Z" fill="#c77dff" opacity="0.6" />
      <path d="M300 290 C312 310 332 314 348 304" stroke="#5a189a" stroke-width="10" stroke-linecap="round" opacity="0.6" />
    `
  }),
  pop: createFramedArtwork({
    background: '#fef3f4',
    frame: '#ff006e',
    artwork: '#ffe066',
    detail: `
      <rect x="200" y="230" width="220" height="100" fill="#8338ec" transform="rotate(-8 310 280)" opacity="0.85" />
      <rect x="190" y="360" width="240" height="140" fill="#ffbe0b" transform="rotate(7 310 430)" opacity="0.8" />
      <circle cx="300" cy="470" r="70" fill="#3a86ff" opacity="0.7" />
      <path d="M220 520 L380 520" stroke="#ff006e" stroke-width="16" stroke-linecap="round" opacity="0.65" />
    `
  }),
  minimalist: createFramedArtwork({
    background: '#f7f7f7',
    frame: '#2d2d2d',
    artwork: '#f0efed',
    detail: `
      <path d="M200 260 H400" stroke="#b5b5b5" stroke-width="14" stroke-linecap="round" opacity="0.5" />
      <rect x="240" y="320" width="120" height="180" rx="20" fill="#cfcfcf" opacity="0.45" />
      <path d="M220 540 H380" stroke="#9e9e9e" stroke-width="10" stroke-linecap="round" opacity="0.4" />
      <path d="M300 260 V580" stroke="#b5b5b5" stroke-width="8" stroke-linecap="round" opacity="0.35" />
    `
  }),
  vintage: createFramedArtwork({
    background: '#f3efe5',
    frame: '#8a5a44',
    mat: '#fdf7ee',
    artwork: '#e9d8a6',
    detail: `
      <path d="M180 360 H420" stroke="#7f5539" stroke-width="14" stroke-linecap="round" opacity="0.6" />
      <circle cx="280" cy="440" r="70" fill="#d4a373" opacity="0.7" />
      <path d="M330 420 C360 400 390 430 380 470 C370 510 340 520 310 500" stroke="#7f5539" stroke-width="10" stroke-linecap="round" opacity="0.6" fill="none" />
      <path d="M220 510 C250 540 280 550 310 530" stroke="#b08968" stroke-width="8" stroke-linecap="round" opacity="0.6" />
    `
  }),
  kids: createFramedArtwork({
    background: '#f7f4ff',
    frame: '#ff8fab',
    artwork: '#fcefee',
    detail: `
      <circle cx="240" cy="330" r="46" fill="#ffafcc" />
      <circle cx="360" cy="360" r="36" fill="#cdb4db" />
      <path d="M210 470 C250 430 350 430 390 470" stroke="#ffafcc" stroke-width="18" stroke-linecap="round" fill="none" />
      <path d="M250 520 Q300 560 350 520" stroke="#a2d2ff" stroke-width="14" stroke-linecap="round" fill="none" />
      <circle cx="300" cy="470" r="18" fill="#ffc8dd" />
    `
  }),
  city: createFramedArtwork({
    background: '#f4f6f8',
    frame: '#2b2d42',
    artwork: '#e0e7ff',
    detail: `
      <rect x="200" y="340" width="40" height="190" fill="#2b2d42" opacity="0.35" />
      <rect x="260" y="300" width="60" height="230" fill="#2b2d42" opacity="0.45" />
      <rect x="340" y="360" width="80" height="170" fill="#2b2d42" opacity="0.4" />
      <path d="M180 540 H420" stroke="#a0aec0" stroke-width="12" stroke-linecap="round" opacity="0.5" />
      <circle cx="360" cy="260" r="28" fill="#ffd166" opacity="0.85" />
    `
  }),
  type: createFramedArtwork({
    background: '#fef5ed',
    frame: '#1f1f1f',
    artwork: '#fff3bf',
    detail: `
      <text x="200" y="360" font-family="'Poppins', Arial, sans-serif" font-size="72" font-weight="700" fill="#1f1f1f">ART</text>
      <text x="200" y="440" font-family="'Poppins', Arial, sans-serif" font-size="48" font-weight="600" fill="#ff6f61">SPEAKS</text>
      <line x1="200" y1="470" x2="400" y2="470" stroke="#1f1f1f" stroke-width="12" stroke-linecap="round" opacity="0.5" />
    `
  }),
  'abstract-natural-frame': createFramedArtwork({
    background: '#f7f3ec',
    frame: '#b28b5d',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'abstract-black-frame': createFramedArtwork({
    background: '#f0f0f0',
    frame: '#111111',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  }),
  'abstract-white-frame': createFramedArtwork({
    background: '#f9f9f9',
    frame: '#ffffff',
    mat: '#f0f0f0',
    artwork: '#fdd4d0',
    detail: `
      <circle cx="270" cy="320" r="62" fill="#ff6f61" opacity="0.85" />
      <circle cx="360" cy="400" r="98" fill="#ffd166" opacity="0.7" />
      <path d="M210 470 C260 420 320 520 390 480" stroke="#073b4c" stroke-width="14" stroke-linecap="round" fill="none" />
    `
  })
};

















