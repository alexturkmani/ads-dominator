import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, DashboardMetrics, AIRecommendation, User, BusinessProfile, Notification } from '../types'
import { mockCampaigns, mockMetrics, mockRecommendations } from '../data/mockData'
import { googleAdsApi, CampaignChange } from '../services/googleAdsApi'

interface GoogleAdsConfig {
  isConnected: boolean;
  customerId: string;
  autoApplyHighConfidence: boolean;
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
