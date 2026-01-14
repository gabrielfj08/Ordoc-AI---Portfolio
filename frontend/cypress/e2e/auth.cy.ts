// Cypress E2E Test - Authentication Flow

describe('Authentication', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    describe('Login', () => {
        it('should redirect to login page when not authenticated', () => {
            cy.url().should('include', '/login')
        })

        it('should show login form', () => {
            cy.visit('/login')
            cy.get('input[type="email"]').should('be.visible')
            cy.get('input[type="password"]').should('be.visible')
            cy.get('button[type="submit"]').should('be.visible')
        })

        it('should show validation errors for empty fields', () => {
            cy.visit('/login')
            cy.get('button[type="submit"]').click()

            // Check for validation messages
            cy.contains(/email.*required/i).should('be.visible')
            cy.contains(/password.*required/i).should('be.visible')
        })

        it('should show error for invalid credentials', () => {
            cy.visit('/login')

            cy.get('input[type="email"]').type('invalid@example.com')
            cy.get('input[type="password"]').type('wrongpassword')
            cy.get('button[type="submit"]').click()

            cy.contains(/invalid.*credentials/i).should('be.visible')
        })

        it('should successfully login with valid credentials', () => {
            cy.visit('/login')

            cy.get('input[type="email"]').type('test@example.com')
            cy.get('input[type="password"]').type('password123')
            cy.get('button[type="submit"]').click()

            // Should redirect to dashboard
            cy.url().should('include', '/my-day')
            cy.contains(/bem-vindo/i).should('be.visible')
        })
    })

    describe('Logout', () => {
        beforeEach(() => {
            // Login first
            cy.visit('/login')
            cy.get('input[type="email"]').type('test@example.com')
            cy.get('input[type="password"]').type('password123')
            cy.get('button[type="submit"]').click()
            cy.url().should('include', '/my-day')
        })

        it('should logout successfully', () => {
            // Click user menu
            cy.get('[data-testid="user-menu"]').click()

            // Click logout
            cy.contains(/sair/i).click()

            // Should redirect to login
            cy.url().should('include', '/login')
        })
    })

    describe('Protected Routes', () => {
        it('should protect dashboard routes', () => {
            cy.visit('/my-day')
            cy.url().should('include', '/login')
        })

        it('should protect documents routes', () => {
            cy.visit('/documents')
            cy.url().should('include', '/login')
        })

        it('should protect processes routes', () => {
            cy.visit('/processes')
            cy.url().should('include', '/login')
        })

        it('should allow access to protected routes when authenticated', () => {
            // Login
            cy.visit('/login')
            cy.get('input[type="email"]').type('test@example.com')
            cy.get('input[type="password"]').type('password123')
            cy.get('button[type="submit"]').click()

            // Navigate to protected routes
            cy.visit('/documents')
            cy.url().should('include', '/documents')

            cy.visit('/processes')
            cy.url().should('include', '/processes')
        })
    })

    describe('Session persistence', () => {
        it('should maintain session after page reload', () => {
            // Login
            cy.visit('/login')
            cy.get('input[type="email"]').type('test@example.com')
            cy.get('input[type="password"]').type('password123')
            cy.get('button[type="submit"]').click()
            cy.url().should('include', '/my-day')

            // Reload page
            cy.reload()

            // Should still be authenticated
            cy.url().should('include', '/my-day')
        })
    })
})
