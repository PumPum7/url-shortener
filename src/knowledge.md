# Next.js 15 App Router Migration Notes

## Project Structure
- API routes moved to app/api/url/
- Each endpoint has its own directory with route.ts
- Layout and pages moved to app/ directory
- Using edge runtime for Auth0 integration
- Middleware handles CORS and auth globally

## API Routes
- All endpoints use NextRequest and NextResponse
- CORS headers applied via middleware
- Authentication handled via Auth0 edge runtime
- FaunaDB operations wrapped in try/catch
- Proper error handling and status codes

## Authentication
- Using @auth0/nextjs-auth0/edge for API routes
- UserProvider from @auth0/nextjs-auth0/client for UI
- Protected routes check session using middleware
- Auth configuration in app/api/auth/[...auth0]

## Error Handling
- Global error boundary in app/error.tsx
- Not found page in app/not-found.tsx
- Loading states in app/loading.tsx
- Consistent error response format
- Proper HTTP status codes
- FaunaDB errors properly caught and formatted

## Future Improvements
- Add request validation middleware
- Implement rate limiting
- Add API documentation
- Enhance type safety
- Add more comprehensive error logging

## Requirements
- Node.js >= 20.0.0
- npm >= 9

## Testing
- Testing is handled by the user, do not manually test
