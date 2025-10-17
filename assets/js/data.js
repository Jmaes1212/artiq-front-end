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
