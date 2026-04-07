import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock navigator.userAgent before importing the module
const setUA = (ua: string) =>
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true })

describe('appleHealth', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  // ─── isIOS ──────────────────────────────────────────────────────────────────

  describe('isIOS', () => {
    it('returns true for iPhone UA', async () => {
      setUA('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
      const { isIOS } = await import('@/services/appleHealth')
      expect(isIOS()).toBe(true)
    })

    it('returns true for iPad UA', async () => {
      setUA('Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)')
      const { isIOS } = await import('@/services/appleHealth')
      expect(isIOS()).toBe(true)
    })

    it('returns false for desktop Chrome UA', async () => {
      setUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120')
      const { isIOS } = await import('@/services/appleHealth')
      expect(isIOS()).toBe(false)
    })

    it('returns false for Android UA', async () => {
      setUA('Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36')
      const { isIOS } = await import('@/services/appleHealth')
      expect(isIOS()).toBe(false)
    })
  })

  // ─── automation setup state ──────────────────────────────────────────────

  describe('isAutomationSetup / markAutomationSetup / resetAutomationSetup', () => {
    it('returns false when not set', async () => {
      const { isAutomationSetup } = await import('@/services/appleHealth')
      expect(isAutomationSetup()).toBe(false)
    })

    it('returns true after markAutomationSetup', async () => {
      const { isAutomationSetup, markAutomationSetup } = await import('@/services/appleHealth')
      markAutomationSetup()
      expect(isAutomationSetup()).toBe(true)
    })

    it('returns false after resetAutomationSetup', async () => {
      const { isAutomationSetup, markAutomationSetup, resetAutomationSetup } =
        await import('@/services/appleHealth')
      markAutomationSetup()
      resetAutomationSetup()
      expect(isAutomationSetup()).toBe(false)
    })

    it('persists in localStorage under correct key', async () => {
      const { markAutomationSetup } = await import('@/services/appleHealth')
      markAutomationSetup()
      expect(localStorage.getItem('apple-health-automation-done')).toBe('true')
    })
  })

  // ─── AUTOMATION_SETUP_STEPS ──────────────────────────────────────────────

  describe('AUTOMATION_SETUP_STEPS', () => {
    it('has 7 steps', async () => {
      const { AUTOMATION_SETUP_STEPS } = await import('@/services/appleHealth')
      expect(AUTOMATION_SETUP_STEPS).toHaveLength(7)
    })

    it('each step is a non-empty string', async () => {
      const { AUTOMATION_SETUP_STEPS } = await import('@/services/appleHealth')
      AUTOMATION_SETUP_STEPS.forEach((step) => {
        expect(typeof step).toBe('string')
        expect(step.length).toBeGreaterThan(0)
      })
    })
  })
})
