import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage({ onNavigate }) {
  const { requestForgotPassword, performPasswordReset } = useAuth()

  const [step, setStep] = useState(1) // 1: request token, 2: reset with token, 3: success
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Step 1: Request reset token
  const handleRequestToken = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const data = await requestForgotPassword(email.trim())
      if (data.resetToken) {
        setToken(data.resetToken)
      }
      setNotice(data.notice || 'Password reset request initiated.')
      setStep(2)
    } catch (err) {
      setError(err.message || 'Unable to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Set new password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (!token.trim()) {
      setError('Please provide the reset token.')
      return
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await performPasswordReset({
        token: token.trim(),
        newPassword,
        confirmPassword
      })
      setStep(3)
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check your token.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-header">
          <div className="auth-brand-badge">📄 ResumeCraft</div>
          <h1>Password Recovery</h1>
          <p>
            {step === 1 && 'Enter your account email to receive reset instructions.'}
            {step === 2 && 'Set a new password for your account.'}
            {step === 3 && 'Password reset completed!'}
          </p>
        </div>

        {error && (
          <div className="auth-alert auth-alert-error" role="alert">
            <span className="auth-alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleRequestToken} className="auth-form" noValidate>
            <div className="auth-field">
              <label htmlFor="forgot-email">Account Email</label>
              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Sending Request…' : 'Generate Reset Token'}
            </button>
          </form>
        )}

        {/* Step 2: Reset Form with Token */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="auth-form" noValidate>
            {/* Pending SMTP notice callout as requested */}
            <div className="auth-callout">
              <div className="auth-callout-title">ℹ️ Email Dispatch Notice</div>
              <p>Direct SMTP delivery is currently pending production mailer configuration.</p>
              <div className="auth-token-box">
                <span className="auth-token-label">Your Active Reset Token:</span>
                <code className="auth-token-code">{token}</code>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reset-token">Reset Token</label>
              <input
                id="reset-token"
                type="text"
                placeholder="Enter reset token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="new-password">New Password (min. 6 characters)</label>
              <div className="password-input-wrapper">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '🔒'}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirm-new-password">Confirm New Password</label>
              <input
                id="confirm-new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Updating Password…' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="auth-success-box">
            <div className="auth-success-icon">✅</div>
            <h2>Password Reset Successfully</h2>
            <p>Your account password has been updated. You can now sign in using your new credentials.</p>
            <button
              type="button"
              className="btn btn-primary auth-submit-btn"
              onClick={() => onNavigate('login')}
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        {/* Footer */}
        {step !== 3 && (
          <div className="auth-footer">
            <button
              type="button"
              className="auth-link-bold"
              onClick={() => onNavigate('login')}
            >
              ← Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
