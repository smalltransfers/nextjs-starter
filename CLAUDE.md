# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js starter project for Small Transfers payment integration.
It demonstrates OAuth-based customer authentication and payment processing using Small Transfers API.
The app supports both test and live Small Transfers environments based on the publishable key prefix.

## Development Commands

- `pnpm install` - Install dependencies.
- `pnpm dev` - Start development server with Turbopack
- `pnpm lint` - Run ESLint.

## Architecture

**Session Management**:
Uses `iron-session` for encrypted session cookies storing user email and access tokens.

**OAuth Flow**:

1. User initiates sign-in via Small Transfers OAuth (`/oauth/callback`).
2. Access token stored in encrypted session.
3. Token used for API calls to Small Transfers.

**Payment Flow**:

1. Authorize charge with Small Transfers API.
2. Perform business logic (placeholder in `/api/paid-requests`).
3. Capture charge for final amount.

**Key Files**:

- `app/Content.tsx` - Main UI component with sign-in/payment logic.
- `app/oauth/callback/route.ts` - OAuth callback handler.
- `app/api/users/me/route.ts` - Session management (GET/DELETE).
- `app/api/paid-requests/route.ts` - Payment processing.
- `lib/ironSession.ts` - Session configuration and types.
- `lib/constants.ts` - Small Transfers API URLs.

## Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Small Transfers OAuth
- **UI**: React + Tailwind CSS
- **Client State**: None
- **Database**: None
