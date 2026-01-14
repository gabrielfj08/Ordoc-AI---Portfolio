import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
            mutations: {
                retry: false,
            },
        },
    })
}

interface AllTheProvidersProps {
    children: React.ReactNode
}

function AllTheProviders({ children }: AllTheProvidersProps) {
    const testQueryClient = createTestQueryClient()

    return (
        <QueryClientProvider client={testQueryClient}>
            {children}
        </QueryClientProvider>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock Next.js router
export const createMockRouter = (overrides = {}) => ({
    basePath: '',
    pathname: '/',
    route: '/',
    asPath: '/',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    isPreview: false,
    ...overrides,
})

// Helper to wait for async updates
export const waitForLoadingToFinish = () =>
    new Promise((resolve) => setTimeout(resolve, 0))

// Helper to create mock file
export const createMockFile = (
    name = 'test.pdf',
    size = 1024,
    type = 'application/pdf'
): File => {
    const blob = new Blob(['test content'], { type })
    return new File([blob], name, { type })
}

// Helper to trigger file input change
export const triggerFileInputChange = (
    input: HTMLInputElement,
    files: File[]
) => {
    Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
    })
    const event = new Event('change', { bubbles: true })
    input.dispatchEvent(event)
}
