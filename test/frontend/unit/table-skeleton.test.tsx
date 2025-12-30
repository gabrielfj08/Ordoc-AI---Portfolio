import { render, screen } from '@testing-library/react'
import { TableSkeleton } from '@/components/ui/skeletons/table-skeleton'

describe('TableSkeleton', () => {
  it('renders default rows and columns', () => {
    const { container } = render(<TableSkeleton />)

    // Default: 5 rows
    const rows = container.querySelectorAll('.divide-y > div')
    expect(rows).toHaveLength(5)
  })

  it('renders custom rows', () => {
    const { container } = render(<TableSkeleton rows={10} />)

    const rows = container.querySelectorAll('.divide-y > div')
    expect(rows).toHaveLength(10)
  })

  it('shows header by default', () => {
    const { container } = render(<TableSkeleton />)

    const header = container.querySelector('.border-b.bg-muted\\/50')
    expect(header).toBeInTheDocument()
  })

  it('hides header when showHeader is false', () => {
    const { container } = render(<TableSkeleton showHeader={false} />)

    const header = container.querySelector('.border-b.bg-muted\\/50')
    expect(header).not.toBeInTheDocument()
  })

  it('shows filters when showFilters is true', () => {
    const { container } = render(<TableSkeleton showFilters />)

    // Should have search input and filter buttons
    const filters = container.querySelector('.flex.items-center.justify-between')
    expect(filters).toBeInTheDocument()
  })

  it('hides filters by default', () => {
    const { container } = render(<TableSkeleton />)

    // First flex container should be the table, not filters
    const firstFlex = container.querySelector('.space-y-4 > .rounded-lg.border')
    expect(firstFlex).toBeInTheDocument()
  })

  it('renders pagination', () => {
    const { container } = render(<TableSkeleton />)

    // Should have pagination skeleton at bottom
    const pagination = container.querySelector('.flex.items-center.justify-between:last-child')
    expect(pagination).toBeInTheDocument()
  })
})
