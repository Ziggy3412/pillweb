import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import LoginPage from './pages/LoginPage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BASE_PATH, GOOGLE_CLIENT_ID } from './config.js'

const root = createRoot(document.getElementById('root'))

function MissingClientId() {
  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans text-slate-800">
      <h1 className="text-xl font-bold text-slate-900">Google Client ID missing</h1>
      <p className="mt-2 text-slate-600">
        The app needs <code className="rounded bg-slate-200 px-1">VITE_GOOGLE_CLIENT_ID</code> to run.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
        <li>
          In the project root, create a file named <code className="rounded bg-slate-200 px-1">.env</code>
        </li>
        <li>
          Add (use your real Web client ID from Google Cloud Console):
          <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-slate-100">
            {`VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
VITE_API_URL=http://localhost:3000`}
          </pre>
        </li>
        <li>Stop the dev server (Ctrl+C) and run <code className="rounded bg-slate-200 px-1">npm run dev</code> again.</li>
      </ol>
    </div>
  )
}

if (!GOOGLE_CLIENT_ID) {
  root.render(<MissingClientId />)
} else {
  root.render(
    <StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <BrowserRouter basename={BASE_PATH || undefined}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </GoogleOAuthProvider>
    </StrictMode>,
  )
}
