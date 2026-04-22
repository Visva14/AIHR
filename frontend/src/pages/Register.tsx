import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes arFi {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ar-scene {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', system-ui, sans-serif;
    padding: 24px 0;
  }

  .ar-card {
    background: var(--bg-card);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border-card);
    border-radius: 18px;
    padding: 44px 48px 40px;
    width: min(400px, calc(100% - 32px));
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
    animation: arFi 0.6s ease forwards;
    box-sizing: border-box;
  }

  .ar-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .ar-logo-mark {
    width: 36px;
    height: 36px;
    background: #111;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .ar-logo-name {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 4px;
  }

  .ar-card h2 {
    margin: 0 0 5px;
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .ar-subtext {
    margin: 0 0 28px;
    font-size: 13.5px;
    color: var(--text-muted);
  }

  .ar-error {
    background: var(--bg-del-bar);
    border: 1px solid var(--border-del);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text-del);
    margin-bottom: 16px;
  }

  .ar-field {
    margin-bottom: 16px;
  }

  .ar-field label {
    display: block;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-label);
    margin-bottom: 6px;
  }

  .ar-field input {
    width: 100%;
    padding: 11px 14px;
    background: var(--bg-input);
    border: 1.5px solid var(--border-input);
    border-radius: 9px;
    font-family: 'Inter', sans-serif;
    font-size: 14.5px;
    color: var(--text-primary);
    outline: none;
    -webkit-appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .ar-field input::placeholder {
    color: var(--text-hint);
  }

  .ar-field input:focus {
    border-color: var(--border-strong);
    background: var(--bg-input);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .ar-strength {
    display: flex;
    gap: 4px;
    margin-top: 7px;
  }

  .ar-sbar {
    flex: 1;
    height: 3px;
    border-radius: 99px;
    background: #e5e5e5;
    transition: background 0.3s;
  }

  .ar-weak {
    background: #f87171;
  }

  .ar-ok {
    background: #fbbf24;
  }

  .ar-good {
    background: #34d399;
  }

  .ar-btn {
    width: 100%;
    padding: 12.5px;
    margin-top: 4px;
    background: var(--bg-dark-btn);
    color: var(--text-dark-btn);
    border: none;
    border-radius: 9px;
    font-size: 14.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .ar-btn:hover {
    background: #333;
  }

  .ar-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .ar-signin-line {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
    margin-top: 20px;
  }

  .ar-signin-line a {
    color: var(--text-primary);
    font-weight: 600;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    .ar-card {
      padding: 34px 22px 30px;
    }
  }
`;

function AIHRMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="7" r="4" fill="white" />
      <path d="M5 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="7" r="2" fill="rgba(255,255,255,0.5)" />
      <circle cx="22" cy="7" r="1.2" fill="white" />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company_name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [strength, setStrength] = useState(0);

  function getStrength(password: string) {
    if (!password) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  }

  function updateField(field: keyof typeof form, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);

    if (field === 'password') {
      setStrength(getStrength(value));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
        return;
      }

      setError(data.detail || 'Registration failed');
    } catch {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ar-scene">
      <style>{CSS}</style>

      <div className="ar-card">
        <div className="ar-logo-row">
          <div className="ar-logo-mark">
            <AIHRMark size={18} />
          </div>
          <span className="ar-logo-name">AIHR</span>
        </div>

        <h2>Create account</h2>
        <p className="ar-subtext">Set up your HR workspace</p>

        {error && <div className="ar-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="ar-field">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              autoComplete="name"
              required
              value={form.full_name}
              onChange={(event) => updateField('full_name', event.target.value)}
            />
          </div>

          <div className="ar-field">
            <label>Work email</label>
            <input
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
            />
          </div>

          <div className="ar-field">
            <label>Company name</label>
            <input
              type="text"
              placeholder="Acme Inc."
              autoComplete="organization"
              required
              value={form.company_name}
              onChange={(event) => updateField('company_name', event.target.value)}
            />
          </div>

          <div className="ar-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />

            <div className="ar-strength">
              <div className={`ar-sbar ${strength >= 1 ? (strength === 1 ? 'ar-weak' : strength === 2 ? 'ar-ok' : 'ar-good') : ''}`} />
              <div className={`ar-sbar ${strength >= 2 ? (strength === 2 ? 'ar-ok' : 'ar-good') : ''}`} />
              <div className={`ar-sbar ${strength >= 3 ? 'ar-good' : ''}`} />
            </div>
          </div>

          <button className="ar-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="ar-signin-line">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
