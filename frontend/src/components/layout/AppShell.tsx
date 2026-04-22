import { ReactNode, useMemo } from 'react';

import type { JobDescription } from '../../types';
import { useTheme } from '../../context/ThemeContext';

type ActivePage = 'dashboard' | 'jobs' | 'jd-detail' | 'create-jd' | 'jd-results' | 'candidate-interview-detail';

type AppShellProps = {
  children: ReactNode;
  activePage: ActivePage;
  activeJdId: number | null;
  jds: JobDescription[];
  userFullName?: string;
  onNavigate: (page: ActivePage, jdId?: number, candidateId?: number) => void;
  onLogout: () => void;
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .as-root {
    min-height: 100vh;
    background: var(--bg-page);
    color: var(--text-primary);
    font-family: 'Inter', system-ui, sans-serif;
  }

  .as-frame {
    min-height: 100vh;
    background:
      radial-gradient(circle at top left, rgba(0, 0, 0, 0.045), transparent 28%),
      radial-gradient(circle at right center, rgba(56, 189, 248, 0.08), transparent 25%),
      var(--bg-page);
  }

  .as-topbar {
    height: 54px;
    background: var(--bg-topbar);
    border-bottom: 1px solid var(--border-card);
    display: flex;
    align-items: center;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .as-brand {
    width: 210px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .as-mark-wrap {
    width: 30px;
    height: 30px;
    border-radius: 9px;
    display: grid;
    place-items: center;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .as-brand-text {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 3px;
  }

  .as-top-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .as-user {
    font-size: 12.5px;
    color: var(--text-muted);
    margin-right: 2px;
  }

  .as-icon-btn,
  .as-logout {
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--border-btn);
    background: var(--bg-action-btn);
    color: var(--text-primary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .as-icon-btn {
    width: 32px;
    padding: 0;
  }

  .as-logout {
    padding: 0 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .as-icon-btn:hover,
  .as-logout:hover {
    background: var(--bg-card-hover);
    transform: translateY(-1px);
  }

  .as-body {
    display: flex;
    min-height: calc(100vh - 54px);
  }

  .as-sidebar {
    width: 210px;
    flex-shrink: 0;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border-sidebar);
    padding: 18px 10px;
    box-sizing: border-box;
  }

  .as-label {
    padding: 0 8px 8px;
    font-size: 10px;
    font-weight: 600;
    color: var(--text-hint);
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .as-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 18px;
  }

  .as-link {
    width: 100%;
    border: 0;
    background: transparent;
    padding: 8px 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--text-secondary);
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }

  .as-link:hover {
    background: var(--bg-card-hover);
  }

  .as-jd-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: calc(100vh - 240px);
    overflow-y: auto;
    padding-right: 2px;
  }

  .as-jd-item {
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--text-muted);
    padding: 7px 8px;
    border-radius: 8px;
    text-align: left;
    font-size: 12px;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .as-jd-item:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
  }

  .as-jd-item.is-active {
    background: var(--bg-muted);
    color: var(--text-primary);
  }

  .as-empty {
    padding: 4px 8px;
    color: var(--text-muted);
    font-size: 11.5px;
  }

  .as-main {
    flex: 1;
    padding: 22px;
    overflow-y: auto;
    box-sizing: border-box;
  }

  @media (max-width: 900px) {
    .as-body {
      flex-direction: column;
    }

    .as-brand,
    .as-sidebar {
      width: 100%;
    }

    .as-sidebar {
      border-right: 0;
      border-bottom: 1px solid var(--border-sidebar);
    }

    .as-jd-links {
      max-height: none;
    }
  }

  @media (max-width: 640px) {
    .as-topbar {
      height: auto;
      min-height: 54px;
      padding: 10px 12px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .as-top-actions {
      width: 100%;
      justify-content: flex-end;
    }

    .as-main {
      padding: 14px;
    }
  }
`;

const NAV_ITEMS: Array<{ key: ActivePage; label: string; icon: JSX.Element }> = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="2" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="2" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="5" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    key: 'jobs',
    label: 'Job Display',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M4 2.5h5l3 3V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 2.5V5.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'create-jd',
    label: 'Create JD',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

function AIHRMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="7" r="4" fill="currentColor" />
      <path d="M5 22c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="22" cy="7" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="22" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 1.8v1.7M8 12.5v1.7M3.62 3.62l1.2 1.2M11.18 11.18l1.2 1.2M1.8 8h1.7M12.5 8h1.7M3.62 12.38l1.2-1.2M11.18 4.82l1.2-1.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10.86 2.17a5.87 5.87 0 1 0 2.97 10.7 6.34 6.34 0 0 1-2.2.39A6.26 6.26 0 0 1 5.37 7 6.33 6.33 0 0 1 10.86 2.17Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function decodeUserName(token: string | null): string | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const json = JSON.parse(window.atob(parts[1]));
    return json.full_name || json.name || null;
  } catch {
    return null;
  }
}

export default function AppShell({ children, activePage, activeJdId, jds, userFullName, onNavigate, onLogout }: AppShellProps) {
  const { theme, toggleTheme } = useTheme();
  const iconColor = theme === 'dark' ? '#111111' : '#ffffff';
  const displayName = useMemo(() => userFullName || decodeUserName(localStorage.getItem('access_token')) || 'HR User', [userFullName]);

  return (
    <div className="as-root">
      <style>{CSS}</style>
      <div className="as-frame">
        <header className="as-topbar">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '0 8px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--bg-tag-dark)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <circle cx="10" cy="8" r="4" fill={iconColor} />
                <path
                  d="M2 24c0-4.418 3.582-8 8-8s8 3.582 8 8"
                  stroke={iconColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="22" cy="8" r="2" fill={iconColor} />
                <line
                  x1="18"
                  y1="8"
                  x2="20"
                  y2="8"
                  stroke={iconColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="22"
                  y1="10"
                  x2="22"
                  y2="13"
                  stroke={iconColor}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="22" cy="15" r="1.5" fill={iconColor} />
              </svg>
            </div>

            <span
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '3px',
              }}
            >
              AIHR
            </span>
          </div>

          <div className="as-top-actions">
            <span className="as-user">{displayName}</span>
            <button
              className="as-icon-btn"
              onClick={(event) => {
                const btn = event.currentTarget;
                btn.style.transform = 'scale(0.85) rotate(20deg)';
                toggleTheme();
                window.setTimeout(() => {
                  btn.style.transform = 'scale(1) rotate(0deg)';
                }, 150);
              }}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              type="button"
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
            <button className="as-logout" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        </header>

        <div className="as-body">
          <aside className="as-sidebar">
            <div className="as-label">Menu</div>
            <div className="as-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  className={`as-link ${activePage === item.key ? 'is-active' : ''}`}
                  style={
                    activePage === item.key
                      ? {
                          background: theme === 'dark' ? '#ffffff' : '#111111',
                          color: theme === 'dark' ? '#111111' : '#ffffff',
                        }
                      : undefined
                  }
                  onClick={() => onNavigate(item.key)}
                  type="button"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="as-label">Job Listings</div>
            <div className="as-jd-links">
              {jds.length === 0 ? (
                <div className="as-empty">No active job descriptions</div>
              ) : (
                jds.map((jd) => (
                  <button
                    key={jd.id}
                    className={`as-jd-item ${activePage === 'jd-detail' && activeJdId === jd.id ? 'is-active' : ''}`}
                    onClick={() => onNavigate('jd-detail', jd.id)}
                    title={jd.title}
                    type="button"
                  >
                    {jd.title}
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className="as-main">{children}</main>
        </div>
      </div>
    </div>
  );
}
