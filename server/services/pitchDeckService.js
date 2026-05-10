import { detectTopic, extractOrGenerateName, extractCity, extractFunding } from './aiLogicService.js';

export function getTitleEmoji(topic) {
  const emojis = {
    food: '🍕', edtech: '📚', health: '🏥', fintech: '💳', agri: '🌾', saas: '⚡', tech: '🚀'
  };
  return emojis[topic] || '🚀';
}

export function selectSlides(templates, count, type) {
  if (!templates || templates.length === 0) return [];
  const selected = [templates[0]];
  if (count <= 1) return selected;
  const lastIndex = templates.length - 1;
  for (let i = 1; i < templates.length - 1 && selected.length < count - 1; i++) {
    if (templates[i]) {
      selected.push(templates[i]);
    }
  }
  const lastSlide = templates[lastIndex];
  if (lastSlide && !selected.includes(lastSlide) && selected.length < count) {
    selected.push(lastSlide);
  }
  return selected.slice(0, count);
}

export function generatePresentationContent(prompt, slideCount, theme, language, type) {
  const p = prompt.toLowerCase();
  const topic = detectTopic(p);
  const startupName = extractOrGenerateName(p, topic);
  const targetCity = extractCity(p);
  const fundingAsk = extractFunding(p);

  const themeColors = {
    '🌑 Dark': { bgColor: '#000000', titleColor: '#FFFFFF', textColor: '#E5E7EB', accentColor: '#FF6B00', cardBg: '#0A0A0A', subtitleColor: '#FF8C3A' },
    '🚀 Startup': { bgColor: '#000000', titleColor: '#FFFFFF', textColor: '#E2E8F0', accentColor: '#FF6B00', cardBg: '#0F0F0F', subtitleColor: '#FF8C3A' },
    '💼 Corporate': { bgColor: '#050505', titleColor: '#FFFFFF', textColor: '#CBD5E1', accentColor: '#FF6B00', cardBg: '#000000', subtitleColor: '#FF8C3A' },
    '☀️ Light': { bgColor: '#FFFFFF', titleColor: '#111827', textColor: '#374151', accentColor: '#FF6B00', cardBg: '#F8FAFC', subtitleColor: '#6B7280' },
    '🎨 Colorful': { bgColor: '#000000', titleColor: '#FFFFFF', textColor: '#FFD5CC', accentColor: '#FF6B00', cardBg: '#1A0A00', subtitleColor: '#FF8C3A' },
    '💜 Purple': { bgColor: '#000000', titleColor: '#FFFFFF', textColor: '#FFE0CC', accentColor: '#FF6B00', cardBg: '#1B0A00', subtitleColor: '#FF8C3A' }
  };

  const t = themeColors[theme] || themeColors['🚀 Startup'];

  const topicData = {
    food: {
      market: '$8.4B', growth: '28% YoY', ask: fundingAsk || '₹50 Lakhs',
      pain: 'Healthy affordable food unavailable', solution: 'Cloud kitchen network',
      revenue: '15% commission + delivery fee', traction: '500+ orders/day in beta',
      competitor1: 'Zomato', c1w: '25-30% commission', competitor2: 'Swiggy', c2w: 'Not profitable',
      competitor3: 'EatSure', c3w: 'Metro cities only',
      stat1: { v: '28%', l: 'Market Growth' }, stat2: { v: '₹350', l: 'Avg Order Value' },
      stat3: { v: '4.2x', l: 'LTV:CAC Ratio' }, stat4: { v: '68%', l: 'Repeat Order Rate' }
    },
    edtech: {
      market: '$4.2B', growth: '39% YoY', ask: fundingAsk || '₹75 Lakhs',
      pain: 'Quality education too expensive', solution: 'AI-powered personalized learning',
      revenue: '₹499/month subscription', traction: '2000+ active learners',
      competitor1: "Byju's", c1w: 'Too expensive', competitor2: 'Unacademy', c2w: 'Low completion',
      competitor3: 'Vedantu', c3w: 'High teacher cost',
      stat1: { v: '39%', l: 'Sector Growth' }, stat2: { v: '₹499', l: 'Monthly Price' },
      stat3: { v: '85%', l: 'Completion Rate' }, stat4: { v: '4.8★', l: 'User Rating' }
    },
    health: {
      market: '$6.1B', growth: '32% YoY', ask: fundingAsk || '₹1 Crore',
      pain: 'Good doctors inaccessible in tier 2', solution: 'Instant doctor booking platform',
      revenue: '₹50 per booking + medicine margin', traction: '1000+ patients served',
      competitor1: 'Practo', c1w: 'Poor tier 2 coverage', competitor2: 'PharmEasy', c2w: 'Delivery slow',
      competitor3: '1mg', c3w: 'Trust issues',
      stat1: { v: '50Cr+', l: 'Potential Patients' }, stat2: { v: '32%', l: 'Annual Growth' },
      stat3: { v: '₹50', l: 'Per Booking Revenue' }, stat4: { v: '90%', l: 'Patient Satisfaction' }
    },
    fintech: {
      market: '$31B', growth: '22% YoY', ask: fundingAsk || '₹2 Crore',
      pain: 'Small businesses lack financial tools', solution: 'All-in-one financial platform',
      revenue: '0.5% transaction fee + subscription', traction: '200+ SMEs onboarded',
      competitor1: 'Razorpay', c1w: 'Complex for SMEs', competitor2: 'PhonePe Biz', c2w: 'Limited features',
      competitor3: 'Paytm', c3w: 'Too cluttered',
      stat1: { v: '3Cr+', l: 'Target SMEs' }, stat2: { v: '$31B', l: 'Market Size' },
      stat3: { v: '22%', l: 'YoY Growth' }, stat4: { v: '200+', l: 'Beta Customers' }
    },
    agri: {
      market: '$2.3B', growth: '41% YoY', ask: fundingAsk || '₹50 Lakhs',
      pain: 'Farmers get 30% of actual value', solution: 'Farm to consumer direct platform',
      revenue: '8% commission both sides', traction: '50 farmers, 200 buyers active',
      competitor1: 'DeHaat', c1w: 'Limited states', competitor2: 'AgroStar', c2w: 'Maharashtra only',
      competitor3: 'Ninjacart', c3w: 'B2B only',
      stat1: { v: '12Cr+', l: 'Farmers in India' }, stat2: { v: '40%', l: 'Extra Income for Farmers' },
      stat3: { v: '30%', l: 'Savings for Buyers' }, stat4: { v: '41%', l: 'Sector Growth' }
    },
    saas: {
      market: '$3.8B', growth: '35% YoY', ask: fundingAsk || '₹1.5 Crore',
      pain: 'SMEs waste time on manual tasks', solution: 'AI automation platform',
      revenue: '₹2999/month per company', traction: '50 paying companies',
      competitor1: 'Zoho', c1w: 'Too complex', competitor2: 'Freshworks', c2w: 'Too expensive',
      competitor3: 'Spreadsheets', c3w: 'Error-prone',
      stat1: { v: '6Cr+', l: 'Target SMEs' }, stat2: { v: '₹2999', l: 'Monthly Price' },
      stat3: { v: '35%', l: 'Market Growth' }, stat4: { v: '50', l: 'Paying Customers' }
    },
    tech: {
      market: '$5.5B', growth: '31% YoY', ask: fundingAsk || '₹75 Lakhs',
      pain: 'Problem not solved efficiently today', solution: 'Technology-first modern solution',
      revenue: 'Freemium + Premium subscription', traction: '1000+ signups in beta',
      competitor1: 'Player 1', c1w: 'Poor UX', competitor2: 'Player 2', c2w: 'Too expensive',
      competitor3: 'Player 3', c3w: 'Outdated tech',
      stat1: { v: '$5.5B', l: 'Market Size' }, stat2: { v: '31%', l: 'Annual Growth' },
      stat3: { v: '1000+', l: 'Beta Signups' }, stat4: { v: '8/10', l: 'User Score' }
    }
  };

  const d = topicData[topic] || topicData.tech;

  const allSlideTemplates = [
    {
      layoutType: 'title',
      emoji: getTitleEmoji(topic),
      title: startupName,
      subtitle: d.solution + ' for India',
      content: 'Seed Round | ' + d.ask,
      speakerNotes: 'Start with energy! Introduce yourself and the company in 30 seconds. Make them curious.',
      stats: [],
      bulletPoints: []
    },
    {
      layoutType: 'bullets',
      emoji: '😤',
      title: 'The Problem',
      subtitle: 'A massive pain point ignored',
      content: d.pain + ' across India',
      bulletPoints: [
        'Crores of Indians face this daily',
        'Current solutions are expensive and poor',
        'No India-first solution exists today',
        'Market ready for disruption right now'
      ],
      speakerNotes: 'Tell a real story of someone facing this problem. Make the investors feel the pain personally.',
      stats: []
    },
    {
      layoutType: 'split',
      emoji: '💡',
      title: 'Our Solution',
      subtitle: startupName + ' — built for Bharat',
      content: d.solution,
      bulletPoints: [
        'Simple enough for non-tech users',
        'Works in Hindi and English',
        'Mobile-first, offline-capable',
        'Solves problem in under 2 minutes'
      ],
      speakerNotes: 'Demo the product here if possible. Show a screenshot or short video. Keep it visual.',
      stats: []
    },
    {
      layoutType: 'stats',
      emoji: '📊',
      title: 'Market Opportunity',
      subtitle: 'Massive TAM in India',
      content: 'Total addressable market analysis',
      bulletPoints: [],
      stats: [
        { value: d.market, label: 'Total Market (TAM)' },
        { value: d.growth, label: 'Annual Growth' },
        { value: '10Cr+', label: 'Target Users' },
        { value: targetCity, label: 'Launch City' }
      ],
      speakerNotes: 'Show bottom-up market calculation. TAM → SAM → SOM. Be conservative and credible.'
    },
    {
      layoutType: 'bullets',
      emoji: '⚡',
      title: 'How It Works',
      subtitle: '3 simple steps',
      content: 'Frictionless user journey',
      bulletPoints: [
        '1. User signs up in 30 seconds',
        '2. Core feature used instantly',
        '3. Value delivered in minutes',
        '4. Refer friends — viral growth'
      ],
      speakerNotes: 'Walk through the actual product flow. Show the app screens. Focus on simplicity.',
      stats: []
    },
    {
      layoutType: 'bullets',
      emoji: '💰',
      title: 'Business Model',
      subtitle: 'Multiple revenue streams',
      content: d.revenue,
      bulletPoints: [
        'Primary: ' + d.revenue,
        'Month 1-6: Free tier to build users',
        'Month 7+: Monetization begins',
        'Target: ₹10L MRR by Month 12'
      ],
      speakerNotes: 'Show unit economics clearly. LTV, CAC, payback period. Investors love specific numbers.',
      stats: []
    },
    {
      layoutType: 'stats',
      emoji: '🚀',
      title: 'Traction',
      subtitle: 'Early momentum is strong',
      content: 'Proof that market wants this',
      bulletPoints: [],
      stats: [
        { value: '1000+', label: 'Waitlist Users' },
        { value: d.traction.split(' ')[0], label: 'Active Users' },
        { value: '4.8★', label: 'Beta Rating' },
        { value: '₹2L', label: 'LOIs Signed' }
      ],
      speakerNotes: 'Show growth chart if possible. Even small numbers with strong growth rate is powerful.'
    },
    {
      layoutType: 'bullets',
      emoji: '🏆',
      title: 'Why We Win',
      subtitle: 'Unfair competitive advantage',
      content: 'We beat competition on every dimension',
      bulletPoints: [
        d.competitor1 + ': ' + d.c1w,
        d.competitor2 + ': ' + d.c2w,
        d.competitor3 + ': ' + d.c3w,
        startupName + ': India-first, affordable'
      ],
      speakerNotes: 'Never say no competition exists. Show you understand the landscape deeply.',
      stats: []
    },
    {
      layoutType: 'team',
      emoji: '👥',
      title: 'Our Team',
      subtitle: 'Experienced & Passionate',
      content: 'The minds behind ' + startupName,
      bulletPoints: [
        'Founder 1: 10+ years in ' + topic,
        'Founder 2: Tech wizard, ex-Google/Meta',
        'Advisor: Industry veteran with 3 exits',
        'Team of 10+ passionate builders'
      ],
      speakerNotes: 'Highlight the unique strengths of each founder. Why are YOU the right team to solve this?',
      stats: []
    },
    {
      layoutType: 'quote',
      emoji: '💬',
      title: 'Customer Love',
      subtitle: 'What people are saying',
      content: '"This is exactly what we needed. ' + startupName + ' changed how we work."',
      bulletPoints: [
        '— Early Beta User from ' + targetCity
      ],
      speakerNotes: 'Read the quote with emotion. Social proof is one of the strongest signals for investors.',
      stats: []
    },
    {
      layoutType: 'timeline',
      emoji: '📅',
      title: 'Roadmap',
      subtitle: 'The journey ahead',
      content: 'Our plan for the next 18 months',
      bulletPoints: [
        'Q2 2026: Product Launch in ' + targetCity,
        'Q3 2026: 10k Active Users milestone',
        'Q4 2026: Expansion to 3 more cities',
        'Q1 2027: Series A Funding round'
      ],
      speakerNotes: 'Show that you have a clear, ambitious but realistic plan. Focus on the next 12-18 months.',
      stats: []
    },
    {
      layoutType: 'thankyou',
      emoji: '🙏',
      title: 'Thank You',
      subtitle: 'Let\'s build the future together',
      content: 'Contact: founder@' + startupName.toLowerCase().replace(/\s+/g, '') + '.com',
      bulletPoints: [
        'Website: www.' + startupName.toLowerCase().replace(/\s+/g, '') + '.com',
        'Twitter: @' + startupName.toLowerCase().replace(/\s+/g, '')
      ],
      speakerNotes: 'End on a high note. Leave your contact info on the screen. Open the floor for Q&A.',
      stats: []
    }
  ];

  const slideSelection = selectSlides(allSlideTemplates, parseInt(slideCount), type);

  return {
    presentationTitle: startupName,
    subtitle: d.solution,
    fundingAsk: d.ask,
    presenter: 'Founder & CEO',
    theme: t,
    themeName: theme,
    slideCount: slideSelection.length,
    slides: slideSelection.map((s, i) => ({
      ...s,
      slideNumber: i + 1,
      content: s.content || 'Key insights about ' + s.title
    }))
  };
}
