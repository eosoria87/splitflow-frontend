import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { loginWithOAuth } = useAuth();
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const expiresAt = searchParams.get('expires_at');

  const [error, setError] = useState<string | null>(
    !accessToken || !refreshToken || !expiresAt
      ? 'Invalid callback parameters. Please try signing in again.'
      : null
  );

  useEffect(() => {
    if (hasRun.current || error) return;
    hasRun.current = true;

    loginWithOAuth(accessToken!, refreshToken!, Number(expiresAt!))
      .then(() => navigate('/dashboard', { replace: true }))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Authentication failed';
        setError(message);
      });
  }, [accessToken, error, expiresAt, loginWithOAuth, navigate, refreshToken]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-slate-500 text-sm">Signing you in…</p>
    </div>
  );
};

export default AuthCallbackPage;
