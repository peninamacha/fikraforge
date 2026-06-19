/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductPlatform, Competition, NewsArticle, Testimonial, TeamMember, ServiceItem, LabCapability } from '../types';

export const PRODUCTS: ProductPlatform[] = [
  {
    id: 'barakazetu',
    name: 'BarakaZetu',
    category: 'live Platform · Music · Streaming',
    description: 'Faith-based music streaming platform featuring offline playback, artist studio tools, live radio channels, and intelligent curation. Live on the Google Play Store.',
    longDescription: 'BarakaZetu is East Africa\'s premier faith-based digital content platform. Built with a robust Flutter client and high-performance server architecture, it enables artists to upload, license, and monetize gospel and spiritual tracks, offering a seamless and low-bandwidth friendly streaming experience for listeners.',
    icon: '🎵',
    url: 'https://barakazetu.com',
    status: 'live',
    tags: ['Mobile App', 'Flutter', 'Streaming', 'Firebase Backend'],
    image: 'https://placehold.co/600x400/121212/C94A1A?text=BarakaZetu+Active+Play'
  },
  {
    id: 'jamiispot',
    name: 'JamiiSpot',
    category: 'live Platform · Community · Identity',
    description: 'Ecosystem introducing NFC-powered smart cards paired with real-time web profiles, event ticketing, and professional networking directory solutions.',
    longDescription: 'JamiiSpot simplifies professional networking in Tanzania. By tapping custom NFC wooden or matte-finish cards on any modern mobile device, creators instantly share a secured, dynamically updated profile featuring their portfolios, contacts, and active social channels.',
    icon: '🌍',
    url: 'https://jamiispot.com',
    status: 'live',
    tags: ['NFC Tech', 'Web App', 'Identity', 'Enterprise'],
    image: 'https://placehold.co/600x400/121212/C94A1A?text=JamiiSpot+NFC+System'
  },
  {
    id: 'fikramakazi',
    name: 'FikraMakazi',
    category: 'Digital · PropTech · SaaS',
    description: 'Sleek rental management system automating lease agreements, rent tracking, tenant notifications, and automated payments through M-Pesa.',
    longDescription: 'FikraMakazi is a residential and commercial asset management portal. It connects local property owners directly to tenants, processing rent receipts in seconds via Tanzanian mobile money provider APIs (M-Pesa, TigoPesa) and generating legally-sound automated lease contracts.',
    icon: '🏠',
    status: 'development',
    tags: ['PropTech', 'SaaS', 'Mobile Money', 'Automation'],
    image: 'https://placehold.co/600x400/121212/C94A1A?text=FikraMakazi+SaaS'
  },
  {
    id: 'fikrasiri',
    name: 'FikraSiri',
    category: 'Digital · Privacy · Social Feed',
    description: 'Private anonymous feedback channel designed to construct healthy, double-blind constructive dialogue between teams, leaders, and creators.',
    longDescription: 'FikraSiri is a highly secure client-side communication tool. It ensures safe, fully anonymous communication pathways while preventing harassment through smart prompt-moderation, helping groups align on feedback objectively.',
    icon: '💬',
    status: 'live',
    tags: ['Privacy', 'Communication', 'Dialogue', 'Security'],
    image: 'https://placehold.co/600x400/121212/C94A1A?text=FikraSiri+Platform'
  },
  {
    id: 'fikrapesa',
    name: 'FikraPesa',
    category: 'Digital · Fintech · payment',
    description: 'Dual-engine transactional dashboard built with secure localized ledger networks and custom payment routing mechanisms. Entry point scheduled for late 2026.',
    icon: '💰',
    status: 'concept',
    tags: ['Fintech', 'Ledger', 'Payment APIs', 'In Progress']
  },
  {
    id: 'prototyping',
    name: 'Physical Prototyping',
    category: 'Hardware · Precision Fabrication',
    description: 'Engineering workflows turning digital CAD blueprints into structural models using our high-grade 3D printers and custom assembly frameworks.',
    icon: '⚙️',
    status: 'live',
    tags: ['CAD / CAM', '3D Printing', 'Product Engineering', 'Materials']
  }
];

export const COMPETITIONS: Competition[] = [
  {
    id: 'sprint2026',
    title: 'FikraForge Product Design Sprint 2026',
    status: 'live',
    statusText: 'Open · Accepting Entries',
    description: 'Coordinated by FikraForge Design Studio. Form a team of 1–4 to solve a hyper-local challenge in Tanzania using minimal tech and smart hardware design. Winners receive fully-funded Lab access, prototyping budget, and mentorship.',
    prize: 'Tsh 5,000,000 + Physical Lab Access & Prototyping Support',
    deadline: 'August 15, 2026',
    type: 'Product Design & Prototyping'
  },
  {
    id: 'patent2026',
    title: 'Forge IP Challenge — Patent Your Idea',
    status: 'live',
    statusText: 'Open · Registration Active',
    description: 'Organized in strategic partnership with BRELA. For inventors across East Africa developing unique mechanical, digital, or process-based innovations. Best submissions get funded legal representation and drafting support for patent documentation.',
    partners: ['BRELA', 'Law Associates'],
    prize: 'Full Legal Patent Drafting, Submission Funding & IP Masterclass',
    deadline: 'September 30, 2026',
    type: 'IP & Patent Strategy'
  },
  {
    id: 'maker2026',
    title: '3D Print It! — East Africa Maker Challenge',
    status: 'upcoming',
    statusText: 'Upcoming · Commencing October',
    description: 'A hands-on physical maker marathon hosted live at the DSM Forge Lab. Secondary school and university teams will be provided a pack of PLA filament and given 48 hours to model, print, and defend a physical tool.',
    prize: 'Preconfigured 3D Printer for School/Lab + Seed Filament Supply',
    deadline: 'October 25, 2026 (Opens)',
    type: '3D Fabrication / Robotics'
  },
  {
    id: 'jam2025',
    title: 'Forge UI Jam 2025',
    status: 'past',
    statusText: 'Concluded · December 2025',
    description: 'Our annual 48-hour digital interface sprint. 12 elite design teams designed responsive interfaces. The winning concept, "Mwaka Property Engine" was acquired for integration into our upcoming FikraMakazi release.',
    prize: 'Tsh 2,500,000 + Internship Offer at FikraForge',
    deadline: 'December 18, 2025',
    type: 'UI/UX Design'
  }
];

export const NEWS: NewsArticle[] = [
  {
    id: 'brela2026',
    date: 'February 9, 2026',
    monthYear: 'Feb 2026',
    title: 'FikraForge Inc. formally incorporated under BRELA, Dar es Salaam',
    body: 'After operating as a focused builder collective since late 2023, FikraForge achieved its primary legal milestone: formal incorporation as FikraForge Inc. (BRELA No. 165382103). Under this entity, we have established our multi-division corporate structure covering digital products, legal compliance, and design studio consultancy.',
    category: 'Milestone'
  },
  {
    id: 'baraka2026',
    date: 'January 15, 2026',
    monthYear: 'Jan 2026',
    title: 'BarakaZetu launches on Google Play Store with 500+ songs',
    body: 'The first official release of 2026 was the live deployment of BarakaZetu on Android. The initial version has been highly optimized for local network architectures, keeping file sizes exceptionally small (sub 15MB) and caching audio intelligently to prevent stream interruptions in areas of poor connectivity.',
    category: 'Product'
  },
  {
    id: 'jamiispot2025',
    date: 'December 10, 2025',
    monthYear: 'Dec 2025',
    title: 'JamiiSpot NFC business card platform goes live for creative leaders',
    body: 'JamiiSpot completed its closed beta test and officially rolled out NFC digital identities. Creative consultants, startup developers, and local agency leads in Dar es Salaam received custom, hand-polished African timber NFC business cards that point directly to their interactive dossiers.',
    category: 'Product'
  },
  {
    id: 'labopen2025',
    date: 'October 1, 2025',
    monthYear: 'Oct 2025',
    title: 'FikraForge Design Studio opens physical innovation lab in DSM',
    body: 'FikraForge established its physical operational workshop base in the heart of Dar es Salaam, Tanzania. This state-of-the-art office features full digital fabrication apparatus, high-speed fiber lines, legal resources, and our newly integrated DMAKERS precision 3D printer and high-capacity Epson L4-Ink series machinery.',
    category: 'Studio'
  },
  {
    id: 'makaziprd2025',
    date: 'September 20, 2025',
    monthYear: 'Sep 2025',
    title: 'FikraMakazi Product Requirement Document finalized & approved',
    body: 'The FikraMakazi product team finalized and signed off the core architectural system designs, setting immediate development paths. The custom M-Pesa automated transaction processor is slated for testing by early summer.',
    category: 'Product'
  },
  {
    id: 'founding2023',
    date: 'December 1, 2023',
    monthYear: 'Dec 2023',
    title: 'FikraForge brand founded as specialized innovation collective',
    body: 'FikraForge was born in Dar es Salaam, Tanzania, as a small group of ambitious developers, mechanical engineers, and intellectual property advocates wishing to provide a genuine localized "forge" where raw creativity gets cast into sustainable technology.',
    category: 'Milestone'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'florence',
    text: 'FikraForge engineered our custom team NFC identity card solution from scratch. The visual fidelity, secure profile engine, and overall delivery speeds have been exceptional.',
    author: 'Florence Sakaya',
    role: 'Brand Strategist · Sakaya Creative, DSM',
    avatarInitials: 'FS'
  },
  {
    id: 'walter',
    text: 'Formulating BarakaZetu alongside FikraForge Inc. gave us literal confidence that African-constructed software product engines can stand shoulder-to-shoulder with global standards.',
    author: 'Walter Joseph',
    role: 'Product Lead · BarakaZetu',
    avatarInitials: 'WJ'
  },
  {
    id: 'penina',
    text: 'The core collective understands both deep engineering principles and the hyper-local cultural nuances of launching products in East Africa. That composition is incredibly rare.',
    author: 'Penina Macha',
    role: 'Early Stakeholder · Dar es Salaam',
    avatarInitials: 'PM'
  }
];

export const TEAM: TeamMember[] = [
  {
    id: 'software',
    name: 'Software & AI Team',
    role: 'Frontend, Backend, Flutter & AI Systems',
    description: 'Directs the engineering of FikraForge\'s digital platforms. Expert in responsive web apps, reactive mobile clients (Flutter), cloud APIs, and specialized AI caching engines.',
    avatarInitials: 'SA'
  },
  {
    id: 'growth',
    name: 'Growth & Marketing',
    role: 'Social Media Management & Strategy',
    description: 'Manages user outreach, social campaign delivery, community channels, brand messaging, and client engagement systems, ensuring FikraForge products reach active audiences.',
    avatarInitials: 'GM'
  },
  {
    id: 'engineering',
    name: 'Engineering & Consultancy',
    role: 'Mechanical, CAD & Prototyping Systems',
    description: 'Drives physical product strategies, 3D modeling, CAD rendering, additive fabrication, and structural modeling of inventions to secure solid manufacturing paths.',
    avatarInitials: 'EC'
  },
  {
    id: 'legal',
    name: 'Legal & Intellectual Property',
    role: 'IP Counsel, Patents & Corporate Compliance',
    description: 'Provides intellectual property consulting, legal patent drafting, trademark verification, regulatory alignment, and direct liaising with BRELA inside Tanzania.',
    avatarInitials: 'LC'
  }
];

export const SERVICES: ServiceItem[] = [
  { id: '1', num: '01', name: 'Software Development (Web, Mobile, Flutter)' },
  { id: '2', num: '02', name: 'Product Design & Electronics Engineering' },
  { id: '3', num: '03', name: '3D Prototyping & CNC Additive Fabrication' },
  { id: '4', num: '04', name: 'Intellectual Property & Patent Consulting' },
  { id: '5', num: '05', name: 'Innovation Sprints & Strategic Consulting' },
  { id: '6', num: '06', name: 'Social Media Management & Brand Growth' },
  { id: '7', num: '07', name: 'Design Competitions, Hackathons & Challenges' }
];

export const LAB_CAPABILITIES: LabCapability[] = [
  {
    id: '3dprint',
    icon: '⚙️',
    name: '3D Printing Lab',
    detail: 'Equipped with custom DMAKERS precision FDM printers utilizing PLA, PETG, and composite materials for structural and mechanical validation.'
  },
  {
    id: 'inkprint',
    icon: '🖨️',
    name: 'Color Publication Engine',
    detail: 'Epson L634 series continuous ink system, enabling quick asset printing, documentation publishing, and high-fidelity packaging mockups.'
  },
  {
    id: 'workstation',
    icon: '🖥️',
    name: 'High-Performance Workstation',
    detail: 'Dedicated local computational base hosting CAD, simulation solvers, cross-compiler toolchains, and offline deployment validation environments.'
  },
  {
    id: 'sprints',
    icon: '💡',
    name: 'Design Innovation Sprints',
    detail: 'Half-day workspace workshops designed for startups and companies to map, brainstorm, structure, and stress-test product ideas before writing code.'
  },
  {
    id: 'patent',
    icon: '🔒',
    name: 'IP Strategy Consultation',
    detail: 'Direct guidance in compiling, drafting, protecting, and submitting patent assets to BRELA (Business Registrations and Licensing Agency).'
  },
  {
    id: 'prototyping',
    icon: '📋',
    name: 'Rapid CAD-to-Product Prototyping',
    detail: 'Full CAD blueprint mapping, ergonomics testing, rapid assembly of mechanical fasteners, and final functional checks in realistic environments.'
  }
];
