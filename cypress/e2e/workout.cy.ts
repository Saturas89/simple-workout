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
