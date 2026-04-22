import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginHR } from '../api/auth';
import { useAuthStore } from '../store/authStore';

type Phase = 'landing' | 'leaving' | 'login';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

  @keyframes alFi {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes alProg {
    from { width: 0; }
    to   { width: 100%; }
  }

  .al-scene {
    min-height: 100vh;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
  }

  .al-landing {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: opacity 0.8s ease;
  }

  .al-out {
    opacity: 0;
    pointer-events: none;
  }

  .al-logo-box {
    width: 52px;
    height: 52px;
    background: #111;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;
    animation: alFi 0.5s ease 0.2s both;
  }

  .al-brand {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 600;
    color: #111;
    letter-spacing: 6px;
    text-transform: uppercase;
    animation: alFi 0.5s ease 0.4s both;
  }

  .al-sub {
    margin: 0 0 40px;
    font-size: 12px;
    font-weight: 400;
    color: #999;
    letter-spacing: 3px;
    text-transform: uppercase;
    animation: alFi 0.5s ease 0.55s both;
  }

  .al-desc {
    margin: 0;
    font-size: 14px;
    font-weight: 300;
    color: #666;
    text-align: center;
    line-height: 1.8;
    white-space: pre-line;
    animation: alFi 0.5s ease 0.7s both;
  }

  .al-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: #e5e5e5;
  }

  .al-bar-fill {
    height: 100%;
    width: 0;
    background: #111;
    animation: alProg 3.8s linear 0.3s both;
  }

  .al-login-wrap {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: alFi 0.7s ease forwards;
  }

  .al-card {
    background: var(--bg-card);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--border-card);
    border-radius: 18px;
    padding: 44px 48px 40px;
    width: min(400px, calc(100% - 32px));
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.07);
    box-sizing: border-box;
  }

  .al-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 32px;
  }

  .al-card-mark {
    width: 36px;
    height: 36px;
    background: #111;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .al-card-name {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 4px;
  }

  .al-card h2 {
    margin: 0 0 5px;
    font-size: 22px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .al-card p {
    margin: 0;
  }

  .al-login-subtext {
    font-size: 13.5px;
    color: var(--text-muted);
    margin-bottom: 28px;
  }

  .al-error {
    background: var(--bg-del-bar);
    border: 1px solid var(--border-del);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 13px;
    color: var(--text-del);
    margin-bottom: 16px;
  }

  .al-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .al-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .al-field label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-label);
  }

  .al-field input {
    width: 100%;
    padding: 11px 14px;
    background: var(--bg-input);
    border: 1.5px solid var(--border-input);
    border-radius: 9px;
    font-size: 14.5px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .al-field input:focus {
    border-color: var(--border-strong);
    background: var(--bg-input);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .al-btn {
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

  .al-btn:hover {
    background: #333;
  }

  .al-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .al-reg {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .al-reg a {
    color: var(--text-primary);
    font-weight: 600;
    text-decoration: none;
  }

  @media (max-width: 520px) {
    .al-card {
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

export default function LandingLogin() {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((state) => state.login);
  const [phase, setPhase] = useState<Phase>('landing');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const leavingTimer = window.setTimeout(() => {
      setPhase('leaving');
    }, 3800);

    const loginTimer = window.setTimeout(() => {
      setPhase('login');
    }, 4600);

    return () => {
      window.clearTimeout(leavingTimer);
      window.clearTimeout(loginTimer);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = await loginHR(email, password);
      storeLogin(token);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="al-scene">
      <style>{CSS}</style>

      {phase !== 'login' && (
        <div className={`al-landing ${phase === 'leaving' ? 'al-out' : ''}`}>
          <div className="al-logo-box">
            <AIHRMark size={26} />
          </div>

          <h1 className="al-brand">AIHR</h1>
          <p className="al-sub">Intelligent Hiring Platform</p>
          <p className="al-desc">{`AI-powered recruitment from screening to hire.\nPrecision. Speed. Intelligence.`}</p>

          <div className="al-bar">
            <div className="al-bar-fill" />
          </div>
        </div>
      )}

      {phase === 'login' && (
        <div className="al-login-wrap">
          <div className="al-card">
            <div className="al-logo-row">
              <div className="al-card-mark">
                <AIHRMark size={18} />
              </div>
              <span className="al-card-name">AIHR</span>
            </div>

            <h2>Welcome back</h2>
            <p className="al-login-subtext">Sign in to your HR dashboard</p>

            {error && <div className="al-error">{error}</div>}

            <form className="al-form" onSubmit={handleSubmit}>
              <div className="al-field">
                <label htmlFor="al-email">Email</label>
                <input
                  id="al-email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>

              <div className="al-field">
                <label htmlFor="al-password">Password</label>
                <input
                  id="al-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>

              <button className="al-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="al-reg">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
