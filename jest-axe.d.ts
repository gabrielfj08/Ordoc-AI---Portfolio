/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// Type definitions for jest-axe
declare module 'jest-axe' {
    import type { AxeResults, RunOptions, Spec } from 'axe-core'

    export interface JestAxeConfigureOptions {
        globalOptions?: Spec
        rules?: RunOptions['rules']
        [key: string]: any
    }

    export function axe(
        html: Element | Document | string,
        options?: RunOptions
    ): Promise<AxeResults>

    export function toHaveNoViolations(results: AxeResults): jest.CustomMatcherResult

    export function configureAxe(options?: JestAxeConfigureOptions): typeof axe
}

// Extend Jest matchers
declare global {
    namespace jest {
        interface Matchers<R> {
            toHaveNoViolations(): R
        }

        interface Expect {
            extend(matchers: any): void
        }
    }
}

// Also extend Vi.Assertion for compatibility
declare module '@vitest/expect' {
    interface Assertion {
        toHaveNoViolations(): void
    }
}

export { }
