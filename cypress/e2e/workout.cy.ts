/**
 * E2E tests for Simple Workout.
 *
 * Auth-gated: The app shows AuthView for unauthenticated sessions.
 * The "Workout Flow" suite stubs the Supabase auth endpoint so the
 * main app is reachable without real credentials.
 */

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Visit with a specific i18n language pre-set in localStorage. */
function visitWithLang(lang: 'de' | 'en') {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('i18n-language', lang)
    },
  })
}

/** Intercept all Supabase auth requests and respond with a mock session. */
function mockSupabaseAuth() {
  const mockUser = {
    id: 'mock-user-id',
    email: 'test@example.com',
    created_at: '2024-01-01T00:00:00Z',
    role: 'authenticated',
  }
  const mockSession = {
    access_token: 'mock-access-token',
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    refresh_token: 'mock-refresh-token',
    user: mockUser,
  }

  cy.intercept('GET', '**/auth/v1/user', { statusCode: 200, body: mockUser }).as('getUser')
  cy.intercept('POST', '**/auth/v1/token**', { statusCode: 200, body: mockSession }).as('token')
  cy.intercept('GET', '**/auth/v1/session', { statusCode: 200, body: mockSession }).as('session')
  // Supabase JS v2 also calls this endpoint for getSession()
  cy.intercept('GET', '**/auth/v1/**', { statusCode: 200, body: mockSession })
}

// ─── Auth View ────────────────────────────────────────────────────────────────

describe('Auth View', () => {
  it('always shows the app title', () => {
    cy.visit('/')
    cy.contains('Simple Workout').should('be.visible')
  })

  describe('English (default locale)', () => {
    beforeEach(() => visitWithLang('en'))

    it('shows the English tagline', () => {
      cy.contains('Your training, your progress').should('be.visible')
    })

    it('shows the Google sign-in button', () => {
      cy.contains('Sign in with Google').should('be.visible')
    })

    it('shows the login form', () => {
      cy.contains('Sign in with email').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')
      cy.contains('Sign in').should('be.visible')
    })

    it('toggles to register mode', () => {
      cy.contains('No account? Register').click()
      cy.contains('Create account').should('be.visible')
      cy.contains('Register').should('be.visible')
    })

    it('toggles back to login mode', () => {
      cy.contains('No account? Register').click()
      cy.contains('Have account? Sign in').click()
      cy.contains('Sign in with email').should('be.visible')
    })
  })

  describe('German locale', () => {
    beforeEach(() => visitWithLang('de'))

    it('shows the German tagline', () => {
      cy.contains('Dein Training, dein Fortschritt').should('be.visible')
    })

    it('shows the German Google sign-in button', () => {
      cy.contains('Mit Google anmelden').should('be.visible')
    })

    it('shows the German login form', () => {
      cy.contains('Mit E-Mail anmelden').should('be.visible')
      cy.contains('Anmelden').should('be.visible')
    })

    it('toggles to register mode in German', () => {
      cy.contains('Noch kein Konto? Registrieren').click()
      cy.contains('Konto erstellen').should('be.visible')
      cy.contains('Registrieren').should('be.visible')
    })

    it('toggles back to login mode in German', () => {
      cy.contains('Noch kein Konto? Registrieren').click()
      cy.contains('Bereits ein Konto? Anmelden').click()
      cy.contains('Mit E-Mail anmelden').should('be.visible')
    })
  })
})

// ─── Workout Flow (authenticated) ─────────────────────────────────────────────

describe('Workout Flow (authenticated)', () => {
  beforeEach(() => {
    mockSupabaseAuth()
    visitWithLang('en')
  })

  it('shows the app title after auth', () => {
    cy.contains('Simple Workout').should('be.visible')
  })

  it('shows the Today and Dashboard tabs', () => {
    cy.contains('Today').should('be.visible')
    cy.contains('Dashboard').should('be.visible')
  })

  it('shows the muscle group selector section', () => {
    cy.contains('Train today').should('be.visible')
  })

  it('shows muscle group buttons', () => {
    cy.contains('Brust').should('be.visible')
    cy.contains('Rücken').should('be.visible')
    cy.contains('Mobility').should('be.visible')
  })

  it('shows the save button placeholder when nothing is selected', () => {
    cy.contains('Select muscle groups').should('be.visible')
  })

  it('updates the save button when groups are selected', () => {
    cy.contains('Brust').click()
    cy.contains('Save 1 group').should('be.visible')
    cy.contains('Rücken').click()
    cy.contains('Save 2 groups').should('be.visible')
  })
})

// ─── Workout Flow — German locale ─────────────────────────────────────────────

describe('Workout Flow — German locale (authenticated)', () => {
  beforeEach(() => {
    mockSupabaseAuth()
    visitWithLang('de')
  })

  it('shows the Today tab label in German', () => {
    cy.contains('Heute').should('be.visible')
  })

  it('shows the muscle group selector section in German', () => {
    cy.contains('Heute trainieren').should('be.visible')
  })

  it('shows the save button placeholder in German', () => {
    cy.contains('Muskelgruppen auswählen').should('be.visible')
  })

  it('updates the save button label in German when groups are selected', () => {
    cy.contains('Brust').click()
    cy.contains('1 Gruppe speichern').should('be.visible')
    cy.contains('Rücken').click()
    cy.contains('2 Gruppen speichern').should('be.visible')
  })
})
