import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Already logged in – skip straight to the app
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  async function handleSuccess(response) {
    setError(null);
    try {
      await login(response.credential);
      navigate('/', { replace: true });
    } catch {
      setError('Sign-in failed. Please try again.');
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl bg-white px-10 py-12 shadow-lg">
        {/* Logo / brand */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM1 10.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" />
              <path d="M10.5 7.25a.75.75 0 0 1 .75.75v2.25H13.5a.75.75 0 0 1 0 1.5h-2.25V14a.75.75 0 0 1-1.5 0v-2.25H7.5a.75.75 0 0 1 0-1.5h2.25V8a.75.75 0 0 1 .75-.75Z" />
            </svg>
          </div>
        </div>

        <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
          PillPal
        </h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Sign in to manage your medications
        </p>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError('Sign-in failed. Please try again.')}
            shape="pill"
            size="large"
            text="signin_with"
            useOneTap
          />
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
