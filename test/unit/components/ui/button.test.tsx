import { render, screen } from '../../../utils/test-utils'
import { Button } from '@/components/ui/button'
import userEvent from '@testing-library/user-event'

describe('Button Component', () => {
    describe('Rendering', () => {
        it('should render with default variant and size', () => {
            render(<Button>Click me</Button>)
            const button = screen.getByRole('button', { name: /click me/i })
            expect(button).toBeInTheDocument()
            expect(button).toHaveAttribute('data-variant', 'default')
            expect(button).toHaveAttribute('data-size', 'default')
        })

        it('should render with different variants', () => {
            const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

            variants.forEach((variant) => {
                const { unmount } = render(<Button variant={variant}>{variant}</Button>)
                const button = screen.getByRole('button', { name: variant })
                expect(button).toHaveAttribute('data-variant', variant)
                unmount()
            })
        })

        it('should render with different sizes', () => {
            const sizes = ['default', 'xs', 'sm', 'lg', 'icon'] as const

            sizes.forEach((size) => {
                const { unmount } = render(<Button size={size}>Button</Button>)
                const button = screen.getByRole('button', { name: /button/i })
                expect(button).toHaveAttribute('data-size', size)
                unmount()
            })
        })

        it('should render with custom className', () => {
            render(<Button className="custom-class">Button</Button>)
            const button = screen.getByRole('button', { name: /button/i })
            expect(button).toHaveClass('custom-class')
        })

        it('should render children correctly', () => {
            render(
                <Button>
                    <span>Icon</span>
                    <span>Text</span>
                </Button>
            )
            expect(screen.getByText('Icon')).toBeInTheDocument()
            expect(screen.getByText('Text')).toBeInTheDocument()
        })
    })

    describe('Behavior', () => {
        it('should call onClick handler when clicked', async () => {
            const user = userEvent.setup()
            const handleClick = jest.fn()

            render(<Button onClick={handleClick}>Click me</Button>)
            const button = screen.getByRole('button', { name: /click me/i })

            await user.click(button)
            expect(handleClick).toHaveBeenCalledTimes(1)
        })

        it('should not call onClick when disabled', async () => {
            const user = userEvent.setup()
            const handleClick = jest.fn()

            render(<Button onClick={handleClick} disabled>Click me</Button>)
            const button = screen.getByRole('button', { name: /click me/i })

            await user.click(button)
            expect(handleClick).not.toHaveBeenCalled()
        })

        it('should be disabled when disabled prop is true', () => {
            render(<Button disabled>Disabled</Button>)
            const button = screen.getByRole('button', { name: /disabled/i })
            expect(button).toBeDisabled()
        })

        it('should support keyboard interaction', async () => {
            const user = userEvent.setup()
            const handleClick = jest.fn()

            render(<Button onClick={handleClick}>Press me</Button>)
            const button = screen.getByRole('button', { name: /press me/i })

            button.focus()
            await user.keyboard('{Enter}')
            expect(handleClick).toHaveBeenCalledTimes(1)

            await user.keyboard(' ')
            expect(handleClick).toHaveBeenCalledTimes(2)
        })
    })

    describe('AsChild prop', () => {
        it('should render as child element when asChild is true', () => {
            render(
                <Button asChild>
                    <a href="/test">Link Button</a>
                </Button>
            )

            const link = screen.getByRole('link', { name: /link button/i })
            expect(link).toBeInTheDocument()
            expect(link).toHaveAttribute('href', '/test')
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA attributes', () => {
            render(<Button aria-label="Submit form">Submit</Button>)
            const button = screen.getByRole('button', { name: /submit form/i })
            expect(button).toHaveAccessibleName('Submit form')
        })

        it('should be keyboard accessible', () => {
            render(<Button>Accessible</Button>)
            const button = screen.getByRole('button', { name: /accessible/i })

            button.focus()
            expect(button).toHaveFocus()
        })
    })
})
