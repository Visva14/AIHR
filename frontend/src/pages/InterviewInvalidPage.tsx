import { Link, useLocation } from 'react-router-dom';

export default function InterviewInvalidPage() {
  const location = useLocation();
  const message = (location.state as { message?: string } | undefined)?.message;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-glass">
        <h1 className="font-display text-2xl font-semibold text-ink">Invalid or Expired Link</h1>
        <p className="mt-2 text-sm text-slate-600">{message || 'This interview link is invalid or expired. Please contact HR for a new link.'}</p>
        <Link to="/login" className="btn-primary mt-5 inline-block">
          Go to HR Login
        </Link>
      </div>
    </div>
  );
}
