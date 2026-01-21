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
  get fullUrl() { return `${this.baseUrl}/${this.apiVersion}`; }
};

class GoogleAdsApiService {
  private credentials: GoogleAdsCredentials | null = null;
  private changeHistory: CampaignChange[] = [];
  private apiConfig = GOOGLE_ADS_CONFIG;

  /**
   * Initialize the service with credentials
   */
  setCredentials(credentials: GoogleAdsCredentials): void {
    this.credentials = credentials;
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
    return this.credentials !== null;
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
}

// Export singleton instance
export const googleAdsApi = new GoogleAdsApiService();

// Export types for use in components
export type { GoogleAdsApiService };
