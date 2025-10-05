# Coverage Todo - Task Management Application

A modern, full-featured task management application built with Next.js 15, featuring user authentication, persistent data storage, and comprehensive testing coverage.

## Features

### Core Task Management

- **Create Tasks**: Add new tasks with title and optional description
- **Mark Complete**: Toggle task completion status with a single click
- **View Tasks**: Organized views for active and completed tasks
- **Task Persistence**: All tasks are stored in a PostgreSQL database via Prisma ORM

### Advanced Task Operations

- **Soft Delete**: Tasks are moved to trash instead of permanent deletion
- **Restore Tasks**: Recover accidentally deleted tasks from trash
- **Permanent Delete**: Manually delete tasks permanently from trash
- **Auto-cleanup**: Automatic deletion of tasks older than 30 days in trash (via cron job)

### User Authentication & Security

- **Clerk Authentication**: Secure user authentication and session management
- **User Isolation**: Each user can only see and manage their own tasks
- **Protected Routes**: All task operations require authentication

### User Interface & Experience

- **Responsive Design**: Fully responsive design that works on all devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Loading States**: Visual feedback during async operations
- **Error Handling**: Comprehensive error messages and validation
- **Gradient Design**: Beautiful gradient backgrounds and modern styling

### Navigation & Organization

- **Multi-page Layout**: Separate pages for different task views
  - Home: Active tasks and task creation
  - Completed: View all completed tasks
  - Trash: Manage deleted tasks
- **Navigation Bar**: Persistent navigation with user profile integration
- **Task Counters**: Limited display on home page with links to full views

### Technical Features

- **Server Actions**: Modern Next.js server actions for data mutations
- **Real-time Updates**: Automatic page revalidation after task operations
- **TypeScript**: Full TypeScript implementation for type safety
- **Database Migrations**: Prisma migrations for database schema management
- **API Routes**: RESTful API endpoints for cron job functionality

### Testing & Quality Assurance

- **Unit Testing**: Comprehensive Jest test suite for components and utilities
- **Testing Library**: React Testing Library for component testing
- **Code Coverage**: Detailed coverage reports with 100% coverage targets
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Code Quality**: Biome for linting and formatting

### Development Tools

- **Hot Reload**: Turbopack integration for fast development builds
- **Development Scripts**: Comprehensive npm scripts for all workflows
- **Database Tools**: Prisma Studio integration for database management
- **Environment Management**: Proper environment variable handling

### Deployment & Production

- **Vercel Integration**: Optimized for Vercel deployment
- **Production Builds**: Turbopack for optimized production builds
- **Environment Configuration**: Separate development and production environments
- **Cron Jobs**: Automated cleanup tasks for production environments

## Technology Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide Icons** - Beautiful icon set

### Backend & Database

- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **Server Actions** - Modern Next.js data mutations
- **Clerk** - Authentication and user management

### Development & Testing

- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **Biome** - Fast linting and formatting
- **Turbopack** - Next-generation bundler

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd coverage-todo
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Fill in your database URL and Clerk keys.

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication layout group
│   ├── api/               # API routes
│   ├── completed/         # Completed tasks page
│   └── trash/             # Deleted tasks page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── *.tsx             # Feature components
├── server/               # Server actions
├── lib/                  # Utilities and database client
├── prisma/               # Database schema and migrations
├── __tests__/            # Test files
└── coverage/             # Test coverage reports
```

## Testing

The project includes comprehensive testing with:

- Component testing with React Testing Library
- Utility function testing
- Coverage reporting with detailed HTML reports
- Continuous integration ready test suite

Run tests with coverage:

```bash
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Set up cron job for `/api/cron/cleanup` endpoint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

This project is private and proprietary.
