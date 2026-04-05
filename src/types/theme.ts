export type Theme = 'dark' | 'pink'

export interface ThemeConfig {
  name: Theme
  label: string
  icon: string
  colors: {
    primary: string
    primaryDark: string
    accent: string
    background: string
    cardBg: string
    text: string
    textSecondary: string
  }
}

export const THEMES: Record<Theme, ThemeConfig> = {
  dark: {
    name: 'dark',
    label: 'Power Mode',
    icon: '💪',
    colors: {
      primary: '#7c3aed',
      primaryDark: '#6d28d9',
      accent: '#8b5cf6',
      background: '#030712',
      cardBg: '#1f1f2e',
      text: '#ffffff',
      textSecondary: '#a1a1aa',
    },
  },
  pink: {
    name: 'pink',
    label: 'Prinzessin Mode',
    icon: '👑',
    colors: {
      primary: '#ec4899',
      primaryDark: '#db2777',
      accent: '#f472b6',
      background: '#fdf2f8',
      cardBg: '#ffffff',
      text: '#831843',
      textSecondary: '#be185d',
    },
  },
}

export interface UserProfile {
  theme: Theme
  name?: string
  email?: string
  createdAt?: string
}
