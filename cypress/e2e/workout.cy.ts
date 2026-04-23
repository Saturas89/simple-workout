describe('Workout Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the app title', () => {
    cy.contains('Simple Workout').should('be.visible')
  })

  it('should allow selecting muscle groups', () => {
    cy.contains('Brust').click()
    cy.contains('Rücken').click()
    cy.contains('Mobility').click()

    cy.contains('Heute:').should('be.visible')
    cy.contains('Brust').should('be.visible')
    cy.contains('Rücken').should('be.visible')
    cy.contains('Mobility').should('be.visible')
  })

  it('should save the selection', () => {
    cy.contains('Brust').click()
    cy.contains('Auswahl speichern').click()
    cy.contains('gespeichert').should('be.visible')
  })

  it('should display the dashboard', () => {
    cy.contains('Dashboard').should('be.visible')
  })
})

describe('Showcase Mode', () => {
  beforeEach(() => {
    cy.visit('/')
    // Open Settings
    cy.get('[title="Settings"]').click()
  })

  it('shows Showcase Modus section in Settings', () => {
    cy.contains('Showcase Modus').should('be.visible')
  })

  it('toggle is off by default', () => {
    cy.get('[data-testid="showcase-toggle"]')
      .should('exist')
      .and('have.attr', 'aria-label', 'Showcase Modus umschalten')
    // Active status text should not be visible when off
    cy.contains('✓ Aktiv').should('not.exist')
  })

  it('activates Showcase Modus and shows confirmation', () => {
    cy.get('[data-testid="showcase-toggle"]').click()
    cy.contains('✓ Aktiv').should('be.visible')
  })

  it('hides Sex button in muscle group selector when active', () => {
    // Enable showcase mode
    cy.get('[data-testid="showcase-toggle"]').click()
    cy.contains('Fertig').click()

    // Sex button should not be visible in the muscle group selector
    cy.contains('Sex').should('not.exist')
  })

  it('still shows all other muscle groups when Showcase Modus is active', () => {
    cy.get('[data-testid="showcase-toggle"]').click()
    cy.contains('Fertig').click()

    cy.contains('Brust').should('be.visible')
    cy.contains('Rücken').should('be.visible')
    cy.contains('Beine').should('be.visible')
    cy.contains('Mobility').should('be.visible')
  })

  it('deactivates Showcase Modus on second toggle', () => {
    cy.get('[data-testid="showcase-toggle"]').click()
    cy.contains('✓ Aktiv').should('be.visible')

    cy.get('[data-testid="showcase-toggle"]').click()
    cy.contains('✓ Aktiv').should('not.exist')
  })
})
