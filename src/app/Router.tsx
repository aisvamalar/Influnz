import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';
import { CreatorProvider } from '../features/creator/CreatorContext';

// Lazy-loaded pages
const Landing      = lazy(() => import('../features/landing/LandingPage'));
const SignupPage   = lazy(() => import('../features/auth/SignupPage'));
const LoginPage    = lazy(() => import('../features/auth/LoginPage'));
const OtpPage      = lazy(() => import('../features/auth/OtpPage'));
const ForgotPage   = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPage    = lazy(() => import('../features/auth/ResetPasswordPage'));
const RoleSelect   = lazy(() => import('../features/auth/RoleSelectPage'));
const Dashboard    = lazy(() => import('../features/dashboard/DashboardPlaceholder'));

// Creator area
const CreatorLayout        = lazy(() => import('../features/creator/CreatorLayout'));
const CreatorGate          = lazy(() => import('../features/creator/CreatorGate'));
const CreatorDashboard     = lazy(() => import('../features/creator/pages/DashboardPage'));
const CreatorProfile       = lazy(() => import('../features/creator/pages/ProfilePage'));
const CreatorInvitations   = lazy(() => import('../features/creator/pages/InvitationsPage'));
const CreatorInvitationDet = lazy(() => import('../features/creator/pages/InvitationDetailPage'));
const CreatorNegotiation   = lazy(() => import('../features/creator/pages/NegotiationPage'));
const CreatorCampaigns     = lazy(() => import('../features/creator/pages/CampaignsPage'));
const CreatorCampaignDet   = lazy(() => import('../features/creator/pages/CampaignDetailPage'));
const CreatorEarnings      = lazy(() => import('../features/creator/pages/EarningsPage'));
const CreatorGrowth        = lazy(() => import('../features/creator/pages/GrowthPage'));
const CreatorPreferences   = lazy(() => import('../features/creator/pages/PreferencesPage'));

// Creator onboarding
const OnboardingLayout     = lazy(() => import('../features/creator/onboarding/OnboardingLayout'));
const VerifyStep           = lazy(() => import('../features/creator/onboarding/VerifyStep'));
const PassportStep         = lazy(() => import('../features/creator/onboarding/PassportStep'));
const PreferencesStep      = lazy(() => import('../features/creator/onboarding/PreferencesStep'));

// New lifecycle pages
const DealRoomPage         = lazy(() => import('../features/creator/pages/DealRoomPage'));
const ContractPage         = lazy(() => import('../features/creator/pages/ContractPage'));
const ReputationPage       = lazy(() => import('../features/creator/pages/ReputationPage'));
const ReferralsPage        = lazy(() => import('../features/creator/pages/ReferralsPage'));
const RewardsPage          = lazy(() => import('../features/creator/pages/RewardsPage'));

// Renders nested creator routes inside the CreatorProvider
function CreatorAreaOutlet() {
  return <Outlet />;
}

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
        <Route path="/get-started" element={<PublicOnlyRoute><RoleSelect /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        <Route path="/login"  element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/verify" element={<OtpPage />} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPage /></PublicOnlyRoute>} />
        <Route path="/reset-password"  element={<PublicOnlyRoute><ResetPage /></PublicOnlyRoute>} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Creator area — provider wraps both onboarding and the gated main app */}
        <Route
          path="/creator"
          element={
            <ProtectedRoute>
              <CreatorProvider>
                <CreatorAreaOutlet />
              </CreatorProvider>
            </ProtectedRoute>
          }
        >
          {/* Onboarding (no sidebar, gated open until complete) */}
          <Route path="onboarding" element={<OnboardingLayout />}>
            <Route index element={<Navigate to="verify" replace />} />
            <Route path="verify" element={<VerifyStep />} />
            <Route path="passport" element={<PassportStep />} />
            <Route path="preferences" element={<PreferencesStep />} />
          </Route>

          {/* Main creator app — requires completed onboarding */}
          <Route
            element={
              <CreatorGate>
                <CreatorLayout />
              </CreatorGate>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CreatorDashboard />} />
            <Route path="profile" element={<CreatorProfile />} />
            <Route path="invitations" element={<CreatorInvitations />} />
            <Route path="invitations/:id" element={<CreatorInvitationDet />} />
            <Route path="negotiation/:id" element={<CreatorNegotiation />} />
            <Route path="deal/:id" element={<DealRoomPage />} />
            <Route path="contract/:id" element={<ContractPage />} />
            <Route path="campaigns" element={<CreatorCampaigns />} />
            <Route path="campaigns/:id" element={<CreatorCampaignDet />} />
            <Route path="earnings" element={<CreatorEarnings />} />
            <Route path="growth" element={<CreatorGrowth />} />
            <Route path="reputation" element={<ReputationPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="preferences" element={<CreatorPreferences />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
