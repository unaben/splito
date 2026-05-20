export function baseUrl(): string {
    // Set NEXT_PUBLIC_APP_URL in production  e.g. https://myapp.com
    if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
    // Vercel injects VERCEL_URL automatically (no protocol prefix)
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    // Local dev fallback — uses the port Next.js is actually running on
    const port = process.env.PORT ?? "3000";    
    return `http://localhost:${port}`;
  }