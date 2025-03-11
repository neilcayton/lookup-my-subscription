# Shared Code for Cross-Platform Development

This directory contains code that can be shared between web and mobile platforms.

## Directory Structure

- `/api` - API services and network requests
- `/hooks` - Custom React hooks for state management
- `/models` - Data models and interfaces
- `/utils` - Utility functions and helpers
- `/constants` - Constants and configuration values

## Usage Guidelines

When adding code to this directory, ensure it:
1. Has no platform-specific dependencies
2. Uses TypeScript for type safety
3. Is well-documented with JSDoc comments
4. Follows the project's coding standards

This approach allows us to maintain a single source of truth for business logic while optimizing UI for each platform.
