import { render, screen } from '@testing-library/react'
import { CardsSkeleton } from '@/components/ui/skeletons/cards-skeleton'

describe('CardsSkeleton', () => {
  it('renders default number of skeleton cards', () => {
    const { container } = render(<CardsSkeleton />)

    // Default is 4 cards
    const cards = container.querySelectorAll('.p-6.rounded-lg.border')
    expect(cards).toHaveLength(4)
  })

  it('renders custom number of cards', () => {
    const { container } = render(<CardsSkeleton count={3} />)

    const cards = container.querySelectorAll('.p-6.rounded-lg.border')
    expect(cards).toHaveLength(3)
  })

  it('applies custom grid columns class', () => {
    const { container } = render(<CardsSkeleton gridCols="grid-cols-3" />)

    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveClass('grid-cols-3')
  })

  it('applies default grid columns', () => {
    const { container } = render(<CardsSkeleton />)

    const grid = container.firstChild as HTMLElement
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4')
  })

  it('each card has all skeleton elements', () => {
    const { container } = render(<CardsSkeleton count={1} />)

    const card = container.querySelector('.p-6.rounded-lg.border')
    expect(card).toBeInTheDocument()

    // Should have multiple skeleton divs for icon, value, label, etc
    const skeletons = card?.querySelectorAll('[data-slot="skeleton"]')
    expect(skeletons?.length).toBeGreaterThan(0)
  })
})
