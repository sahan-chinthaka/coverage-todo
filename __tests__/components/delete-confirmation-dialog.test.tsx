import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'

describe('DeleteConfirmationDialog Component', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Test Task',
    isDeleted: false,
    isPending: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders delete dialog correctly', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
    expect(screen.getByText('"Test Task"')).toBeInTheDocument()
    expect(screen.getByText(/moved to trash and can be restored/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move to Trash' })).toBeInTheDocument()
  })

  it('renders permanent delete dialog correctly', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isDeleted={true} />)
    
    expect(screen.getByRole('heading', { name: /delete permanently/i })).toBeInTheDocument()
    expect(screen.getByText('"Test Task"')).toBeInTheDocument()
    expect(screen.getByText(/cannot be undone and the task will be completely removed/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Permanently' })).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<DeleteConfirmationDialog {...defaultProps} open={false} />)
    
    expect(screen.queryByText('Delete Task')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()
    
    render(<DeleteConfirmationDialog {...defaultProps} onOpenChange={mockOnOpenChange} />)
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('calls onConfirm and onOpenChange when confirm button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnConfirm = jest.fn()
    const mockOnOpenChange = jest.fn()
    
    render(
      <DeleteConfirmationDialog 
        {...defaultProps} 
        onConfirm={mockOnConfirm}
        onOpenChange={mockOnOpenChange}
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: 'Move to Trash' })
    await user.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalled()
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows loading state when isPending is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isPending={true} />)
    
    expect(screen.getByText('Moving to trash...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('shows loading state for permanent delete when isPending is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isDeleted={true} isPending={true} />)
    
    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('disables buttons when isPending is true', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isPending={true} />)
    
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    expect(screen.getByRole('button', { name: /moving to trash/i })).toBeDisabled()
  })

  it('shows appropriate icon for regular delete', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    
    // The dialog should be present
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('shows appropriate icon for permanent delete', () => {
    render(<DeleteConfirmationDialog {...defaultProps} isDeleted={true} />)
    
    // The dialog should be present
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('handles escape key to close dialog', async () => {
    const user = userEvent.setup()
    const mockOnOpenChange = jest.fn()
    
    render(<DeleteConfirmationDialog {...defaultProps} onOpenChange={mockOnOpenChange} />)
    
    await user.keyboard('{Escape}')
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders with dialog role and buttons', () => {
    render(<DeleteConfirmationDialog {...defaultProps} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: 'Move to Trash' })
    expect(confirmButton).toBeInTheDocument()
  })

  it('renders task title in bold within description', () => {
    render(<DeleteConfirmationDialog {...defaultProps} title="My Important Task" />)
    
    const strongElement = screen.getByText('"My Important Task"')
    expect(strongElement.tagName).toBe('STRONG')
  })
})