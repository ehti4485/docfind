# DocFind - Doctor Appointment Web Application

![DocFind Logo](https://raw.githubusercontent.com/ehti4485/docfind/main/public/logo.svg)

A modern web application for booking doctor appointments, built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- User authentication (login/register)
- Doctor listing and search
- Appointment booking system
- User dashboard with appointment management
- User profile management
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install
# or
yarn install

# Run the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses the following Supabase tables:

- **profiles**: User profile information
- **doctors**: Doctor information
- **appointments**: Appointment bookings

## Project Structure

```
/src
  /app                 # Next.js app router
    /api               # API routes
    /auth              # Authentication pages
    /public            # Public pages
  /components          # React components
    /forms             # Form components
    /layout            # Layout components
    /ui                # UI components
  /lib                 # Utility libraries
    /supabase          # Supabase client
    /utils             # Helper functions
  /types               # TypeScript type definitions
```

## Deployment

### GitHub Repository

The code is available on GitHub at: [https://github.com/ehti4485/docfind](https://github.com/ehti4485/docfind)

### Vercel Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Fork the GitHub repository
2. Connect your Vercel account to GitHub
3. Import the repository in Vercel
4. Configure the environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## License

MIT