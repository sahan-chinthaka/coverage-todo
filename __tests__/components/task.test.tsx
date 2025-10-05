import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Task from '@/components/task'
import { deleteTask, deletePermanentTask, restoreTask, toggleTaskComplete } from '@/server/actions/task'

// Mock the server actions
jest.mock('@/server/actions/task', () => ({
  deleteTask: jest.fn(),
  deletePermanentTask: jest.fn(),
  restoreTask: jest.fn(),
  toggleTaskComplete: jest.fn(),
}))
const mockDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>
const mockDeletePermanentTask = deletePermanentTask as jest.MockedFunction<typeof deletePermanentTask>
const mockRestoreTask = restoreTask as jest.MockedFunction<typeof restoreTask>
const mockToggleTaskComplete = toggleTaskComplete as jest.MockedFunction<typeof toggleTaskComplete>

describe('Task Component', () => {
  const defaultProps = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders task correctly', () => {
    render(<Task {...defaultProps} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders completed task with strikethrough', () => {
    render(<Task {...defaultProps} completed={true} />)
    
    const title = screen.getByText('Test Task')
    expect(title).toHaveClass('line-through')
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders task without description', () => {
    render(<Task {...defaultProps} description={undefined} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('toggles task completion when checkbox is clicked', async () => {
    const user = userEvent.setup()
    mockToggleTaskComplete.mockResolvedValue({ done: true })
    
    render(<Task {...defaultProps} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(mockToggleTaskComplete).toHaveBeenCalledWith('task-1')
  })

  it('shows delete button on hover and opens confirmation dialog', async () => {
    const user = userEvent.setup()
    render(<Task {...defaultProps} />)
    
    const taskElement = screen.getByText('Test Task').closest('div')
    if (!taskElement) fail('Task element not found')
    
    fireEvent.mouseEnter(taskElement)
    
    const deleteButton = screen.getByLabelText('Delete task')
    await user.click(deleteButton)
    
    expect(screen.getByText('Delete Task')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
  })

  it('deletes task when confirmation is confirmed', async () => {
    const user = userEvent.setup()
    mockDeleteTask.mockResolvedValue({ done: true })
    
    render(<Task {...defaultProps} />)
    
    const taskElement = screen.getByText('Test Task').closest('div')
    if (!taskElement) fail('Task element not found')
    
    fireEvent.mouseEnter(taskElement)
    
    const deleteButton = screen.getByLabelText('Delete task')
    await user.click(deleteButton)
    
    const confirmButton = screen.getByRole('button', { name: /move to trash/i })
    await user.click(confirmButton)
    
    expect(mockDeleteTask).toHaveBeenCalledWith('task-1')
  })

  it('renders deleted task with proper styling and controls', () => {
    const deletedAt = new Date('2023-10-01')
    render(
      <Task 
        {...defaultProps} 
        isDeleted={true} 
        deletedAt={deletedAt}
      />
    )
    
    expect(screen.getByText('Test Task')).toHaveClass('line-through')
    expect(screen.getByText('Incomplete • Deleted')).toBeInTheDocument()
    expect(screen.getByLabelText('Restore task')).toBeInTheDocument()
    expect(screen.getByLabelText('Delete permanently')).toBeInTheDocument()
  })

  it('restores deleted task when restore button is clicked', async () => {
    const user = userEvent.setup()
    mockRestoreTask.mockResolvedValue({ done: true })
    
    render(<Task {...defaultProps} isDeleted={true} />)
    
    const restoreButton = screen.getByLabelText('Restore task')
    await user.click(restoreButton)
    
    expect(mockRestoreTask).toHaveBeenCalledWith('task-1')
  })

  it('permanently deletes task when permanent delete is confirmed', async () => {
    const user = userEvent.setup()
    mockDeletePermanentTask.mockResolvedValue({ done: true })
    
    render(<Task {...defaultProps} isDeleted={true} />)
    
    const permanentDeleteButton = screen.getByLabelText('Delete permanently')
    await user.click(permanentDeleteButton)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    
    const confirmButton = screen.getByRole('button', { name: /delete permanently/i })
    await user.click(confirmButton)
    
    expect(mockDeletePermanentTask).toHaveBeenCalledWith('task-1')
  })

  it('calls toggle function when checkbox is clicked', async () => {
    const user = userEvent.setup()
    mockToggleTaskComplete.mockResolvedValue({ done: true })
    
    render(<Task {...defaultProps} />)
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    expect(mockToggleTaskComplete).toHaveBeenCalledWith('task-1')
  })

  it('hides delete button when showDeleteButton is false', () => {
    render(<Task {...defaultProps} showDeleteButton={false} />)
    
    const taskElement = screen.getByText('Test Task').closest('div')
    if (!taskElement) fail('Task element not found')
    
    fireEvent.mouseEnter(taskElement)
    
    expect(screen.queryByLabelText('Delete task')).not.toBeInTheDocument()
  })

  it('shows warning for tasks about to be permanently deleted', () => {
    const deletedAt = new Date()
    deletedAt.setDate(deletedAt.getDate() - 28) // 28 days ago (2 days left)
    
    render(
      <Task 
        {...defaultProps} 
        isDeleted={true} 
        deletedAt={deletedAt}
      />
    )
    
    expect(screen.getByText(/2 days left until permanent deletion/)).toBeInTheDocument()
  })

  it('shows critical warning for tasks about to be deleted today', () => {
    const deletedAt = new Date()
    deletedAt.setDate(deletedAt.getDate() - 30) // 30 days ago (0 days left)
    
    render(
      <Task 
        {...defaultProps} 
        isDeleted={true} 
        deletedAt={deletedAt}
      />
    )
    
    expect(screen.getByText(/Will be permanently deleted soon/)).toBeInTheDocument()
  })

  it('shows singular day text when 1 day left', () => {
    const deletedAt = new Date()
    deletedAt.setDate(deletedAt.getDate() - 29) // 29 days ago (1 day left)
    
    render(
      <Task 
        {...defaultProps} 
        isDeleted={true} 
        deletedAt={deletedAt}
      />
    )
    
    expect(screen.getByText(/1 day left until permanent deletion/)).toBeInTheDocument()
  })

  it('applies proper accessibility labels for incomplete task', () => {
    render(<Task {...defaultProps} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Mark as complete')
  })

  it('applies proper accessibility labels for completed task', () => {
    render(<Task {...defaultProps} completed={true} />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('aria-label', 'Mark as incomplete')
  })
})