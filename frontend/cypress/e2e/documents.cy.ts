// Cypress E2E Test - Documents Flow

describe('Documents', () => {
    beforeEach(() => {
        // Login before each test
        cy.visit('/login')
        cy.get('input[type="email"]').type('test@example.com')
        cy.get('input[type="password"]').type('password123')
        cy.get('button[type="submit"]').click()
        cy.url().should('include', '/my-day')

        // Navigate to documents
        cy.visit('/documents')
    })

    describe('Document List', () => {
        it('should display document list', () => {
            cy.contains(/meu drive/i).should('be.visible')
            cy.get('[data-testid="document-item"]').should('have.length.greaterThan', 0)
        })

        it('should display document details', () => {
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="document-name"]').should('be.visible')
                cy.get('[data-testid="document-date"]').should('be.visible')
            })
        })
    })

    describe('Document Upload', () => {
        it('should open upload dialog', () => {
            cy.get('[data-testid="upload-button"]').click()
            cy.contains(/fazer upload/i).should('be.visible')
        })

        it('should upload a file', () => {
            cy.get('[data-testid="upload-button"]').click()

            // Create a test file
            const fileName = 'test-document.pdf'
            cy.get('input[type="file"]').selectFile({
                contents: Cypress.Buffer.from('test content'),
                fileName: fileName,
                mimeType: 'application/pdf',
            })

            // Verify upload
            cy.contains(fileName).should('be.visible')
            cy.get('[data-testid="upload-confirm"]').click()

            // Should show success message
            cy.contains(/upload.*sucesso/i).should('be.visible')
        })

        it('should handle upload errors', () => {
            cy.get('[data-testid="upload-button"]').click()

            // Try to upload invalid file type
            cy.get('input[type="file"]').selectFile({
                contents: Cypress.Buffer.from('test'),
                fileName: 'test.exe',
                mimeType: 'application/x-msdownload',
            })

            cy.contains(/tipo.*arquivo.*inválido/i).should('be.visible')
        })
    })

    describe('Document Actions', () => {
        it('should favorite a document', () => {
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="favorite-button"]').click()
            })

            cy.contains(/favoritado/i).should('be.visible')
        })

        it('should unfavorite a document', () => {
            // First favorite
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="favorite-button"]').click()
            })

            // Then unfavorite
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="favorite-button"]').click()
            })

            cy.contains(/removido.*favoritos/i).should('be.visible')
        })

        it('should archive a document', () => {
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="more-actions"]').click()
            })

            cy.contains(/arquivar/i).click()
            cy.contains(/arquivado/i).should('be.visible')
        })

        it('should delete a document', () => {
            cy.get('[data-testid="document-item"]').first().within(() => {
                cy.get('[data-testid="more-actions"]').click()
            })

            cy.contains(/excluir/i).click()

            // Confirm deletion
            cy.get('[data-testid="confirm-delete"]').click()
            cy.contains(/excluído/i).should('be.visible')
        })
    })

    describe('Document Search', () => {
        it('should search documents', () => {
            cy.get('[data-testid="search-input"]').type('test')

            // Should filter results
            cy.get('[data-testid="document-item"]').each(($el) => {
                cy.wrap($el).should('contain.text', 'test')
            })
        })

        it('should show no results message', () => {
            cy.get('[data-testid="search-input"]').type('nonexistentdocument123')

            cy.contains(/nenhum.*documento.*encontrado/i).should('be.visible')
        })

        it('should clear search', () => {
            cy.get('[data-testid="search-input"]').type('test')
            cy.get('[data-testid="clear-search"]').click()

            cy.get('[data-testid="search-input"]').should('have.value', '')
        })
    })

    describe('Folder Navigation', () => {
        it('should navigate into folder', () => {
            cy.get('[data-testid="folder-item"]').first().dblclick()

            // Should show folder contents
            cy.get('[data-testid="breadcrumb"]').should('contain.text', 'Meu Drive')
        })

        it('should navigate back using breadcrumb', () => {
            cy.get('[data-testid="folder-item"]').first().dblclick()

            cy.get('[data-testid="breadcrumb"]').contains('Meu Drive').click()

            // Should be back at root
            cy.url().should('include', '/documents')
        })
    })

    describe('Document Preview', () => {
        it('should open document preview', () => {
            cy.get('[data-testid="document-item"]').first().click()
            cy.get('[data-testid="preview-button"]').click()

            cy.get('[data-testid="document-preview"]').should('be.visible')
        })

        it('should close document preview', () => {
            cy.get('[data-testid="document-item"]').first().click()
            cy.get('[data-testid="preview-button"]').click()

            cy.get('[data-testid="close-preview"]').click()
            cy.get('[data-testid="document-preview"]').should('not.exist')
        })
    })

    describe('Filters', () => {
        it('should filter by favorites', () => {
            cy.contains(/favoritos/i).click()

            // Should only show favorited documents
            cy.get('[data-testid="document-item"]').each(($el) => {
                cy.wrap($el).find('[data-testid="favorite-button"]').should('have.class', 'favorited')
            })
        })

        it('should filter by archived', () => {
            cy.contains(/arquivados/i).click()

            cy.url().should('include', 'filter=archived')
        })

        it('should filter by trash', () => {
            cy.contains(/lixeira/i).click()

            cy.url().should('include', '/trash')
        })
    })
})
