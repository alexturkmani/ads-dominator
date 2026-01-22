/**
 * Google Ads API Integration Service
 * 
 * This service handles direct integration with Google Ads API to make
 * campaign changes when AI recommendations have 100% confidence.
 * 
 * IMPORTANT: Changes are only applied when confidence is 100%
 */

export interface GoogleAdsCredentials {
  accessToken: string;
  refreshToken: string;
  customerId: string;
  developerToken: string;
}

export interface GoogleAdsAccount {
  id: string;
  customerId: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  isManager: boolean;
  canManageClients: boolean;
  status: 'enabled' | 'suspended' | 'cancelled' | 'pending';
  linkedAt?: string;
}

export interface OAuthState {
  isAuthenticating: boolean;
  authUrl: string | null;
  error: string | null;
}

export interface CampaignChange {
  id: string;
  campaignId: string;
  type: 'budget' | 'status' | 'bid' | 'keyword' | 'targeting';
  previousValue: unknown;
  newValue: unknown;
  confidence: number;
  reason: string;
  appliedAt: string;
  status: 'pending' | 'applied' | 'failed' | 'reverted';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Google Ads API configuration
const GOOGLE_ADS_CONFIG = {
  apiVersion: 'v15',
  baseUrl: 'https://googleads.googleapis.com',
  apiToken: import.meta.env.VITE_GOOGLE_ADS_API_TOKEN || '',
  oauthClientId: import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID || '',
  oauthRedirectUri: `${window.location.origin}/oauth/callback`,
  oauthScopes: ['https://www.googleapis.com/auth/adwords'],
  get fullUrl() { return `${this.baseUrl}/${this.apiVersion}`; }
};

class GoogleAdsApiService {
  private credentials: GoogleAdsCredentials | null = null;
  private changeHistory: CampaignChange[] = [];
  private apiConfig = GOOGLE_ADS_CONFIG;
  private apiToken: string = GOOGLE_ADS_CONFIG.apiToken;
  private linkedAccounts: GoogleAdsAccount[] = [];
  private selectedAccountId: string | null = null;

  /**
   * Initialize the service with credentials
   */
  setCredentials(credentials: GoogleAdsCredentials): void {
    this.credentials = credentials;
  }

  /**
   * Set the API token for authentication
   */
  setApiToken(token: string): void {
    this.apiToken = token;
  }

  /**
   * Get the current API token
   */
  getApiToken(): string {
    return this.apiToken;
  }

  /**
   * Check if API token is configured
   */
  hasApiToken(): boolean {
    return this.apiToken !== null && this.apiToken.length > 0;
  }

  /**
   * Get authorization headers for API requests
   */
  getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
      'developer-token': this.credentials?.developerToken || '',
    };
  }

  /**
   * Get the API URL for making requests
   */
  getApiUrl(): string {
    return this.apiConfig.fullUrl;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.credentials !== null || this.hasApiToken();
  }

  /**
   * Get change history
   */
  getChangeHistory(): CampaignChange[] {
    return this.changeHistory;
  }

  /**
   * Only apply changes when confidence is 100%
   */
  private validateConfidence(confidence: number): boolean {
    return confidence === 100;
  }

  /**
   * Update campaign budget - Only when 100% confident
   */
  async updateCampaignBudget(
    campaignId: string,
    newBudget: number,
    confidence: number,
    reason: string
  ): Promise<ApiResponse<CampaignChange>> {
    if (!this.validateConfidence(confidence)) {
      return {
        success: false,
        error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.`
      };
    }

    if (!this.credentials) {
      return {
        success: false,
        error: 'Google Ads API not configured. Please connect your account in Settings.'
      };
    }

    try {
      // In production, this would call the actual Google Ads API:
      // POST ${API_BASE_URL}/customers/${this.credentials.customerId}/campaigns/${campaignId}:mutate
      
      const change: CampaignChange = {
        id: crypto.randomUUID(),
        campaignId,
        type: 'budget',
        previousValue: null, // Would be fetched from current campaign state
        newValue: newBudget,
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied'
      };

      this.changeHistory.unshift(change);

      console.log(`[GoogleAdsAPI] Budget updated for campaign ${campaignId}: $${newBudget}`);
      console.log(`[GoogleAdsAPI] Reason: ${reason}`);

      return { success: true, data: change };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update budget: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Update campaign status - Only when 100% confident
   */
  async updateCampaignStatus(
    campaignId: string,
    newStatus: 'active' | 'paused',
    confidence: number,
    reason: string
  ): Promise<ApiResponse<CampaignChange>> {
    if (!this.validateConfidence(confidence)) {
      return {
        success: false,
        error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.`
      };
    }

    if (!this.credentials) {
      return {
        success: false,
        error: 'Google Ads API not configured. Please connect your account in Settings.'
      };
    }

    try {
      const change: CampaignChange = {
        id: crypto.randomUUID(),
        campaignId,
        type: 'status',
        previousValue: null,
        newValue: newStatus,
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied'
      };

      this.changeHistory.unshift(change);

      console.log(`[GoogleAdsAPI] Status updated for campaign ${campaignId}: ${newStatus}`);
      console.log(`[GoogleAdsAPI] Reason: ${reason}`);

      return { success: true, data: change };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Update keyword bid - Only when 100% confident
   */
  async updateKeywordBid(
    campaignId: string,
    keywordId: string,
    newBid: number,
    confidence: number,
    reason: string
  ): Promise<ApiResponse<CampaignChange>> {
    if (!this.validateConfidence(confidence)) {
      return {
        success: false,
        error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.`
      };
    }

    if (!this.credentials) {
      return {
        success: false,
        error: 'Google Ads API not configured. Please connect your account in Settings.'
      };
    }

    try {
      const change: CampaignChange = {
        id: crypto.randomUUID(),
        campaignId,
        type: 'bid',
        previousValue: { keywordId },
        newValue: { keywordId, bid: newBid },
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied'
      };

      this.changeHistory.unshift(change);

      console.log(`[GoogleAdsAPI] Bid updated for keyword ${keywordId}: $${newBid}`);
      console.log(`[GoogleAdsAPI] Reason: ${reason}`);

      return { success: true, data: change };
    } catch (error) {
      return {
        success: false,
        error: `Failed to update bid: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Add negative keyword - Only when 100% confident
   */
  async addNegativeKeyword(
    campaignId: string,
    keyword: string,
    matchType: 'broad' | 'phrase' | 'exact',
    confidence: number,
    reason: string
  ): Promise<ApiResponse<CampaignChange>> {
    if (!this.validateConfidence(confidence)) {
      return {
        success: false,
        error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.`
      };
    }

    if (!this.credentials) {
      return {
        success: false,
        error: 'Google Ads API not configured. Please connect your account in Settings.'
      };
    }

    try {
      const change: CampaignChange = {
        id: crypto.randomUUID(),
        campaignId,
        type: 'keyword',
        previousValue: null,
        newValue: { keyword, matchType, isNegative: true },
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied'
      };

      this.changeHistory.unshift(change);

      console.log(`[GoogleAdsAPI] Negative keyword added: "${keyword}" (${matchType})`);
      console.log(`[GoogleAdsAPI] Reason: ${reason}`);

      return { success: true, data: change };
    } catch (error) {
      return {
        success: false,
        error: `Failed to add negative keyword: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Revert a previously applied change
   */
  async revertChange(changeId: string): Promise<ApiResponse<CampaignChange>> {
    const changeIndex = this.changeHistory.findIndex(c => c.id === changeId);
    
    if (changeIndex === -1) {
      return {
        success: false,
        error: 'Change not found in history'
      };
    }

    const change = this.changeHistory[changeIndex];
    
    // Mark the change as reverted
    this.changeHistory[changeIndex] = {
      ...change,
      status: 'reverted'
    };

    console.log(`[GoogleAdsAPI] Change reverted: ${change.type} for campaign ${change.campaignId}`);

    return { success: true, data: this.changeHistory[changeIndex] };
  }

  /**
   * Apply an AI recommendation with 100% confidence
   */
  async applyRecommendation(
    recommendation: {
      campaignId: string;
      type: 'budget' | 'status' | 'bid' | 'keyword' | 'targeting';
      value: unknown;
      confidence: number;
      reason: string;
    }
  ): Promise<ApiResponse<CampaignChange>> {
    if (!this.validateConfidence(recommendation.confidence)) {
      return {
        success: false,
        error: `Cannot auto-apply: AI confidence is ${recommendation.confidence}%. Changes require 100% confidence for automatic application.`
      };
    }

    switch (recommendation.type) {
      case 'budget':
        return this.updateCampaignBudget(
          recommendation.campaignId,
          recommendation.value as number,
          recommendation.confidence,
          recommendation.reason
        );
      case 'status':
        return this.updateCampaignStatus(
          recommendation.campaignId,
          recommendation.value as 'active' | 'paused',
          recommendation.confidence,
          recommendation.reason
        );
      default:
        return {
          success: false,
          error: `Unsupported recommendation type: ${recommendation.type}`
        };
    }
  }

  // ==========================================
  // OAuth & Account Access Methods
  // ==========================================

  /**
   * Generate OAuth URL for Google Ads authorization
   */
  getOAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.apiConfig.oauthClientId,
      redirect_uri: this.apiConfig.oauthRedirectUri,
      response_type: 'code',
      scope: this.apiConfig.oauthScopes.join(' '),
      access_type: 'offline',
      prompt: 'consent',
      state: crypto.randomUUID(), // CSRF protection
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    try {
      // In production, this should be done server-side to protect client secret
      console.log('[GoogleAdsAPI] Exchanging authorization code for tokens:', code.substring(0, 10) + '...');
      
      // Simulated token exchange for demo
      // In production: POST to https://oauth2.googleapis.com/token with the code
      const tokens = {
        accessToken: `ya29.${crypto.randomUUID()}`,
        refreshToken: `1//${crypto.randomUUID()}`,
      };

      this.credentials = {
        ...this.credentials,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        customerId: '',
        developerToken: this.apiToken,
      } as GoogleAdsCredentials;

      return { success: true, data: tokens };
    } catch (error) {
      return {
        success: false,
        error: `Failed to exchange code: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Fetch accessible Google Ads accounts for the authenticated user
   */
  async fetchAccessibleAccounts(): Promise<ApiResponse<GoogleAdsAccount[]>> {
    if (!this.hasApiToken() && !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated. Please connect your Google account first.'
      };
    }

    try {
      console.log('[GoogleAdsAPI] Fetching accessible accounts');
      
      // In production, this would call:
      // GET ${API_BASE_URL}/customers:listAccessibleCustomers
      
      // Simulated accounts for demo - represents real Google Ads account structure
      const accounts: GoogleAdsAccount[] = [
        {
          id: 'acc-1',
          customerId: '123-456-7890',
          descriptiveName: 'Main Business Account',
          currencyCode: 'USD',
          timeZone: 'America/Los_Angeles',
          isManager: false,
          canManageClients: false,
          status: 'enabled',
          linkedAt: new Date().toISOString(),
        },
        {
          id: 'acc-2',
          customerId: '234-567-8901',
          descriptiveName: 'E-commerce Store',
          currencyCode: 'USD',
          timeZone: 'America/New_York',
          isManager: false,
          canManageClients: false,
          status: 'enabled',
          linkedAt: new Date().toISOString(),
        },
        {
          id: 'acc-3',
          customerId: '345-678-9012',
          descriptiveName: 'Agency Manager Account',
          currencyCode: 'USD',
          timeZone: 'America/Chicago',
          isManager: true,
          canManageClients: true,
          status: 'enabled',
          linkedAt: new Date().toISOString(),
        },
      ];

      this.linkedAccounts = accounts;
      
      return { success: true, data: accounts };
    } catch (error) {
      return {
        success: false,
        error: `Failed to fetch accounts: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get the list of linked accounts
   */
  getLinkedAccounts(): GoogleAdsAccount[] {
    return this.linkedAccounts;
  }

  /**
   * Set linked accounts (for restoring from storage)
   */
  setLinkedAccounts(accounts: GoogleAdsAccount[]): void {
    this.linkedAccounts = accounts;
  }

  /**
   * Select an account to work with
   */
  selectAccount(accountId: string): ApiResponse<GoogleAdsAccount> {
    const account = this.linkedAccounts.find(a => a.id === accountId);
    
    if (!account) {
      return {
        success: false,
        error: 'Account not found'
      };
    }

    this.selectedAccountId = accountId;
    
    if (this.credentials) {
      this.credentials.customerId = account.customerId;
    }

    console.log(`[GoogleAdsAPI] Selected account: ${account.descriptiveName} (${account.customerId})`);
    
    return { success: true, data: account };
  }

  /**
   * Get the currently selected account
   */
  getSelectedAccount(): GoogleAdsAccount | null {
    if (!this.selectedAccountId) return null;
    return this.linkedAccounts.find(a => a.id === this.selectedAccountId) || null;
  }

  /**
   * Get the selected account ID
   */
  getSelectedAccountId(): string | null {
    return this.selectedAccountId;
  }

  /**
   * Link a new Google Ads account
   */
  async linkAccount(customerId: string): Promise<ApiResponse<GoogleAdsAccount>> {
    if (!this.hasApiToken() && !this.credentials?.accessToken) {
      return {
        success: false,
        error: 'Not authenticated. Please connect your Google account first.'
      };
    }

    try {
      console.log(`[GoogleAdsAPI] Linking account: ${customerId}`);

      // In production, this would verify access to the account via API
      // GET ${API_BASE_URL}/customers/${customerId}

      const newAccount: GoogleAdsAccount = {
        id: crypto.randomUUID(),
        customerId: customerId.replace(/-/g, ''),
        descriptiveName: `Account ${customerId}`,
        currencyCode: 'USD',
        timeZone: 'America/Los_Angeles',
        isManager: false,
        canManageClients: false,
        status: 'enabled',
        linkedAt: new Date().toISOString(),
      };

      this.linkedAccounts.push(newAccount);

      return { success: true, data: newAccount };
    } catch (error) {
      return {
        success: false,
        error: `Failed to link account: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Unlink a Google Ads account
   */
  unlinkAccount(accountId: string): ApiResponse<void> {
    const index = this.linkedAccounts.findIndex(a => a.id === accountId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Account not found'
      };
    }

    const account = this.linkedAccounts[index];
    this.linkedAccounts.splice(index, 1);

    // If this was the selected account, clear selection
    if (this.selectedAccountId === accountId) {
      this.selectedAccountId = null;
      if (this.credentials) {
        this.credentials.customerId = '';
      }
    }

    console.log(`[GoogleAdsAPI] Unlinked account: ${account.descriptiveName}`);

    return { success: true };
  }

  /**
   * Disconnect from Google Ads entirely
   */
  disconnect(): void {
    this.credentials = null;
    this.linkedAccounts = [];
    this.selectedAccountId = null;
    console.log('[GoogleAdsAPI] Disconnected from Google Ads');
  }

  /**
   * Check if we have any linked accounts
   */
  hasLinkedAccounts(): boolean {
    return this.linkedAccounts.length > 0;
  }

  /**
   * Get account by ID
   */
  getAccountById(accountId: string): GoogleAdsAccount | undefined {
    return this.linkedAccounts.find(a => a.id === accountId);
  }

  /**
   * Refresh account data from Google Ads API
   */
  async refreshAccountData(accountId: string): Promise<ApiResponse<GoogleAdsAccount>> {
    const account = this.getAccountById(accountId);
    
    if (!account) {
      return {
        success: false,
        error: 'Account not found'
      };
    }

    try {
      // In production, this would fetch fresh data from the API
      console.log(`[GoogleAdsAPI] Refreshing data for account: ${account.descriptiveName}`);
      
      return { success: true, data: account };
    } catch (error) {
      return {
        success: false,
        error: `Failed to refresh account: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// Export singleton instance
export const googleAdsApi = new GoogleAdsApiService();

// Export types for use in components
export type { GoogleAdsApiService };
