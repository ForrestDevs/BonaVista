# BonaVista Website

A modern web application built with Next.js 15, PayloadCMS, and TypeScript.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **CMS**: PayloadCMS 3.22
- **Database**: MongoDB
- **Styling**: Tailwind CSS, Radix UI
- **Language**: TypeScript
- **Email**: React Email
- **Payments**: Stripe
- **Storage**: Vercel Blob Storage
- **Caching**: Upstash Redis

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

The project is organized into the following directories:

- `src/app`: Contains the Next.js App Router pages and components
- `src/components`: Contains reusable components
- `src/lib`: Contains utility functions and types
- `src/payload`: Contains the PayloadCMS configuration and collections

## PayloadCMS Configuration

The PayloadCMS configuration is located in the `src/payload` directory.
