export const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!NEXT_PUBLIC_API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables.');
}