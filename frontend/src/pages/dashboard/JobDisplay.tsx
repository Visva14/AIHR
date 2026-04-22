import type { JobDescription } from '../../types';

type JobDisplayProps = {
  jds: JobDescription[];
  onOpenJD: (jdId: number) => void;
  onCreateJD: () => void;
  onDeleteJD: (jdId: number) => void;
};

const CSS = `
  .jd-card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 11px;
    padding: 16px;
  }

  .jd-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }

  .jd-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }

  .jd-create {
    border: 0;
    background: var(--bg-dark-btn);
    color: var(--text-dark-btn);
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
  }

  .jd-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 11px;
  }

  .jd-item,
  .jd-add {
    position: relative;
    border-radius: 10px;
    padding: 15px;
    box-sizing: border-box;
    min-height: 170px;
  }

  .jd-item {
    background: var(--bg-muted);
    border: 1px solid var(--border-card);
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  }

  .jd-item:hover {
    background: var(--bg-card-hover);
    border-color: var(--border-strong);
    transform: translateY(-1px);
  }

  .jd-delete {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: var(--score-red);
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .jd-item:hover .jd-delete {
    display: flex;
  }

  .jd-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: var(--bg-chip-gray);
    display: grid;
    place-items: center;
    margin-bottom: 16px;
    color: var(--text-primary);
  }

  .jd-name {
    font-size: 13px;
    font-weight: 600;
    padding-right: 28px;
    line-height: 1.5;
    margin-bottom: 6px;
  }

  .jd-dept {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-bottom: 12px;
  }

  .jd-badges {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .jd-badge {
    font-size: 10.5px;
    border-radius: 999px;
    padding: 4px 8px;
    display: inline-flex;
    align-items: center;
    font-weight: 500;
  }

  .jd-badge.gray { background: var(--bg-chip-gray); color: var(--text-chip-gray); }
  .jd-badge.blue { background: var(--bg-chip-blue); color: var(--text-chip-blue); }
  .jd-badge.green { background: var(--bg-chip-green); color: var(--text-chip-grn); }

  .jd-add {
    border: 1px dashed var(--border-dashed);
    background: transparent;
    display: grid;
    place-items: center;
    cursor: pointer;
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
  }
`;

export default function JobDisplay({ jds, onOpenJD, onCreateJD, onDeleteJD }: JobDisplayProps) {
  return (
    <div className="jd-card">
      <style>{CSS}</style>

      <div className="jd-head">
        <h2 className="jd-title">Job Display</h2>
        <button className="jd-create" onClick={onCreateJD} type="button">
          + Create JD
        </button>
      </div>

      <div className="jd-grid">
        {jds.map((jd) => (
          <div
            className="jd-item"
            key={jd.id}
            onClick={() => onOpenJD(jd.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onOpenJD(jd.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <button
              className="jd-delete"
              onClick={(event) => {
                event.stopPropagation();
                if (window.confirm('Delete this JD?')) {
                  onDeleteJD(jd.id);
                }
              }}
              type="button"
            >
              <TrashIcon />
            </button>

            <div className="jd-icon">
              <FileGlyph />
            </div>
            <div className="jd-name">{jd.title}</div>
            <div className="jd-dept">{jd.department || 'General'}</div>
            <div className="jd-badges">
              <span className="jd-badge gray">Threshold: {jd.screening_threshold}</span>
              <span className="jd-badge blue">{jd.candidate_count || 0} resumes</span>
              {jd.is_active && <span className="jd-badge green">Active</span>}
            </div>
          </div>
        ))}

        <button className="jd-add" onClick={onCreateJD} type="button">
          <span>+ New Job Description</span>
        </button>
      </div>
    </div>
  );
}

function FileGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M4 2.5h5l3 3V13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 2.5V5.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 5.5h9M6.5 2.8h3l.5 1.2H6l.5-1.2ZM5.5 6.5V11.5M8 6.5V11.5M10.5 6.5V11.5M4.5 5.5l.4 7a1 1 0 0 0 1 .9h4.2a1 1 0 0 0 1-.9l.4-7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
