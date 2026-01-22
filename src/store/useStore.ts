import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, DashboardMetrics, AIRecommendation, User, BusinessProfile, Notification } from '../types'
import { mockCampaigns, mockMetrics, mockRecommendations } from '../data/mockData'
import { googleAdsApi, CampaignChange, GoogleAdsAccount } from '../services/googleAdsApi'

interface GoogleAdsConfig {
  isConnected: boolean;
  customerId: string;
  autoApplyHighConfidence: boolean;
  linkedAccounts: GoogleAdsAccount[];
  selectedAccountId: string | null;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  businessProfile: BusinessProfile | null;
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  metrics: DashboardMetrics;
  recommendations: AIRecommendation[];
  autoOptimize: boolean;
  sidebarOpen: boolean;
  notifications: Notification[];
  googleAdsConfig: GoogleAdsConfig;
  appliedChanges: CampaignChange[];
  
  setUser: (user: User | null) => void;
  setBusinessProfile: (profile: BusinessProfile) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  selectCampaign: (id: string | null) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  setRecommendations: (recommendations: AIRecommendation[]) => void;
  applyRecommendation: (id: string) => void;
  dismissRecommendation: (id: string) => void;
  toggleAutoOptimize: () => void;
  toggleSidebar: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  logout: () => void;
  setGoogleAdsConfig: (config: Partial<GoogleAdsConfig>) => void;
  applyRecommendationToGoogleAds: (id: string, confidence: number) => Promise<boolean>;
  connectGoogleAds: () => Promise<boolean>;
  disconnectGoogleAds: () => void;
  fetchGoogleAdsAccounts: () => Promise<GoogleAdsAccount[]>;
  selectGoogleAdsAccount: (accountId: string) => void;
  linkGoogleAdsAccount: (customerId: string) => Promise<boolean>;
  unlinkGoogleAdsAccount: (accountId: string) => void;
  startDemo: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      businessProfile: null,
      campaigns: mockCampaigns,
      selectedCampaignId: null,
      metrics: mockMetrics,
      recommendations: mockRecommendations,
      autoOptimize: true,
      sidebarOpen: true,
      notifications: [],
      googleAdsConfig: {
        isConnected: false,
        customerId: '',
        autoApplyHighConfidence: true,
        linkedAccounts: [],
        selectedAccountId: null,
      },
      appliedChanges: [],

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setBusinessProfile: (profile) => set({ businessProfile: profile }),
      
      setCampaigns: (campaigns) => set({ campaigns }),
      
      selectCampaign: (id) => set({ selectedCampaignId: id }),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
        ),
      })),
      
      setMetrics: (metrics) => set({ metrics }),
      
      setRecommendations: (recommendations) => set({ recommendations }),
      
      applyRecommendation: (id) => set((state) => ({
        recommendations: state.recommendations.map((r) =>
          r.id === id ? { ...r, status: 'applied' as const } : r
        ),
      })),
      
      dismissRecommendation: (id) => set((state) => ({
        recommendations: state.recommendations.map((r) =>
          r.id === id ? { ...r, status: 'dismissed' as const } : r
        ),
      })),
      
      toggleAutoOptimize: () => set((state) => ({ autoOptimize: !state.autoOptimize })),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...state.notifications,
        ],
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      
      logout: () => set({
        user: null,
        isAuthenticated: false,
        businessProfile: null,
      }),

      setGoogleAdsConfig: (config) => set((state) => ({
        googleAdsConfig: { ...state.googleAdsConfig, ...config },
      })),

      /**
       * Apply a recommendation directly to Google Ads
       * Only applies when confidence is 100%
       */
      applyRecommendationToGoogleAds: async (id: string, confidence: number) => {
        const state = get();
        const recommendation = state.recommendations.find(r => r.id === id);
        
        if (!recommendation) {
          console.error('Recommendation not found');
          return false;
        }

        // Only auto-apply when confidence is 100%
        if (confidence !== 100) {
          get().addNotification({
            type: 'warning',
            title: 'Manual Review Required',
            message: `Cannot auto-apply: Confidence is ${confidence}%. Changes require 100% confidence for automatic application.`,
          });
          return false;
        }

        if (!state.googleAdsConfig.isConnected) {
          get().addNotification({
            type: 'error',
            title: 'Google Ads Not Connected',
            message: 'Please connect your Google Ads account in Settings to apply changes.',
          });
          return false;
        }

        // Attempt to apply the change via Google Ads API
        const result = await googleAdsApi.applyRecommendation({
          campaignId: 'campaign-1', // In production, this would come from the recommendation
          type: recommendation.type as 'budget' | 'status' | 'bid' | 'keyword' | 'targeting',
          value: recommendation.estimatedImpact,
          confidence,
          reason: recommendation.description,
        });

        if (result.success && result.data) {
          // Update local state
          set((state) => ({
            recommendations: state.recommendations.map((r) =>
              r.id === id ? { ...r, status: 'applied' as const } : r
            ),
            appliedChanges: [result.data!, ...state.appliedChanges],
          }));

          get().addNotification({
            type: 'success',
            title: 'Change Applied to Google Ads',
            message: `${recommendation.title} has been applied with 100% confidence.`,
          });

          return true;
        } else {
          get().addNotification({
            type: 'error',
            title: 'Failed to Apply Change',
            message: result.error || 'An unknown error occurred',
          });
          return false;
        }
      },

      /**
       * Connect to Google Ads via OAuth
       */
      connectGoogleAds: async () => {
        try {
          // In a real app, this would open OAuth popup/redirect
          // For demo, we simulate successful connection
          console.log('[Store] Initiating Google Ads connection');
          
          // Fetch available accounts
          const result = await googleAdsApi.fetchAccessibleAccounts();
          
          if (result.success && result.data) {
            set((state) => ({
              googleAdsConfig: {
                ...state.googleAdsConfig,
                isConnected: true,
                linkedAccounts: result.data!,
              },
            }));

            get().addNotification({
              type: 'success',
              title: 'Google Ads Connected',
              message: `Successfully connected! Found ${result.data.length} accessible accounts.`,
            });

            return true;
          } else {
            get().addNotification({
              type: 'error',
              title: 'Connection Failed',
              message: result.error || 'Failed to connect to Google Ads',
            });
            return false;
          }
        } catch (error) {
          get().addNotification({
            type: 'error',
            title: 'Connection Error',
            message: error instanceof Error ? error.message : 'Unknown error occurred',
          });
          return false;
        }
      },

      /**
       * Disconnect from Google Ads
       */
      disconnectGoogleAds: () => {
        googleAdsApi.disconnect();
        set((state) => ({
          googleAdsConfig: {
            ...state.googleAdsConfig,
            isConnected: false,
            customerId: '',
            linkedAccounts: [],
            selectedAccountId: null,
          },
        }));

        get().addNotification({
          type: 'info',
          title: 'Google Ads Disconnected',
          message: 'Your Google Ads account has been disconnected.',
        });
      },

      /**
       * Fetch Google Ads accounts
       */
      fetchGoogleAdsAccounts: async () => {
        const result = await googleAdsApi.fetchAccessibleAccounts();
        
        if (result.success && result.data) {
          set((state) => ({
            googleAdsConfig: {
              ...state.googleAdsConfig,
              linkedAccounts: result.data!,
            },
          }));
          return result.data;
        }
        
        return [];
      },

      /**
       * Select a Google Ads account to work with
       */
      selectGoogleAdsAccount: (accountId: string) => {
        const result = googleAdsApi.selectAccount(accountId);
        
        if (result.success && result.data) {
          set((state) => ({
            googleAdsConfig: {
              ...state.googleAdsConfig,
              selectedAccountId: accountId,
              customerId: result.data!.customerId,
            },
          }));

          get().addNotification({
            type: 'success',
            title: 'Account Selected',
            message: `Now managing: ${result.data.descriptiveName}`,
          });
        }
      },

      /**
       * Link a new Google Ads account by Customer ID
       */
      linkGoogleAdsAccount: async (customerId: string) => {
        const result = await googleAdsApi.linkAccount(customerId);
        
        if (result.success && result.data) {
          set((state) => ({
            googleAdsConfig: {
              ...state.googleAdsConfig,
              linkedAccounts: [...state.googleAdsConfig.linkedAccounts, result.data!],
            },
          }));

          get().addNotification({
            type: 'success',
            title: 'Account Linked',
            message: `Successfully linked account: ${customerId}`,
          });

          return true;
        } else {
          get().addNotification({
            type: 'error',
            title: 'Failed to Link Account',
            message: result.error || 'Unknown error occurred',
          });
          return false;
        }
      },

      /**
       * Unlink a Google Ads account
       */
      unlinkGoogleAdsAccount: (accountId: string) => {
        const account = googleAdsApi.getAccountById(accountId);
        const result = googleAdsApi.unlinkAccount(accountId);
        
        if (result.success) {
          set((state) => ({
            googleAdsConfig: {
              ...state.googleAdsConfig,
              linkedAccounts: state.googleAdsConfig.linkedAccounts.filter(a => a.id !== accountId),
              selectedAccountId: state.googleAdsConfig.selectedAccountId === accountId 
                ? null 
                : state.googleAdsConfig.selectedAccountId,
              customerId: state.googleAdsConfig.selectedAccountId === accountId 
                ? '' 
                : state.googleAdsConfig.customerId,
            },
          }));

          get().addNotification({
            type: 'info',
            title: 'Account Unlinked',
            message: `Removed account: ${account?.descriptiveName || accountId}`,
          });
        }
      },

      /**
       * Start demo mode with pre-configured data
       */
      startDemo: () => {
        // Set demo user
        set({
          user: {
            id: 'demo-user',
            email: 'demo@adsdominator.com',
            name: 'Demo User',
            company: 'Demo Company',
            plan: 'pro',
            createdAt: new Date().toISOString(),
          },
          isAuthenticated: true,
          businessProfile: {
            id: 'demo-profile',
            businessName: 'Demo E-commerce Store',
            websiteUrl: 'https://demo-store.com',
            industry: 'E-commerce',
            businessType: 'Online Retail',
            targetLocations: ['United States', 'Canada', 'United Kingdom'],
            monthlyBudget: 5000,
            goals: ['Increase Sales', 'Lower CPA', 'Improve ROAS'],
          },
          googleAdsConfig: {
            isConnected: true,
            customerId: '123-456-7890',
            autoApplyHighConfidence: true,
            linkedAccounts: [
              {
                id: 'demo-acc-1',
                customerId: '123-456-7890',
                descriptiveName: 'Demo E-commerce Store',
                currencyCode: 'USD',
                timeZone: 'America/Los_Angeles',
                isManager: false,
                canManageClients: false,
                status: 'enabled',
                linkedAt: new Date().toISOString(),
              },
              {
                id: 'demo-acc-2',
                customerId: '234-567-8901',
                descriptiveName: 'Demo Brand Campaigns',
                currencyCode: 'USD',
                timeZone: 'America/New_York',
                isManager: false,
                canManageClients: false,
                status: 'enabled',
                linkedAt: new Date().toISOString(),
              },
            ],
            selectedAccountId: 'demo-acc-1',
          },
        });

        // Sync with API service
        googleAdsApi.setLinkedAccounts([
          {
            id: 'demo-acc-1',
            customerId: '123-456-7890',
            descriptiveName: 'Demo E-commerce Store',
            currencyCode: 'USD',
            timeZone: 'America/Los_Angeles',
            isManager: false,
            canManageClients: false,
            status: 'enabled',
            linkedAt: new Date().toISOString(),
          },
          {
            id: 'demo-acc-2',
            customerId: '234-567-8901',
            descriptiveName: 'Demo Brand Campaigns',
            currencyCode: 'USD',
            timeZone: 'America/New_York',
            isManager: false,
            canManageClients: false,
            status: 'enabled',
            linkedAt: new Date().toISOString(),
          },
        ]);
        googleAdsApi.selectAccount('demo-acc-1');

        get().addNotification({
          type: 'success',
          title: 'Welcome to Demo Mode!',
          message: 'Explore all features with sample data. Google Ads is pre-connected.',
        });
      },
    }),
    {
      name: 'ads-optimizer-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        businessProfile: state.businessProfile,
        autoOptimize: state.autoOptimize,
        googleAdsConfig: state.googleAdsConfig,
      }),
    }
  )
)
