// ─── Rich platform-specific base data ───────────────────────────────────────

const PLATFORM_BASE = {
  Instagram:  { followers: 128000, rate: 7.2, posts: 540,  reach: 520000 },
  Twitter:    { followers: 64000,  rate: 4.1, posts: 890,  reach: 310000 },
  LinkedIn:   { followers: 38000,  rate: 5.6, posts: 210,  reach: 180000 },
  Facebook:   { followers: 95000,  rate: 3.8, posts: 320,  reach: 400000 },
  TikTok:     { followers: 211000, rate: 9.4, posts: 480,  reach: 870000 },
};

const ALL_PLATFORMS = {
  followers: 280500,
  rate:      5.8,
  posts:     1482,
  reach:     1200000,
};

// ─── Time-range multipliers ──────────────────────────────────────────────────
const TIME_MULTIPLIERS = {
  'Last 7 Days':    0.28,
  'Last 30 Days':   1.0,
  'Last 6 Months':  3.8,
};

// ─── Engagement timeline (7 data-points each) ────────────────────────────────
const ENGAGEMENT_BASE = {
  'Last 7 Days': [
    { name: 'Mon', Instagram: 920,  Twitter: 540, LinkedIn: 210, Facebook: 680, TikTok: 1800 },
    { name: 'Tue', Instagram: 1100, Twitter: 620, LinkedIn: 280, Facebook: 720, TikTok: 2100 },
    { name: 'Wed', Instagram: 980,  Twitter: 490, LinkedIn: 260, Facebook: 590, TikTok: 1950 },
    { name: 'Thu', Instagram: 1340, Twitter: 700, LinkedIn: 310, Facebook: 810, TikTok: 2400 },
    { name: 'Fri', Instagram: 1500, Twitter: 820, LinkedIn: 380, Facebook: 900, TikTok: 2800 },
    { name: 'Sat', Instagram: 1280, Twitter: 650, LinkedIn: 200, Facebook: 750, TikTok: 3100 },
    { name: 'Sun', Instagram: 1420, Twitter: 710, LinkedIn: 240, Facebook: 840, TikTok: 2900 },
  ],
  'Last 30 Days': [
    { name: 'Wk 1', Instagram: 5200, Twitter: 2800, LinkedIn: 1100, Facebook: 3200, TikTok: 9400 },
    { name: 'Wk 2', Instagram: 6100, Twitter: 3400, LinkedIn: 1400, Facebook: 3800, TikTok: 11200 },
    { name: 'Wk 3', Instagram: 5800, Twitter: 3100, LinkedIn: 1250, Facebook: 3500, TikTok: 10600 },
    { name: 'Wk 4', Instagram: 7200, Twitter: 3900, LinkedIn: 1650, Facebook: 4300, TikTok: 13500 },
  ],
  'Last 6 Months': [
    { name: 'Nov', Instagram: 18000, Twitter: 10000, LinkedIn: 4200, Facebook: 13000, TikTok: 37000 },
    { name: 'Dec', Instagram: 21000, Twitter: 11500, LinkedIn: 5100, Facebook: 15500, TikTok: 43000 },
    { name: 'Jan', Instagram: 19500, Twitter: 10800, LinkedIn: 4800, Facebook: 14200, TikTok: 40000 },
    { name: 'Feb', Instagram: 23000, Twitter: 12400, LinkedIn: 5600, Facebook: 16800, TikTok: 48000 },
    { name: 'Mar', Instagram: 25000, Twitter: 13200, LinkedIn: 6000, Facebook: 18000, TikTok: 52000 },
    { name: 'Apr', Instagram: 27500, Twitter: 14500, LinkedIn: 6800, Facebook: 20000, TikTok: 58000 },
  ],
};

const PLATFORM_COMPARISON = [
  { name: 'Instagram', value: 128000, color: '#E1306C' },
  { name: 'Twitter',   value: 64000,  color: '#1DA1F2' },
  { name: 'LinkedIn',  value: 38000,  color: '#0077B5' },
  { name: 'Facebook',  value: 95000,  color: '#4267B2' },
  { name: 'TikTok',    value: 211000, color: '#010101' },
];

const AUDIENCE_BASE = {
  'All Platforms': [
    { name: '18-24', value: 420 },
    { name: '25-34', value: 380 },
    { name: '35-44', value: 260 },
    { name: '45+',   value: 140 },
  ],
  Instagram: [
    { name: '18-24', value: 580 },
    { name: '25-34', value: 310 },
    { name: '35-44', value: 180 },
    { name: '45+',   value: 80 },
  ],
  Twitter: [
    { name: '18-24', value: 340 },
    { name: '25-34', value: 420 },
    { name: '35-44', value: 280 },
    { name: '45+',   value: 160 },
  ],
  LinkedIn: [
    { name: '18-24', value: 120 },
    { name: '25-34', value: 450 },
    { name: '35-44', value: 380 },
    { name: '45+',   value: 250 },
  ],
  Facebook: [
    { name: '18-24', value: 210 },
    { name: '25-34', value: 340 },
    { name: '35-44', value: 390 },
    { name: '45+',   value: 320 },
  ],
  TikTok: [
    { name: '18-24', value: 720 },
    { name: '25-34', value: 280 },
    { name: '35-44', value: 120 },
    { name: '45+',   value: 40 },
  ],
};

import { POSTS_DATA } from './postsData';

// ─── API functions ────────────────────────────────────────────────────────────

export const fetchDashboardData = (timeRange, platform, connections = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const timeMult = TIME_MULTIPLIERS[timeRange] ?? 1;
      const isAll = platform === 'All Platforms';

      // Determine which platforms are actually connected
      const connectedKeys = Object.keys(PLATFORM_BASE).filter(p => 
        connections[p.toLowerCase()] || Object.keys(connections).length === 0
      );

      // KPI stats aggregation
      let base;
      if (isAll) {
        base = connectedKeys.reduce((acc, p) => ({
          followers: acc.followers + PLATFORM_BASE[p].followers,
          rate:      acc.rate + PLATFORM_BASE[p].rate, 
          posts:     acc.posts + PLATFORM_BASE[p].posts,
          reach:     acc.reach + PLATFORM_BASE[p].reach,
        }), { followers: 0, rate: 0, posts: 0, reach: 0 });
        if (connectedKeys.length > 0) base.rate = base.rate / connectedKeys.length;
      } else {
        base = PLATFORM_BASE[platform] ?? PLATFORM_BASE.Instagram;
      }
      const kpistats = {
        followers: Math.round(base.followers * (isAll ? 1 : timeMult)),
        rate:      Number((base.rate).toFixed(1)),
        posts:     Math.round(base.posts * timeMult),
        reach:     Math.round(base.reach * (isAll ? 1 : timeMult)),
        followersDelta: isAll ? '+12.5%' : '+' + (4 + (platform.length % 8)).toFixed(1) + '%',
        rateDelta:      isAll ? '+1.2%'  : '+' + (0.3 + (platform.length % 4) * 0.2).toFixed(1) + '%',
        postsDelta:     isAll ? '-2.4%'  : (platform.length % 2 === 0 ? '+' : '-') + (1 + (platform.length % 5)) + '%',
        reachDelta:     isAll ? '+18.7%' : '+' + (10 + (platform.length % 12)).toFixed(0) + '%',
      };

      // Engagement timeline
      const rawTimeline = ENGAGEMENT_BASE[timeRange] ?? ENGAGEMENT_BASE['Last 30 Days'];
      const engagementData = rawTimeline.map((row) => ({
        name:  row.name,
        value: isAll
          ? connectedKeys.reduce((sum, p) => sum + (row[p] ?? 0), 0)
          : (row[platform] ?? 0),
      }));

      // Platform comparison (Only show connected platforms)
      const platformData = PLATFORM_COMPARISON.filter(d => 
        (isAll && connectedKeys.includes(d.name)) || (!isAll && d.name === platform)
      );

      // Audience distribution
      const audienceKey = isAll ? 'All Platforms' : (AUDIENCE_BASE[platform] ? platform : 'All Platforms');
      const audienceData = AUDIENCE_BASE[audienceKey];

      resolve({ kpistats, engagementData, platformData, audienceData });
    }, 900);
  });
};

export const fetchRecentPosts = (platform, timeRange, connections = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isAll = platform === 'All Platforms';
      const connectedKeys = Object.keys(PLATFORM_BASE).filter(p => 
        connections[p.toLowerCase()] || Object.keys(connections).length === 0
      );

      const filtered = isAll 
        ? POSTS_DATA.filter(p => connectedKeys.includes(p.platform))
        : POSTS_DATA.filter((p) => p.platform === platform);
      resolve(filtered);
    }, 700);
  });
};

// ─── Analytics-specific data ─────────────────────────────────────────────────

// Reach/Impressions trend data (separate from engagement)
const REACH_TREND = {
  'Last 7 Days': [
    { name: 'Mon', Instagram: 12000, Twitter: 8500,  LinkedIn: 3200,  Facebook: 9800,  TikTok: 28000 },
    { name: 'Tue', Instagram: 14500, Twitter: 9200,  LinkedIn: 3800,  Facebook: 10500, TikTok: 32000 },
    { name: 'Wed', Instagram: 13200, Twitter: 8800,  LinkedIn: 3500,  Facebook: 9200,  TikTok: 29500 },
    { name: 'Thu', Instagram: 16800, Twitter: 10400, LinkedIn: 4200,  Facebook: 11800, TikTok: 38000 },
    { name: 'Fri', Instagram: 19500, Twitter: 12000, LinkedIn: 5100,  Facebook: 13500, TikTok: 44000 },
    { name: 'Sat', Instagram: 17200, Twitter: 10800, LinkedIn: 3200,  Facebook: 12200, TikTok: 48000 },
    { name: 'Sun', Instagram: 18500, Twitter: 11200, LinkedIn: 3800,  Facebook: 13000, TikTok: 45000 },
  ],
  'Last 30 Days': [
    { name: 'Wk 1', Instagram: 68000,  Twitter: 42000, LinkedIn: 15000, Facebook: 55000, TikTok: 145000 },
    { name: 'Wk 2', Instagram: 78000,  Twitter: 48000, LinkedIn: 18000, Facebook: 62000, TikTok: 168000 },
    { name: 'Wk 3', Instagram: 72000,  Twitter: 45000, LinkedIn: 16500, Facebook: 58000, TikTok: 158000 },
    { name: 'Wk 4', Instagram: 91000,  Twitter: 56000, LinkedIn: 21000, Facebook: 72000, TikTok: 195000 },
  ],
  'Last 6 Months': [
    { name: 'Nov', Instagram: 245000, Twitter: 148000, LinkedIn: 62000,  Facebook: 195000, TikTok: 520000 },
    { name: 'Dec', Instagram: 292000, Twitter: 168000, LinkedIn: 74000,  Facebook: 228000, TikTok: 612000 },
    { name: 'Jan', Instagram: 268000, Twitter: 155000, LinkedIn: 68000,  Facebook: 210000, TikTok: 572000 },
    { name: 'Feb', Instagram: 318000, Twitter: 182000, LinkedIn: 82000,  Facebook: 248000, TikTok: 695000 },
    { name: 'Mar', Instagram: 352000, Twitter: 198000, LinkedIn: 91000,  Facebook: 272000, TikTok: 768000 },
    { name: 'Apr', Instagram: 395000, Twitter: 218000, LinkedIn: 105000, Facebook: 305000, TikTok: 870000 },
  ],
};

// Post performance (likes, comments, shares per period)
const POST_PERF = {
  'Last 7 Days': [
    { name: 'Mon', likes: 1850,  comments: 124, shares: 312 },
    { name: 'Tue', likes: 2100,  comments: 156, shares: 380 },
    { name: 'Wed', likes: 1920,  comments: 138, shares: 295 },
    { name: 'Thu', likes: 2680,  comments: 204, shares: 445 },
    { name: 'Fri', likes: 3250,  comments: 268, shares: 590 },
    { name: 'Sat', likes: 2980,  comments: 234, shares: 520 },
    { name: 'Sun', likes: 3120,  comments: 252, shares: 548 },
  ],
  'Last 30 Days': [
    { name: 'Wk 1', likes: 12400, comments: 890,  shares: 2100 },
    { name: 'Wk 2', likes: 14800, comments: 1050, shares: 2580 },
    { name: 'Wk 3', likes: 13500, comments: 980,  shares: 2280 },
    { name: 'Wk 4', likes: 18200, comments: 1320, shares: 3200 },
  ],
  'Last 6 Months': [
    { name: 'Nov', likes: 48000,  comments: 3600,  shares: 8500  },
    { name: 'Dec', likes: 58000,  comments: 4300,  shares: 10200 },
    { name: 'Jan', likes: 52000,  comments: 3900,  shares: 9400  },
    { name: 'Feb', likes: 68000,  comments: 5100,  shares: 12800 },
    { name: 'Mar', likes: 75000,  comments: 5600,  shares: 14200 },
    { name: 'Apr', likes: 88000,  comments: 6500,  shares: 16800 },
  ],
};

// Growth % vs previous period for each platform
const GROWTH_VS_PREV = {
  'All Platforms': { engagement: 18.4, reach: 22.1, followers: 12.5, posts: -2.4 },
  Instagram:  { engagement: 24.2, reach: 31.5, followers: 15.8, posts: 8.2  },
  Twitter:    { engagement: 9.8,  reach: 14.2, followers: 6.4,  posts: 12.1 },
  LinkedIn:   { engagement: 16.5, reach: 19.8, followers: 11.2, posts: -5.3 },
  Facebook:   { engagement: 7.2,  reach: 11.6, followers: 4.8,  posts: -8.1 },
  TikTok:     { engagement: 38.6, reach: 45.2, followers: 28.4, posts: 22.5 },
};

// Best period (highest engagement point)
const BEST_PERIOD = {
  'Last 7 Days':   { 'All Platforms': 'Friday', Instagram: 'Friday', Twitter: 'Friday', LinkedIn: 'Friday', Facebook: 'Friday', TikTok: 'Saturday' },
  'Last 30 Days':  { 'All Platforms': 'Week 4', Instagram: 'Week 4', Twitter: 'Week 4', LinkedIn: 'Week 4', Facebook: 'Week 4', TikTok: 'Week 4'   },
  'Last 6 Months': { 'All Platforms': 'April',  Instagram: 'April',  Twitter: 'April',  LinkedIn: 'April',  Facebook: 'April',  TikTok: 'April'    },
};

export const fetchAnalyticsData = (timeRange, platform, connections = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isAll = platform === 'All Platforms';
      const connectedKeys = Object.keys(PLATFORM_BASE).filter(p => 
        connections[p.toLowerCase()] || Object.keys(connections).length === 0
      );

      // Engagement timeline
      const engRaw = ENGAGEMENT_BASE[timeRange] ?? ENGAGEMENT_BASE['Last 30 Days'];
      const engagementTrend = engRaw.map((row) => ({
        name:  row.name,
        value: isAll
          ? connectedKeys.reduce((s, p) => s + (row[p] ?? 0), 0)
          : (row[platform] ?? 0),
      }));

      // Reach timeline
      const reachRaw = REACH_TREND[timeRange] ?? REACH_TREND['Last 30 Days'];
      const reachTrend = reachRaw.map((row) => ({
        name:  row.name,
        value: isAll
          ? connectedKeys.reduce((s, p) => s + (row[p] ?? 0), 0)
          : (row[platform] ?? 0),
      }));

      // Post performance
      const postPerf = POST_PERF[timeRange] ?? POST_PERF['Last 30 Days'];

      // Platform comparison bar (only connected)
      const platformComparison = isAll
        ? Object.entries(PLATFORM_BASE)
            .filter(([name]) => connectedKeys.includes(name))
            .map(([name, base]) => ({
            name,
            engagement: Math.round(base.rate * 1000),
            reach:      base.reach,
            followers:  base.followers,
            color:      { Instagram: '#E1306C', Twitter: '#1DA1F2', LinkedIn: '#0077B5', Facebook: '#4267B2', TikTok: '#06B6D4' }[name] ?? '#3B82F6',
          }))
        : [];

      // Growth insights
      const growth = GROWTH_VS_PREV[platform] ?? GROWTH_VS_PREV['All Platforms'];

      // Top platform (highest engagement rate)
      const topPlatform = Object.entries(PLATFORM_BASE).reduce((a, [k, v]) => v.rate > a[1] ? [k, v.rate] : a, ['', 0]);

      // Best performing period
      const bestPeriod = (BEST_PERIOD[timeRange] ?? {})[platform] ?? '—';

      // Summary stats for insights
      const currentEngagement = engagementTrend.reduce((s, d) => s + d.value, 0);
      const currentReach      = reachTrend.reduce((s, d) => s + d.value, 0);

      resolve({
        engagementTrend,
        reachTrend,
        postPerf,
        platformComparison,
        growth,
        topPlatform: topPlatform[0],
        bestPeriod,
        currentEngagement,
        currentReach,
      });
    }, 950);
  });
};
