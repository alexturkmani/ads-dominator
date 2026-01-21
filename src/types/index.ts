// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  type?: string;
  status: 'active' | 'paused' | 'ended' | 'draft';
  budget: number;
  dailySpend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversionChange?: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  startDate: string;
  endDate?: string;
  adGroups: AdGroup[];
  targetLocations: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  status: 'active' | 'paused';
  ads: Ad[];
  keywords: Keyword[];
}

export interface Ad {
  id: string;
  adGroupId: string;
  headline1: string;
  headline2: string;
  headline3?: string;
  description1: string;
  description2?: string;
  finalUrl: string;
  displayUrl: string;
  status: 'active' | 'paused' | 'testing';
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  qualityScore?: number;
  createdAt: string;
}

export interface Keyword {
  id: string;
  adGroupId: string;
  keyword: string;
  matchType: 'broad' | 'phrase' | 'exact';
  status: 'active' | 'paused' | 'negative';
  bid: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  qualityScore: number;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  opportunity: number;
}

export interface AnalyticsData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface DashboardMetrics {
  totalSpend: number;
  totalConversions: number;
  averageCPA: number;
  averageROAS: number;
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averageCPC: number;
  conversionRate: number;
  spendChange: number;
  conversionsChange: number;
  cpaChange: number;
  roasChange: number;
}

export interface ABTest {
  id: string;
  name: string;
  description?: string;
  campaignId: string;
  status: 'running' | 'completed' | 'paused' | 'draft';
  startDate: string;
  endDate?: string;
  variants: ABVariant[];
  winningVariant?: string;
  confidence: number;
}

export interface ABVariant {
  id: string;
  testId: string;
  name: string;
  type: 'headline' | 'description' | 'cta' | 'image';
  content: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  isControl: boolean;
  isWinner: boolean;
  improvement?: number;
}

export interface AIRecommendation {
  id: string;
  type: 'keyword' | 'budget' | 'bid' | 'creative' | 'targeting';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  estimatedImpact: {
    conversions: number;
    cpa: number;
    spend: number;
  };
  actions: AIAction[];
  status: 'pending' | 'applied' | 'dismissed';
  createdAt: string;
}

export interface AIAction {
  id: string;
  type: string;
  description: string;
  params: Record<string, unknown>;
}

export interface KeywordSuggestion {
  keyword: string;
  matchType: 'broad' | 'phrase' | 'exact';
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  suggestedBid: number;
  estimatedClicks: number;
  estimatedConversions: number;
  opportunityScore: number;
  reason: string;
}

export interface BudgetAllocation {
  campaignId: string;
  campaignName: string;
  currentBudget: number;
  suggestedBudget: number;
  reason: string;
  expectedImpact: {
    additionalConversions: number;
    newCPA: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  plan: 'starter' | 'pro' | 'enterprise';
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  googleAdsId: string;
  name: string;
  currency: string;
  timezone: string;
  isConnected: boolean;
  lastSyncAt: string;
}

export interface LocationTarget {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'region';
  targetType: 'include' | 'exclude';
  radius?: {
    value: number;
    unit: 'miles' | 'km';
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface BusinessProfile {
  websiteUrl: string;
  industry: string;
  businessType?: string;
  targetAudience: string;
  uniqueSellingPoints: string[];
  competitors: string[];
  conversionGoal: 'leads' | 'sales' | 'signups' | 'calls';
  averageOrderValue?: number;
  profitMargin?: number;
  targetLocations: string[]; // Legacy simple location list
  locationTargets?: LocationTarget[]; // New advanced location targeting
  excludeOutsideRadius?: boolean; // If true, exclude all locations outside the defined targets
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}
