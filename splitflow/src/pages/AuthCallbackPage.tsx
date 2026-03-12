import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/ui/Logo';
import FooterBar from '../components/navigation/FooterBar';

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

  return (
    <div className="h-full w-full flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center w-full sm:px-4 sm:py-8 sm:w-md h-full overflow-y-auto">
        <div className="mb-8"><Logo /></div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full p-8 sm:p-10 border border-slate-100 flex flex-col items-center gap-4">
          {error ? (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Authentication failed</h1>
              <p className="text-sm text-slate-500 text-center">{error}</p>
              <Link to="/signup" className="text-sm font-medium text-primary hover:underline mt-2">
                Back to Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Signing you in…</h1>
              <p className="text-sm text-slate-500">Please wait while we complete authentication.</p>
            </>
          )}
        </div>

        <FooterBar />
      </div>
    </div>
  );
};

export default AuthCallbackPage;
