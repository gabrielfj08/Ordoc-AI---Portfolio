import { render, screen } from '../../../utils/test-utils'
import { InteractiveChart } from '@/components/analytics/InteractiveChart'
import { mockChartData } from '../../../utils/mocks'

describe('InteractiveChart Component', () => {
    const defaultProps = {
        title: 'Test Chart',
        data: mockChartData,
    }

    describe('Line Chart', () => {
        it('should render line chart with title', () => {
            render(<InteractiveChart {...defaultProps} type="line" />)

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })

        it('should render with custom dataKey', () => {
            const customData = [
                { month: 'Jan', sales: 400 },
                { month: 'Feb', sales: 300 },
            ]

            render(
                <InteractiveChart
                    type="line"
                    title="Sales"
                    data={customData}
                    dataKey="sales"
                    xAxisKey="month"
                />
            )

            expect(screen.getByText('Sales')).toBeInTheDocument()
        })

        it('should handle empty data', () => {
            render(<InteractiveChart {...defaultProps} type="line" data={[]} />)

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })
    })

    describe('Bar Chart', () => {
        it('should render bar chart', () => {
            render(<InteractiveChart {...defaultProps} type="bar" />)

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })
    })

    describe('Pie Chart', () => {
        it('should render pie chart', () => {
            render(<InteractiveChart {...defaultProps} type="pie" />)

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })

        it('should handle undefined percent in label', () => {
            // This tests the fix we made for the TypeScript error
            const pieData = [
                { name: 'Category A', value: 400 },
                { name: 'Category B', value: 300 },
            ]

            render(<InteractiveChart type="pie" title="Distribution" data={pieData} />)

            expect(screen.getByText('Distribution')).toBeInTheDocument()
        })
    })

    describe('Area Chart', () => {
        it('should render area chart', () => {
            render(<InteractiveChart {...defaultProps} type="area" />)

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })
    })

    describe('Custom colors', () => {
        it('should accept custom colors', () => {
            const customColors = ['#ff0000', '#00ff00', '#0000ff']

            render(
                <InteractiveChart
                    {...defaultProps}
                    type="line"
                    colors={customColors}
                />
            )

            expect(screen.getByText('Test Chart')).toBeInTheDocument()
        })
    })

    describe('Styling', () => {
        it('should have proper container styling', () => {
            const { container } = render(<InteractiveChart {...defaultProps} type="line" />)

            const chartContainer = container.firstChild as HTMLElement
            expect(chartContainer).toHaveClass('bg-white', 'rounded-2xl', 'border', 'border-slate-200', 'p-6')
        })
    })

    describe('Responsive behavior', () => {
        it('should render ResponsiveContainer for all chart types', () => {
            const types = ['line', 'bar', 'pie', 'area'] as const

            types.forEach((type) => {
                const { container, unmount } = render(
                    <InteractiveChart {...defaultProps} type={type} />
                )

                // ResponsiveContainer is rendered by recharts
                expect(container.querySelector('.recharts-responsive-container')).toBeInTheDocument()
                unmount()
            })
        })
    })
})
