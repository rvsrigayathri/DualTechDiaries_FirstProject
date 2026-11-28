import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import companyLogo from '../assets/company-logo.jpg'

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.')
      return
    }

    setLoading(true)
    try {
      await login(email.trim(), password, rememberMe)
      onNavigate('dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-layout-container">

        {/* ════ LEFT: DualTechDiaries Company Overview & Showcase ════ */}
        <section className="company-showcase-panel" aria-label="About DualTechDiaries">
          {/* Header Brand */}
          <div className="company-brand-header">
            <div className="company-logo-frame">
              <img
                src={companyLogo}
                alt="DualTechDiaries Logo - Bridging Heritage and Technology"
                className="company-showcase-logo"
              />
            </div>
            <div className="company-title-block">
              <span className="company-badge-pill">Innovate · Connect · Inspire</span>
              <h1 className="company-main-title">DualTechDiaries</h1>
              <p className="company-tagline">Beyond Technology, Into Every Heart.</p>
              <p className="company-subtagline">Connecting lives. Creating impact. Inspiring change.</p>
            </div>
          </div>

          {/* Company Overview */}
          <div className="company-card-block">
            <h3>🏢 Company Overview</h3>
            <p>
              DualTechDiaries is a technology-focused company with a people-centered vision.
              We believe technology should go beyond screens and systems—bringing people closer,
              creating opportunities, simplifying everyday challenges, and inspiring positive change.
            </p>
          </div>

          {/* Vision & Mission Grid */}
          <div className="company-two-col-grid">
            <div className="company-mini-card">
              <h4>🎯 Our Vision</h4>
              <p>
                To build a technology-driven ecosystem that connects people, empowers communities,
                and contributes to a better society.
              </p>
            </div>

            <div className="company-mini-card">
              <h4>🚀 Our Mission</h4>
              <ul className="company-bullet-list">
                <li>Develop useful & accessible technology solutions.</li>
                <li>Connect people with opportunities and resources.</li>
                <li>Solve real-world challenges through innovation.</li>
                <li>Create positive social impact through technology.</li>
                <li>Encourage learning, creativity and continuous growth.</li>
              </ul>
            </div>
          </div>

          {/* Product Spotlight - ResumeCraft */}
          <div className="company-product-spotlight">
            <div className="product-spotlight-header">
              <div>
                <span className="product-badge">Featured Product</span>
                <h3>ResumeCraft – Build Your Professional Resume</h3>
              </div>
            </div>
            <p className="product-desc">
              Developed under DualTechDiaries to help individuals present their skills, education,
              and experience confidently with ease and high-impact presentation.
            </p>
            <div className="product-features-chips">
              <span>📄 16+ Professional Templates</span>
              <span>🎨 Live Dynamic Preview</span>
              <span>📷 Profile Photo Customizer</span>
              <span>⚡ ATS-Optimized Formats</span>
              <span>💾 Cloud Auto-Save & Dashboard</span>
              <span>📥 One-Click PDF Download</span>
            </div>
          </div>

          {/* Values Row */}
          <div className="company-values-row">
            <h4>🌟 Core Values</h4>
            <div className="values-grid">
              <div className="val-pill"><strong>Innovation:</strong> Problem-solving with purpose</div>
              <div className="val-pill"><strong>Connection:</strong> Meaningful human relationships</div>
              <div className="val-pill"><strong>Accessibility:</strong> Technology within everyone's reach</div>
              <div className="val-pill"><strong>Integrity:</strong> Trust through responsible work</div>
              <div className="val-pill"><strong>Impact:</strong> Creating solutions that matter</div>
            </div>
          </div>

          {/* Contact Details & Links */}
          <div className="company-contact-bar">
            <div className="contact-info-items">
              <a href="mailto:dualtechdiaries@gmail.com" className="contact-link" title="Email Us">
                ✉️ dualtechdiaries@gmail.com
              </a>
              <span className="contact-divider">|</span>
              <a href="tel:+917354666252" className="contact-link" title="Call Us">
                📞 +91 7354666252
              </a>
              <span className="contact-divider">|</span>
              <a
                href="https://www.linkedin.com/in/r-srigayathri-rajkumar-096600328/"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
                title="Connect on LinkedIn"
              >
                💼 LinkedIn Profile
              </a>
            </div>
            <p className="closing-statement">
              <em>"Technology is our tool. People are our purpose. Impact is our journey."</em>
            </p>
          </div>
        </section>


        {/* ════ RIGHT: Login Card ════ */}
        <div className="auth-card-panel">
          <div className="auth-card">
            {/* Form Brand Header */}
            <div className="auth-header">
              <div className="auth-logo-wrapper">
                <img
                  src={companyLogo}
                  alt="DualTechDiaries Logo"
                  className="auth-company-logo"
                />
              </div>
              <div className="auth-brand-badge">📄 ResumeCraft</div>
              <h2>Sign In to Your Account</h2>
              <p>Access your saved resumes, draft edits, and personal dashboard.</p>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                <span className="auth-alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              {/* Email */}
              <div className="auth-field">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Password */}
              <div className="auth-field">
                <div className="auth-label-row">
                  <label htmlFor="login-password">Password</label>
                  <button
                    type="button"
                    className="auth-link-subtle"
                    onClick={() => onNavigate('forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
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

              {/* Remember Me */}
              <div className="auth-remember-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me on this device</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <span>Don't have an account?</span>{' '}
              <button
                type="button"
                className="auth-link-bold"
                onClick={() => onNavigate('register')}
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
