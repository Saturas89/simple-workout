import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Theme, UserProfile, THEMES } from '@/types/theme'

interface ThemeStore {
  // State
  theme: Theme
  profile: UserProfile

  // Actions
  setTheme: (theme: Theme) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  getThemeConfig: () => typeof THEMES[Theme]
  getCurrentColors: () => typeof THEMES.dark.colors
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      profile: {
        theme: 'dark',
      },

      setTheme: (theme: Theme) => {
        set((state) => ({
          theme,
          profile: {
            ...state.profile,
            theme,
          },
        }))
      },

      updateProfile: (profile: Partial<UserProfile>) => {
        set((state) => ({
          profile: {
            ...state.profile,
            ...profile,
          },
        }))
      },

      getThemeConfig: () => {
        const { theme } = get()
        return THEMES[theme]
      },

      getCurrentColors: () => {
        const { theme } = get()
        return THEMES[theme].colors
      },
    }),
    {
      name: 'theme-store',
      partialize: (state) => ({ theme: state.theme, profile: state.profile }),
    },
  ),
)
