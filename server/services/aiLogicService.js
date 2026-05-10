// This logic was extracted from App.jsx to centralize AI-related logic on the backend.

export function detectTopic(prompt) {
  const p = prompt.toLowerCase();
  const map = {
    food: ['food', 'tiffin', 'restaurant', 'delivery', 'kitchen', 'cook', 'meal', 'snack', 'cloud kitchen'],
    edtech: ['education', 'student', 'learn', 'teach', 'school', 'college', 'course', 'tutor', 'jee', 'neet'],
    health: ['health', 'doctor', 'medicine', 'hospital', 'fitness', 'medical', 'patient', 'clinic', 'pharma'],
    fintech: ['money', 'payment', 'loan', 'invest', 'finance', 'bank', 'insurance', 'credit', 'upi'],
    agri: ['farmer', 'farm', 'crop', 'agriculture', 'kisan', 'harvest', 'vegetable', 'grain'],
    saas: ['software', 'tool', 'platform', 'dashboard', 'automation', 'crm', 'erp', 'management', 'workflow']
  };
  for (const [topic, words] of Object.entries(map)) {
    if (words.some(w => p.includes(w))) return topic;
  }
  return 'tech';
}

export function extractOrGenerateName(prompt, topic) {
  const words = prompt.split(' ');
  const caps = words.find(w => w.length > 3 && w[0] === w[0].toUpperCase() && w[0] !== w[0].toLowerCase());
  if (caps && caps.length > 3) return caps;

  const names = {
    food: ['TiffinHub', 'FreshBox', 'GharKhana', 'MealMate', 'YumGo'],
    edtech: ['LearnFast', 'VidyaAI', 'SmartGuru', 'StudyPro', 'GyanBox'],
    health: ['DocNear', 'CareAI', 'SwasthApp', 'MedEasy', 'HealHub'],
    fintech: ['PayFast', 'DhanAI', 'MoneyMate', 'FinEasy', 'ArthPro'],
    agri: ['KisanHub', 'FarmDirect', 'FasalAI', 'GreenMart', 'AgroConnect'],
    saas: ['FlowAI', 'DashPro', 'StackUp', 'AutoMate', 'ScaleHub'],
    tech: ['TechHub', 'AppPro', 'DigiSolve', 'SmartApp', 'InnovatePro']
  };
  const list = names[topic] || names.tech;
  return list[Math.floor(Math.random() * list.length)];
}

export function extractCity(prompt) {
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
  const p = prompt.toLowerCase();
  return cities.find(c => p.includes(c.toLowerCase())) || 'Delhi NCR';
}

export function extractFunding(prompt) {
  const match = prompt.match(/₹\s*\d+\s*(lakh|crore|L|Cr)/i);
  return match ? match[0] : null;
}



export function generateMockDashboard(idea, city) {
  const topic = detectTopic(idea);
  const startupName = extractOrGenerateName(idea, topic);

  const stats = {
    food: { tam: "$8.4B", growth: "28%", users: "1.2M", competitors: ["Zomato", "Swiggy", "EatFit"] },
    edtech: { tam: "$4.2B", growth: "39%", users: "2.5M", competitors: ["Byju's", "Unacademy", "PhysicsWallah"] },
    health: { tam: "$6.1B", growth: "32%", users: "800K", competitors: ["Practo", "PharmEasy", "HealthifyMe"] },
    fintech: { tam: "$31B", growth: "22%", users: "5M", competitors: ["Razorpay", "PhonePe", "BharatPe"] },
    agri: { tam: "$2.3B", growth: "41%", users: "300K", competitors: ["DeHaat", "Ninjacart", "AgroStar"] },
    saas: { tam: "$3.8B", growth: "35%", users: "100K", competitors: ["Zoho", "Freshworks", "Postman"] },
    tech: { tam: "$5.5B", growth: "31%", users: "1M", competitors: ["Player 1", "Player 2", "Player 3"] }
  };

  const s = stats[topic] || stats.tech;

  return {
    startupName,
    marketSize: s.tam,
    marketAnalysisDetails: `The ${topic} market in ${city} is experiencing a massive shift towards digital-first solutions. With a projected growth rate of ${s.growth}, there is a significant opportunity for ${startupName} to capture a large share of the ${s.users} active users.`,
    fullMarketResearch: `**Comprehensive Market Research Report for ${startupName}**\n\n**1. Industry Overview (${topic})**\nThe ${topic} industry in ${city} represents an addressable market worth ${s.tam}. Due to changing consumer habits and technology adoption post-2020, the sector has seen a compound annual growth rate (CAGR) of ${s.growth}.\n\n**2. Competitive Landscape**\nCurrently, the market is dominated by players like ${s.competitors.join(', ')}. While these incumbents possess significant capital, they suffer from legacy technological debt and slower innovation cycles.\n\n**3. Target Audience & Adoption**\nThe core user base comprises ${s.users} early adopters. There is an untapped opportunity in tier-2 expansions and micro-segmentation which ${startupName} can uniquely exploit.\n\n**4. Strategic Risks & Mitigation**\n- *Risk:* High CAC (Customer Acquisition Cost) on digital platforms.\n- *Mitigation:* Leveraging viral product loops and community-led growth.\n\nOverall Opportunity Score: 9.2/10.`,
    opportunityScore: 9.2,
    competitors: s.competitors.map(name => ({ name, strength: "High", weakness: "Legacy Systems" })),
    pitchSlides: [
      { slideNumber: 1, title: "The Problem", content: `Current solutions in ${topic} are slow and inefficient for users in ${city}.` },
      { slideNumber: 2, title: "Our Solution", content: `${startupName} provides a seamless, AI-powered experience.` },
      { slideNumber: 3, title: "Market Size", content: `TAM: ${s.tam} with ${s.growth} YoY growth.` }
    ],
    investorEmail: {
      subject: `Investment Opportunity: ${startupName} - Disrupting ${topic} in ${city}`,
      body: `Hi,\n\nI'm building ${startupName}, a ${topic} startup focused on ${city}. We are seeing massive growth in this sector and would love to discuss a potential investment.\n\nBest,\nFounder`
    },
    targetCustomer: "Millennials and Gen Z",
    revenueModel: "Subscription and Transaction fees",
    localInvestors: [], // This would ideally come from the investors data
    marketGrowth: s.growth,
    marketTrends: ["Digital Transformation", "Sustainability", "Direct-to-Consumer", "AI-Powered Personalization"],
    riskLevel: "Medium",
    thinkingAnalysis: `### 🧠 Strategic Deep-Dive: ${startupName}

#### 🎯 Market Entry & Moat
- **Hyper-Local Focus**: By starting in **${city}**, you can achieve density and viral growth before national expansion.
- **Data Advantage**: Proprietary analysis of **${s.users}** active users provides a specialized data moat that global incumbents lack.
- **Vertical Integration**: Controlling the end-to-end user experience in **${topic}** will yield higher margins than horizontal platforms.

#### ⚖️ Risk-Opportunity Matrix
- **Critical Risk**: Platform disintermediation. *Mitigation:* Focus on high-frequency user touchpoints and community rewards.
- **Massive Opportunity**: Tier-2 & Tier-3 city expansion represents a **$${(Number(s.tam.replace(/[\$B]/g, '')) * 1.5).toFixed(1)}B** untapped market.

#### 🚀 Scaling Path (0-100)
1. **Pilot Phase**: Onboard 50 high-value power users in **${city}**.
2. **Growth Loop**: Implement referral mechanics to reduce CAC by **35%**.
3. **Series A**: Target **$${(Number(s.tam.replace(/[\$B]/g, '')) * 0.1).toFixed(1)}B** GMV before seeking institutional capital.`
  };
}


