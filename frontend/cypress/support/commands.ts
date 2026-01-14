// ***********************************************
// This file contains custom Cypress commands
// ***********************************************

/// <reference types="cypress" />

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Custom command to login
             * @example cy.login('test@example.com', 'password123')
             */
            login(email: string, password: string): Chainable<void>

            /**
             * Custom command to logout
             * @example cy.logout()
             */
            logout(): Chainable<void>

            /**
             * Custom command to upload a file
             * @example cy.uploadFile('test.pdf', 'application/pdf')
             */
            uploadFile(fileName: string, mimeType: string): Chainable<void>

            /**
             * Custom command to wait for API call
             * @example cy.waitForAPI('@getDocuments')
             */
            waitForAPI(alias: string): Chainable<void>
        }
    }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button[type="submit"]').click()
    cy.url().should('not.include', '/login')
})

// Logout command
Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="user-menu"]').click()
    cy.contains(/sair/i).click()
    cy.url().should('include', '/login')
})

// Upload file command
Cypress.Commands.add('uploadFile', (fileName: string, mimeType: string) => {
    cy.get('[data-testid="upload-button"]').click()
    cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('test content'),
        fileName: fileName,
        mimeType: mimeType,
    })
    cy.get('[data-testid="upload-confirm"]').click()
})

// Wait for API command
Cypress.Commands.add('waitForAPI', (alias: string) => {
    cy.wait(alias)
})

export { }
