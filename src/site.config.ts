/**
 * Every business fact the site renders lives here. Change it once, it changes
 * everywhere. Nothing else in the codebase should hard-code a phone number,
 * an address or an analytics ID.
 */
export const site = {
  name: 'Coravant',
  legalName: 'Coravant Limited',
  url: 'https://www.coravant.co.uk',
  tagline: 'Software that fits your business, not the other way round',
  description:
    'Coravant builds and fixes the software that UK manufacturers, distributors and retailers run on. Six developers, thirty years of combined experience, based in West Yorkshire.',

  email: 'info@coravant.co.uk',
  // No public phone number by choice: enquiries come through email and the
  // booking form. Add one here and it appears in the header, footer and schema.
  phone: '' as string,
  linkedin: 'https://www.linkedin.com/company/coravant',

  address: {
    street: '455 Bradford Road',
    locality: 'Liversedge',
    region: 'West Yorkshire',
    postcode: 'WF15 6BT',
    country: 'GB',
  },

  companyNumber: '11565030',
  founded: 2018,

  /** Headline credibility facts. Kept to three: more reads as padding. */
  stats: [
    { value: 6, suffix: '', label: 'developers, all UK-based' },
    { value: 30, suffix: '+', label: 'years of combined experience' },
    { value: 2018, suffix: '', label: 'trading since', plain: true },
  ],

  sectors: [
    'Manufacturing',
    'Import and distribution',
    'Ecommerce',
    'Retail',
    'Pharmacy',
    'Professional services',
  ],

  /**
   * Tally form IDs. Created in the Coravant Tally workspace; swap an ID here
   * to point a page at a different form.
   */
  tally: {
    enquiry: 'GxM0GQ',
    consultation: 'jaKxRY',
  },

  /**
   * Cal.com booking link, e.g. 'coravant/consultation'. Leave empty and the
   * booking page falls back to the Tally consultation form on its own.
   */
  cal: {
    link: '' as string,
    durationMinutes: 30,
  },

  analytics: {
    /** Loads only after cookie consent. */
    ga4: 'G-T01JXM8ZVT',
    /** Cookieless, loads always. Paste the token from the Cloudflare dashboard. */
    cloudflareToken: '' as string,
  },
} as const;

export const nav = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export const formatAddress = () =>
  [site.address.street, site.address.locality, site.address.postcode].join(', ');
