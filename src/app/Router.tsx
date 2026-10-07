import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './ProtectedRoute';

// Lazy-loaded pages — Auth & Landing
const Landing      = lazy(() => import('../features/landing/LandingPage'));
const SignupPage   = lazy(() => import('../features/auth/SignupPage'));
const LoginPage    = lazy(() => import('../features/auth/LoginPage'));
const OtpPage      = lazy(() => import('../features/auth/OtpPage'));
const ForgotPage   = lazy(() => import('../features/auth/ForgotPasswordPage'));
const ResetPage    = lazy(() => import('../features/auth/ResetPasswordPage'));
const Dashboard    = lazy(() => import('../features/dashboard/DashboardPlaceholder'));

// Lazy-loaded pages — Business side
const BizDashboard        = lazy(() => import('../features/business/BusinessDashboard'));
const CampaignList        = lazy(() => import('../features/business/CampaignListPage'));
const CreateCampaign      = lazy(() => import('../features/business/CreateCampaignPage'));
const CreatorSelection    = lazy(() => import('../features/business/CreatorSelectionPage'));
const Guardrails          = lazy(() => import('../features/business/GuardrailsPage'));
const Invitations         = lazy(() => import('../features/business/InvitationsPage'));
const DealConfirmed       = lazy(() => import('../features/business/DealConfirmedPage'));
const CollaborationSetup  = lazy(() => import('../features/business/CollaborationSetupPage'));
const ContentSubmission   = lazy(() => import('../features/business/ContentSubmissionPage'));
const ReviewApproval      = lazy(() => import('../features/business/ReviewApprovalPage'));
const PaymentProcessing   = lazy(() => import('../features/business/PaymentProcessingPage'));
const CampaignAnalytics   = lazy(() => import('../features/business/CampaignAnalyticsPage'));
const CampaignOps         = lazy(() => import('../features/business/CampaignOperationsPage'));
const Approvals           = lazy(() => import('../features/business/ApprovalsPage'));
const Analytics           = lazy(() => import('../features/business/AnalyticsPage'));
const Payments            = lazy(() => import('../features/business/PaymentsPage'));
const Notifications       = lazy(() => import('../features/business/NotificationsPage'));
const Settings            = lazy(() => import('../features/business/SettingsPage'));

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

        {/* Legacy dashboard placeholder */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><BizDashboard /></ProtectedRoute>} />

        {/* ── Business side ── */}
        <Route path="/business" element={<ProtectedRoute><BizDashboard /></ProtectedRoute>} />
        <Route path="/business/dashboard" element={<ProtectedRoute><BizDashboard /></ProtectedRoute>} />
        <Route path="/business/campaigns" element={<ProtectedRoute><CampaignList /></ProtectedRoute>} />
        <Route path="/business/campaigns/create" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
        <Route path="/business/campaigns/creators" element={<ProtectedRoute><CreatorSelection /></ProtectedRoute>} />
        <Route path="/business/campaigns/guardrails" element={<ProtectedRoute><Guardrails /></ProtectedRoute>} />
        <Route path="/business/campaigns/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/deal-confirmed" element={<ProtectedRoute><DealConfirmed /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/collaboration-setup" element={<ProtectedRoute><CollaborationSetup /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/content-submission" element={<ProtectedRoute><ContentSubmission /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/review-approval" element={<ProtectedRoute><ReviewApproval /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/payment-processing" element={<ProtectedRoute><PaymentProcessing /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id/campaign-analytics" element={<ProtectedRoute><CampaignAnalytics /></ProtectedRoute>} />
        <Route path="/business/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
        <Route path="/business/campaigns/:id" element={<ProtectedRoute><CampaignOps /></ProtectedRoute>} />
        <Route path="/business/creators" element={<ProtectedRoute><CreatorSelection /></ProtectedRoute>} />
        <Route path="/business/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/business/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/business/approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
        <Route path="/business/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/business/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/business/guardrails" element={<ProtectedRoute><Guardrails /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
