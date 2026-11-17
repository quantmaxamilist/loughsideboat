// Boat listings — VERBATIM from the two old WordPress posts (fetched 2026-11-12).
// Old URLs: /2025/12/08/2007-bayliner-192/ (holds the MasterCraft listing despite its slug)
//           /2025/12/09/2005-glastron-gs279-sports-cruiser/
// Emoji section markers from the old posts are dropped; section headings kept.

// A photo is either a key in photos.json (built-in images) or a ready-made remote image from the CRM.
export type PhotoRef = string | { src: string; srcset: string; w: number; h: number };

export type Boat = {
  slug: string;
  title: string; // also the page <title> prefix, exactly as on the old site
  year: string;
  make: string;
  model: string;
  headline?: string;
  price: string;
  priceNote?: string;
  status?: string;
  sold?: boolean;
  location?: string;
  summary: string; // shown on the listing card
  sections: { title: string; items: string[] }[];
  body: string[];
  viewing?: string;
  photos: PhotoRef[]; // first is the cover
  oldUrl: string;
};

export const boats: Boat[] = [
  {
    slug: '2005-glastron-gs279-sports-cruiser',
    title: '2005 Glastron GS279 Sports Cruiser',
    year: '2005',
    make: 'Glastron',
    model: 'GS279 Sports Cruiser',
    price: '£34,950 OVNO',
    priceNote: '£34,950 or nearest offer',
    location: 'Mountshannon, County Clare',
    summary: 'Location: Mountshannon, County Clare',
    headline: 'Includes brand new 2025 twin axle 3500KG trailer',
    sections: [
      { title: 'Engine & Performance', items: ['Engine: Volvo Penta KAD 32 Diesel', 'Drive: Volvo outdrive', 'Hours: 460', 'Bowthruster for easy maneuvering'] },
      { title: 'Accommodation – 4 Berth', items: ['Midship double berth', 'Forward convertible dinette (converts to double berth)', 'Starboard heads with electric toilet and shower', 'Diesel night heater provides warm air throughout cabin and cockpit'] },
      { title: 'Galley', items: ['Sink', 'Hob', 'Microwave', 'Fridge'] },
      { title: 'Electronics & Features', items: ['Garmin GPS 182C', 'Garmin Compass', 'Electric bilge pump', 'Electric toilet with macerator', 'Bowthruster'] },
      { title: 'Deck & Exterior', items: ['Covers replaced in 2021', 'Synthetic teak on bathing platform', 'Fender rack', 'Brand new (2025) twin axle trailer rated for 3500KG'] },
    ],
    body: ['A well-maintained and comfortable sports cruiser perfect for weekends away or exploring inland and coastal waters. Ready to go, with no expense spared on upkeep.'],
    viewing: 'Viewing available in Mountshannon, County Clare',
    photos: ['gl-trailer', 'gl-berth', 'gl-marina', 'gl-reflect'],
    oldUrl: '/2025/12/09/2005-glastron-gs279-sports-cruiser/',
  },
  {
    slug: '2014-mastercraft-prostar',
    title: '2014 MasterCraft ProStar',
    year: '2014',
    make: 'MasterCraft',
    model: 'ProStar',
    headline: 'Immaculate Ski Boat – Serviced & Maintained by MasterCraft Ireland Since New.',
    price: '£54,995',
    status: 'Available Now',
    summary: 'Immaculate Ski Boat – Serviced & Maintained by MasterCraft Ireland Since New.',
    sections: [
      {
        title: 'Key Features',
        items: [
          'Ilmor 5.7L OPS V8 Engine – 280 hours',
          'Full Service History – Maintained by MasterCraft Ireland',
          'Recent tune-up & impeller replacement',
          'Picklefork Bow with Seating',
          'Walkthrough Windscreen',
          'Ski Mirror',
          'Top Deck SeaDek Tread Pads',
          'Deckadence Flooring',
          'Climacool Upholstery',
          'Fibreglass Swim Platform',
          'Walkthrough Transom',
          'Removable Transom Rack Seating',
          'Transom Storage Lockers',
        ],
      },
      { title: 'Extras', items: ['Brand New Factory-Fit MasterCraft Mooring Cover', 'BoatMate Colour-Matched Twin Axle Bunk Trailer', 'Guide Poles', 'Spare Wheel'] },
    ],
    body: ['This ProStar combines tournament-grade performance with premium comfort and style. An ideal choice for serious skiers or families looking for a high-quality, turnkey ski boat.'],
    photos: ['mc-shed', 'mc-cockpit', 'mc-side'],
    oldUrl: '/2025/12/08/2007-bayliner-192/',
  },
];
