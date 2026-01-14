import { render, screen } from '../../../utils/test-utils'
import { KPICard } from '@/components/analytics/KPICard'
import { FileText } from 'lucide-react'

describe('KPICard Component', () => {
    const defaultProps = {
        title: 'Total Documents',
        value: 1234,
        change: 12.5,
        icon: FileText,
        color: 'text-blue-600',
    }

    describe('Rendering', () => {
        it('should render title and value correctly', () => {
            render(<KPICard {...defaultProps} />)

            expect(screen.getByText('Total Documents')).toBeInTheDocument()
            expect(screen.getByText('1234')).toBeInTheDocument()
        })

        it('should render string value correctly', () => {
            render(<KPICard {...defaultProps} value="1.2K" />)

            expect(screen.getByText('1.2K')).toBeInTheDocument()
        })

        it('should render icon', () => {
            const { container } = render(<KPICard {...defaultProps} />)

            // Check if icon container exists
            const iconContainer = container.querySelector('.text-blue-600')
            expect(iconContainer).toBeInTheDocument()
        })
    })

    describe('Change indicator', () => {
        it('should show positive change', () => {
            const { container } = render(<KPICard {...defaultProps} change={12.5} />)

            expect(screen.getByText('12.5%')).toBeInTheDocument()

            // Find the change indicator by its classes
            const changeIndicator = container.querySelector('.bg-green-100.text-green-700')
            expect(changeIndicator).toBeInTheDocument()
            expect(changeIndicator).toHaveTextContent('12.5%')
        })

        it('should show negative change', () => {
            const { container } = render(<KPICard {...defaultProps} change={-8.3} />)

            expect(screen.getByText('8.3%')).toBeInTheDocument()

            const changeIndicator = container.querySelector('.bg-red-100.text-red-700')
            expect(changeIndicator).toBeInTheDocument()
            expect(changeIndicator).toHaveTextContent('8.3%')
        })

        it('should show zero change as positive', () => {
            const { container } = render(<KPICard {...defaultProps} change={0} />)

            expect(screen.getByText('0%')).toBeInTheDocument()

            const changeIndicator = container.querySelector('.bg-green-100.text-green-700')
            expect(changeIndicator).toBeInTheDocument()
            expect(changeIndicator).toHaveTextContent('0%')
        })
    })

    describe('Trend sparkline', () => {
        it('should render trend when provided', () => {
            const trend = [65, 59, 80, 81, 56, 55, 70]
            const { container } = render(<KPICard {...defaultProps} trend={trend} />)

            const sparklineBars = container.querySelectorAll('.flex-1')
            expect(sparklineBars.length).toBe(trend.length)
        })

        it('should not render trend when not provided', () => {
            const { container } = render(<KPICard {...defaultProps} />)

            const sparklineContainer = container.querySelector('.mt-4.h-8')
            expect(sparklineContainer).not.toBeInTheDocument()
        })

        it('should not render trend when empty array', () => {
            const { container } = render(<KPICard {...defaultProps} trend={[]} />)

            const sparklineContainer = container.querySelector('.mt-4.h-8')
            expect(sparklineContainer).not.toBeInTheDocument()
        })

        it('should scale trend bars correctly', () => {
            const trend = [50, 100, 25]
            const { container } = render(<KPICard {...defaultProps} trend={trend} />)

            const sparklineBars = container.querySelectorAll('.flex-1')

            // The max value (100) should have 100% height
            const maxBar = sparklineBars[1] as HTMLElement
            expect(maxBar.style.height).toBe('100%')

            // The min value (25) should have 25% height
            const minBar = sparklineBars[2] as HTMLElement
            expect(minBar.style.height).toBe('25%')
        })
    })

    describe('Styling', () => {
        it('should apply correct color class', () => {
            const { container } = render(<KPICard {...defaultProps} color="text-red-600" />)

            const coloredElements = container.querySelectorAll('.text-red-600')
            expect(coloredElements.length).toBeGreaterThan(0)
        })

        it('should have hover effect', () => {
            const { container } = render(<KPICard {...defaultProps} />)

            const card = container.firstChild as HTMLElement
            expect(card).toHaveClass('hover:shadow-md', 'transition-all')
        })
    })

    describe('Accessibility', () => {
        it('should have proper semantic structure', () => {
            render(<KPICard {...defaultProps} />)

            // Check for proper heading structure
            const title = screen.getByText('Total Documents')
            expect(title.tagName).toBe('P')

            const value = screen.getByText('1234')
            expect(value.tagName).toBe('P')
        })
    })
})
