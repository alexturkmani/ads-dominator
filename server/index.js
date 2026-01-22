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

// ==========================================
// Integration Store (use database in production)
// ==========================================

const integrationStore = new Map();

// ==========================================
// Google Analytics Integration
// ==========================================

const GOOGLE_ANALYTICS_SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.manage.users.readonly',
];

app.get('/api/integrations/google-analytics/auth-url', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const state = `ga_${sessionId}_${Math.random().toString(36).substring(7)}`;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_ANALYTICS_CLIENT_ID || GOOGLE_ADS_CONFIG.client_id,
    redirect_uri: `${process.env.OAUTH_REDIRECT_URI?.replace('/oauth/', '/oauth/ga/')  || 'http://localhost:3001/oauth/ga/callback'}`,
    response_type: 'code',
    scope: GOOGLE_ANALYTICS_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ authUrl, state });
});

app.get('/oauth/ga/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-analytics&error=${encodeURIComponent(error)}`);
  }

  const sessionId = state?.split('_')[1];
  
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_ANALYTICS_CLIENT_ID || GOOGLE_ADS_CONFIG.client_id,
        client_secret: process.env.GOOGLE_ANALYTICS_CLIENT_SECRET || GOOGLE_ADS_CONFIG.client_secret,
        redirect_uri: `${process.env.OAUTH_REDIRECT_URI?.replace('/oauth/', '/oauth/ga/') || 'http://localhost:3001/oauth/ga/callback'}`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    // Store integration tokens
    const integrations = integrationStore.get(sessionId) || {};
    integrations.google_analytics = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      connected: true,
      connectedAt: new Date().toISOString(),
    };
    integrationStore.set(sessionId, integrations);

    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-analytics&connected=true`);
  } catch (err) {
    console.error('GA OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-analytics&error=auth_failed`);
  }
});

app.get('/api/integrations/google-analytics/properties', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.google_analytics?.connected) {
    return res.status(401).json({ error: 'Google Analytics not connected' });
  }

  try {
    // Fetch GA4 properties using Admin API
    const response = await fetch('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
      headers: { 
        'Authorization': `Bearer ${integrations.google_analytics.access_token}` 
      },
    });

    const data = await response.json();
    
    const properties = [];
    if (data.accountSummaries) {
      for (const account of data.accountSummaries) {
        if (account.propertySummaries) {
          for (const prop of account.propertySummaries) {
            properties.push({
              id: prop.property,
              name: `${account.displayName} - ${prop.displayName}`,
            });
          }
        }
      }
    }

    res.json({ properties });
  } catch (err) {
    console.error('Error fetching GA properties:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.post('/api/integrations/google-analytics/config', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { propertyId, measurementId, viewId } = req.body;
  
  const integrations = integrationStore.get(sessionId) || {};
  if (integrations.google_analytics) {
    integrations.google_analytics.config = { propertyId, measurementId, viewId };
    integrationStore.set(sessionId, integrations);
  }
  
  res.json({ success: true });
});

app.get('/api/integrations/google-analytics/data', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { startDate, endDate } = req.query;
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.google_analytics?.connected) {
    return res.status(401).json({ error: 'Google Analytics not connected' });
  }

  const config = integrations.google_analytics.config;
  if (!config?.propertyId) {
    return res.status(400).json({ error: 'No property configured' });
  }

  try {
    // Use GA4 Data API
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/${config.propertyId}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integrations.google_analytics.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
        ],
      }),
    });

    const data = await response.json();
    
    const row = data.rows?.[0]?.metricValues || [];
    res.json({
      sessions: parseInt(row[0]?.value || '0'),
      users: parseInt(row[1]?.value || '0'),
      bounceRate: parseFloat(row[2]?.value || '0'),
      avgSessionDuration: parseFloat(row[3]?.value || '0'),
    });
  } catch (err) {
    console.error('Error fetching GA data:', err);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

app.post('/api/integrations/google-analytics/disconnect', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId) || {};
  delete integrations.google_analytics;
  integrationStore.set(sessionId, integrations);
  res.json({ success: true });
});

// ==========================================
// Google Tag Manager Integration
// ==========================================

const GTM_SCOPES = [
  'https://www.googleapis.com/auth/tagmanager.readonly',
  'https://www.googleapis.com/auth/tagmanager.manage.accounts',
];

app.get('/api/integrations/google-tag-manager/auth-url', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const state = `gtm_${sessionId}_${Math.random().toString(36).substring(7)}`;
  
  const params = new URLSearchParams({
    client_id: process.env.GTM_CLIENT_ID || GOOGLE_ADS_CONFIG.client_id,
    redirect_uri: `${process.env.OAUTH_REDIRECT_URI?.replace('/oauth/', '/oauth/gtm/') || 'http://localhost:3001/oauth/gtm/callback'}`,
    response_type: 'code',
    scope: GTM_SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ authUrl, state });
});

app.get('/oauth/gtm/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-tag-manager&error=${encodeURIComponent(error)}`);
  }

  const sessionId = state?.split('_')[1];
  
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GTM_CLIENT_ID || GOOGLE_ADS_CONFIG.client_id,
        client_secret: process.env.GTM_CLIENT_SECRET || GOOGLE_ADS_CONFIG.client_secret,
        redirect_uri: `${process.env.OAUTH_REDIRECT_URI?.replace('/oauth/', '/oauth/gtm/') || 'http://localhost:3001/oauth/gtm/callback'}`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      throw new Error(tokens.error_description || tokens.error);
    }

    const integrations = integrationStore.get(sessionId) || {};
    integrations.google_tag_manager = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      connected: true,
      connectedAt: new Date().toISOString(),
    };
    integrationStore.set(sessionId, integrations);

    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-tag-manager&connected=true`);
  } catch (err) {
    console.error('GTM OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=google-tag-manager&error=auth_failed`);
  }
});

app.get('/api/integrations/google-tag-manager/containers', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.google_tag_manager?.connected) {
    return res.status(401).json({ error: 'Google Tag Manager not connected' });
  }

  try {
    // Get accounts first
    const accountsResponse = await fetch('https://tagmanager.googleapis.com/tagmanager/v2/accounts', {
      headers: { 
        'Authorization': `Bearer ${integrations.google_tag_manager.access_token}` 
      },
    });
    const accountsData = await accountsResponse.json();
    
    const containers = [];
    if (accountsData.account) {
      for (const account of accountsData.account) {
        const containersResponse = await fetch(`https://tagmanager.googleapis.com/tagmanager/v2/${account.path}/containers`, {
          headers: { 
            'Authorization': `Bearer ${integrations.google_tag_manager.access_token}` 
          },
        });
        const containersData = await containersResponse.json();
        
        if (containersData.container) {
          for (const container of containersData.container) {
            containers.push({
              id: container.containerId,
              name: container.name,
              publicId: container.publicId,
            });
          }
        }
      }
    }

    res.json({ containers });
  } catch (err) {
    console.error('Error fetching GTM containers:', err);
    res.status(500).json({ error: 'Failed to fetch containers' });
  }
});

app.post('/api/integrations/google-tag-manager/config', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { containerId, workspaceId } = req.body;
  
  const integrations = integrationStore.get(sessionId) || {};
  if (integrations.google_tag_manager) {
    integrations.google_tag_manager.config = { containerId, workspaceId };
    integrationStore.set(sessionId, integrations);
  }
  
  res.json({ success: true });
});

app.post('/api/integrations/google-tag-manager/disconnect', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId) || {};
  delete integrations.google_tag_manager;
  integrationStore.set(sessionId, integrations);
  res.json({ success: true });
});

// ==========================================
// Slack Integration
// ==========================================

const SLACK_SCOPES = [
  'channels:read',
  'chat:write',
  'incoming-webhook',
  'team:read',
];

app.get('/api/integrations/slack/auth-url', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const state = `slack_${sessionId}_${Math.random().toString(36).substring(7)}`;
  
  const params = new URLSearchParams({
    client_id: process.env.SLACK_CLIENT_ID || '',
    redirect_uri: process.env.SLACK_REDIRECT_URI || 'http://localhost:3001/oauth/slack/callback',
    scope: SLACK_SCOPES.join(','),
    state,
  });

  const authUrl = `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  res.json({ authUrl, state });
});

app.get('/oauth/slack/callback', async (req, res) => {
  const { code, state, error } = req.query;
  
  if (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/settings?integration=slack&error=${encodeURIComponent(error)}`);
  }

  const sessionId = state?.split('_')[1];
  
  try {
    const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.SLACK_CLIENT_ID || '',
        client_secret: process.env.SLACK_CLIENT_SECRET || '',
        redirect_uri: process.env.SLACK_REDIRECT_URI || 'http://localhost:3001/oauth/slack/callback',
      }),
    });

    const data = await tokenResponse.json();
    
    if (!data.ok) {
      throw new Error(data.error || 'Slack auth failed');
    }

    const integrations = integrationStore.get(sessionId) || {};
    integrations.slack = {
      access_token: data.access_token,
      bot_user_id: data.bot_user_id,
      team: data.team,
      incoming_webhook: data.incoming_webhook,
      connected: true,
      connectedAt: new Date().toISOString(),
    };
    integrationStore.set(sessionId, integrations);

    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=slack&connected=true`);
  } catch (err) {
    console.error('Slack OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/settings?integration=slack&error=auth_failed`);
  }
});

app.get('/api/integrations/slack/channels', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.slack?.connected) {
    return res.status(401).json({ error: 'Slack not connected' });
  }

  try {
    const response = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel', {
      headers: { 
        'Authorization': `Bearer ${integrations.slack.access_token}` 
      },
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(data.error);
    }

    const channels = data.channels.map(ch => ({
      id: ch.id,
      name: ch.name,
    }));

    res.json({ channels });
  } catch (err) {
    console.error('Error fetching Slack channels:', err);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

app.post('/api/integrations/slack/config', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { channelId, channelName } = req.body;
  
  const integrations = integrationStore.get(sessionId) || {};
  if (integrations.slack) {
    integrations.slack.config = { channelId, channelName };
    integrationStore.set(sessionId, integrations);
  }
  
  res.json({ success: true });
});

app.post('/api/integrations/slack/test', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { channelId } = req.body;
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.slack?.connected) {
    return res.status(401).json({ error: 'Slack not connected' });
  }

  try {
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integrations.slack.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelId || integrations.slack.config?.channelId,
        text: '🎉 Ads Dominator integration test successful! You will receive campaign notifications here.',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*🎉 Ads Dominator Connected!*\nYour Slack integration is working. You will receive campaign notifications here.',
            },
          },
        ],
      }),
    });

    const data = await response.json();
    res.json({ success: data.ok });
  } catch (err) {
    console.error('Error sending Slack test message:', err);
    res.status(500).json({ error: 'Failed to send test message' });
  }
});

app.post('/api/integrations/slack/notify', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { message, type = 'info' } = req.body;
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.slack?.connected) {
    return res.status(401).json({ error: 'Slack not connected' });
  }

  const emoji = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  try {
    const channelId = integrations.slack.config?.channelId || integrations.slack.incoming_webhook?.channel_id;
    
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${integrations.slack.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: channelId,
        text: `${emoji[type]} ${message}`,
      }),
    });

    const data = await response.json();
    res.json({ success: data.ok });
  } catch (err) {
    console.error('Error sending Slack notification:', err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

app.post('/api/integrations/slack/disconnect', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId) || {};
  delete integrations.slack;
  integrationStore.set(sessionId, integrations);
  res.json({ success: true });
});

// ==========================================
// Zapier Integration
// ==========================================

app.get('/api/integrations/zapier/webhook-url', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  // Generate a unique webhook URL for this session
  const webhookId = `${sessionId}_${Date.now().toString(36)}`;
  const webhookUrl = `${process.env.API_URL || 'http://localhost:3001'}/api/webhooks/zapier/${webhookId}`;
  
  res.json({ webhookUrl, webhookId });
});

app.post('/api/integrations/zapier/config', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { webhookUrl, zapId } = req.body;
  
  const integrations = integrationStore.get(sessionId) || {};
  integrations.zapier = {
    webhookUrl,
    zapId,
    connected: true,
    connectedAt: new Date().toISOString(),
  };
  integrationStore.set(sessionId, integrations);
  
  res.json({ success: true });
});

app.post('/api/integrations/zapier/test', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.zapier?.connected || !integrations.zapier.webhookUrl) {
    return res.status(401).json({ error: 'Zapier not configured' });
  }

  try {
    const response = await fetch(integrations.zapier.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'test',
        message: 'Ads Dominator integration test',
        timestamp: new Date().toISOString(),
      }),
    });

    res.json({ success: response.ok });
  } catch (err) {
    console.error('Error testing Zapier webhook:', err);
    res.status(500).json({ error: 'Failed to test webhook' });
  }
});

app.post('/api/integrations/zapier/trigger', async (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { event, data } = req.body;
  const integrations = integrationStore.get(sessionId);
  
  if (!integrations?.zapier?.connected || !integrations.zapier.webhookUrl) {
    return res.status(401).json({ error: 'Zapier not configured' });
  }

  try {
    const response = await fetch(integrations.zapier.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString(),
      }),
    });

    res.json({ success: response.ok });
  } catch (err) {
    console.error('Error triggering Zapier event:', err);
    res.status(500).json({ error: 'Failed to trigger event' });
  }
});

app.post('/api/integrations/zapier/disconnect', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId) || {};
  delete integrations.zapier;
  integrationStore.set(sessionId, integrations);
  res.json({ success: true });
});

// Incoming webhook endpoint for Zapier
app.post('/api/webhooks/zapier/:webhookId', (req, res) => {
  console.log('Zapier webhook received:', req.params.webhookId, req.body);
  // Process incoming Zapier triggers here
  res.json({ received: true });
});

// ==========================================
// Get All Integrations Status
// ==========================================

app.get('/api/integrations', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const integrations = integrationStore.get(sessionId) || {};
  
  const result = [
    {
      id: 'google_analytics',
      name: 'Google Analytics',
      type: 'google_analytics',
      connected: integrations.google_analytics?.connected || false,
      config: integrations.google_analytics?.config,
      connectedAt: integrations.google_analytics?.connectedAt,
    },
    {
      id: 'google_tag_manager',
      name: 'Google Tag Manager',
      type: 'google_tag_manager',
      connected: integrations.google_tag_manager?.connected || false,
      config: integrations.google_tag_manager?.config,
      connectedAt: integrations.google_tag_manager?.connectedAt,
    },
    {
      id: 'slack',
      name: 'Slack',
      type: 'slack',
      connected: integrations.slack?.connected || false,
      config: integrations.slack?.config,
      connectedAt: integrations.slack?.connectedAt,
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'zapier',
      connected: integrations.zapier?.connected || false,
      config: integrations.zapier,
      connectedAt: integrations.zapier?.connectedAt,
    },
  ];
  
  res.json({ integrations: result });
});

app.get('/api/integrations/:type/status', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  const { type } = req.params;
  const integrations = integrationStore.get(sessionId) || {};
  
  const integration = integrations[type];
  
  res.json({
    integration: {
      id: type,
      name: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      type,
      connected: integration?.connected || false,
      config: integration?.config,
      connectedAt: integration?.connectedAt,
    },
  });
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
