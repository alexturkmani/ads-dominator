/**
 * Google Ads Backend API Service
 * 
 * This service communicates with the backend server to make
 * real Google Ads API calls securely.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Store session ID in localStorage
const SESSION_KEY = 'google_ads_session_id';

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(sessionId: string): void {
  localStorage.setItem(SESSION_KEY, sessionId);
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
  const sessionId = getSessionId();
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': sessionId || '',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}

export interface GoogleAdsAccount {
  id: string;
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  isManager: boolean;
  canManageClients: boolean;
  status: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: string;
  type: string;
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
}

export interface Keyword {
  id: string;
  keyword: string;
  matchType: string;
  status: string;
  bid: number;
  qualityScore: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cpc: number;
}

export interface CampaignChange {
  id: string;
  campaignId: string;
  type: 'budget' | 'status';
  newValue: unknown;
  confidence: number;
  reason: string;
  appliedAt: string;
  status: string;
}

/**
 * Get OAuth URL to connect Google Ads account
 */
export async function getOAuthUrl(): Promise<{ authUrl: string; state: string } | null> {
  const result = await apiRequest<{ authUrl: string; state: string }>('/api/oauth/url');
  return result.success ? result.data! : null;
}

/**
 * Initiate Google Ads OAuth flow
 */
export async function initiateOAuth(): Promise<void> {
  const result = await getOAuthUrl();
  if (result?.authUrl) {
    // Store state for CSRF verification
    sessionStorage.setItem('oauth_state', result.state);
    // Redirect to Google OAuth
    window.location.href = result.authUrl;
  }
}

/**
 * Handle OAuth callback - call this on the settings page when returning from OAuth
 */
export function handleOAuthCallback(): { connected: boolean; error?: string } {
  const params = new URLSearchParams(window.location.search);
  
  const connected = params.get('connected') === 'true';
  const sessionId = params.get('session');
  const error = params.get('error');

  if (connected && sessionId) {
    setSessionId(sessionId);
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
    return { connected: true };
  }

  if (error) {
    window.history.replaceState({}, '', window.location.pathname);
    return { connected: false, error };
  }

  return { connected: false };
}

/**
 * Check if we have an active session
 */
export function isConnected(): boolean {
  return !!getSessionId();
}

/**
 * Fetch accessible Google Ads accounts
 */
export async function fetchAccounts(): Promise<GoogleAdsAccount[]> {
  const result = await apiRequest<{ accounts: GoogleAdsAccount[] }>('/api/accounts');
  return result.success ? result.data!.accounts : [];
}

/**
 * Fetch campaigns for a customer
 */
export async function fetchCampaigns(customerId: string): Promise<Campaign[]> {
  const result = await apiRequest<{ campaigns: Campaign[] }>(
    `/api/accounts/${customerId}/campaigns`
  );
  return result.success ? result.data!.campaigns : [];
}

/**
 * Fetch keywords for a customer
 */
export async function fetchKeywords(customerId: string): Promise<Keyword[]> {
  const result = await apiRequest<{ keywords: Keyword[] }>(
    `/api/accounts/${customerId}/keywords`
  );
  return result.success ? result.data!.keywords : [];
}

/**
 * Update campaign budget (requires 100% confidence)
 */
export async function updateCampaignBudget(
  customerId: string,
  campaignId: string,
  budget: number,
  confidence: number,
  reason: string
): Promise<{ success: boolean; change?: CampaignChange; error?: string }> {
  const result = await apiRequest<{ success: boolean; change: CampaignChange }>(
    `/api/accounts/${customerId}/campaigns/${campaignId}/budget`,
    {
      method: 'PATCH',
      body: JSON.stringify({ budget, confidence, reason }),
    }
  );

  if (result.success && result.data) {
    return { success: true, change: result.data.change };
  }
  return { success: false, error: result.error };
}

/**
 * Update campaign status (requires 100% confidence)
 */
export async function updateCampaignStatus(
  customerId: string,
  campaignId: string,
  status: 'active' | 'paused',
  confidence: number,
  reason: string
): Promise<{ success: boolean; change?: CampaignChange; error?: string }> {
  const result = await apiRequest<{ success: boolean; change: CampaignChange }>(
    `/api/accounts/${customerId}/campaigns/${campaignId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status, confidence, reason }),
    }
  );

  if (result.success && result.data) {
    return { success: true, change: result.data.change };
  }
  return { success: false, error: result.error };
}

/**
 * Disconnect from Google Ads
 */
export async function disconnect(): Promise<void> {
  await apiRequest('/api/disconnect', { method: 'POST' });
  clearSessionId();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string; configured: boolean } | null> {
  const result = await apiRequest<{ status: string; configured: boolean }>('/api/health');
  return result.success ? result.data! : null;
}
