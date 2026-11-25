/**
 * Displays the backend health status with three visual states:
 *   loading  → neutral grey message
 *   error    → red warning (backend unreachable)
 *   success  → green confirmation
 */
export default function HealthStatus({ status, loading, error }) {
  if (loading) {
    return <p style={{ color: '#888' }}>Checking backend…</p>
  }
  if (error) {
    return (
      <p style={{ color: '#c0392b' }}>
        ⚠ Could not reach the backend. Make sure <code>mvn spring-boot:run</code> is running on port 8080.
      </p>
    )
  }
  return <p style={{ color: '#27ae60', fontWeight: 'bold' }}>{status}</p>
}
