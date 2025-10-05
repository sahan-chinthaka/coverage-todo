import { render, screen } from '@testing-library/react'
import NavigationBar from '@/components/navigation-bar'

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-out">{children}</div>,
  SignInButton: ({ children }: { children: React.ReactNode }) => <div data-testid="sign-in-button">{children}</div>,
  UserButton: () => <div data-testid="user-button">User Button</div>,
}))

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

describe('NavigationBar Component', () => {
  it('renders the app logo and title', () => {
    render(<NavigationBar />)
    
    expect(screen.getByText('Coverage Todo')).toBeInTheDocument()
    const logoLink = screen.getByRole('link', { name: /coverage todo/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders all navigation links', () => {
    render(<NavigationBar />)
    
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /completed/i })).toHaveAttribute('href', '/completed')
    expect(screen.getByRole('link', { name: /trash/i })).toHaveAttribute('href', '/trash')
  })

  it('renders authentication components', () => {
    render(<NavigationBar />)
    
    expect(screen.getByTestId('signed-in')).toBeInTheDocument()
    expect(screen.getByTestId('signed-out')).toBeInTheDocument()
    expect(screen.getByTestId('sign-in-button')).toBeInTheDocument()
    expect(screen.getByTestId('user-button')).toBeInTheDocument()
  })

  it('renders sign in button text', () => {
    render(<NavigationBar />)
    
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('has proper navigation structure with aria-label', () => {
    render(<NavigationBar />)
    
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Primary')
  })

  it('renders with correct header styling classes', () => {
    const { container } = render(<NavigationBar />)
    
    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-slate-900/85', 'backdrop-blur-sm', 'border-b', 'border-slate-800')
  })

  it('has responsive design classes for text visibility', () => {
    render(<NavigationBar />)
    
    // Check that some spans have hidden sm:inline for responsive design
    const homeText = screen.getByText('Home')
    const completedText = screen.getByText('Completed')
    const trashText = screen.getByText('Trash')
    const signInText = screen.getByText('Sign in')
    
    expect(homeText).toHaveClass('hidden', 'sm:inline')
    expect(completedText).toHaveClass('hidden', 'sm:inline')
    expect(trashText).toHaveClass('hidden', 'sm:inline')
    expect(signInText).toHaveClass('hidden', 'sm:inline')
  })

  it('renders navigation as unordered list', () => {
    render(<NavigationBar />)
    
    const list = screen.getByRole('list')
    expect(list).toBeInTheDocument()
    
    const listItems = screen.getAllByRole('listitem')
    expect(listItems).toHaveLength(4) // Home, Completed, Trash, Auth
  })
})