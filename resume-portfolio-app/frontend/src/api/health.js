/**
 * Fetches the health status from the Spring Boot backend.
 * During development, Vite proxies /api/* to localhost:8080.
 * No hardcoded hostname here — always use relative paths.
 */
export async function fetchHealth() {
  const response = await fetch('/api/health')
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`)
  }
  return response.json()
}
