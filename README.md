# ProFinder - Find Trusted Professionals Near You

ProFinder is a modern full-stack platform that connects people with verified professional service providers in their area. Whether you need a plumber, electrician, carpenter, or any other skilled professional, ProFinder makes it easy to find and hire the right person for the job.

## What This Project Does

Think of ProFinder as your go-to directory for finding reliable professionals. Instead of scrolling through endless Google results or asking friends for recommendations, you can search for exactly what you need and see verified providers with real ratings, experience, and reviews.

The platform works for both sides: people looking for services get a clean, easy way to find trustworthy professionals, and service providers get a straightforward way to showcase their work and connect with potential clients.

## Key Features

### For People Looking for Services
- **Smart Search**: Find professionals by typing what you need (like "plumber") and your city
- **Verified Providers**: All professionals go through verification so you know who's legitimate
- **Detailed Profiles**: See experience years, ratings, service areas, and professional bios
- **Filter & Sort**: Filter by verified status and sort by rating, reviews, or experience
- **No More Guesswork**: Provider profiles include photos, service areas, and contact info
- **Bookmark Favorites**: Save providers you like for quick access later

### For Professional Service Providers
- **Easy Registration**: Sign up and create a professional profile in minutes
- **Showcase Your Work**: Add photos, experience, service areas, and a professional bio
- **Get Verified**: Complete verification process to build trust with potential clients
- **Stand Out**: Display your ratings, years of experience, and customer reviews
- **Google Integration**: Sign in with your Google account for quick setup
- **Professional Dashboard**: Manage your profile, services, and client interactions

### User Experience
- **Clean Design**: Modern, responsive interface that works great on mobile and desktop
- **Smooth Interactions**: Fast loading, intuitive navigation, and helpful notifications
- **Account Types**: Separate experiences for regular users and service providers
- **Secure**: JWT-based authentication with email verification
- **Multiple Sign-in Options**: Email/password or Google OAuth

## Complete Tech Stack

This is a full-stack application with a modern tech stack:

**Frontend**
- **Next.js** for fast, SEO-friendly React applications
- **TypeScript** for better code reliability and developer experience
- **RTK Query** for efficient data fetching and caching
- **shadcn/ui** for consistent, accessible UI components
- **Tailwind CSS** for responsive, utility-first styling

**Backend**
- **NestJS** for the backend structure
- **TypeScript** for type safety (because surprises are rarely good)
- **PostgreSQL** for reliable data storage
- **Sequelize ORM** for database operations and relationships

**Authentication & Security**
- **Passport.js** for authentication strategies
- **JWT** for secure token-based auth
- **bcrypt** for password hashing
- **Google OAuth** integration

**Development Tools**
- **ESLint and Prettier** for code quality
- **Jest** for testing (unit and integration)
- **Sequelize CLI** for database migrations
- **Hot reload** for development

## How It Works

1. **Sign Up**: Create an account as either a user or service provider
2. **Get Verified**: Providers complete verification to build trust
3. **Search or Create Profile**: Users search for services, providers create compelling profiles
4. **Connect**: Browse profiles, check reviews, and contact the right professional

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ProFinder
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=profinder

   # JWT Secrets
   JWT_ACCESS_SECRET=your_access_token_secret
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_ACCESS_TIME=15m
   JWT_REFRESH_TIME=7d

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Email Service
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   # Environment
   NODE_ENVIRONMENT=development
   ```

   Set up the database:
   ```bash
   npm run migrate
   npm run start:dev
   ```

   The backend API will be running at `http://localhost:3000`

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## Project Structure

```
ProFinder/
├── backend/                   # NestJS backend
│   ├── src/
│   │   ├── modules/          # Feature modules
│   │   │   ├── auth/         # Authentication & security
│   │   │   ├── users/        # User management
│   │   │   ├── providers/    # Provider profiles & services
│   │   │   ├── profession/   # Service categories
│   │   │   ├── location/     # Location & city data
│   │   │   └── mail/         # Email & notifications
│   │   ├── common/           # Shared utilities & guards
│   │   └── main.ts           # Application entry point
│   ├── migrations/           # Database migrations
│   └── package.json
├── frontend/                 # Next.js frontend
│   ├── app/                  # Next.js app directory
│   │   ├── auth/             # Authentication pages
│   │   ├── profile/          # User profile management
│   │   ├── search/           # Provider search functionality
│   │   └── ...
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   └── providers/       # Context providers
│   ├── lib/                 # Core application logic
│   │   ├── api/             # API services
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   └── package.json
└── README.md
```

## Database Schema

The application uses a well-structured relational database:

- **Users** - Store user account information and profiles
- **Providers** - Service provider information linked to users
- **Professions** - Different types of services offered
- **Cities/Locations** - Geographic location data
- **UserBookmarks** - User's favorite providers
- **RefreshTokens** - Session management for JWT tokens
- **OTP** - One-time password verification codes

## Available Scripts

### Backend
- `npm run start:dev` - Start development server with hot reload

### Frontend
- `npm run dev` - Start development server

## Key Features Explained

### Authentication System
- **Login/Register**: Traditional email/password authentication
- **Google OAuth**: Quick sign-in with Google accounts
- **Password Recovery**: Forgot password functionality with email verification
- **Email Verification**: Users verify their email addresses during registration
- **Session Management**: JWT-based with automatic refresh

### Search & Discovery
- **Location-based Search**: Find providers in your city or service area
- **Profession Filtering**: Search by specific services (plumbing, electrical work, etc.)
- **Smart Results**: Empty states and error handling for better user experience
- **Real-time Data**: Live search results with loading states

### Profile Management
- **User Profiles**: Personal information, preferences, and account settings
- **Provider Profiles**: Professional information, services, and verification status
- **Profile Editing**: Update information, change account type, manage verification
- **Verification System**: Email-based verification with OTP for security

## Security Features

- JWT tokens with automatic expiration
- Password hashing with bcrypt
- Refresh token rotation
- Google OAuth integration
- Email verification system
- OTP-based authentication
- SQL injection protection through Sequelize ORM
- Global exception handling for consistent error responses

## Pending Word
- Implement Bookmark Functionality
- Implement proper peer-to-peer chatting functionality. (Long Term Goal)

## Development Notes

The codebase follows best practices with proper separation of concerns, dependency injection, and modular architecture. All code is written in TypeScript with strict type checking enabled.

**Backend**: NestJS provides a robust structure with modules, controllers, services, and proper dependency injection. Database operations use Sequelize ORM with migrations for version control.

**Frontend**: Next.js app directory structure with RTK Query for efficient data management, shadcn/ui for consistent components, and Tailwind for responsive design.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add some amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you run into any issues or have questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
4. Provide information about your environment (browser, OS, Node.js version, etc.)

---

