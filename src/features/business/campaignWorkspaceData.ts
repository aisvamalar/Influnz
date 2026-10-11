/**
 * Shared campaign workspace data (creators, negotiation history, content deliverables)
 * used by both the web and mobile versions of the campaign workspace.
 */
import chennaiThumb from '../../assets/campaigns/chennai-cafe-thumb.png';
import avatarShruti from '../../assets/campaigns/avatar-shruti.png';
import c1Shruti from '../../assets/campaigns/c1-shruti.png';
import c2Pranav from '../../assets/campaigns/c2-pranav.png';
import c3Explorer from '../../assets/campaigns/c3-explorer.png';
import c4Anu from '../../assets/campaigns/c4-anu.png';
import c5Rohit from '../../assets/campaigns/c5-rohit.png';
import c6Foodtales from '../../assets/campaigns/c6-foodtales.png';
import c7Madras from '../../assets/campaigns/c7-madras.png';
import c8Cafe from '../../assets/campaigns/c8-cafe.png';

// Import content assets matching Pasted Image.png & Pasted Image 2.png
import contentD1 from '../../assets/campaigns/content-d1.png';
import contentD2 from '../../assets/campaigns/content-d2.png';
import contentD3 from '../../assets/campaigns/content-d3.png';
import videoPlayerMain from '../../assets/campaigns/video-player-main.png';
import frame1 from '../../assets/campaigns/frame-1.png';
import frame2 from '../../assets/campaigns/frame-2.png';
import frame3 from '../../assets/campaigns/frame-3.png';
import frame4 from '../../assets/campaigns/frame-4.png';
import complianceCert from '../../assets/campaigns/compliance-cert.png';

export interface NegotiationOffer {
  type: 'initial' | 'creator-counter' | 'our-counter';
  title: string;
  amount: string;
  deliverables: string;
  extra?: string;
}

export interface NegotiationStep {
  sender: 'ai' | 'creator';
  time: string;
  message: string;
  offer?: NegotiationOffer;
}

export interface ContentDeliverable {
  id: string;
  title: string;
  type: string;
  duration: string;
  status: 'approved' | 'in_review' | 'revision' | 'pending';
  complianceScore: number;
  submittedDate: string;
  thumbnail: string;
  videoPreview: string;
  caption: string;
  hashtags: string[];
  location: string;
  postedOn: string;
  likes: string;
  comments: string;
  shares: string;
  saves: string;
  checks: {
    brandTag: string;
    paidDisclosure: string;
    productShown: string;
    audioClear: string;
    noMisleading: string;
    formatDuration: string;
  };
}

export interface CreatorPerformance {
  views: string;
  reach: string;
  visits: number;
  cac: string;
  engagement: string;
  grade: 'A+' | 'A' | 'B+' | 'B' | '—';
  sales: string;
  couponsUsed: number;
  aiNote: string;
}

export interface CreatorPayment {
  totalFee: string;
  released: string;
  escrow: string;
  status: 'released' | 'escrow' | 'hold';
  invoiceId: string;
  accountMasked: string;
  tdsDeducted: string;
}

export interface CreatorData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  largeAvatar?: string;
  verified: boolean;
  status: 'accepted' | 'pending' | 'intervene' | 'not-started';
  contentStatus: 'approved' | 'in_review' | 'not-started' | 'pending' | 'completed';
  contentDeliveredText: string;
  finalOffer: string;
  wasPrice: string;
  initialOffer: string;
  creatorAsk: string;
  deliverables: string;
  usageRights: string;
  timeline: string;
  exclusivity: string;
  followers: string;
  engagement: string;
  location: string;
  insights: string[];
  steps: NegotiationStep[];
  contentDeliverables: ContentDeliverable[];
  performance: CreatorPerformance;
  payments: CreatorPayment;
}

export const INITIAL_CREATORS: CreatorData[] = [
  {
    id: 'shruti',
    name: 'Shruti Vlogs',
    handle: '@shruti.vlogs',
    avatar: c1Shruti,
    largeAvatar: avatarShruti,
    verified: true,
    status: 'accepted',
    contentStatus: 'approved',
    contentDeliveredText: '3/3 delivered',
    finalOffer: '₹32,000',
    wasPrice: '(was ₹45,000)',
    initialOffer: '₹25,000',
    creatorAsk: '₹45,000',
    deliverables: '1 Reel + 3 Stories',
    usageRights: '20 days',
    timeline: 'Within 20 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '1.2M',
    engagement: '4.8%',
    location: 'Chennai, TN',
    insights: [
      'Good audience fit for Chennai market',
      'Strong engagement rate (4.8%)',
      'Creator open to long-term collaboration',
      'Recommended for future campaigns',
    ],
    steps: [
      {
        sender: 'ai',
        time: '10:02 AM',
        message: 'Analyzed creator profile, audience fit and past brand collabs...',
        offer: {
          type: 'initial',
          title: 'Initial Offer',
          amount: '₹25,000',
          deliverables: '1 Reel + 3 Stories',
        },
      },
      {
        sender: 'ai',
        time: '10:03 AM',
        message: 'Creator requested ₹45,000. Negotiating within your limit...',
        offer: {
          type: 'creator-counter',
          title: 'Creator Counter',
          amount: '₹45,000',
          deliverables: '1 Reel + 3 Stories',
        },
      },
      {
        sender: 'ai',
        time: '10:04 AM',
        message: 'Presented counter offer with usage rights and 20 days timeline...',
        offer: {
          type: 'our-counter',
          title: 'Our Counter',
          amount: '₹32,000',
          deliverables: '1 Reel + 3 Stories',
          extra: '+ 20 days usage rights',
        },
      },
      {
        sender: 'creator',
        time: '10:06 AM',
        message:
          "Looks good! I'm happy to collaborate at ₹32,000 with the proposed deliverables and timeline.",
      },
    ],
    contentDeliverables: [
      {
        id: 'deliv-shruti-1',
        title: 'Café Experience Reel',
        type: 'Instagram Reel (30–60s)',
        duration: '0:45',
        status: 'approved',
        complianceScore: 98,
        submittedDate: 'Submitted on 25 Oct 2026',
        thumbnail: contentD1,
        videoPreview: videoPlayerMain,
        caption: 'The perfect café spot in Chennai! Great food, cozy vibes and a must visit! #ad #ChennaiCafe',
        hashtags: ['#ChennaiCafe', '#ChennaiFood', '#CafeVibes', '+2'],
        location: 'Chennai, TN',
        postedOn: '25 Oct 2026, 11:02 AM',
        likes: '8.2K',
        comments: '542',
        shares: '312',
        saves: '186',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '0:45 (Valid)',
        },
      },
      {
        id: 'deliv-shruti-2',
        title: 'Menu Highlight Story',
        type: 'Instagram Story (3 frames)',
        duration: '3 frames',
        status: 'approved',
        complianceScore: 96,
        submittedDate: 'Submitted on 28 Oct 2026',
        thumbnail: contentD2,
        videoPreview: contentD2,
        caption: 'Must-try signature cold brew and wood-fired sourdough pizzas at Chennai Café! Location tagged.',
        hashtags: ['#ChennaiCafe', '#FoodieChennai'],
        location: 'Chennai, TN',
        postedOn: '28 Oct 2026, 04:30 PM',
        likes: '4.5K',
        comments: '128',
        shares: '180',
        saves: '95',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '3 frames (Valid)',
        },
      },
      {
        id: 'deliv-shruti-3',
        title: 'Closing Story',
        type: 'Instagram Story (2 frames)',
        duration: '0:60',
        status: 'approved',
        complianceScore: 99,
        submittedDate: 'Submitted on 30 Oct 2026',
        thumbnail: contentD3,
        videoPreview: contentD3,
        caption: 'Weekend discount code CAFE15 still valid! Swipe up to get directions.',
        hashtags: ['#ChennaiCafe', '#WeekendVibes'],
        location: 'Chennai, TN',
        postedOn: '30 Oct 2026, 06:15 PM',
        likes: '6.1K',
        comments: '290',
        shares: '240',
        saves: '142',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '0:60 (Valid)',
        },
      },
    ],
    performance: {
      views: '325K',
      reach: '240K',
      visits: 540,
      cac: '₹59',
      engagement: '4.8%',
      grade: 'A+',
      sales: '₹2,43,000',
      couponsUsed: 312,
      aiNote: 'Highest footfall conversion in Chennai market. Drove massive weekend brunch traffic.',
    },
    payments: {
      totalFee: '₹32,000',
      released: '₹32,000',
      escrow: '₹0',
      status: 'released',
      invoiceId: 'INV-2026-081',
      accountMasked: 'HDFC •••• 4921',
      tdsDeducted: '₹320 (1%)',
    },
  },
  {
    id: 'pranav',
    name: 'Thefoodiepranav',
    handle: '@thefoodiepranav',
    avatar: c2Pranav,
    verified: false,
    status: 'pending',
    contentStatus: 'in_review',
    contentDeliveredText: '1/3 delivered',
    finalOffer: '₹28,000',
    wasPrice: '(was ₹40,000)',
    initialOffer: '₹22,000',
    creatorAsk: '₹40,000',
    deliverables: '1 Reel + 2 Stories',
    usageRights: '15 days',
    timeline: 'Within 15 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '340K',
    engagement: '5.2%',
    location: 'Chennai, TN',
    insights: [
      'High reach among foodies in Anna Nagar & T. Nagar',
      'Average view rate above 42,000 on restaurant reels',
      'Awaiting creator confirmation on counter offer',
    ],
    steps: [
      {
        sender: 'ai',
        time: '10:11 AM',
        message: 'Initiated brief with campaign deliverables and footfall target.',
        offer: {
          type: 'initial',
          title: 'Initial Offer',
          amount: '₹22,000',
          deliverables: '1 Reel + 2 Stories',
        },
      },
      {
        sender: 'ai',
        time: '10:14 AM',
        message: 'Creator counter received. Negotiating with creator within guardrails...',
        offer: {
          type: 'creator-counter',
          title: 'Creator Counter',
          amount: '₹40,000',
          deliverables: '1 Reel + 2 Stories',
        },
      },
      {
        sender: 'ai',
        time: '10:18 AM',
        message: 'Sent optimized counter offer of ₹28,000. Waiting for creator acceptance.',
        offer: {
          type: 'our-counter',
          title: 'Our Counter',
          amount: '₹28,000',
          deliverables: '1 Reel + 2 Stories',
          extra: '+ 15 days usage rights',
        },
      },
    ],
    contentDeliverables: [
      {
        id: 'deliv-pranav-1',
        title: 'Street Food vs Café Brew Comparison',
        type: 'Instagram Reel (30–60s)',
        duration: '0:50',
        status: 'in_review',
        complianceScore: 92,
        submittedDate: 'Submitted on 27 Oct 2026',
        thumbnail: contentD1,
        videoPreview: contentD1,
        caption: 'Exploring Chennai Café specialty drinks! Check out this filter coffee brew. #ad #ChennaiCafe',
        hashtags: ['#ChennaiCafe', '#ChennaiFoodies'],
        location: 'Anna Nagar, Chennai',
        postedOn: 'Draft Review',
        likes: '—',
        comments: '—',
        shares: '—',
        saves: '—',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '0:50 (Valid)',
        },
      },
    ],
    performance: {
      views: '98,000',
      reach: '76,000',
      visits: 180,
      cac: '₹68',
      engagement: '5.2%',
      grade: 'A',
      sales: '₹84,000',
      couponsUsed: 94,
      aiNote: 'Strong engagement from youth demographic in Anna Nagar.',
    },
    payments: {
      totalFee: '₹28,000',
      released: '₹0',
      escrow: '₹28,000',
      status: 'escrow',
      invoiceId: 'INV-2026-084',
      accountMasked: 'ICICI •••• 8820',
      tdsDeducted: '₹280 (1%)',
    },
  },
  {
    id: 'explorer',
    name: 'Chennai Explorer',
    handle: '@chennai.explorer',
    avatar: c3Explorer,
    verified: false,
    status: 'intervene',
    contentStatus: 'not-started',
    contentDeliveredText: '0/3 delivered',
    finalOffer: '₹30,000',
    wasPrice: '(was ₹38,000)',
    initialOffer: '₹24,000',
    creatorAsk: '₹38,000',
    deliverables: '2 Reels + 2 Stories',
    usageRights: '30 days',
    timeline: 'Within 18 days',
    exclusivity: 'Regional exclusive (TN)',
    followers: '490K',
    engagement: '3.9%',
    location: 'Chennai, TN',
    insights: [
      'Creator requested higher usage rights fee',
      'Counter-offer is near the business approval limit',
      'Manual intervention recommended to close the deal',
    ],
    steps: [],
    contentDeliverables: [],
    performance: {
      views: '1,10,000',
      reach: '85,000',
      visits: 210,
      cac: '₹82',
      engagement: '3.9%',
      grade: 'B+',
      sales: '₹95,000',
      couponsUsed: 112,
      aiNote: 'Good city discovery audience. Deliverables activate upon deal confirmation.',
    },
    payments: {
      totalFee: '₹30,000',
      released: '₹0',
      escrow: '₹30,000',
      status: 'hold',
      invoiceId: 'INV-2026-085',
      accountMasked: 'Axis •••• 1044',
      tdsDeducted: '₹300 (1%)',
    },
  },
  {
    id: 'anu',
    name: 'Travel with Anu',
    handle: '@travelwithanu',
    avatar: c4Anu,
    verified: true,
    status: 'accepted',
    contentStatus: 'pending',
    contentDeliveredText: '0/3 delivered',
    finalOffer: '₹38,000',
    wasPrice: '(was ₹55,000)',
    initialOffer: '₹30,000',
    creatorAsk: '₹55,000',
    deliverables: '1 Reel + 4 Stories',
    usageRights: '25 days',
    timeline: 'Within 20 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '620K',
    engagement: '4.5%',
    location: 'Chennai, TN',
    insights: [
      'High trust score & viral reel track record in Chennai',
      'Agreed to special café tasting walkthrough',
      'Discount achieved: 31% from initial ask',
    ],
    steps: [],
    contentDeliverables: [],
    performance: {
      views: '1,90,000',
      reach: '1,45,000',
      visits: 310,
      cac: '₹122',
      engagement: '4.5%',
      grade: 'A',
      sales: '₹1,38,000',
      couponsUsed: 165,
      aiNote: 'Excellent brand prestige and high reach across Tamil Nadu tourists.',
    },
    payments: {
      totalFee: '₹38,000',
      released: '₹38,000',
      escrow: '₹0',
      status: 'released',
      invoiceId: 'INV-2026-082',
      accountMasked: 'SBI •••• 9923',
      tdsDeducted: '₹380 (1%)',
    },
  },
  {
    id: 'rohit',
    name: 'Rohit Visuals',
    handle: '@rohitvisuals',
    avatar: c5Rohit,
    verified: false,
    status: 'accepted',
    contentStatus: 'completed',
    contentDeliveredText: '4/4 delivered',
    finalOffer: '₹25,000',
    wasPrice: '(was ₹32,000)',
    initialOffer: '₹20,000',
    creatorAsk: '₹32,000',
    deliverables: '1 Reel + 2 Stories',
    usageRights: '20 days',
    timeline: 'Within 14 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '280K',
    engagement: '6.1%',
    location: 'Chennai, TN',
    insights: [
      'Highest engagement rate in creator pool (6.1%)',
      'Cinematic visual style for café aesthetic showcase',
      'Fast turnaround promised within 14 days',
    ],
    steps: [],
    contentDeliverables: [
      {
        id: 'deliv-rohit-1',
        title: 'Cinematic Café Ambience & Special Pastries',
        type: 'Instagram Reel (30–60s)',
        duration: '0:58',
        status: 'approved',
        complianceScore: 94,
        submittedDate: 'Submitted on 26 Oct 2026',
        thumbnail: contentD2,
        videoPreview: contentD2,
        caption: 'Moody lighting, slow pours and artisanal bakery treats at Chennai Café. #sponsored #ChennaiCafe',
        hashtags: ['#ChennaiCafe', '#ChennaiAesthetics'],
        location: 'Alwarpet, Chennai',
        postedOn: '26 Oct 2026, 02:15 PM',
        likes: '12.4K',
        comments: '680',
        shares: '512',
        saves: '420',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '0:58 (Valid)',
        },
      },
    ],
    performance: {
      views: '1,80,000',
      reach: '1,32,000',
      visits: 460,
      cac: '₹54',
      engagement: '6.1%',
      grade: 'A+',
      sales: '₹2,05,000',
      couponsUsed: 278,
      aiNote: 'Lowest cost per visit (₹54). High repeat footfall driven to store.',
    },
    payments: {
      totalFee: '₹25,000',
      released: '₹12,500',
      escrow: '₹12,500',
      status: 'escrow',
      invoiceId: 'INV-2026-083',
      accountMasked: 'HDFC •••• 3311',
      tdsDeducted: '₹250 (1%)',
    },
  },
  {
    id: 'foodtales',
    name: 'Food Tales',
    handle: '@foodtales.in',
    avatar: c6Foodtales,
    verified: false,
    status: 'pending',
    contentStatus: 'in_review',
    contentDeliveredText: '2/4 delivered',
    finalOffer: '₹26,000',
    wasPrice: '(was ₹35,000)',
    initialOffer: '₹20,000',
    creatorAsk: '₹35,000',
    deliverables: '1 Reel + 3 Stories',
    usageRights: '15 days',
    timeline: 'Within 15 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '210K',
    engagement: '4.7%',
    location: 'Chennai, TN',
    insights: [
      'Strong local food discovery audience',
      'Creator countered at ₹35,000',
      'AI countered at ₹26,000; awaiting final reply',
    ],
    steps: [],
    contentDeliverables: [
      {
        id: 'deliv-foodtales-1',
        title: 'Top 5 Desserts to Try at Chennai Café',
        type: 'Instagram Reel (30–60s)',
        duration: '0:50',
        status: 'in_review',
        complianceScore: 90,
        submittedDate: 'Submitted on 29 Oct 2026',
        thumbnail: contentD3,
        videoPreview: contentD3,
        caption: 'Dessert lovers rejoice! Trying the tiramisu & pain au chocolat at Chennai Café. #ad #ChennaiCafe',
        hashtags: ['#ChennaiDesserts', '#ChennaiCafe'],
        location: 'Chennai, TN',
        postedOn: 'Draft Review',
        likes: '—',
        comments: '—',
        shares: '—',
        saves: '—',
        checks: {
          brandTag: 'Found',
          paidDisclosure: 'Found',
          productShown: 'Found',
          audioClear: 'Good',
          noMisleading: 'Clear',
          formatDuration: '0:50 (Valid)',
        },
      },
    ],
    performance: {
      views: '72,000',
      reach: '58,000',
      visits: 140,
      cac: '₹64',
      engagement: '4.7%',
      grade: 'B+',
      sales: '₹62,000',
      couponsUsed: 71,
      aiNote: 'Good dessert & bakery crowd footfall driven during tea time.',
    },
    payments: {
      totalFee: '₹26,000',
      released: '₹0',
      escrow: '₹26,000',
      status: 'escrow',
      invoiceId: 'INV-2026-086',
      accountMasked: 'Kotak •••• 7120',
      tdsDeducted: '₹260 (1%)',
    },
  },
  {
    id: 'madras',
    name: 'Madras Bites',
    handle: '@madrasbites',
    avatar: c7Madras,
    verified: false,
    status: 'not-started',
    contentStatus: 'not-started',
    contentDeliveredText: '0/2 delivered',
    finalOffer: '—',
    wasPrice: '',
    initialOffer: '₹18,000',
    creatorAsk: '₹28,000',
    deliverables: '1 Reel + 2 Stories',
    usageRights: '14 days',
    timeline: 'Within 14 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '180K',
    engagement: '4.2%',
    location: 'Chennai, TN',
    insights: [
      'High concentration of South Chennai foodies',
      'Ready for automated AI negotiation',
      'Click "AI Negotiate" to generate offer',
    ],
    steps: [],
    contentDeliverables: [],
    performance: {
      views: '—',
      reach: '—',
      visits: 0,
      cac: '—',
      engagement: '4.2%',
      grade: '—',
      sales: '—',
      couponsUsed: 0,
      aiNote: 'Negotiation pending. Sourcing content brief upon contract signature.',
    },
    payments: {
      totalFee: '₹22,000 (Est.)',
      released: '₹0',
      escrow: '₹0',
      status: 'hold',
      invoiceId: 'Pending',
      accountMasked: 'Verified on Sign',
      tdsDeducted: '₹0',
    },
  },
  {
    id: 'cafe',
    name: 'Cafe Stories',
    handle: '@cafestories',
    avatar: c8Cafe,
    verified: false,
    status: 'not-started',
    contentStatus: 'not-started',
    contentDeliveredText: '0/3 delivered',
    finalOffer: '—',
    wasPrice: '',
    initialOffer: '₹16,000',
    creatorAsk: '₹24,000',
    deliverables: '1 Reel + 2 Stories',
    usageRights: '14 days',
    timeline: 'Within 14 days',
    exclusivity: 'Category exclusive (Chennai)',
    followers: '140K',
    engagement: '3.8%',
    location: 'Chennai, TN',
    insights: [
      'Niche café review channel',
      'Ready for automated AI negotiation',
      'Click "AI Negotiate" to generate offer',
    ],
    steps: [],
    contentDeliverables: [],
    performance: {
      views: '—',
      reach: '—',
      visits: 0,
      cac: '—',
      engagement: '3.8%',
      grade: '—',
      sales: '—',
      couponsUsed: 0,
      aiNote: 'Negotiation pending. Sourcing content brief upon contract signature.',
    },
    payments: {
      totalFee: '₹19,000 (Est.)',
      released: '₹0',
      escrow: '₹0',
      status: 'hold',
      invoiceId: 'Pending',
      accountMasked: 'Verified on Sign',
      tdsDeducted: '₹0',
    },
  },
];

export { chennaiThumb, complianceCert, frame1, frame2, frame3, frame4, videoPlayerMain };
