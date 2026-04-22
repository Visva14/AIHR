import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { deleteActivity, getActivity } from '../../api/dashboard';
import { useTheme } from '../../context/ThemeContext';
import type { ActivityItem, DashboardStats, JobDescription } from '../../types';

type ActivePage = 'dashboard' | 'jobs' | 'jd-detail' | 'create-jd' | 'jd-results';

type DashboardHomeProps = {
  stats: DashboardStats;
  jds: JobDescription[];
  onNavigate: (page: ActivePage, jdId?: number, candidateId?: number) => void;
};

const CSS = `
  .dh-wrap {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .dh-row {
    display: grid;
    gap: 11px;
  }

  .dh-row-stats {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .dh-card {
    background: var(--bg-stat);
    border: 1px solid var(--border-card);
    border-radius: 12px;
    padding: 16px 18px;
    box-sizing: border-box;
  }

  .dh-stat-label {
    margin: 0;
    font-size: 10.5px;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-hint);
  }

  .dh-stat-value {
    margin: 12px 0 0;
    font-size: 28px;
    line-height: 1;
    font-weight: 600;
    color: var(--text-primary);
  }

  .dh-stat-sub {
    margin: 10px 0 0;
    font-size: 11px;
    color: var(--text-hint);
  }

  .dh-title {
    margin: 0 0 14px;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .dh-bars {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .dh-bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dh-bar-label {
    width: 160px;
    min-width: 160px;
    font-size: 12px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dh-bar-track {
    flex: 1;
    height: 5px;
    background: var(--bg-chip-gray);
    border-radius: 99px;
    overflow: hidden;
  }

  .dh-bar-fill {
    height: 100%;
    background: var(--bg-dark-btn);
    border-radius: inherit;
  }

  .dh-bar-value {
    min-width: 22px;
    text-align: right;
    font-size: 12px;
    color: var(--text-muted);
  }

  .dh-empty {
    padding: 12px 0;
    font-size: 13px;
    color: var(--text-hint);
  }

  .dh-activity {
    display: flex;
    flex-direction: column;
  }

  .dh-act-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-divider);
    position: relative;
    cursor: default;
  }

  .dh-act-row:last-child {
    border-bottom: none;
  }

  .dh-act-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .dh-act-message {
    flex: 1;
    min-width: 0;
    font-size: 12.5px;
    color: var(--text-secondary);
  }

  .dh-act-side {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .dh-act-time {
    font-size: 11px;
    color: var(--text-hint);
    white-space: nowrap;
  }

  .dh-del-btn {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 5px;
    background: transparent;
    color: var(--text-del);
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
  }

  .dh-del-btn:hover {
    background: var(--bg-del-bar);
  }

  .dh-act-row .dh-del-btn {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .dh-act-row:hover .dh-del-btn {
    opacity: 1;
  }

  .dh-skeleton-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border-divider);
  }

  .dh-skeleton-row:last-child {
    border-bottom: none;
  }

  .dh-skeleton-dot,
  .dh-skeleton-line,
  .dh-skeleton-time {
    background: linear-gradient(90deg, var(--bg-muted) 0%, var(--bg-card-hover) 50%, var(--bg-muted) 100%);
    background-size: 200% 100%;
    animation: dh-shimmer 1.2s linear infinite;
  }

  .dh-skeleton-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .dh-skeleton-line {
    flex: 1;
    height: 12px;
    border-radius: 999px;
  }

  .dh-skeleton-time {
    width: 82px;
    height: 11px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  @keyframes dh-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (max-width: 1200px) {
    .dh-row-stats {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 840px) {
    .dh-row-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .dh-bar-row {
      flex-wrap: wrap;
    }

    .dh-bar-label {
      width: 100%;
      min-width: 0;
    }
  }

  @media (max-width: 560px) {
    .dh-row-stats {
      grid-template-columns: 1fr;
    }

    .dh-act-row {
      align-items: flex-start;
    }

    .dh-act-side {
      padding-top: 1px;
    }
  }
`;

const ACTIVITY_COLORS: Record<ActivityItem['type'], string> = {
  jd_created: 'var(--dot-created)',
  jd_deleted: 'var(--score-red)',
  resumes_uploaded: 'var(--dot-upload)',
  screening_done: 'var(--score-green)',
  interviews_sent: 'var(--text-filter-on)',
  shortlisted: '#a78bfa',
};

export default function DashboardHome({ stats, jds }: DashboardHomeProps) {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const maxCount = Math.max(...jds.map((jd) => jd.candidate_count || 0), 1);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      try {
        const items = await getActivity();
        if (!ignore) {
          setActivities(items);
        }
      } catch {
        if (!ignore) {
          setActivities([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleDeleteActivity(activityId: number) {
    try {
      await deleteActivity(activityId);
      setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
    } catch {
      // Keep the UI stable if delete fails.
    }
  }

  return (
    <div className="dh-wrap">
      <style>{CSS}</style>

      <div className="dh-row dh-row-stats">
        {[
          ['Total JDs', stats.total_jds, 'Active roles'],
          ['Total Resumes', stats.total_candidates, 'Uploaded'],
          ['Screened', stats.screened, 'Pending'],
          ['Interview Sent', stats.interviews_sent, 'Awaiting'],
          ['Interviewed', stats.interviewed, 'Completed'],
        ].map(([label, value, sub]) => (
          <div className="dh-card" key={label}>
            <p className="dh-stat-label">{label}</p>
            <p className="dh-stat-value">{value}</p>
            <p className="dh-stat-sub">{sub}</p>
          </div>
        ))}
      </div>

      <div className="dh-row">
        <div className="dh-card">
          <p className="dh-title">Resumes per JD</p>
          {jds.length === 0 ? (
            <div className="dh-empty">Create a job description to start tracking resumes.</div>
          ) : (
            <div className="dh-bars">
              {jds.map((jd) => {
                const count = jd.candidate_count || 0;
                return (
                  <div className="dh-bar-row" key={jd.id}>
                    <span className="dh-bar-label" title={jd.title}>
                      {jd.title}
                    </span>
                    <div className="dh-bar-track">
                      <div
                        className="dh-bar-fill"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          background: theme === 'dark' ? '#ffffff' : '#111111',
                        }}
                      />
                    </div>
                    <span className="dh-bar-value">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="dh-row">
        <div className="dh-card">
          <p className="dh-title">Recent activity</p>
          <div className="dh-activity">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div className="dh-skeleton-row" key={index}>
                  <div className="dh-skeleton-dot" />
                  <div className="dh-skeleton-line" />
                  <div className="dh-skeleton-time" />
                </div>
              ))
            ) : activities.length === 0 ? (
              <div className="dh-empty">No recent activity yet.</div>
            ) : (
              activities.map((activity) => (
                <div className="dh-act-row" key={activity.id}>
                  <span className="dh-act-dot" style={{ background: ACTIVITY_COLORS[activity.type] }} />
                  <div className="dh-act-message">{activity.message}</div>
                  <div className="dh-act-side">
                    <span className="dh-act-time">{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                    <button className="dh-del-btn" onClick={() => void handleDeleteActivity(activity.id)} type="button">
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
