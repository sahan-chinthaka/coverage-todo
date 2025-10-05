import AddTask from "@/components/add-task";
import { addTask } from "@/server/actions/task";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the server action
jest.mock("@/server/actions/task", () => ({
  addTask: jest.fn(),
}));
const mockAddTask = addTask as jest.MockedFunction<typeof addTask>;

describe("AddTask Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(<AddTask />);

    expect(screen.getByText(/task title/i)).toBeInTheDocument();
    expect(screen.getByText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("What needs to be done?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Add any additional details...")).toBeInTheDocument();
  });

  it("shows error when title is empty", async () => {
    const user = userEvent.setup();
    render(<AddTask />);

    const submitButton = screen.getByRole("button", { name: /add task/i });
    await user.click(submitButton);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("shows error when title is only whitespace", async () => {
    const user = userEvent.setup();
    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "   ");
    await user.click(submitButton);

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(mockAddTask).not.toHaveBeenCalled();
  });

  it("submits form with title only", async () => {
    const user = userEvent.setup();
    mockAddTask.mockResolvedValue({ done: true });

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith("Test task", "");
    });
  });

  it("submits form with title and description", async () => {
    const user = userEvent.setup();
    mockAddTask.mockResolvedValue({ done: true });

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add any additional details...");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.type(descriptionInput, "Test description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith("Test task", "Test description");
    });
  });

  it("trims whitespace from inputs", async () => {
    const user = userEvent.setup();
    mockAddTask.mockResolvedValue({ done: true });

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add any additional details...");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "  Test task  ");
    await user.type(descriptionInput, "  Test description  ");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith("Test task", "Test description");
    });
  });

  it("clears form after successful submission", async () => {
    const user = userEvent.setup();
    mockAddTask.mockResolvedValue({ done: true });

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const descriptionInput = screen.getByPlaceholderText("Add any additional details...");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.type(descriptionInput, "Test description");
    await user.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue("");
      expect(descriptionInput).toHaveValue("");
    });
  });

  it("shows error message when server action fails", async () => {
    const user = userEvent.setup();
    mockAddTask.mockResolvedValue({ done: false, error: "Server error" });

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });

  it("shows loading state during submission", async () => {
    const user = userEvent.setup();
    let resolvePromise = (value: { done: boolean }) => {};
    const promise = new Promise<{ done: boolean }>((resolve) => {
      resolvePromise = resolve;
    });
    mockAddTask.mockReturnValue(promise);

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    expect(screen.getByText("Adding...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    resolvePromise({ done: true });

    await waitFor(() => {
      expect(screen.getByText(/add task/i)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("calls onAdd callback when provided", async () => {
    const user = userEvent.setup();
    const mockOnAdd = jest.fn();
    mockAddTask.mockResolvedValue({ done: true });

    render(<AddTask onAdd={mockOnAdd} />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    expect(mockOnAdd).toHaveBeenCalledWith({
      title: "Test task",
      description: "",
    });
  });

  it("handles server action throwing an error", async () => {
    const user = userEvent.setup();
    mockAddTask.mockRejectedValue(new Error("Network error"));

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("handles server action throwing error without message", async () => {
    const user = userEvent.setup();
    mockAddTask.mockRejectedValue("String error");

    render(<AddTask />);

    const titleInput = screen.getByPlaceholderText("What needs to be done?");
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "Test task");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to save task")).toBeInTheDocument();
    });
  });
});
