/** Copy, photos and numbers shared by the mobile and web landing pages. */

export const photo = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=faces,center&w=${w}&h=${h}&q=70`;

export const PHOTOS = {
  hero: '1760551938407-f66c40173749',
  latte: '1509042239860-f550ce710b93',
  pranav: '1763014456070-6f42f3d8fbb0',
  anu: '1756376755233-d3abcd9a5edb',
  rohit: '1694871420680-88c06ab9cc49',
  explorer: '1759840278511-f73a3d62fb9f',
  foodtales: '1774437891793-2013f7b5a04a',
  cafe: '1669555354650-02227bc6c811',
  arjun: '1507003211169-0a1dd7228f2d',
};

export const BRANDS = ['Kaapi House', 'UrbanKart', 'Saree Story', 'Masala Labs', 'Bloom Skin', 'Desi Threads', 'PixelBazaar', 'Chai Collective'];

export const STEPS = [
  {
    title: 'Tell the AI your goal',
    text: 'Describe what you want in plain words — city, budget, audience. No forms.',
  },
  {
    title: 'Get matched creators',
    text: 'Influnz ranks local creators by audience fit, language and past results.',
  },
  {
    title: 'Approve & pay on delivery',
    text: 'Money sits in escrow and is released only when content goes live.',
  },
];

export const MATCHES = [
  { name: 'Shruti Vlogs', photo: PHOTOS.hero, fit: 96 },
  { name: 'Thefoodiepranav', photo: PHOTOS.pranav, fit: 92 },
  { name: 'Food Tales', photo: PHOTOS.foodtales, fit: 89 },
];

export const STATS = [
  { value: '2,400+', label: 'Verified creators' },
  { value: '40+', label: 'Indian cities' },
  { value: '3.2x', label: 'Average campaign ROI' },
  { value: '48h', label: 'From brief to launch' },
];

export const AUDIENCES = {
  brands: {
    label: 'For brands',
    points: [
      'Launch a campaign from one chat message',
      'AI negotiates fair rates within your guardrails',
      'Approve every post before it goes live',
      'Pay only for content that is delivered',
    ],
    cta: 'Start a campaign',
  },
  creators: {
    label: 'For creators',
    points: [
      'Get offers from brands that fit your audience',
      'Counter offers without awkward DMs',
      'Payment is secured in escrow before you shoot',
      'Get paid within 48 hours of going live',
    ],
    cta: 'Join as a creator',
  },
} as const;

export type Audience = keyof typeof AUDIENCES;

export const QUOTES = [
  {
    quote: 'We filled our café three weekends in a row. The AI picked creators our customers actually follow.',
    name: 'Priya Raman',
    role: 'Owner, Kaapi House · Chennai',
    photo: PHOTOS.anu,
  },
  {
    quote: 'I stopped chasing brands for payments. The money is in escrow before I even start shooting.',
    name: 'Pranav S.',
    role: 'Food creator · 320K followers',
    photo: PHOTOS.pranav,
  },
  {
    quote: 'Negotiation used to take a week of DMs. Now it is done before my chai gets cold.',
    name: 'Rohit Mehta',
    role: 'Marketing lead, UrbanKart',
    photo: PHOTOS.rohit,
  },
  {
    quote: 'Finally a platform that understands Tamil and Telugu audiences, not just metro English ones.',
    name: 'Arjun K.',
    role: 'Travel creator · 210K followers',
    photo: PHOTOS.arjun,
  },
];

export const FAQS = [
  {
    q: 'How much does Influnz cost?',
    a: 'Creating an account and planning campaigns is free. A small platform fee is added only when a creator deal is confirmed.',
  },
  {
    q: 'How are creators verified?',
    a: 'Every creator links their social accounts. We check audience authenticity, engagement quality and past brand work before they can receive offers.',
  },
  {
    q: 'What if a creator does not deliver?',
    a: 'Your payment stays in escrow until you approve the content. If nothing is delivered, the money comes back to you.',
  },
  {
    q: 'Can I work in regional languages?',
    a: 'Yes. Influnz matches creators across Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali and more.',
  },
];

export const LANGUAGES = ['Tamil', 'Hindi', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];

export const CHART = [38, 52, 46, 64, 58, 78, 92];
