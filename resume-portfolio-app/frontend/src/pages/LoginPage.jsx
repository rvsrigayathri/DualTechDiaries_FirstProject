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
              <a href="mailto:dualtechdiaries@gmail.com" className="contact-link contact-pill" title="Email Us via Gmail">
                <svg className="contact-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#EA4335" d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.5l8.073-6.007C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
                <span>dualtechdiaries@gmail.com</span>
              </a>

              <a
                href="https://wa.me/917354666252"
                target="_blank"
                rel="noreferrer"
                className="contact-link contact-pill"
                title="Chat on WhatsApp"
              >
                <svg className="contact-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#25D366" d="M12.004 0C5.374 0 0 5.373 0 12c0 2.115.553 4.184 1.603 6.005L0 24l6.166-1.579A11.94 11.94 0 0 0 12.004 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm.004 21.905a9.88 9.88 0 0 1-5.044-1.378l-.362-.215-3.664.939.977-3.571-.237-.377A9.873 9.873 0 0 1 2.095 12c0-5.464 4.444-9.905 9.909-9.905 5.464 0 9.905 4.441 9.905 9.905 0 5.464-4.441 9.905-9.905 9.905zm5.426-7.41c-.297-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.668.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.099-.198.05-.372-.025-.52-.074-.149-.668-1.611-.916-2.206-.241-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
                <span>WhatsApp: +91 7354666252</span>
              </a>

              <a
                href="https://www.linkedin.com/in/r-srigayathri-rajkumar-096600328/"
                target="_blank"
                rel="noreferrer"
                className="contact-link contact-pill"
                title="Connect on LinkedIn"
              >
                <svg className="contact-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path fill="#0A66C2" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn Profile</span>
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
