import { useLocation } from 'react-router-dom';

function formatDuration(totalSeconds?: number) {
  const safe = Math.max(0, totalSeconds || 0);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

export default function InterviewCompletePage() {
  const location = useLocation();
  const { candidateName, jobTitle, answeredCount, timeTaken } =
    (location.state as {
      candidateName?: string;
      jobTitle?: string;
      answeredCount?: number;
      timeTaken?: number;
    } | null) || {};

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '18px',
          padding: '40px 32px',
          border: '1px solid rgba(0,0,0,0.07)',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#dcfce7',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: '22px',
            fontWeight: 600,
            color: '#111',
          }}
        >
          Interview completed!
        </h1>

        <p
          style={{
            margin: '14px 0 0',
            fontSize: '14px',
            color: '#888',
            lineHeight: 1.7,
          }}
        >
          Thank you for completing the interview{candidateName ? `, ${candidateName}` : ''}. Your responses have been submitted and are being evaluated by our AI system.
        </p>

        <div
          style={{
            marginTop: '22px',
            background: '#f8f8f8',
            borderRadius: '10px',
            padding: '14px 16px',
            textAlign: 'left',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <SummaryRow label="Position" value={jobTitle || '-'} />
          <SummaryRow label="Questions answered" value={`${answeredCount ?? 10} / 10`} />
          <SummaryRow label="Time taken" value={formatDuration(timeTaken)} borderless />
        </div>

        <p
          style={{
            margin: '18px 0 0',
            fontSize: '12px',
            color: '#aaa',
            lineHeight: 1.7,
          }}
        >
          The HR team will review your results and contact you. You may close this window.
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  borderless = false,
}: {
  label: string;
  value: string;
  borderless?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
        padding: borderless ? '0' : '0 0 10px',
        marginBottom: borderless ? 0 : '10px',
        borderBottom: borderless ? 'none' : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <span style={{ fontSize: '12px', color: '#999', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#111', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
