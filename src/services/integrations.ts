/**
 * Integrations Service
 * 
 * Handles all third-party integrations:
 * - Google Analytics
 * - Google Tag Manager
 * - Slack
 * - Zapier
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function getSessionId(): string | null {
  return localStorage.getItem('google_ads_session_id');
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

// ==========================================
// Integration Types
// ==========================================

export interface Integration {
  id: string;
  name: string;
  type: 'google_analytics' | 'google_tag_manager' | 'slack' | 'zapier';
  connected: boolean;
  config?: Record<string, unknown>;
  connectedAt?: string;
}

export interface GoogleAnalyticsConfig {
  propertyId: string;
  measurementId: string;
  viewId?: string;
}

export interface GoogleTagManagerConfig {
  containerId: string;
  workspaceId?: string;
}

export interface SlackConfig {
  workspaceId: string;
  workspaceName: string;
  channelId: string;
  channelName: string;
  webhookUrl?: string;
}

export interface ZapierConfig {
  webhookUrl: string;
  zapId?: string;
}

// ==========================================
// Google Analytics
// ==========================================

export async function getGoogleAnalyticsAuthUrl(): Promise<string | null> {
  const result = await apiRequest<{ authUrl: string }>('/api/integrations/google-analytics/auth-url');
  return result.success ? result.data!.authUrl : null;
}

export async function connectGoogleAnalytics(): Promise<void> {
  const authUrl = await getGoogleAnalyticsAuthUrl();
  if (authUrl) {
    window.location.href = authUrl;
  }
}

export async function getGoogleAnalyticsProperties(): Promise<Array<{ id: string; name: string }>> {
  const result = await apiRequest<{ properties: Array<{ id: string; name: string }> }>(
    '/api/integrations/google-analytics/properties'
  );
  return result.success ? result.data!.properties : [];
}

export async function saveGoogleAnalyticsConfig(config: GoogleAnalyticsConfig): Promise<boolean> {
  const result = await apiRequest('/api/integrations/google-analytics/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
  return result.success;
}

export async function disconnectGoogleAnalytics(): Promise<boolean> {
  const result = await apiRequest('/api/integrations/google-analytics/disconnect', {
    method: 'POST',
  });
  return result.success;
}

export async function getAnalyticsData(
  startDate: string,
  endDate: string
): Promise<{ sessions: number; users: number; bounceRate: number; avgSessionDuration: number } | null> {
  const result = await apiRequest<{ 
    sessions: number; 
    users: number; 
    bounceRate: number; 
    avgSessionDuration: number 
  }>(`/api/integrations/google-analytics/data?startDate=${startDate}&endDate=${endDate}`);
  return result.success ? result.data! : null;
}

// ==========================================
// Google Tag Manager
// ==========================================

export async function getGoogleTagManagerAuthUrl(): Promise<string | null> {
  const result = await apiRequest<{ authUrl: string }>('/api/integrations/google-tag-manager/auth-url');
  return result.success ? result.data!.authUrl : null;
}

export async function connectGoogleTagManager(): Promise<void> {
  const authUrl = await getGoogleTagManagerAuthUrl();
  if (authUrl) {
    window.location.href = authUrl;
  }
}

export async function getGoogleTagManagerContainers(): Promise<Array<{ id: string; name: string; publicId: string }>> {
  const result = await apiRequest<{ containers: Array<{ id: string; name: string; publicId: string }> }>(
    '/api/integrations/google-tag-manager/containers'
  );
  return result.success ? result.data!.containers : [];
}

export async function saveGoogleTagManagerConfig(config: GoogleTagManagerConfig): Promise<boolean> {
  const result = await apiRequest('/api/integrations/google-tag-manager/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
  return result.success;
}

export async function disconnectGoogleTagManager(): Promise<boolean> {
  const result = await apiRequest('/api/integrations/google-tag-manager/disconnect', {
    method: 'POST',
  });
  return result.success;
}

// ==========================================
// Slack
// ==========================================

export async function getSlackAuthUrl(): Promise<string | null> {
  const result = await apiRequest<{ authUrl: string }>('/api/integrations/slack/auth-url');
  return result.success ? result.data!.authUrl : null;
}

export async function connectSlack(): Promise<void> {
  const authUrl = await getSlackAuthUrl();
  if (authUrl) {
    window.location.href = authUrl;
  }
}

export async function getSlackChannels(): Promise<Array<{ id: string; name: string }>> {
  const result = await apiRequest<{ channels: Array<{ id: string; name: string }> }>(
    '/api/integrations/slack/channels'
  );
  return result.success ? result.data!.channels : [];
}

export async function saveSlackConfig(config: SlackConfig): Promise<boolean> {
  const result = await apiRequest('/api/integrations/slack/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
  return result.success;
}

export async function sendSlackTestMessage(channelId: string): Promise<boolean> {
  const result = await apiRequest('/api/integrations/slack/test', {
    method: 'POST',
    body: JSON.stringify({ channelId }),
  });
  return result.success;
}

export async function disconnectSlack(): Promise<boolean> {
  const result = await apiRequest('/api/integrations/slack/disconnect', {
    method: 'POST',
  });
  return result.success;
}

export async function sendSlackNotification(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<boolean> {
  const result = await apiRequest('/api/integrations/slack/notify', {
    method: 'POST',
    body: JSON.stringify({ message, type }),
  });
  return result.success;
}

// ==========================================
// Zapier
// ==========================================

export async function getZapierWebhookUrl(): Promise<string | null> {
  const result = await apiRequest<{ webhookUrl: string }>('/api/integrations/zapier/webhook-url');
  return result.success ? result.data!.webhookUrl : null;
}

export async function saveZapierConfig(config: ZapierConfig): Promise<boolean> {
  const result = await apiRequest('/api/integrations/zapier/config', {
    method: 'POST',
    body: JSON.stringify(config),
  });
  return result.success;
}

export async function testZapierWebhook(): Promise<boolean> {
  const result = await apiRequest('/api/integrations/zapier/test', {
    method: 'POST',
  });
  return result.success;
}

export async function disconnectZapier(): Promise<boolean> {
  const result = await apiRequest('/api/integrations/zapier/disconnect', {
    method: 'POST',
  });
  return result.success;
}

export async function triggerZapierEvent(
  event: string,
  data: Record<string, unknown>
): Promise<boolean> {
  const result = await apiRequest('/api/integrations/zapier/trigger', {
    method: 'POST',
    body: JSON.stringify({ event, data }),
  });
  return result.success;
}

// ==========================================
// Get All Integrations Status
// ==========================================

export async function getAllIntegrations(): Promise<Integration[]> {
  const result = await apiRequest<{ integrations: Integration[] }>('/api/integrations');
  return result.success ? result.data!.integrations : [];
}

export async function getIntegrationStatus(type: Integration['type']): Promise<Integration | null> {
  const result = await apiRequest<{ integration: Integration }>(`/api/integrations/${type}/status`);
  return result.success ? result.data!.integration : null;
}
