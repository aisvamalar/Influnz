import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// Lazy-loaded pages
const Landing      = lazy(() => import('../features/landing/LandingPage'));
const SignupPage   = lazy(() => import('../features/auth/SignupPage'));
const LoginPage    = lazy(() => import('../features/auth/LoginPage'));
const OtpPage      = lazy(() => import('../features/auth/OtpPage'));
const ForgotPage   = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPage    = lazy(() => import('../features/auth/ResetPasswordPage'));
const Dashboard    = lazy(() => import('../features/dashboard/DashboardPlaceholder'));

function PageLoader() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--in-cream)' }}>
      <div className="in-spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: 'rgba(242,132,107,0.2)', borderTopColor: 'var(--in-coral)' }} />
    </div>
  );
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        <Route path="/login"  element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/verify" element={<OtpPage />} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPage /></PublicOnlyRoute>} />
        <Route path="/reset-password"  element={<PublicOnlyRoute><ResetPage /></PublicOnlyRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
