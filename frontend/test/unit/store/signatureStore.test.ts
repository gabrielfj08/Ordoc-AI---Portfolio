import { renderHook, act } from '@testing-library/react'
import { useSignatureStore } from '@/store/signatureStore'
import { mockSigner, mockSignatureField } from '../../utils/mocks'

describe('signatureStore', () => {
    beforeEach(() => {
        // Reset store before each test
        const { result } = renderHook(() => useSignatureStore())
        act(() => {
            result.current.reset()
        })
    })

    describe('Initial state', () => {
        it('should have correct initial state', () => {
            const { result } = renderHook(() => useSignatureStore())

            expect(result.current.step).toBe('list')
            expect(result.current.selectedFile).toBeNull()
            expect(result.current.fields).toEqual([])
            expect(result.current.signers).toEqual([])
            expect(result.current.sealedDocuments).toEqual([])
        })
    })

    describe('Step management', () => {
        it('should update step', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.setStep('upload')
            })

            expect(result.current.step).toBe('upload')
        })

        it('should change between different steps', () => {
            const { result } = renderHook(() => useSignatureStore())
            const steps = ['list', 'upload', 'editor', 'signers', 'review'] as const

            steps.forEach((step) => {
                act(() => {
                    result.current.setStep(step)
                })
                expect(result.current.step).toBe(step)
            })
        })
    })

    describe('File management', () => {
        it('should set selected file', () => {
            const { result } = renderHook(() => useSignatureStore())
            const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })

            act(() => {
                result.current.setSelectedFile(mockFile)
            })

            expect(result.current.selectedFile).toBe(mockFile)
        })

        it('should clear selected file', () => {
            const { result } = renderHook(() => useSignatureStore())
            const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })

            act(() => {
                result.current.setSelectedFile(mockFile)
            })

            expect(result.current.selectedFile).toBe(mockFile)

            act(() => {
                result.current.setSelectedFile(null)
            })

            expect(result.current.selectedFile).toBeNull()
        })
    })

    describe('Field management', () => {
        it('should add field', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addField(mockSignatureField)
            })

            expect(result.current.fields).toHaveLength(1)
            expect(result.current.fields[0]).toEqual(mockSignatureField)
        })

        it('should add multiple fields', () => {
            const { result } = renderHook(() => useSignatureStore())
            const field2 = { ...mockSignatureField, id: 'sf2', x: 200 }

            act(() => {
                result.current.addField(mockSignatureField)
                result.current.addField(field2)
            })

            expect(result.current.fields).toHaveLength(2)
        })

        it('should update field position', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addField(mockSignatureField)
            })

            act(() => {
                result.current.updateFieldPosition('sf1', 300, 400)
            })

            expect(result.current.fields[0].x).toBe(300)
            expect(result.current.fields[0].y).toBe(400)
        })

        it('should update field signer', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addField(mockSignatureField)
            })

            act(() => {
                result.current.updateFieldSigner('sf1', 's2')
            })

            expect(result.current.fields[0].signerId).toBe('s2')
        })

        it('should remove field', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addField(mockSignatureField)
            })

            expect(result.current.fields).toHaveLength(1)

            act(() => {
                result.current.removeField('sf1')
            })

            expect(result.current.fields).toHaveLength(0)
        })
    })

    describe('Signer management', () => {
        it('should add signer', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addSigner(mockSigner)
            })

            expect(result.current.signers).toHaveLength(1)
            expect(result.current.signers[0]).toEqual(mockSigner)
        })

        it('should add multiple signers', () => {
            const { result } = renderHook(() => useSignatureStore())
            const signer2 = { ...mockSigner, id: 's2', name: 'Jane Doe' }

            act(() => {
                result.current.addSigner(mockSigner)
                result.current.addSigner(signer2)
            })

            expect(result.current.signers).toHaveLength(2)
        })

        it('should remove signer', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addSigner(mockSigner)
            })

            expect(result.current.signers).toHaveLength(1)

            act(() => {
                result.current.removeSigner('s1')
            })

            expect(result.current.signers).toHaveLength(0)
        })

        it('should clean up field assignments when removing signer', () => {
            const { result } = renderHook(() => useSignatureStore())

            act(() => {
                result.current.addSigner(mockSigner)
                result.current.addField(mockSignatureField)
            })

            expect(result.current.fields[0].signerId).toBe('s1')

            act(() => {
                result.current.removeSigner('s1')
            })

            expect(result.current.fields[0].signerId).toBeUndefined()
        })
    })

    describe('Sealed documents', () => {
        it('should add sealed document', () => {
            const { result } = renderHook(() => useSignatureStore())
            const mockSealedDoc = {
                id: 'sd1',
                name: 'sealed.pdf',
                createdAt: new Date().toISOString(),
                signers: [mockSigner],
            }

            act(() => {
                result.current.addSealedDocument(mockSealedDoc)
            })

            expect(result.current.sealedDocuments).toHaveLength(1)
            expect(result.current.sealedDocuments[0]).toEqual(mockSealedDoc)
        })

        it('should add new documents to the beginning', () => {
            const { result } = renderHook(() => useSignatureStore())
            const doc1 = { id: 'sd1', name: 'doc1.pdf', createdAt: '2024-01-01', signers: [] }
            const doc2 = { id: 'sd2', name: 'doc2.pdf', createdAt: '2024-01-02', signers: [] }

            act(() => {
                result.current.addSealedDocument(doc1)
                result.current.addSealedDocument(doc2)
            })

            expect(result.current.sealedDocuments[0].id).toBe('sd2')
            expect(result.current.sealedDocuments[1].id).toBe('sd1')
        })
    })

    describe('Reset', () => {
        it('should reset all state', () => {
            const { result } = renderHook(() => useSignatureStore())
            const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' })

            // Set up some state
            act(() => {
                result.current.setStep('editor')
                result.current.setSelectedFile(mockFile)
                result.current.addField(mockSignatureField)
                result.current.addSigner(mockSigner)
            })

            // Verify state is set
            expect(result.current.step).toBe('editor')
            expect(result.current.selectedFile).toBe(mockFile)
            expect(result.current.fields).toHaveLength(1)
            expect(result.current.signers).toHaveLength(1)

            // Reset
            act(() => {
                result.current.reset()
            })

            // Verify reset
            expect(result.current.step).toBe('list')
            expect(result.current.selectedFile).toBeNull()
            expect(result.current.fields).toEqual([])
            expect(result.current.signers).toEqual([])
        })
    })
})
