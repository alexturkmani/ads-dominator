import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, DashboardMetrics, AIRecommendation, User, BusinessProfile, Notification } from '../types'
import { mockCampaigns, mockMetrics, mockRecommendations } from '../data/mockData'

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
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'ads-optimizer-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        businessProfile: state.businessProfile,
        autoOptimize: state.autoOptimize,
      }),
    }
  )
)
