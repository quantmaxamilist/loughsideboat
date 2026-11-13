// ALL COPY IN THIS FILE IS VERBATIM FROM THE OLD SITE (loughsideboatsales.co.uk, fetched 2026-11-12),
// with these exceptions, each listed in the delivery note:
//  - spelling fixes: "your selling" -> "you're selling", "an viewings" -> "and viewings", "exisiting" -> "existing",
//    "Adviced" -> "Advice", "theres" -> "there's", page title "Serviceinhg" -> "Servicing"
//  - designer notes that were published as copy are dropped ("Servicing box –", "Book a service link",
//    "3 boxes are stacked and not redable…", "About Loughside Boat Sales box –", "(will get a picture)")
//  - the homepage's second, near-duplicate "When your selling a boat…" sentence is dropped
// Neutral UI microcopy (button labels, form tick-boxes, counts) lives in the components.

export const site = {
  name: 'Loughside Boat Sales',
  short: 'Loughside',
  url: 'https://loughsideboatsales.co.uk',
  heroTitle: 'Loughside Boat Sales',
  intro: 'Independent boat brokerage, detailing and servicing on the Fermanagh loughs.',
  introSub: 'Sail into your next adventure with honest advice and personal service.',
  // Footer shows Sales@loughsideboatsales.co.uk; the contact page shows info@loughsideboatsales.com (flagged).
  email: 'Sales@loughsideboatsales.co.uk',
  phone: { display: '07745 682988', tel: '+447745682988', who: 'Jonny' },
  phones: [
    { who: 'Jonny', display: '07745 682988', tel: '+447745682988' },
    { who: 'John', display: '07927 903935', tel: '+447927903935' },
  ],
  copyright: 'Loughside Boat Sales. All rights reserved.',
};

export const nav = [
  { href: '/boats-for-sale', label: 'Boats for Sale' },
  { href: '/brokerage', label: 'Brokerage' },
  { href: '/detailing', label: 'Detailing' },
  { href: '/servicing', label: 'Servicing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// The four things Loughside does — one per propeller blade. Text verbatim from the homepage service boxes
// and the Boats for Sale page intro.
export const offers = [
  { slug: 'boats-for-sale', href: '/boats-for-sale', title: 'Boats for Sale', text: 'Browse our current listings. Get in touch if you need a boat sourced or enquire what is coming to the market.', photo: 'trailer' },
  { slug: 'brokerage', href: '/brokerage', title: 'Boat Brokerage', text: 'Professional listings, photography and marketing to get your boat sold.', photo: 'stern' },
  { slug: 'detailing', href: '/detailing', title: 'Detailing', text: 'Professional gelcoat restorations to antifouling & interior cleaning.', photo: 'interior' },
  { slug: 'servicing', href: '/servicing', title: 'Servicing', text: 'Routine servicing to maintenance and repairs.', photo: 'mc-shed' },
];

export const home = {
  title: 'Loughside | Boat Sales',
  whySell: {
    title: 'Why sell your boat with Loughside?',
    lead: 'When you’re selling a boat, you want straight advice and serious buyers – not time-wasters.',
    listIntro: 'With Loughside Boat Sales you get:',
    list: [
      'Honest valuations and clear communication throughout the sale',
      'Professional photos and well-presented listings',
      'All enquiries and viewings handled',
      'Competitive commission rates',
      'Local knowledge',
    ],
  },
  ready: {
    title: 'Ready to talk about your boat?',
    text: 'Whether you’re selling, buying or need help sourcing a boat or maintaining your boat get in touch',
  },
};

export const boatsPage = {
  title: 'Boats for Sale | Loughside',
  h1: 'Boats for sale',
  intro: 'Browse our current listings. Get in touch if you need a boat sourced or enquire what is coming to the market.',
};

export const sellBand = {
  title: 'Thinking of selling your boat?',
  text: 'We can photograph, list and handle enquiries for you.',
};

export const brokerage = {
  title: 'Brokerage | Loughside',
  h1: 'Brokerage',
  intro: 'Professional listings, photography and marketing to get your boat sold.',
  cta: 'Request a valuation',
  steps: [
    { title: 'Free valuation & chat', text: 'We’ll discuss your boat, history and ideal sale price, then agree a realistic marketing price together.' },
    { title: 'Photos, listing & marketing', text: 'We handle photos, description writing and listings, and promote your boat to our network of buyers.' },
    { title: 'Viewings & sale completion', text: 'We manage enquiries, viewings and negotiation, keeping you updated throughout.' },
  ],
  whyTitle: 'Why choose Loughside',
  why: [
    'Professional photography and videos',
    'Detailed listing with honest description',
    'Promotion throughout our existing contacts',
    'Advice on pricing, offers and negotiation',
    'Support with paperwork and handover',
  ],
  points: [
    'Independent, local broker on Lough Erne',
    'Personal one-to-one service with Johnny',
    'Experience with both sports boats and cruisers',
    'Honest advice – not just the price you want to hear',
  ],
};

export const detailing = {
  title: 'Detailing | Loughside',
  h1: 'Boat Detailing',
  intro: 'Professional gelcoat restorations to antifouling & interior cleaning.',
  cta: 'Request detailing quote',
  boxes: ['Gelcoat restoration', 'Marine ceramic coating', 'Interior and teak cleaning'],
  whyTitle: 'Why choose Loughside for detailing',
  why: [
    'Over 20 years experience',
    'Professional wet sanding, compounding & polishing',
    'Professional marine grade ceramic coating',
    'Cover cleaning & reproofing',
    'Teak cleaning',
    'Interior cleaning',
    'Bilge & Engine cleaning',
    'Antifouling',
    'Lift outs and hull cleans',
  ],
  band: { title: 'Want your boat looking its best?', text: 'We can wash, polish and protect your boat, ready for the season or for sale.' },
};

export const servicing = {
  title: 'Servicing | Loughside',
  h1: 'Boat Servicing',
  intro: 'Routine servicing to maintenance and repairs',
  cta: 'Book a service',
  boxes: ['Engine & Drive service', 'Winterising', 'Diagnostics, Repairs & Safety Checks'],
  whyTitle: 'Why choose Loughside for servicing',
  why: [
    'Professional engine & drive service',
    'Routine maintenance checks',
    'Breakdown call outs',
    'Battery checks',
    'Winterisation packages',
    'Boat transportation',
  ],
  band: { title: 'Want your boat running at its best?', text: 'We can service and maintain your boat so it’s ready for every trip – and spot issues before they become problems' },
};

export const about = {
  title: 'About | Loughside',
  h1: 'About Loughside Boat Sales',
  intro: 'Loughside Boat Sales is an independent boat brokerage based on Lough Erne. We help our customers to buy, sell and source the right boats for them. A service run by boat owners for boat owners.',
  people: [
    {
      name: 'Jonny',
      heading: 'Meet Jonny',
      text: [
        'Jonny has been around boats on Lough Erne for 20 years after initially setting up a successful independent boat detailing service. This has led to a customer base that now trust us with the handling and sale of their boats.',
        'We have setup Loughside Boat Sales to offer a fully insured, local, independent brokerage that treats every boat as if it was our own.',
      ],
      photo: null, // "(will get a picture)" — blank frame until supplied
    },
    {
      name: 'John',
      heading: 'Meet John',
      text: [
        'John has been around boats all his life, growing up on the shores of Lough Erne. With over 10 years as a marine engineer there’s no job too big or small.',
        'Whether you’re moving up, downsizing or selling a much-loved boat, he’ll give you straight, realistic advice and keep you updated at every stage.',
      ],
      photo: 'john-helm', // shown beside "Meet John" on the old About page
    },
  ],
  band: { title: 'Thinking about selling or upgrading?', text: 'If you would like a no obligation chat about your options, we are happy to talk boats.' },
};

export const contact = {
  title: 'Contact | Loughside',
  h1: 'Contact Loughside Boat Sales',
  intro: 'Ready to talk about buying, selling or looking after your boat? Get in touch.',
  formTitle: 'Send an enquiry',
  formIntro: 'Tell us a little about what you’re looking for and John will reply with some options and next steps.',
  fields: { name: 'Name', email: 'Email Address', phone: 'Phone Number', message: 'Message', submit: 'Submit' },
};
