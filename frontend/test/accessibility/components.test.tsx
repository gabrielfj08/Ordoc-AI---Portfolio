import { render } from '../utils/test-utils'
import { axe } from 'jest-axe'
import { Button } from '@/components/ui/button'
import { KPICard } from '@/components/analytics/KPICard'
import { InteractiveChart } from '@/components/analytics/InteractiveChart'
import { FileText } from 'lucide-react'

describe('Accessibility Tests', () => {
    describe('Button Component', () => {
        it('should not have accessibility violations', async () => {
            const { container } = render(<Button>Click me</Button>)
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with different variants', async () => {
            const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

            for (const variant of variants) {
                const { container } = render(<Button variant={variant}>Button</Button>)
                const results = await axe(container)
                expect(results).toHaveNoViolations()
            }
        })

        it('should not have violations when disabled', async () => {
            const { container } = render(<Button disabled>Disabled</Button>)
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with aria-label', async () => {
            const { container } = render(<Button aria-label="Submit form">Submit</Button>)
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })
    })

    describe('KPICard Component', () => {
        const kpiProps = {
            title: 'Total Documents',
            value: 1234,
            change: 12.5,
            icon: FileText,
            color: 'text-blue-600',
        }

        it('should not have accessibility violations', async () => {
            const { container } = render(<KPICard {...kpiProps} />)
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with trend', async () => {
            const { container } = render(
                <KPICard {...kpiProps} trend={[65, 59, 80, 81, 56, 55, 70]} />
            )
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with negative change', async () => {
            const { container } = render(<KPICard {...kpiProps} change={-8.5} />)
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })
    })

    describe('InteractiveChart Component', () => {
        const chartData = [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
        ]

        it('should not have violations with line chart', async () => {
            const { container } = render(
                <InteractiveChart type="line" title="Line Chart" data={chartData} />
            )
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with bar chart', async () => {
            const { container } = render(
                <InteractiveChart type="bar" title="Bar Chart" data={chartData} />
            )
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with pie chart', async () => {
            const { container } = render(
                <InteractiveChart type="pie" title="Pie Chart" data={chartData} />
            )
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })

        it('should not have violations with area chart', async () => {
            const { container } = render(
                <InteractiveChart type="area" title="Area Chart" data={chartData} />
            )
            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })
    })

    describe('Color Contrast', () => {
        it('should have sufficient color contrast for buttons', async () => {
            const { container } = render(
                <div>
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                </div>
            )

            const results = await axe(container, {
                rules: {
                    'color-contrast': { enabled: true },
                },
            })

            expect(results).toHaveNoViolations()
        })
    })

    describe('Keyboard Navigation', () => {
        it('should have proper focus indicators', async () => {
            const { container } = render(
                <div>
                    <Button>First</Button>
                    <Button>Second</Button>
                    <Button>Third</Button>
                </div>
            )

            const results = await axe(container, {
                rules: {
                    'focus-order-semantics': { enabled: true },
                },
            })

            expect(results).toHaveNoViolations()
        })
    })

    describe('ARIA Attributes', () => {
        it('should have proper ARIA labels when needed', async () => {
            const { container } = render(
                <div>
                    <Button aria-label="Close dialog">×</Button>
                    <Button aria-label="Open menu">☰</Button>
                </div>
            )

            const results = await axe(container)
            expect(results).toHaveNoViolations()
        })
    })
})
