# Environment Configuration

This project uses environment variables to manage API endpoints across different environments.

## Environment Files

- `.env`: Default environment variables, loaded in all environments
- `.env.development`: Variables for development environment (used with `npm run dev`)
- `.env.production`: Variables for production environment (used with `npm run build`)

## Available Variables

- `VITE_API_BASE_URL`: Base URL for API endpoints
- `VITE_AUTH_URL`: Base URL for authentication endpoints

## Usage

Environment variables are accessed in the code using `import.meta.env.VARIABLE_NAME`.

Example:
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## Adding New Environment Variables

When adding new environment variables:

1. Add them to all environment files (`.env`, `.env.development`, `.env.production`)
2. Prefix them with `VITE_` to make them accessible in the client-side code
3. Update this README to document the new variables
