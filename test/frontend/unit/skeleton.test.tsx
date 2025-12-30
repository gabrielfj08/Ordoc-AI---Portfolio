import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />)

    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('bg-accent', 'animate-pulse', 'rounded-md')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)

    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('h-10', 'w-full')
  })

  it('has correct data attribute', () => {
    const { container } = render(<Skeleton />)

    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
  })

  it('spreads additional props', () => {
    const { container } = render(<Skeleton data-testid="custom-skeleton" />)

    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveAttribute('data-testid', 'custom-skeleton')
  })
})
