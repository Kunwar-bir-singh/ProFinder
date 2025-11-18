# ProFinder - Find Trusted Professionals Near You

ProFinder is a modern web platform that connects people with verified professional service providers in their area. Whether you need a plumber, electrician, carpenter, or any other skilled professional, ProFinder makes it easy to find and hire the right person for the job.

## What This App Does

Think of ProFinder as your go-to directory for finding reliable professionals. Instead of scrolling through endless Google results or asking friends for recommendations, you can search for exactly what you need and see verified providers with real ratings, experience, and reviews.

## Key Features

### For People Looking for Services
- **Smart Search**: Find professionals by typing what you need (like "plumber") and your city
- **Verified Providers**: All professionals go through verification so you know who's legitimate
- **Detailed Profiles**: See experience years, ratings, service areas, and professional bios
- **Filter & Sort**: Filter by verified status and sort by rating, reviews, or experience
- **No More Guesswork**: Provider profiles include photos, service areas, and contact info

### For Professional Service Providers
- **Easy Registration**: Sign up and create a professional profile in minutes
- **Showcase Your Work**: Add photos, experience, service areas, and a professional bio
- **Get Verified**: Complete verification process to build trust with potential clients
- **Stand Out**: Display your ratings, years of experience, and customer reviews
- **Google Integration**: Sign in with your Google account for quick setup

### User Experience
- **Clean Design**: Modern, responsive interface that works great on mobile and desktop
- **Smooth Interactions**: Fast loading, intuitive navigation, and helpful notifications
- **Account Types**: Separate experiences for regular users and service providers
- **Secure**: JWT-based authentication with email verification
- **Multiple Sign-in Options**: Email/password or Google OAuth

## How It Works

1. **Sign Up**: Create an account as either a user or service provider
2. **Get Verified**: Providers complete verification to build trust
3. **Search or Create Profile**: Users search for services, providers create compelling profiles
4. **Connect**: Browse profiles, check reviews, and contact the right professional

## Tech Behind the Scenes

This frontend is built with modern web technologies:
- **Next.js** for fast, SEO-friendly React applications
- **TypeScript** for better code reliability and developer experience
- **RTK Query** for efficient data fetching and caching
- **shadcn/ui** for consistent, accessible UI components
- **Tailwind CSS** for responsive, utility-first styling
- **JWT Authentication** for secure user sessions
- **Google OAuth** for streamlined social sign-in

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── profile/           # User profile management
│   ├── search/            # Provider search functionality
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (buttons, inputs, etc.)
│   └── providers/        # Context providers for app state
├── lib/                  # Core application logic
│   ├── api/              # API services and RTK Query setup
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions and type definitions
└── styles/               # Global CSS and styling
```

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ProFinder/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000` to see the application

### Building for Production

```bash
npm run build
npm start
```

## Key Components

### Authentication System
- **Login/Register**: Traditional email/password authentication
- **Google OAuth**: Quick sign-in with Google accounts
- **Password Recovery**: Forgot password functionality with email verification
- **Email Verification**: Users verify their email addresses during registration

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

## API Integration

The frontend communicates with a REST API for all data operations:
- User authentication and session management
- Provider directory and search functionality
- Profile management and updates
- Email verification and password reset
- Search filters and result pagination

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you run into any issues or have questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
4. Provide information about your environment (browser, OS, etc.)

---

Built with care for people who want to find reliable professionals and for professionals who want to grow their business.