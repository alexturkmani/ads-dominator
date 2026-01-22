import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleAdsApi } from 'google-ads-api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Store tokens in memory (use Redis/database in production)
const tokenStore = new Map();

// Google OAuth Configuration
const GOOGLE_ADS_CONFIG = {
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
};

const OAUTH_SCOPES = ['https://www.googleapis.com/auth/adwords'];
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3001/oauth/callback';

// ==========================================
// OAuth Endpoints
// ==========================================

/**
 * Generate OAuth URL for Google Ads authorization
 */
app.get('/api/oauth/url', (req, res) => {
  const state = Math.random().toString(36).substring(7);
  
  const params = new URLSearchParams({
    client_id: GOOGLE_ADS_CONFIG.client_id,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: 'code',
    scope: OAUTH_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  res.json({ authUrl, state });
});

/**
 * OAuth callback - exchange code for tokens
 */
app.get('/oauth/callback', async (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/settings?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${process.env.FRONTEND_URL}/settings?error=no_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_ADS_CONFIG.client_id,
        client_secret: GOOGLE_ADS_CONFIG.client_secret,
        redirect_uri: OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error('Token exchange error:', tokens);
      return res.redirect(`${process.env.FRONTEND_URL}/settings?error=${encodeURIComponent(tokens.error_description || tokens.error)}`);
    }

    // Generate a session ID to store tokens
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    
    tokenStore.set(sessionId, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
    });

    // Redirect back to frontend with session ID
    res.redirect(`${process.env.FRONTEND_URL}/settings?connected=true&session=${sessionId}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=token_exchange_failed`);
  }
});

/**
 * Refresh access token
 */
async function refreshAccessToken(sessionId) {
  const tokenData = tokenStore.get(sessionId);
  if (!tokenData?.refresh_token) {
    throw new Error('No refresh token available');
  }

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: tokenData.refresh_token,
      client_id: GOOGLE_ADS_CONFIG.client_id,
      client_secret: GOOGLE_ADS_CONFIG.client_secret,
      grant_type: 'refresh_token',
    }),
  });

  const tokens = await tokenResponse.json();

  if (tokens.error) {
    throw new Error(tokens.error_description || tokens.error);
  }

  tokenStore.set(sessionId, {
    ...tokenData,
    access_token: tokens.access_token,
    expires_at: Date.now() + (tokens.expires_in * 1000),
  });

  return tokens.access_token;
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken(sessionId) {
  const tokenData = tokenStore.get(sessionId);
  if (!tokenData) {
    throw new Error('Session not found');
  }

  // Refresh if token expires in less than 5 minutes
  if (tokenData.expires_at < Date.now() + 300000) {
    return await refreshAccessToken(sessionId);
  }

  return tokenData.access_token;
}

/**
 * Create Google Ads API client
 */
function createGoogleAdsClient(accessToken, refreshToken) {
  return new GoogleAdsApi({
    client_id: GOOGLE_ADS_CONFIG.client_id,
    client_secret: GOOGLE_ADS_CONFIG.client_secret,
    developer_token: GOOGLE_ADS_CONFIG.developer_token,
  });
}

// ==========================================
// Google Ads API Endpoints
// ==========================================

/**
 * Get accessible Google Ads accounts
 */
app.get('/api/accounts', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  try {
    const accessToken = await getValidAccessToken(sessionId);
    const tokenData = tokenStore.get(sessionId);

    const client = createGoogleAdsClient(accessToken, tokenData.refresh_token);
    
    // Get list of accessible customers
    const customers = await client.listAccessibleCustomers(tokenData.refresh_token);
    
    // Fetch details for each customer
    const accounts = await Promise.all(
      customers.resource_names.map(async (resourceName) => {
        const customerId = resourceName.replace('customers/', '');
        try {
          const customer = client.Customer({
            customer_id: customerId,
            refresh_token: tokenData.refresh_token,
          });
          
          const [accountInfo] = await customer.query(`
            SELECT
              customer.id,
              customer.descriptive_name,
              customer.currency_code,
              customer.time_zone,
              customer.manager,
              customer.status
            FROM customer
            LIMIT 1
          `);
          
          return {
            id: customerId,
            customerId: customerId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
            descriptiveName: accountInfo.customer.descriptive_name || `Account ${customerId}`,
            currencyCode: accountInfo.customer.currency_code || 'USD',
            timeZone: accountInfo.customer.time_zone || 'America/Los_Angeles',
            isManager: accountInfo.customer.manager || false,
            canManageClients: accountInfo.customer.manager || false,
            status: (accountInfo.customer.status || 'ENABLED').toLowerCase(),
          };
        } catch (err) {
          console.error(`Error fetching customer ${customerId}:`, err.message);
          return null;
        }
      })
    );

    res.json({ accounts: accounts.filter(Boolean) });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get campaigns for a customer
 */
app.get('/api/accounts/:customerId/campaigns', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { customerId } = req.params;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  try {
    const tokenData = tokenStore.get(sessionId);
    if (!tokenData) {
      return res.status(401).json({ error: 'Session expired' });
    }

    const client = createGoogleAdsClient(tokenData.access_token, tokenData.refresh_token);
    const customer = client.Customer({
      customer_id: customerId.replace(/-/g, ''),
      refresh_token: tokenData.refresh_token,
    });

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      ORDER BY metrics.impressions DESC
      LIMIT 50
    `);

    const formattedCampaigns = campaigns.map(row => ({
      id: row.campaign.id.toString(),
      name: row.campaign.name,
      status: row.campaign.status.toLowerCase(),
      type: row.campaign.advertising_channel_type,
      budget: (row.campaign_budget?.amount_micros || 0) / 1000000,
      impressions: row.metrics?.impressions || 0,
      clicks: row.metrics?.clicks || 0,
      conversions: row.metrics?.conversions || 0,
      cost: (row.metrics?.cost_micros || 0) / 1000000,
      ctr: row.metrics?.ctr || 0,
      cpc: (row.metrics?.average_cpc || 0) / 1000000,
    }));

    res.json({ campaigns: formattedCampaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update campaign budget
 */
app.patch('/api/accounts/:customerId/campaigns/:campaignId/budget', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { customerId, campaignId } = req.params;
  const { budget, confidence, reason } = req.body;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  // Only allow changes with 100% confidence
  if (confidence !== 100) {
    return res.status(400).json({ 
      error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.` 
    });
  }

  try {
    const tokenData = tokenStore.get(sessionId);
    if (!tokenData) {
      return res.status(401).json({ error: 'Session expired' });
    }

    const client = createGoogleAdsClient(tokenData.access_token, tokenData.refresh_token);
    const customer = client.Customer({
      customer_id: customerId.replace(/-/g, ''),
      refresh_token: tokenData.refresh_token,
    });

    // First, get the campaign's budget resource name
    const [campaignData] = await customer.query(`
      SELECT
        campaign.id,
        campaign.campaign_budget
      FROM campaign
      WHERE campaign.id = ${campaignId}
    `);

    if (!campaignData) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Update the budget
    const budgetResourceName = campaignData.campaign.campaign_budget;
    const budgetMicros = Math.round(budget * 1000000);

    await customer.campaignBudgets.update({
      resource_name: budgetResourceName,
      amount_micros: budgetMicros,
    });

    console.log(`[GoogleAdsAPI] Budget updated for campaign ${campaignId}: $${budget}`);
    console.log(`[GoogleAdsAPI] Reason: ${reason}`);

    res.json({ 
      success: true, 
      change: {
        id: Date.now().toString(),
        campaignId,
        type: 'budget',
        newValue: budget,
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied',
      }
    });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Update campaign status (pause/enable)
 */
app.patch('/api/accounts/:customerId/campaigns/:campaignId/status', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { customerId, campaignId } = req.params;
  const { status, confidence, reason } = req.body;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  if (confidence !== 100) {
    return res.status(400).json({ 
      error: `Cannot apply change: Confidence is ${confidence}%, must be 100% to auto-apply changes.` 
    });
  }

  try {
    const tokenData = tokenStore.get(sessionId);
    if (!tokenData) {
      return res.status(401).json({ error: 'Session expired' });
    }

    const client = createGoogleAdsClient(tokenData.access_token, tokenData.refresh_token);
    const customer = client.Customer({
      customer_id: customerId.replace(/-/g, ''),
      refresh_token: tokenData.refresh_token,
    });

    const campaignStatus = status === 'active' ? 'ENABLED' : 'PAUSED';

    await customer.campaigns.update({
      resource_name: `customers/${customerId.replace(/-/g, '')}/campaigns/${campaignId}`,
      status: campaignStatus,
    });

    console.log(`[GoogleAdsAPI] Status updated for campaign ${campaignId}: ${status}`);
    console.log(`[GoogleAdsAPI] Reason: ${reason}`);

    res.json({ 
      success: true, 
      change: {
        id: Date.now().toString(),
        campaignId,
        type: 'status',
        newValue: status,
        confidence,
        reason,
        appliedAt: new Date().toISOString(),
        status: 'applied',
      }
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get keyword performance
 */
app.get('/api/accounts/:customerId/keywords', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { customerId } = req.params;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session ID provided' });
  }

  try {
    const tokenData = tokenStore.get(sessionId);
    if (!tokenData) {
      return res.status(401).json({ error: 'Session expired' });
    }

    const client = createGoogleAdsClient(tokenData.access_token, tokenData.refresh_token);
    const customer = client.Customer({
      customer_id: customerId.replace(/-/g, ''),
      refresh_token: tokenData.refresh_token,
    });

    const keywords = await customer.query(`
      SELECT
        ad_group_criterion.criterion_id,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.status,
        ad_group_criterion.cpc_bid_micros,
        ad_group_criterion.quality_info.quality_score,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc
      FROM keyword_view
      WHERE ad_group_criterion.status != 'REMOVED'
      ORDER BY metrics.impressions DESC
      LIMIT 100
    `);

    const formattedKeywords = keywords.map(row => ({
      id: row.ad_group_criterion.criterion_id.toString(),
      keyword: row.ad_group_criterion.keyword.text,
      matchType: row.ad_group_criterion.keyword.match_type.toLowerCase(),
      status: row.ad_group_criterion.status.toLowerCase(),
      bid: (row.ad_group_criterion.cpc_bid_micros || 0) / 1000000,
      qualityScore: row.ad_group_criterion.quality_info?.quality_score || 0,
      impressions: row.metrics?.impressions || 0,
      clicks: row.metrics?.clicks || 0,
      conversions: row.metrics?.conversions || 0,
      cost: (row.metrics?.cost_micros || 0) / 1000000,
      ctr: row.metrics?.ctr || 0,
      cpc: (row.metrics?.average_cpc || 0) / 1000000,
    }));

    res.json({ keywords: formattedKeywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Disconnect (revoke tokens)
 */
app.post('/api/disconnect', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId) {
    const tokenData = tokenStore.get(sessionId);
    if (tokenData?.access_token) {
      // Revoke the token with Google
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenData.access_token}`, {
          method: 'POST',
        });
      } catch (err) {
        console.error('Error revoking token:', err);
      }
    }
    tokenStore.delete(sessionId);
  }

  res.json({ success: true });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    configured: !!(GOOGLE_ADS_CONFIG.client_id && GOOGLE_ADS_CONFIG.client_secret && GOOGLE_ADS_CONFIG.developer_token),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Google Ads API Server running on http://localhost:${PORT}`);
  console.log(`📋 OAuth callback: ${OAUTH_REDIRECT_URI}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  
  if (!GOOGLE_ADS_CONFIG.client_id || GOOGLE_ADS_CONFIG.client_id === 'your_client_id.apps.googleusercontent.com') {
    console.warn('\n⚠️  WARNING: Google Ads API credentials not configured!');
    console.warn('   Please update server/.env with your credentials.\n');
  }
});
