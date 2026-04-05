import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Theme, UserProfile, THEMES } from '@/types/theme'

interface ThemeStore {
  theme: Theme
  profile: UserProfile

  setTheme: (theme: Theme) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  getThemeConfig: () => typeof THEMES[Theme]
  getCurrentColors: () => typeof THEMES.dark.colors
}

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      profile: {
        theme: 'dark',
      },

      setTheme: (theme: Theme) => {
        applyTheme(theme)
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
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.theme)
      },
    },
  ),
)
